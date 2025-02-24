"use server";

import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type MBTIType =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ";

export async function saveTestResult(mbtiType: MBTIType) {
  const cookieStore = cookies();
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
