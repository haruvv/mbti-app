"use server";

import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File) {
  try {
    const supabase = createClient();

    // ファイル名をユニークに
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Supabaseにアップロード
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "画像のアップロードに失敗しました" };
  }
}
