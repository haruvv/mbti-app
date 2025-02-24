"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateMBTIType } from "../utils/mbti";
import type { Question } from "../data/questions";

export function QuestionForm({ questions }: { questions: Question[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(3)
  );
  const router = useRouter();
  const questionsPerPage = 10;

  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const progress =
    (((currentPage + 1) * questionsPerPage) / questions.length) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      const mbtiType = calculateMBTIType(answers);
      router.push(`/result?type=${mbtiType}&from=test`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-8">
        {currentQuestions.map((question, index) => {
          const questionIndex = currentPage * questionsPerPage + index;
          return (
            <div
              key={questionIndex}
              className="glass-effect rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-medium text-gray-800">
                Q{questionIndex + 1}. {question.text}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`p-3 rounded-lg font-medium transition-all ${
                      answers[questionIndex] === value
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                    }`}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[questionIndex] = value;
                      setAnswers(newAnswers);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{question.leftLabel}</span>
                <span>{question.rightLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
      >
        {currentPage < Math.ceil(questions.length / questionsPerPage) - 1
          ? "次のページへ"
          : "診断結果を見る"}
      </button>
    </form>
  );
}
