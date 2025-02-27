import Link from "next/link";
import { Github, Twitter, Mail, Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10 bg-gray-50 border-t">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* サイト情報 */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              MBTI App
            </h3>
            <p className="text-gray-600 text-sm">
              MBTIに基づいた性格診断とユーザーマッチングを提供するコミュニティプラットフォーム
            </p>
          </div>

          {/* リンク */}
          <div className="md:col-span-1">
            <h3 className="text-md font-bold mb-3 text-gray-800">メニュー</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/test"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  診断テスト
                </Link>
              </li>
              <li>
                <Link
                  href="/types"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  タイプ一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* ヘルプ */}
          <div className="md:col-span-1">
            <h3 className="text-md font-bold mb-3 text-gray-800">ヘルプ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  サービスについて
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  利用規約
                </Link>
              </li>
            </ul>
          </div>

          {/* ソーシャル */}
          <div className="md:col-span-1">
            <h3 className="text-md font-bold mb-3 text-gray-800">フォロー</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="mailto:contact@mbtiapp.example.com"
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-gray-500 text-sm mb-3 md:mb-0">
              © {new Date().getFullYear()} MBTI Community. All rights reserved.
            </p>
            <div className="flex space-x-4 text-gray-500 text-sm">
              <Link
                href="/privacy"
                className="hover:text-indigo-600 transition-colors"
              >
                プライバシー
              </Link>
              <Link
                href="/terms"
                className="hover:text-indigo-600 transition-colors"
              >
                利用規約
              </Link>
              <Link
                href="/contact"
                className="hover:text-indigo-600 transition-colors"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
