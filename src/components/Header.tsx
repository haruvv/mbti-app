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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="relative flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-6">
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

          <nav className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/profile"
                className={cn(
                  "group flex items-center gap-2 rounded-full border px-4 py-2",
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
          </nav>
        </div>
      </div>
    </header>
  );
}
