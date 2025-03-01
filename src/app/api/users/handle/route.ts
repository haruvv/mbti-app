import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    // auth() を await で解決
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { handle } = body;

    if (!handle) {
      return NextResponse.json(
        { error: "ユーザーIDは必須です" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // まずユーザーのUUIDを取得
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // ハンドルの更新を試みる
    const { data, error } = await supabase.rpc("update_user_handle", {
      p_user_id: user.id,
      p_new_handle: handle,
    });

    if (error) {
      // エラーメッセージを日本語に変換
      const errorMessage =
        {
          "Handle update not allowed":
            "ユーザーIDは14日間に1度しか変更できません",
          "Handle already taken": "このユーザーIDは既に使用されています",
          "Invalid handle format":
            "ユーザーIDは1-15文字の半角英数字と_のみ使用できます",
        }[error.message] || error.message;

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Handle update error:", error);
    return NextResponse.json(
      { error: "ユーザーIDの更新に失敗しました" },
      { status: 500 }
    );
  }
}
