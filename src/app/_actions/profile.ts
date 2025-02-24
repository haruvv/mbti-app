"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  custom_image_url: string | null;
  preferred_mbti: string | null;
};

export async function getUserProfile(clerkId: string) {
  try {
    const supabase = createClient();

    let { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            clerk_id: clerkId,
            email: "dummy@example.com",
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

    if (!user || !profile) {
      const { data: newProfile, error: createProfileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id: user!.id,
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
  profile: Partial<UserProfile>
) {
  try {
    const supabase = createClient();

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (!user) {
      throw new Error("User not found");
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        display_name: profile.display_name,
        custom_image_url: profile.custom_image_url,
        preferred_mbti: profile.preferred_mbti,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "プロフィールの更新に失敗しました" };
  }
}
