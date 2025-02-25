import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // Webhookヘッダーの取得
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // リクエストボディの取得
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
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;
  const supabase = createClient();

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, username, first_name, last_name } = evt.data;
    const primaryEmail = email_addresses.find(
      (email) => email.id === evt.data.primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return new Response("No primary email found", { status: 400 });
    }

    try {
      const { error } = await supabase.from("users").upsert(
        {
          clerk_id: id,
          email: primaryEmail,
          display_name:
            [first_name, last_name].filter(Boolean).join(" ") || null,
          // handleは後でユーザーに設定してもらう
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "clerk_id",
        }
      );

      if (error) throw error;

      return new Response("Success", { status: 200 });
    } catch (error) {
      console.error("Supabase insert error:", error);
      return new Response("Error occurred", { status: 500 });
    }
  }

  return new Response("Success", { status: 200 });
}
