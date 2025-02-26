import Link from "next/link";

export function FollowStats({
  followingCount,
  followersCount,
  handle,
}: {
  followingCount: number;
  followersCount: number;
  handle: string;
}) {
  return (
    <div className="flex gap-6 text-sm">
      <Link
        href={`/profile/${handle}/follows?tab=following`}
        className="flex flex-col items-center hover:opacity-80 transition-opacity"
      >
        <span className="font-bold text-lg">{followingCount}</span>
        <span className="text-gray-600">フォロー中</span>
      </Link>
      <Link
        href={`/profile/${handle}/follows?tab=followers`}
        className="flex flex-col items-center hover:opacity-80 transition-opacity"
      >
        <span className="font-bold text-lg">{followersCount}</span>
        <span className="text-gray-600">フォロワー</span>
      </Link>
    </div>
  );
}
