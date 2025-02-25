"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  custom_image_url: string | null;
  preferred_mbti: string | null;
  bio: string | null;
  bookmarked_types: string[] | null;
  handle: string | null;
};

export async function getUserProfile(clerkId: string) {
  try {
    const supabase = createClient();

    let { data: user } = await supabase
      .from("users")
      .select("id, display_name")
      .eq("clerk_id", clerkId)
      .single();

    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) throw new Error("User not found in Clerk");

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            clerk_id: clerkId,
            email:
              clerkUser.emailAddresses[0]?.emailAddress || "dummy@example.com",
            display_name: clerkUser.firstName || null,
          },
        ])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      user = newUser;
    }

    let { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (!profile) {
      if (!user) throw new Error("User not found");

      const { data: newProfile, error: createProfileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id: user.id,
            display_name: user.display_name,
          },
        ])
        .select()
        .single();

      if (createProfileError) {
        throw createProfileError;
      }

      profile = newProfile;
    }

    return { success: true, data: profile as UserProfile };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return { success: false, error: "プロフィールの取得に失敗しました" };
  }
}

export async function updateUserProfile(
  clerkId: string,
  data: {
    displayName: string;
    imageUrl: string;
    preferredMbti: string | null;
    bio: string;
    bookmarkedTypes: string[];
    handle: string;
  }
) {
  const supabase = createClient();

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

  try {
    // 1. まずhandleを更新（update_user_handle関数を使用）
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

    // 2. 次にuser_profilesテーブルを更新
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .update({
        display_name: data.displayName,
        custom_image_url: data.imageUrl,
        preferred_mbti: data.preferredMbti,
        bio: data.bio,
        bookmarked_types: data.bookmarkedTypes,
      })
      .eq("user_id", userData.id)
      .select()
      .single();

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: "プロフィールの更新に失敗しました" };
    }

    // キャッシュを更新
    revalidatePath("/profile");
    revalidatePath(`/profile/${data.handle}`);

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error("Update error:", error);
    return { error: "プロフィールの更新に失敗しました" };
  }
}
