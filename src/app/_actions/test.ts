"use server";

import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { MBTIType, TestResult } from "@/types/mbti";

export async function getTestResults(): Promise<{
  success: boolean;
  data?: TestResult[];
  error?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const supabase = createClient();

    // まずユーザーのUUIDを取得
    let { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      throw new Error(`ユーザー情報の取得に失敗: ${userError.message}`);
    }

    if (!userData) {
      // ユーザーが存在しない場合は新規作成
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ clerk_id: user.id })
        .select()
        .single();

      if (createError) {
        console.error("User creation error:", createError);
        throw new Error(`ユーザーの作成に失敗: ${createError.message}`);
      }

      userData = newUser;
    }

    // テスト結果を取得
    const { data, error } = await supabase
      .from("test_results")
      .select(
        `
        id,
        mbti_type,
        taken_at
      `
      )
      .eq("user_id", userData!.id)
      .order("taken_at", { ascending: false });

    if (error) {
      console.error("Test results fetch error:", error);
      throw new Error(`テスト結果の取得に失敗: ${error.message}`);
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getTestResults:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "予期せぬエラーが発生しました",
    };
  }
}

export async function saveTestResult(mbtiType: MBTIType) {
  const cookieStore = await cookies();
  const savedKey = `saved_result_${mbtiType}`;

  // 既に保存済みかチェック
  if (cookieStore.get(savedKey)) {
    return { success: true, message: "既に保存済みです" };
  }

  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const supabase = createClient();

    // まずユーザーのUUIDを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    if (userError || !userData) {
      throw new Error("ユーザー情報の取得に失敗しました");
    }

    // 診断結果を保存
    const { data, error } = await supabase
      .from("test_results")
      .insert({
        user_id: userData.id,
        mbti_type: mbtiType,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 保存済みとしてマーク
    cookieStore.set(savedKey, "true", { maxAge: 3 }); // 3秒間有効

    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    console.error("Error saving test result:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "診断結果の保存に失敗しました",
    };
  }
}
