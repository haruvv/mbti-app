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
import UserSearch from "@/components/features/search/UserSearch";
import { BarChart3, Home, User, Menu, X, Star } from "lucide-react";

// プロフィールタイプの定義
type Profile = {
  display_name?: string;
  custom_image_url?: string;
  handle?: string;
  // 他のプロフィール情報
};

export default function Header() {
  const { user, isSignedIn } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const { data } = await getUserProfile(user.id);
        if (data) setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
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

  // ナビゲーションリンクを一致させる - アイコンも含める
  const navigationLinks = [
    { href: "/", label: "ホーム", icon: <Home size={18} /> },
    { href: "/test", label: "診断する", icon: <BarChart3 size={18} /> },
    { href: "/types", label: "タイプ一覧", icon: <User size={18} /> },
    { href: "/ranking", label: "ランキング", icon: <Star size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ロゴ */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              MBTI App
            </div>
          </Link>
        </div>

        {/* デスクトップナビゲーション（中画面以上） */}
        <nav className="hidden md:flex space-x-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 検索ボックス - タブレット以上で表示 */}
        <div className="hidden md:block w-1/3 max-w-xs">
          <UserSearch />
        </div>

        {/* 認証ボタン / ユーザーメニュー */}
        <div className="flex items-center">
          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all hover:shadow-md hidden sm:flex"
                >
                  ログイン
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-sm hover:shadow transition-all"
                >
                  登録
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            {/* ユーザープロフィールリンク */}
            <Link
              href={profile?.handle ? `/profile/${profile.handle}` : "/profile"}
              className="flex items-center gap-2 hover:text-blue-600 transition-all p-2 rounded-md hover:bg-indigo-50 hover:shadow-sm"
            >
              {profile?.custom_image_url ? (
                <div className="w-9 h-9 relative ring-2 ring-indigo-100 rounded-full overflow-hidden">
                  <Image
                    src={profile.custom_image_url}
                    alt={profile?.display_name || "プロフィール"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {getInitial()}
                </div>
              )}
              <span className="text-sm font-medium hidden md:inline-block">
                {profile?.display_name || user?.firstName || "ユーザー"}
              </span>
            </Link>
          </SignedIn>

          {/* シンプルなモバイルメニューボタン */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-2"
            aria-label="メニュー"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 検索ボックス - モバイルのみ表示 */}
      <div className="md:hidden px-4 pb-3">
        <UserSearch />
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <nav className="bg-white py-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-4 py-3 hover:bg-indigo-50 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3 text-indigo-600">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <div className="border-t border-gray-100 mt-2 pt-2 px-4 space-y-2">
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    ログイン
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500">
                    アカウント登録
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  );
}
