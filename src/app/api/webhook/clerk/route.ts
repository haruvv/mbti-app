import { Webhook } from "svix";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env file"
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

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
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses } = evt.data;
    const email =
      email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : "dummy@example.com";

    try {
      // returning を削除
      const { error: userError } = await supabase.from("users").upsert(
        {
          clerk_id: id,
          email: email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_id" } // returning を削除
      );

      if (userError) throw userError;

      const { data: user, error: getUserError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", id)
        .single();

      if (getUserError) throw getUserError;

      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            display_name: "ゲスト",
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
