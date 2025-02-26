"use client";

import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/components/features/follows/FollowButton";

export function UserSearchResults({ users }) {
  return (
    <ul className="divide-y divide-gray-200">
      {users.map((user) => (
        <li key={user.id} className="py-4 flex items-center justify-between">
          <Link
            href={`/profile/${user.handle}`}
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={
                  user.user_profiles?.custom_image_url || "/default-avatar.png"
                }
                alt={
                  user.user_profiles?.display_name ||
                  user.display_name ||
                  user.handle
                }
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">
                {user.user_profiles?.display_name ||
                  user.display_name ||
                  `@${user.handle}`}
              </p>
              <p className="text-sm text-gray-500">@{user.handle}</p>
            </div>
          </Link>

          {/* 自分自身でない場合のみフォローボタンを表示 */}
          {!user.is_current_user && (
            <FollowButton
              userId={user.id}
              initialIsFollowing={user.is_following || false}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
