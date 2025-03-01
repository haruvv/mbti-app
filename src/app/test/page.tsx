"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { QUESTIONS } from "../data/questions";
import {
  Play,
  Info,
  ChevronRight,
  Brain,
  Users,
  LineChart,
  Clock,
  Activity,
} from "lucide-react";

export default function TestPage() {
  const [stats, setStats] = useState({
    userCount: "...",
    testCount: "...",
  });
  const [isLoading, setIsLoading] = useState(true);
  // 統計情報を取得
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/stats");

        if (!response.ok) {
          throw new Error("統計情報の取得に失敗しました");
        }

        const data = await response.json();
        setStats({
          userCount: data.formattedUserCount,
          testCount: data.formattedTestCount,
        });
      } catch (error) {
        console.error("統計情報取得エラー:", error);
        setStats({
          userCount: "1k+",
          testCount: "5k+",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-slate-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gray-100 rounded-full opacity-30 blur-3xl"></div>

      <div className="container mx-auto max-w-6xl px-4 py-16 relative z-10">
        {/* ヒーローセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 via-gray-600 to-slate-700">
            あなたの本当の性格を発見しよう
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            科学的根拠に基づいたMBTI診断テストで、あなたの思考パターンと行動特性を分析し、
            16タイプのどれに最も適合するかを解明します。
          </p>
        </motion.div>

        {/* メインコンテンツ */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* 左側：診断テスト開始カード */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50 hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                診断テストを開始
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">所要時間: 約5分</h3>
                    <p className="text-sm text-gray-500">
                      簡単な質問に答えるだけ
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">科学的な分析</h3>
                    <p className="text-sm text-gray-500">
                      4つの軸で16タイプを正確に診断
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <LineChart className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">詳細な結果</h3>
                    <p className="text-sm text-gray-500">
                      あなたの強みと弱み、適性を解説
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/test/questions">
                <button className="w-full py-4 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center group">
                  テストを始める
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* 右側：MBTIについての情報 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-50 hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <Info className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                MBTIについて
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                マイヤーズ・ブリッグス・タイプ指標（MBTI）は、カール・ユングの心理学理論に基づく性格タイプの分類法です。
                世界中で使用されており、自己理解と他者との関係構築に役立ちます。
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold mr-3">
                    E/I
                  </span>
                  <span className="text-sm">
                    外向型(Extraversion) / 内向型(Introversion)
                  </span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                  <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">
                    S/N
                  </span>
                  <span className="text-sm">
                    感覚型(Sensing) / 直感型(iNtuition)
                  </span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                  <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold mr-3">
                    T/F
                  </span>
                  <span className="text-sm">
                    思考型(Thinking) / 感情型(Feeling)
                  </span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg">
                  <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">
                    J/P
                  </span>
                  <span className="text-sm">
                    判断型(Judging) / 知覚型(Perceiving)
                  </span>
                </div>
              </div>

              <Link href="/test/about">
                <button className="w-full py-4 px-8 bg-white border-2 border-purple-200 hover:border-purple-300 text-purple-700 font-medium rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center group">
                  詳細を見る
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 追加情報セクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-1">サイト利用者数</h3>
              <p className="text-xl font-bold text-indigo-600">
                {isLoading ? (
                  <span className="inline-block w-16 h-8 bg-indigo-50 animate-pulse rounded"></span>
                ) : (
                  stats.userCount
                )}
              </p>
              <p className="text-xs text-gray-500">MBTI診断を利用した人々</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-1">診断実施回数</h3>
              <p className="text-xl font-bold text-teal-600">
                {isLoading ? (
                  <span className="inline-block w-16 h-8 bg-teal-50 animate-pulse rounded"></span>
                ) : (
                  stats.testCount
                )}
              </p>
              <p className="text-xs text-gray-500">累計診断回数</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <LineChart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">診断精度</h3>
              <p className="text-xl font-bold text-purple-600">95%</p>
              <p className="text-xs text-gray-500">信頼性の高い診断結果</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
