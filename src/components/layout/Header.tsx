"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-indigo-700">
            MBTI Community
          </Link>
          <nav className="hidden md:flex ml-8">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/explore"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  タイプ一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/test/about"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  診断テスト
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  コミュニティ
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                プロフィール
              </Link>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center space-x-3">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                新規登録
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
