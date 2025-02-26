export async function updateUserProfile(
  userId: string,
  data: {
    displayName?: string;
    bio?: string;
    preferredMbti?: string;
    customImageUrl?: string;
    bookmarkedTypes?: string[];
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      website?: string;
    };
  }
) {
  const { data: result, error } = await supabase.rpc("update_user_profile", {
    p_user_id: userId,
    p_display_name: data.displayName,
    p_bio: data.bio,
    p_preferred_mbti: data.preferredMbti,
    p_custom_image_url: data.customImageUrl,
    p_bookmarked_types: data.bookmarkedTypes,
    p_social_links: data.socialLinks,
  });

  if (error) {
    console.error("Error updating user profile:", error);
    throw new Error("プロフィールの更新に失敗しました");
  }

  return result;
}
