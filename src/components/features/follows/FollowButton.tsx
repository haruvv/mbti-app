"use client";

import { useState } from "react";
import { toggleFollow } from "@/app/_actions/follows";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FollowButtonProps = {
  targetUserId?: string;
  userId?: string;
  initialIsFollowing: boolean;
};

export function FollowButton({
  targetUserId,
  userId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userIdToUse = targetUserId || userId;

  const handleToggleFollow = async () => {
    if (!userIdToUse) {
      console.error("No user ID provided to FollowButton");
      toast.error("ユーザーIDが指定されていません");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFollow(userIdToUse);
      console.log("Toggle follow result:", result);

      if (!result.success) {
        toast.error(result.error || "フォロー操作に失敗しました");
        return;
      }

      const newFollowState = !isFollowing;
      console.log("Setting follow state to:", newFollowState);
      setIsFollowing(newFollowState);

      router.refresh();
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("フォロー操作に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading || !userIdToUse}
      className={`px-4 py-2 rounded-full font-medium transition-colors ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {isLoading ? (
        <span className="inline-block h-5 w-5 border-2 border-current rounded-full border-t-transparent animate-spin"></span>
      ) : isFollowing ? (
        "フォロー中"
      ) : (
        "フォローする"
      )}
    </button>
  );
}
