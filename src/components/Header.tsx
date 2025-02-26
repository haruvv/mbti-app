"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/_actions/profile";
import type { UserProfile } from "@/app/_actions/profile";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import UserSearch from "@/components/UserSearch";

// プロフィールタイプの定義
type Profile = {
  display_name?: string;
  custom_image_url?: string;
  // 他のプロフィール情報
};

export default function Header() {
  const { user, isSignedIn } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await getUserProfile(user.id);
      if (data) setProfile(data);
    }
    fetchProfile();
  }, [user]);

  // ユーザーのイニシャルを取得
  const getInitial = () => {
    if (profile?.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">MBTI App</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/test" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    診断テスト
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/types" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    タイプ一覧
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 検索ボックス - デスクトップのみ表示 */}
        <div className="hidden md:block w-1/3 max-w-xs">
          <UserSearch />
        </div>

        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <Button variant="outline" size="sm">
                ログイン
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm">登録</Button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center">
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-gray-50"
            >
              {profile?.custom_image_url ? (
                <div className="w-9 h-9 relative">
                  <Image
                    src={profile.custom_image_url}
                    alt={profile?.display_name || "プロフィール"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {getInitial()}
                </div>
              )}
              <span className="text-sm font-medium hidden md:inline-block">
                {profile?.display_name || user?.firstName || "ユーザー"}
              </span>
            </Link>
          </div>
        </SignedIn>
      </div>

      {/* 検索ボックス - モバイルのみ表示 */}
      <div className="md:hidden px-4 pb-3">
        <UserSearch />
      </div>
    </header>
  );
}
