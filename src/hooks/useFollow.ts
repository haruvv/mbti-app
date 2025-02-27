import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useFollow() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォロー状態を切り替える
  const toggleFollow = async (followerId: string, followingId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc("toggle_follow_status", {
        p_follower_id: followerId,
        p_following_id: followingId,
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error("Error toggling follow status:", err);
      setError(err.message || "フォロー状態の更新に失敗しました");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // フォロー状態をチェックする
  const checkFollowStatus = async (followerId: string, followingId: string) => {
    try {
      const { data, error } = await supabase.rpc("check_follow_status", {
        p_follower_id: followerId,
        p_following_id: followingId,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error checking follow status:", err);
      return false;
    }
  };

  return { toggleFollow, checkFollowStatus, isLoading, error };
}
