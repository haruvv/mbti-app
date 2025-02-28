"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/app/data/questions";
import { calculateMBTIType } from "@/app/utils/mbti";
import { Button } from "@/components/ui/button";

export function TestForm() {
  // QUESTIONSデータが存在しているか確認
  const questions = QUESTIONS || [];

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(3) // 中立=3
  );
  const router = useRouter();
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // 現在のページの質問を取得
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // 進捗率の計算
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  const handleAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentPage * questionsPerPage + questionIndex] = value;
    setAnswers(newAnswers);
  };

  const isPageComplete = () => {
    // 少なくとも1つの質問に回答していれば次へ進める
    // 中立(3)の選択も有効な回答として扱う
    return true;
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      // 次のページへ
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      // 最終ページなら結果へ
      const mbtiType = calculateMBTIType(answers);
      console.log("診断結果: ", mbtiType); // デバッグ用ログ
      if (mbtiType && mbtiType.length === 4) {
        router.push(`/result?type=${mbtiType.toUpperCase()}&from=test`);
      } else {
        // タイプ判定に失敗した場合はデフォルトでINFPに設定（必要に応じて変更）
        console.error("タイプ判定に失敗しました", mbtiType);
        router.push(`/result?type=INFP&from=test&error=true`);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  // 選択肢の説明
  const labelMap = {
    1: "強く同意",
    2: "同意",
    3: "中立",
    4: "反対",
    5: "強く反対",
  };

  return (
    <div>
      {/* 進捗バー */}
      <div className="mb-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-600 to-teal-700 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>
            質問 {currentPage * questionsPerPage + 1} -{" "}
            {Math.min((currentPage + 1) * questionsPerPage, questions.length)}
          </span>
          <span>全{questions.length}問中</span>
        </div>
      </div>

      {/* 質問リスト */}
      <div className="space-y-8 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentQuestions.map((question, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-medium mb-4 text-gray-800">
                  {question.text}
                </h3>

                {/* シンプルな選択肢インターフェース */}
                <div className="flex flex-col space-y-3">
                  {/* スケール表示 */}
                  <div className="flex justify-between text-xs text-gray-500 px-2 mb-2">
                    <span>強く同意</span>
                    <span>強く反対</span>
                  </div>

                  {/* 選択肢スライダー */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(index, value)}
                        title={labelMap[value as keyof typeof labelMap]}
                        className={`
                          relative group h-12 rounded-lg transition-all duration-200
                          ${
                            answers[currentPage * questionsPerPage + index] ===
                            value
                              ? `
                              ${value === 1 ? "bg-teal-800" : ""}
                              ${value === 2 ? "bg-teal-700" : ""}
                              ${value === 3 ? "bg-gray-500" : ""}
                              ${value === 4 ? "bg-teal-600" : ""}
                              ${value === 5 ? "bg-teal-500" : ""}
                              shadow-md transform scale-105
                            `
                              : `bg-gray-50 hover:bg-gray-100 border border-gray-200 
                                ${value === 1 ? "hover:border-teal-700" : ""}
                                ${value === 2 ? "hover:border-teal-600" : ""}
                                ${value === 3 ? "hover:border-gray-400" : ""}
                                ${value === 4 ? "hover:border-teal-500" : ""}
                                ${value === 5 ? "hover:border-teal-400" : ""}
                              `
                          }
                        `}
                      >
                        {/* 選択時のチェックマーク */}
                        {answers[currentPage * questionsPerPage + index] ===
                          value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <CheckCircle className="h-5 w-5 text-white" />
                          </motion.div>
                        )}

                        {/* ツールチップ */}
                        <div
                          className={`
                          absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                          text-xs px-2 py-1 rounded bg-gray-800 text-white opacity-0 
                          group-hover:opacity-100 transition-opacity whitespace-nowrap z-1
                        `}
                        >
                          {labelMap[value as keyof typeof labelMap]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={currentPage === 0 ? "invisible" : ""}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 前へ
        </Button>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md"
        >
          {currentPage < totalPages - 1 ? (
            <>
              次へ <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "結果を見る"
          )}
        </Button>
      </div>
    </div>
  );
}
