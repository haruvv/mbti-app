import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    const supabase = createClient();

    // 検索クエリを実行
    const { data: users, error } = await supabase
      .from("user_profiles")
      .select(
        `
        user_id,
        display_name,
        custom_image_url,
        handle
      `
      )
      .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error("User search error:", error);
      return NextResponse.json(
        { error: "ユーザー検索に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Unexpected error during user search:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
