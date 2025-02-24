import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createClerkSupabaseClient() {
  const { getToken } = await auth();
  const supabaseToken = await getToken({ template: "supabase" });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      },
    }
  );
}
