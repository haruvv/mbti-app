const { data: users } = await supabase
  .from("user_profiles")
  .select(
    "user_id, display_name, bio, preferred_mbti, custom_image_url, handle"
  )
  .ilike("display_name", `%${query}%`)
  .limit(10);
