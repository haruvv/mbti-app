"use server";

import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { MBTIType, TestResult } from "@/types/mbti";
import { MBTITypeKey } from "../data/mbtiTypes";

export async function getTestResults() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "ログインが必要です" };
    }

    const supabase = createClient();

    // ClerkIDからユーザー情報を取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      // エラーをスローするのではなく、エラー結果を返す
      return { success: false, error: "ユーザー情報の取得に失敗しました" };
    }

    if (!userData) {
      // ユーザーが見つからない場合も、エラー結果を返す
      return { success: false, error: "ユーザーが見つかりません" };
    }

    // テスト結果を取得（created_atカラムによるソートを削除）
    const { data: testResults, error: testError } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_id", userData.id)
      .order("id", { ascending: false }); // idでソートに変更

    if (testError) {
      console.error("Test results fetch error:", testError);
      return { success: false, error: "テスト結果の取得に失敗しました" };
    }

    // テスト結果がない場合でも空の配列を返す
    return { success: true, data: testResults || [] };
  } catch (error) {
    console.error("Error in getTestResults:", error);
    return { success: false, error: "テスト結果の取得に失敗しました" };
  }
}

export async function saveTestResult(formData: FormData) {
  try {
    // 必要なデータを取得
    const mbtiType = formData.get("mbtiType") as string;

    // クライアント認証を確認
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("ユーザー認証が必要です");
    }

    // Supabaseクライアント作成
    const supabase = createClient();

    // ユーザーデータを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      throw new Error("ユーザー情報の取得に失敗しました");
    }

    // ユーザーが存在しない場合は作成
    if (!userData) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
        })
        .select()
        .single();

      if (createError) {
        console.error("User creation error:", createError);
        throw new Error("ユーザー情報の作成に失敗しました");
      }

      // 新しく作成したユーザーIDで保存
      const { data, error } = await supabase.rpc("save_test_result", {
        p_user_id: newUser.id,
        p_mbti_type: mbtiType,
        p_answers: {},
      });

      if (error) {
        console.error("Error saving test result:", error);
        throw new Error(`テスト結果の保存に失敗しました: ${error.message}`);
      }
    } else {
      // 既存ユーザーIDで保存（RPC関数を使用）
      const { data, error } = await supabase.rpc("save_test_result", {
        p_user_id: userData.id,
        p_mbti_type: mbtiType,
        p_answers: {},
        p_e_score: 0,
        p_n_score: 0,
        p_f_score: 0,
        p_p_score: 0,
      });

      if (error) {
        console.error("Error saving test result:", error);
        throw new Error(`テスト結果の保存に失敗しました: ${error.message}`);
      }
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error saving test result:", error);
    return { error: (error as Error).message };
  }
}
