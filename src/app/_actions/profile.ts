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

  // トランザクション的に両方のテーブルを更新
  // 1. まずusersテーブルを更新
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({
      handle: data.handle,
      display_name: data.displayName, // usersテーブルのdisplay_nameを更新
    })
    .eq("clerk_id", clerkId);

  if (userUpdateError) {
    console.error("User update error:", userUpdateError);
    return { error: "ユーザー情報の更新に失敗しました" };
  }

  // 2. 次にuser_profilesテーブルを更新
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .update({
      display_name: data.displayName, // user_profilesテーブルのdisplay_nameを更新
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
}
