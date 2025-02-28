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
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import UserSearch from "@/components/features/search/UserSearch";
import { BarChart3, Home, User, Menu, X, Star } from "lucide-react";

// プロフィールタイプの定義
type Profile = {
  display_name?: string;
  custom_image_url?: string;
  handle?: string;
};

export default function Header() {
  const { user } = useUser();
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
    if (profile?.display_name)
      return profile.display_name.charAt(0).toUpperCase();
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    return "U";
  };

  // ナビゲーションリンク定義
  const navigationLinks = [
    { href: "/", label: "ホーム", icon: <Home size={18} /> },
    { href: "/test", label: "診断する", icon: <BarChart3 size={18} /> },
    { href: "/types", label: "タイプ一覧", icon: <User size={18} /> },
    { href: "/ranking", label: "ランキング", icon: <Star size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* ロゴ */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            MBTI App
          </div>
        </Link>

        {/* デスクトップナビゲーション */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex space-x-2">
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* 検索ボックス */}
        <div className="hidden md:block w-1/3 max-w-xs">
          <UserSearch />
        </div>

        {/* 認証ボタン / ユーザープロフィール */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  ログイン
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm transition-all hover:shadow-md"
                >
                  登録
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <Link
              href={profile?.handle ? `/profile/${profile.handle}` : "/profile"}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 transition-all"
            >
              {profile?.custom_image_url ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-100">
                  <Image
                    src={profile.custom_image_url}
                    alt={profile?.display_name || "プロフィール"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-sm">
                  {getInitial()}
                </div>
              )}
              <span className="hidden md:inline-block text-sm font-medium">
                {profile?.display_name || user?.firstName || "ユーザー"}
              </span>
            </Link>
          </SignedIn>

          {/* モバイルメニューボタン */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="メニュー"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* モバイル用ナビゲーション & 検索 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3">
            <UserSearch />
          </div>
          <nav className="px-4 py-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-purple-50 transition-colors"
              >
                <span className="text-purple-600">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <div className="mt-4 space-y-2">
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    ログイン
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
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
