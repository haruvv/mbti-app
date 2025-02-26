"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// テスト質問データ
const questions = [
  {
    id: 1,
    category: "E-I",
    question: "私は新しい人と出会うのが好きだ",
  },
  {
    id: 2,
    category: "E-I",
    question: "通常、会話を始めるのは私のほうからだ",
  },
  {
    id: 3,
    category: "E-I",
    question: "グループでの活動よりも一人での活動を好む",
  },
  {
    id: 4,
    category: "E-I",
    question: "人混みの中にいると疲れてしまう",
  },
  {
    id: 5,
    category: "S-N",
    question: "抽象的な概念やアイデアに興味がある",
  },
  {
    id: 6,
    category: "S-N",
    question: "未来の可能性について考えるのが好きだ",
  },
  {
    id: 7,
    category: "S-N",
    question: "実用的で現実的な解決策を好む",
  },
  {
    id: 8,
    category: "S-N",
    question: "詳細よりも全体像を重視する",
  },
  {
    id: 9,
    category: "T-F",
    question: "決断する際は感情より論理を重視する",
  },
  {
    id: 10,
    category: "T-F",
    question: "相手の気持ちに共感することが得意だ",
  },
  {
    id: 11,
    category: "T-F",
    question: "議論では客観性を重視する",
  },
  {
    id: 12,
    category: "T-F",
    question: "人間関係の調和を保つことを大切にしている",
  },
  {
    id: 13,
    category: "J-P",
    question: "計画を立てて物事を進めるのが好きだ",
  },
  {
    id: 14,
    category: "J-P",
    question: "締め切りぎりぎりまで物事を先延ばしにしがちだ",
  },
  {
    id: 15,
    category: "J-P",
    question: "予定変更には柔軟に対応できる",
  },
  {
    id: 16,
    category: "J-P",
    question: "整理整頓された環境で作業したい",
  },
];

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();

  const question = questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });

    // 少し待ってから次の質問へ自動的に進む
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 結果を計算
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    // 各軸のスコアを集計
    let eScore = 0;
    let sScore = 0;
    let tScore = 0;
    let jScore = 0;

    questions.forEach((q) => {
      const answer = answers[q.id] || 3; // デフォルト値は中立(3)

      if (q.category === "E-I") {
        // E-I軸: 低いスコアはE、高いスコアはI
        if (q.id <= 2) {
          // Eに関する質問
          eScore += 6 - answer;
        } else {
          // Iに関する質問
          eScore += answer - 1;
        }
      } else if (q.category === "S-N") {
        // S-N軸: 低いスコアはS、高いスコアはN
        if (q.id >= 7) {
          // Sに関する質問
          sScore += 6 - answer;
        } else {
          // Nに関する質問
          sScore += answer - 1;
        }
      } else if (q.category === "T-F") {
        // T-F軸: 低いスコアはT、高いスコアはF
        if (q.id === 9 || q.id === 11) {
          // Tに関する質問
          tScore += 6 - answer;
        } else {
          // Fに関する質問
          tScore += answer - 1;
        }
      } else if (q.category === "J-P") {
        // J-P軸: 低いスコアはJ、高いスコアはP
        if (q.id === 13 || q.id === 16) {
          // Jに関する質問
          jScore += 6 - answer;
        } else {
          // Pに関する質問
          jScore += answer - 1;
        }
      }
    });

    // 各軸のスコアを正規化（0〜100%）
    const maxScorePerAxis = 20; // 各軸4問×最大5点
    const ePercentage = Math.round((eScore / maxScorePerAxis) * 100);
    const sPercentage = Math.round((sScore / maxScorePerAxis) * 100);
    const tPercentage = Math.round((tScore / maxScorePerAxis) * 100);
    const jPercentage = Math.round((jScore / maxScorePerAxis) * 100);

    // MBTIタイプを決定
    const type = `${ePercentage > 50 ? "I" : "E"}${sPercentage > 50 ? "N" : "S"}${tPercentage > 50 ? "F" : "T"}${jPercentage > 50 ? "P" : "J"}`;

    // 結果ページへ移動
    router.push(`/result?type=${type}&from=test`);
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
              質問 {currentQuestion + 1} / {questions.length}
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
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-center text-gray-800">
                {question.question}
              </h2>

              <div className="flex flex-col space-y-3">
                <div className="flex justify-between text-sm text-gray-500 px-4 mb-1">
                  <span>強く反対</span>
                  <span>中立</span>
                  <span>強く同意</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={`relative h-14 rounded-lg transition-all duration-200 ${
                        answers[question.id] === value
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
                      }`}
                    >
                      {answers[question.id] === value && (
                        <CheckCircle className="absolute top-1 right-1 w-4 h-4" />
                      )}
                      <span>{value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentQuestion === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <ArrowLeft size={16} className="mr-1" />
            前の質問
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
              !answers[question.id]
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                次の質問 <ArrowRight size={16} className="ml-1" />
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
