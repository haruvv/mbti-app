import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ users: [] });
  }

  const supabase = createClient();
  const { userId } = auth();

  // ログインユーザーのSupabase IDを取得
  let currentUserId = null;
  if (userId) {
    const { data: currentUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (currentUser) {
      currentUserId = currentUser.id;
    }
  }

  // ユーザー検索クエリ
  const { data: users, error } = await supabase
    .from("users")
    .select(
      `
      id,
      handle,
      display_name,
      user_profiles!left (
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
      id,
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

  // ログインしている場合、フォロー状態を確認
  if (currentUserId) {
    // フォロー状態を一括で取得
    const { data: followData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    const followingIds = followData?.map((f) => f.following_id) || [];

    // フォロー状態と自分自身かどうかの情報を各ユーザーに追加
    uniqueUsers.forEach((user) => {
      user.is_following = followingIds.includes(user.id);
      user.is_current_user = user.id === currentUserId;
    });
  }

  return NextResponse.json({ users: uniqueUsers });
}
