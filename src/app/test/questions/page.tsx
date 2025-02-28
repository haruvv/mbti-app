"use client";

import { TestForm } from "@/components/features/test/TestForm";
import { motion } from "framer-motion";
import { Brain, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TestQuestionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-slate-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gray-100 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto max-w-3xl pt-12 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-50 p-8"
        >
          {/* ヘッダー部分 */}
          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-gray-600">
              MBTIタイプ診断
            </h1>
            <p className="text-gray-600 text-center mb-2 max-w-lg mx-auto">
              各質問に対して、あなた自身に最も近いと思う選択肢を選んでください。
            </p>
            <p className="text-sm text-slate-600 text-center font-medium">
              直感的に回答することで、より正確な結果が得られます
            </p>
          </div>

          {/* 診断フォーム */}
          <TestForm />

          {/* アドバイス */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 bg-slate-50 rounded-xl p-4 border border-slate-100"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 text-slate-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-slate-800">
                  診断のヒント
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  「こうあるべき」ではなく「実際の自分」をベースに回答することで、より正確な結果が得られます。
                  回答に迷ったら、最初に思いついた選択肢を選びましょう。
                </p>
              </div>
            </div>
          </motion.div>

          {/* フッターリンク */}
          <div className="mt-6 text-center">
            <Link
              href="/test"
              className="text-xs text-gray-500 hover:text-slate-600 transition-colors"
            >
              診断を中断して戻る
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
