import { Webhook } from "svix";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  // Webhookシークレットを取得
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env file"
    );
  }

  // リクエストの検証
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // リクエストボディを取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Webhookの検証
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const supabase = createClient();

  // イベントタイプに基づいて処理
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses } = evt.data;

    // メールアドレスの取得（必須）
    const email =
      email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : "dummy@example.com"; // フォールバック

    try {
      // usersテーブルのみ更新（認証連携用の最小限の情報）
      const { data, error: userError } = await supabase.from("users").upsert(
        {
          clerk_id: id,
          email: email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_id", returning: "minimal" }
      );

      if (userError) throw userError;

      // ユーザーIDを取得
      const { data: user, error: getUserError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", id)
        .single();

      if (getUserError) throw getUserError;

      // 初回作成時のみ基本的なプロフィールを作成
      // 既存のプロフィールは上書きしない（ユーザーが後でプロフィール編集で設定）
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingProfile) {
        // 初期プロフィールの作成（最小限）
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            display_name: "ゲスト", // デフォルト名
          });

        if (profileError) throw profileError;
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error syncing user:", error);
      return new Response(JSON.stringify({ error: JSON.stringify(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (eventType === "user.deleted") {
    const userId = evt.data.id;

    try {
      // Clerkユーザーが削除された場合、関連するSupabaseのユーザーを削除
      // CASCADEでuser_profilesとtest_resultsも削除される
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("clerk_id", userId);

      if (deleteError) throw deleteError;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response(JSON.stringify({ error: JSON.stringify(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("", { status: 200 });
}
