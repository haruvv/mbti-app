import { Webhook } from "svix";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  console.log("Webhook received");

  try {
    // リクエストボディを文字列として取得
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const headersList = await headers();
    const supabase = createClient();

    // Webhookヘッダーを取得
    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing webhook headers");
      return Response.json(
        { success: false, error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    console.log("Webhook headers:", {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature.substring(0, 10) + "...",
    });

    // 環境変数の確認
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET is not set");
      return Response.json(
        { success: false, error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    console.log("Webhook raw body:", rawBody);

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = (await wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    })) as any;

    console.log("Webhook event type:", payload.type);
    console.log("Webhook payload:", {
      id: payload.data?.id,
      email: payload.data?.email_addresses?.[0]?.email_address,
      username: payload.data?.username,
    });

    if (payload.type === "user.created") {
      const { id, email_addresses, username } = payload.data;
      const email = email_addresses[0].email_address;

      const { data, error } = await supabase
        .from("users")
        .insert({ clerk_id: id, email, username })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("User successfully inserted:", data);
      return Response.json({ success: true, data });
    }

    return Response.json({ success: true, message: "Non-user.created event" });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
