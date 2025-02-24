"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUsername(clerkId: string, newUsername: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .update({ username: newUsername })
      .eq("clerk_id", clerkId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    console.error("Error updating username:", error);
    return { success: false, error: "ユーザー名の更新に失敗しました" };
  }
}
