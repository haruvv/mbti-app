import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          パーソナリティタイプ診断
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          60の質問であなたのMBTIタイプを診断します。 約10分程度で完了します。
        </p>
        <div className="space-y-4">
          <Link
            href="/test"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            診断を開始する
          </Link>
          <SignedIn>
            <div className="mt-4">
              <Link
                href="/profile"
                className="inline-block text-blue-600 hover:text-blue-700 transition-colors"
              >
                過去の診断結果を見る →
              </Link>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
