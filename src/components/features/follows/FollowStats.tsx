"use client";

import Link from "next/link";

type FollowStatsProps = {
  followingCount: number;
  followersCount: number;
  handle: string;
};

export function FollowStats({
  followingCount,
  followersCount,
  handle,
}: FollowStatsProps) {
  return (
    <div className="flex space-x-4 text-sm">
      <Link
        href={`/profile/${handle}/follows?tab=following`}
        className="hover:text-blue-600 transition-colors"
      >
        <span className="font-bold">{followingCount}</span>{" "}
        <span className="text-gray-600">フォロー中</span>
      </Link>
      <Link
        href={`/profile/${handle}/follows?tab=followers`}
        className="hover:text-blue-600 transition-colors"
      >
        <span className="font-bold">{followersCount}</span>{" "}
        <span className="text-gray-600">フォロワー</span>
      </Link>
    </div>
  );
}
