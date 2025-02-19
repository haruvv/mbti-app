"use client";

import { useState } from "react";
import { QUESTIONS } from "../data/questions";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const result = calculateMBTI(newAnswers);
      router.push(`/result?type=${result}`);
    }
  };

  const calculateMBTI = (answers: number[]): string => {
    type DimensionKey = "EI" | "SN" | "TF" | "JP";
    const dimensions: Record<DimensionKey, { [key: string]: number }> = {
      EI: { E: 0, I: 0 },
      SN: { S: 0, N: 0 },
      TF: { T: 0, F: 0 },
      JP: { J: 0, P: 0 },
    };

    answers.forEach((score, index) => {
      const question = QUESTIONS[index];
      const value = question.positive ? score - 3 : 3 - score;
      const dim = question.dimension as DimensionKey;

      if (value > 0) {
        dimensions[dim][question.dimension[0]] += Math.abs(value);
      } else {
        dimensions[dim][question.dimension[1]] += Math.abs(value);
      }
    });

    return Object.entries(dimensions)
      .map(([dim, scores]) => {
        const [first, second] = Object.entries(scores);
        return first[1] >= second[1] ? first[0] : second[0];
      })
      .join("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <progress
            value={currentStep + 1}
            max={QUESTIONS.length}
            className="w-full h-3 rounded-full overflow-hidden bg-gray-200"
          />
          <div className="text-right mt-2 text-sm text-gray-600 font-medium">
            {currentStep + 1}/{QUESTIONS.length}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            {QUESTIONS[currentStep].text}
          </h2>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(score)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                {getAnswerLabel(score)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const getAnswerLabel = (score: number): string => {
  const labels: { [key: number]: string } = {
    5: "強く同意する",
    4: "やや同意する",
    3: "どちらとも言えない",
    2: "やや反対する",
    1: "強く反対する",
  };
  return labels[score];
};
