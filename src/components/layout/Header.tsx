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
import { UserSearch } from "@/components/features/search/UserSearch";

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
                  <Link href="/test" className={navigationMenuTriggerStyle()}>
                    診断する
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 検索フォームをヘッダーの中央に配置 */}
          <div className="flex-1 max-w-xl mx-4">
            <UserSearch />
          </div>

          <div className="flex items-center gap-2">
            <SignedIn>
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-2 rounded-full px-2 py-1 group",
                  "bg-background/50 hover:bg-accent transition-colors",
                  "text-sm font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative size-7 overflow-hidden rounded-full ring-2 ring-background group-hover:ring-foreground/20 transition-all">
                  <Image
                    src={profile?.custom_image_url || user?.imageUrl || ""}
                    alt="プロフィール"
                    fill
                    className="object-cover"
                  />
                </div>
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
