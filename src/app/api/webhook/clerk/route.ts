import { Webhook } from "svix";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  console.log("Webhook received");

  try {
    // リクエストボディを文字列として取得
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const headersList = headers();
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
    const evt = (await wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    })) as WebhookEvent;

    console.log("Webhook event type:", evt.type);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const primaryEmail = email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      )?.email_address;

      if (!primaryEmail) {
        console.error("No primary email found");
        return Response.json(
          { success: false, error: "No primary email found" },
          { status: 400 }
        );
      }

      // トランザクションを使用してユーザーとプロフィールを作成
      const { data, error } = await supabase.rpc("create_user_with_profile", {
        p_clerk_id: id,
        p_email: primaryEmail,
        p_display_name:
          [first_name, last_name].filter(Boolean).join(" ") || null,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return Response.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      console.log("User and profile successfully created:", data);
      return Response.json({ success: true, data });
    }

    return Response.json({
      success: true,
      message: "Non-user event processed",
    });
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
