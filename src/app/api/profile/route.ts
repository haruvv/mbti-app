import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // URLパラメータの代わりにClerkから直接認証情報を取得
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const clerkId = user.id;
    const supabase = createClient();

    // まずClerkIdからSupabaseのuser_idを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      return NextResponse.json(
        { error: "ユーザー情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    // ユーザープロフィールを取得
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    if (profileError) {
      if (profileError.code === "PGRST116") {
        // プロフィールが存在しない場合は新規作成
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert([
            {
              user_id: userData.id,
              display_name: user.firstName || "ゲスト",
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error("Profile creation error:", createError);
          return NextResponse.json(
            { error: "プロフィール作成に失敗しました" },
            { status: 500 }
          );
        }

        return NextResponse.json(newProfile);
      }

      console.error("Profile fetch error:", profileError);
      return NextResponse.json(
        { error: "プロフィールの取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
