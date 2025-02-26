"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  preferred_mbti: string | null;
  custom_image_url: string | null;
  bookmarked_types: string[];
  handle: string | null;
  social_links: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
  handle_updated_at?: string;
};

export async function getUserProfile(clerkId: string) {
  try {
    const supabase = createClient();

    // usersテーブルからユーザーIDのみを取得
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    // ユーザーが存在しない場合のみ作成を試みる
    if (userError && userError.code === "PGRST116") {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return { error: "ユーザーが見つかりません" };
      }

      // 新規ユーザーの作成
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      if (!email) {
        return { error: "メールアドレスが見つかりません" };
      }

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            clerk_id: clerkId,
            email: email,
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return { error: `ユーザー作成エラー: ${createError.message}` };
      }

      // 新規プロフィールの作成（handleはまだ設定しない）
      const { data: newProfile, error: profileCreateError } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id: newUser.id,
            display_name: "ゲスト",
          },
        ])
        .select()
        .single();

      if (profileCreateError) {
        console.error("Error creating profile:", profileCreateError);
        return {
          error: `プロフィール作成エラー: ${profileCreateError.message}`,
        };
      }

      return { data: newProfile };
    } else if (userError) {
      console.error("User fetch error:", userError);
      return { error: `ユーザー取得エラー: ${userError.message}` };
    }

    // user_profilesテーブルからプロフィール情報を取得
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      // プロフィールが見つからない場合は作成
      if (profileError.code === "PGRST116") {
        const { data: newProfile, error: createProfileError } = await supabase
          .from("user_profiles")
          .insert([
            {
              user_id: user.id,
              display_name: "ゲスト",
            },
          ])
          .select()
          .single();

        if (createProfileError) {
          console.error("Error creating profile:", createProfileError);
          return {
            error: `プロフィール作成エラー: ${createProfileError.message}`,
          };
        }

        return { data: newProfile };
      }

      console.error("Profile fetch error:", profileError);
      return { error: `プロフィール取得エラー: ${profileError.message}` };
    }

    return { data: profile };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return { error: "プロフィールの取得に失敗しました" };
  }
}

export async function updateUserProfile(
  clerkId: string,
  data: {
    displayName?: string;
    bio?: string;
    preferredMbti?: string | null;
    customImageUrl?: string;
    bookmarkedTypes?: string[];
    handle?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      website?: string;
    };
  }
) {
  const supabase = createClient();

  try {
    // まずClerkIDに対応するSupabaseのuser_idを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      return { error: "ユーザー情報の取得に失敗しました" };
    }

    // ハンドル更新処理（指定された場合のみ）
    if (data.handle) {
      const { error: handleError } = await supabase.rpc("update_user_handle", {
        p_user_id: userData.id,
        p_new_handle: data.handle,
      });

      if (handleError) {
        const errorMessage =
          {
            "Handle update not allowed":
              "ユーザーIDは14日間に1度しか変更できません",
            "Handle already taken": "このユーザーIDは既に使用されています",
            "Invalid handle format":
              "ユーザーIDは1-15文字の半角英数字と_のみ使用できます",
          }[handleError.message] || handleError.message;

        return { error: errorMessage };
      }
    }

    // プロフィール更新処理（RPC関数を使用）
    const { data: profile, error: profileError } = await supabase.rpc(
      "update_user_profile",
      {
        p_user_id: userData.id,
        p_display_name: data.displayName,
        p_bio: data.bio,
        p_preferred_mbti: data.preferredMbti,
        p_custom_image_url: data.customImageUrl,
        p_bookmarked_types: data.bookmarkedTypes,
        p_social_links: data.socialLinks,
      }
    );

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: "プロフィールの更新に失敗しました" };
    }

    return { data: profile };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "予期せぬエラーが発生しました" };
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("ログインが必要です");
    }

    const supabase = createClient();

    // FormDataから値を取得
    const displayName = formData.get("displayName") as string;
    const bio = formData.get("bio") as string;
    const mbtiType = formData.get("mbtiType") as string;
    const customImageUrl = formData.get("customImageUrl") as string;
    const favoriteTypesStr = formData.get("favoriteTypes") as string;
    const socialLinksStr = formData.get("socialLinks") as string;
    const handle = formData.get("handle") as string;

    // JSON文字列をパース
    const favoriteTypes = JSON.parse(favoriteTypesStr || "[]");
    const socialLinks = JSON.parse(socialLinksStr || "{}");

    // Clerkのユーザーを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      return {
        success: false,
        error: "ユーザー情報の取得に失敗しました",
      };
    }

    // 既存のプロフィールを確認
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userData.id)
      .maybeSingle();

    // handleが変更されている場合、既に使用されていないか確認
    if (handle) {
      const { data: existingHandle, error: handleError } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("handle", handle)
        .neq("user_id", userData.id)
        .maybeSingle();

      if (existingHandle) {
        return {
          success: false,
          error: "このユーザーIDは既に使用されています",
        };
      }
    }

    // プロフィールの更新または作成
    let updateOperation;
    if (existingProfile) {
      // 既存のプロフィールを更新
      updateOperation = supabase
        .from("user_profiles")
        .update({
          display_name: displayName,
          bio,
          preferred_mbti: mbtiType || null,
          custom_image_url: customImageUrl,
          bookmarked_types: favoriteTypes,
          social_links: socialLinks,
          handle: handle || null,
        })
        .eq("user_id", userData.id);
    } else {
      // 新規プロフィールを作成
      updateOperation = supabase.from("user_profiles").insert({
        user_id: userData.id,
        display_name: displayName,
        bio,
        preferred_mbti: mbtiType || null,
        custom_image_url: customImageUrl,
        bookmarked_types: favoriteTypes,
        social_links: socialLinks,
        handle: handle || null,
      });
    }

    const { error: updateError } = await updateOperation;

    if (updateError) {
      console.error("Profile update error:", updateError);
      return {
        success: false,
        error: "プロフィールの更新に失敗しました",
      };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  }
}
