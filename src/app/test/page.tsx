"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QUESTIONS } from "../data/questions";
import { calculateMBTIType } from "../utils/mbti";

export default function TestPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(QUESTIONS.length).fill(3)
  );
  const router = useRouter();
  const questionsPerPage = 10;
  const totalPages = Math.ceil(QUESTIONS.length / questionsPerPage);

  // 現在のページの質問を取得
  const currentQuestions = QUESTIONS.slice(
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
    const pageAnswers = answers.slice(
      currentPage * questionsPerPage,
      (currentPage + 1) * questionsPerPage
    );

    // 少なくとも1つの質問に回答していれば次へ進める
    return pageAnswers.some((answer) => answer !== 3);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      // 次のページへ
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      // 最終ページなら結果へ
      const mbtiType = calculateMBTIType(answers);
      router.push(`/result?type=${mbtiType}&from=test`);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/test/about"
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            診断説明に戻る
          </Link>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="bg-white shadow-sm border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">
              ページ {currentPage + 1} / {totalPages}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 質問部分 */}
      <div className="container mx-auto px-4 py-10 pb-24 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {currentQuestions.map((question, index) => {
                const questionIndex = currentPage * questionsPerPage + index;
                return (
                  <div
                    key={questionIndex}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      {index + 1}. {question.text}
                    </h2>

                    <div className="flex flex-col space-y-3">
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => handleAnswer(index, value)}
                            className={`relative h-14 rounded-lg transition-all duration-200 ${
                              answers[questionIndex] === value
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
                            }`}
                          >
                            {answers[questionIndex] === value && (
                              <CheckCircle className="absolute top-1 right-1 w-4 h-4" />
                            )}
                            <span>{value}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 px-2">
                        <span>強く反対</span>
                        <span>中立</span>
                        <span>強く同意</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ナビゲーションボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentPage === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <ArrowLeft size={16} className="mr-1" />
            前のページ
          </button>

          <button
            onClick={handleNext}
            disabled={false}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
              false
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {currentPage < totalPages - 1 ? (
              <>
                次のページ <ArrowRight size={16} className="ml-1" />
              </>
            ) : (
              "結果を見る"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
