import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Brain, Users, Activity, LineChart } from "lucide-react";
import { typeDescriptions } from "./data/mbtiTypes";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { DebugPanel } from "@/components/debug/DebugPanel";

export default async function HomePage() {
  // クライアントの作成
  const supabase = createClient();

  // サーバーサイドでデータを取得
  let userCount = 0;
  let testCount = 0;

  try {
    // 最新の登録ユーザー数を取得
    const userResult = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    userCount = userResult.count || 0;

    // 最新の診断テスト数を取得
    const testResult = await supabase
      .from("test_results")
      .select("*", { count: "exact", head: true });

    testCount = testResult.count || 0;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

  // デバッグデータを準備
  const debugData = {
    stats: {
      userCount,
      testCount,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            あなたの性格タイプを発見しよう
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            MBTIで自己理解を深め、あなたに合った人間関係やキャリアを見つけましょう
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/test"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              診断を始める
            </a>
            <a
              href="/types"
              className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
            >
              タイプを見る
            </a>
          </div>
        </div>

        {/* 特徴セクション */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* 特徴1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">正確な診断</h3>
            <p className="text-gray-600">
              科学的根拠に基づいた質問で、あなたの性格タイプを正確に分析します
            </p>
          </div>

          {/* 特徴2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">コミュニティ</h3>
            <p className="text-gray-600">
              同じタイプのユーザーと交流し、経験や考えを共有できます
            </p>
          </div>

          {/* 特徴3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">洞察に満ちた分析</h3>
            <p className="text-gray-600">
              あなたの強みや弱み、理想的な環境を詳しく解説します
            </p>
          </div>
        </div>

        {/* MBTIの説明 */}
        <div className="mb-16 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">MBTIとは？</h2>
              <p className="text-gray-700 mb-4">
                MBTIは「マイヤーズ・ブリッグスタイプ指標」の略で、カール・ユングの心理学理論に基づいて作られた性格診断ツールです。
                4つの指標から、あなたの思考・行動パターンを16タイプに分類します。
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="w-8 h-8 mr-2 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    E/I
                  </span>
                  <span>外向型(Extraversion)／内向型(Introversion)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-8 h-8 mr-2 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    S/N
                  </span>
                  <span>感覚型(Sensing)／直感型(iNtuition)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-8 h-8 mr-2 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                    T/F
                  </span>
                  <span>思考型(Thinking)／感情型(Feeling)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-8 h-8 mr-2 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    J/P
                  </span>
                  <span>判断型(Judging)／知覚型(Perceiving)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">診断の流れ</h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li>簡単な質問に回答（約5分）</li>
                <li>あなたの性格タイプを分析</li>
                <li>詳細な解説と自己理解のヒント</li>
                <li>相性の良いタイプとの比較</li>
              </ol>
              <div className="mt-4">
                <a
                  href="/test"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  今すぐ診断する
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTAセクション */}
        <div className="text-center py-8 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            自分自身を理解する旅に出よう
          </h2>
          <p className="text-white opacity-90 mb-6 max-w-xl mx-auto">
            5分の診断で、あなたの性格タイプを発見し、より良い人間関係や自己成長につなげましょう
          </p>
          <a
            href="/test"
            className="inline-block px-6 py-3 bg-white text-indigo-700 rounded-lg shadow hover:bg-gray-100 transition-colors"
          >
            無料診断を始める
          </a>
        </div>
      </div>
    </div>
  );
}

// 特徴カードコンポーネント
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// タイプカードコンポーネント
function MbtiTypeCard({ code, name }: { code: string; name: string }) {
  return (
    <Link
      href={`/types/${code.toLowerCase()}`}
      className="group transition-transform hover:-translate-y-1"
    >
      <TypeCard type={code} title={name} />
    </Link>
  );
}
