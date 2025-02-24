import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ users: [] });
  }

  const supabase = createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select(
      `
      handle,
      display_name,
      user_profiles (
        display_name,
        custom_image_url
      )
    `
    )
    .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
  }

  // user_profilesのdisplay_nameでの検索を別途実行
  const { data: profileUsers, error: profileError } = await supabase
    .from("users")
    .select(
      `
      handle,
      display_name,
      user_profiles!inner (
        display_name,
        custom_image_url
      )
    `
    )
    .ilike("user_profiles.display_name", `%${query}%`)
    .limit(10);

  if (profileError) {
    console.error("Profile search error:", profileError);
  }

  // 両方の結果をマージして重複を除去
  const allUsers = [...(users || []), ...(profileUsers || [])];
  const uniqueUsers = allUsers.filter(
    (user, index, self) =>
      index === self.findIndex((u) => u.handle === user.handle)
  );

  return NextResponse.json({ users: uniqueUsers });
}
