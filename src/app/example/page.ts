import { createClerkSupabaseClient } from "@/lib/supabase/client";

export default async function Page() {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase.from("users").select().single();

  // ...
}
