"use client";

import { useState } from "react";
import { toggleFollow } from "@/app/_actions/follows";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FollowButton({
  userId,
  initialIsFollowing,
}: {
  userId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleFollow = async () => {
    setIsLoading(true);
    try {
      const result = await toggleFollow(userId);

      if (!result.success) {
        toast.error(result.error || "フォロー操作に失敗しました");
        return;
      }

      setIsFollowing(result.isFollowing || false);
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
      disabled={isLoading}
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
