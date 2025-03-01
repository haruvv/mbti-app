import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL環境変数が設定されていません");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY環境変数が設定されていません");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = async () => {
  const { getToken } = await auth();
  const supabaseToken = await getToken({ template: "supabase" });

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseToken}`,
      },
    },
  });
};
