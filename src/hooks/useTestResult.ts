import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export function useTestResult() {
  const { user } = useUser();

  const saveTestResult = async (type: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("test_results").insert([
        {
          clerk_user_id: user.id,
          mbti_type: type,
          taken_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error details:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  const getTestHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("clerk_user_id", user.id)
        .order("taken_at", { ascending: false });

      if (error) {
        console.error("Error details:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching test history:", error);
      return [];
    }
  };

  return { saveTestResult, getTestHistory };
}
