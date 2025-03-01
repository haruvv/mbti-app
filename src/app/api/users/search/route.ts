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
  const { userId } = await auth();

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

  try {
    // RPC関数を使用した検索
    const { data, error } = await supabase.rpc("search_users", {
      p_search_term: query,
      p_current_user_id: currentUserId,
      p_limit: 10,
      p_offset: 0,
    });

    if (error) {
      console.error("RPC search error:", error);

      // RPCが利用できない場合はフォールバック
      const { data: users, error: fallbackError } = await supabase
        .from("user_profiles")
        .select("user_id, handle, display_name, custom_image_url")
        .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10);

      if (fallbackError) {
        return NextResponse.json(
          { error: "検索に失敗しました" },
          { status: 500 }
        );
      }

      return NextResponse.json({ users });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
  }
}
