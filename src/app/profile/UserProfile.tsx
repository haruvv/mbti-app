"use client";

import Image from "next/image";

type UserProfileProps = {
  imageUrl?: string | null;
  firstName?: string | null;
};

export function UserProfile({ imageUrl, firstName }: UserProfileProps) {
  return (
    <div className="relative">
      {imageUrl ? (
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
          <Image
            src={imageUrl}
            alt={firstName || "ユーザー"}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-2xl font-bold text-white border-4 border-white/20 shadow-xl">
          {(firstName?.[0] || "U").toUpperCase()}
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
    </div>
  );
}
