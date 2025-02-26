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

// プロフィールタイプの定義（必要に応じて）
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
  }, [isSignedIn]);

  const getProfileImageUrl = () => {
    if (profile?.custom_image_url && profile.custom_image_url.trim() !== "") {
      return profile.custom_image_url;
    }
    // デフォルト画像を使用
    return "/images/default-avatar.png";
  };

  // イニシャルを取得する関数を追加
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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden items-center space-x-2 md:flex">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                MBTI診断
              </span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/test" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      診断を始める
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      MBTIについて
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <UserSearch />
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/profile"
                className={cn(
                  "group flex items-center gap-2 rounded-full border px-4 py-2",
                  "bg-background/50 hover:bg-accent transition-colors",
                  "text-sm font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                ) : profile?.custom_image_url ? (
                  <Image
                    src={profile.custom_image_url}
                    alt="プロフィール"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {getInitial()}
                  </div>
                )}
                <span className="inline-block max-w-[100px] truncate">
                  {profile?.display_name || user?.firstName || "ゲスト"}
                </span>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "hidden",
                    userButtonPopoverCard:
                      "shadow-lg rounded-lg border bg-popover p-2",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  ログイン
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white hover:opacity-90"
                >
                  新規登録
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
