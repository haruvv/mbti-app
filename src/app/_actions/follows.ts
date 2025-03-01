"use server";

import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ユーザー型を定義
type User = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  // 他に必要なフィールドがあれば追加
};

// フォロー状態を切り替える
export async function toggleFollow(targetUserId: string): Promise<{
  success: boolean;
  isFollowing?: boolean;
  error?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "認証が必要です" };
    }

    const supabase = createClient();

    // 自分のユーザーIDを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return { success: false, error: "ユーザー情報の取得に失敗しました" };
    }

    // 自分自身をフォローしようとしている場合はエラーを返す
    if (userData.id === targetUserId) {
      return {
        success: false,
        error: "自分自身をフォローすることはできません",
      };
    }

    // フォロー/フォロー解除の処理
    const { data, error } = await supabase.rpc("toggle_follow_status", {
      p_follower_id: userData.id,
      p_following_id: targetUserId,
    });

    if (error) {
      console.error("Toggle follow error:", error);

      // デバッグ用の詳細なログ出力
      console.log("Function params:", {
        p_follower_id: userData.id,
        p_following_id: targetUserId,
      });

      return { success: false, error: "フォロー状態の更新に失敗しました" };
    }

    // 関連するパスを再検証
    revalidatePath(`/profile/[handle]`);
    revalidatePath(`/profile/[handle]/follows`);

    return {
      success: true,
      isFollowing: data.is_following,
    };
  } catch (error) {
    console.error("Toggle follow error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "予期せぬエラーが発生しました",
    };
  }
}

// フォロー状態を確認する
export async function checkIsFollowing(targetUserId: string): Promise<{
  success: boolean;
  isFollowing?: boolean;
  error?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "認証が必要です" };
    }

    const supabase = createClient();

    // 自分のユーザーIDを取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return { success: false, error: "ユーザー情報の取得に失敗しました" };
    }

    // フォロー状態を確認
    const { data: isFollowing, error: followError } = await supabase.rpc(
      "check_follow_status",
      {
        p_follower_id: userData.id,
        p_following_id: targetUserId,
      }
    );

    if (followError) {
      console.error("Follow check error:", followError);
      return { success: false, error: "フォロー状態の確認に失敗しました" };
    }

    return { success: true, isFollowing };
  } catch (error) {
    console.error("Check following error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "予期せぬエラーが発生しました",
    };
  }
}

// フォロー数とフォロワー数を取得する
export async function getFollowCounts(userId: string): Promise<{
  success: boolean;
  data?: {
    following_count: number;
    followers_count: number;
  };
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_follow_counts", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Get follow counts error:", error);
      return { success: false, error: "フォロー数の取得に失敗しました" };
    }

    return {
      success: true,
      data: {
        following_count: data.following_count,
        followers_count: data.followers_count,
      },
    };
  } catch (error) {
    console.error("Get follow counts error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "予期せぬエラーが発生しました",
    };
  }
}

// フォロー/フォロワーリストを取得する関数を追加
export async function getUserFollows(
  userId: string,
  type: "following" | "followers",
  limit: number = 20,
  offset: number = 0
): Promise<{
  success: boolean;
  data?: {
    users: User[];
    total_count: number;
  };
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_user_follows", {
      p_user_id: userId,
      p_type: type,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error("Get user follows error:", error);
      return { success: false, error: "フォローリストの取得に失敗しました" };
    }

    return {
      success: true,
      data: {
        users: data.users || [],
        total_count: data.total_count || 0,
      },
    };
  } catch (error) {
    console.error("Get user follows error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "予期せぬエラーが発生しました",
    };
  }
}
