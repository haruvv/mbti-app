"use client";

import Image from "next/image";

type UserProfileProps = {
  imageUrl: string;
  name: string;
};

export function UserProfile({ imageUrl, name }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24">
        <Image
          src={imageUrl}
          alt={`${name}のプロフィール画像`}
          fill
          className="rounded-full border-4 border-white shadow-lg object-cover"
        />
      </div>
    </div>
  );
}
