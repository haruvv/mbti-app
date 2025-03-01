import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // フォームデータからファイルを取得
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが見つかりません" },
        { status: 400 }
      );
    }

    // ファイルタイプの検証
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "画像ファイル以外はアップロードできません" },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 }
      );
    }

    // Supabaseのクライアントを初期化
    const supabase = createClient();

    // クラークIDからユーザーIDを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "ユーザー情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    // ユニークなファイル名を生成
    const fileExt = file.name.split(".").pop();
    const fileName = `${userData.id}_${uuidv4()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabaseストレージにアップロード
    const { error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "画像のアップロードに失敗しました" },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const { data: publicUrl } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrl.publicUrl,
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
