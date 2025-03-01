"use server";

import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return { success: false, error: "ユーザー情報の取得に失敗しました" };
    }

    // ユーザーのテスト結果を全て取得（修正版）
    const { data, error } = await supabase
      .from("test_results")
      .select("id, mbti_type, created_at, e_score, n_score, f_score, p_score") // スコアデータを追加
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Test results fetch error:", error);
      return { success: false, error: "テスト結果の取得に失敗しました" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching test results:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function saveTestResult(formData: FormData) {
  try {
    // 必要なデータを取得
    const mbtiType = formData.get("mbtiType") as string;
    const eScore = parseInt(formData.get("eScore") as string) || 50;
    const nScore = parseInt(formData.get("nScore") as string) || 50;
    const fScore = parseInt(formData.get("fScore") as string) || 50;
    const pScore = parseInt(formData.get("pScore") as string) || 50;

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
      const { error } = await supabase.rpc("save_test_result", {
        p_user_id: newUser.id,
        p_mbti_type: mbtiType,
        p_answers: {},
        p_e_score: eScore,
        p_n_score: nScore,
        p_f_score: fScore,
        p_p_score: pScore,
      });

      if (error) {
        console.error("Error saving test result:", error);
        throw new Error(`テスト結果の保存に失敗しました: ${error.message}`);
      }
    } else {
      // 既存ユーザーIDで保存（RPC関数を使用）
      const { error } = await supabase.rpc("save_test_result", {
        p_user_id: userData.id,
        p_mbti_type: mbtiType,
        p_answers: {},
        p_e_score: eScore,
        p_n_score: nScore,
        p_f_score: fScore,
        p_p_score: pScore,
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

// 特定のテスト結果IDで結果を取得する関数
export async function getTestResultById(resultId: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { error: "ログインが必要です" };
    }

    const supabase = createClient();

    // ClerkIDからユーザー情報を取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return { error: "ユーザー情報の取得に失敗しました" };
    }

    // 指定されたIDのテスト結果を取得（自分のテスト結果のみ）
    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("id", resultId)
      .eq("user_id", userData.id)
      .single();

    if (error) {
      console.error("Test result fetch error:", error);
      return { error: "テスト結果の取得に失敗しました" };
    }

    return { data };
  } catch (error) {
    console.error("Error fetching test result:", error);
    return { error: (error as Error).message };
  }
}
