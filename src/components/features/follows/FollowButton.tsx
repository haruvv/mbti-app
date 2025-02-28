"use client";

import { useState } from "react";
import { toggleFollow } from "@/app/_actions/follows";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, UserPlus, Loader2 } from "lucide-react";

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
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`h-9 gap-2 transition-colors ${
        isFollowing
          ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          : "bg-teal-700 hover:bg-teal-800 text-white"
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <Check className="h-4 w-4" />
          フォロー中
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          フォローする
        </>
      )}
    </Button>
  );
}
