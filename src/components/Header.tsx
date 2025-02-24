"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/_actions/profile";
import type { UserProfile } from "@/app/_actions/profile";

export default function Header() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await getUserProfile(user.id);
      if (data) setProfile(data);
    }
    fetchProfile();
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 glass-effect z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            MBTI診断
          </Link>

          <nav className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <div className="relative w-8 h-8">
                  <Image
                    src={profile?.custom_image_url || user?.imageUrl || ""}
                    alt="プロフィール"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span>
                  {profile?.display_name || user?.firstName || "ゲスト"}
                </span>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "hidden", // Clerkのアバターを非表示
                    userButtonPopoverCard: "glass-effect",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all">
                  ログイン
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all">
                  新規登録
                </button>
              </SignUpButton>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
}
