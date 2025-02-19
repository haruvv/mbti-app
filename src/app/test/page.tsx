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
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-4">
        <progress
          value={currentStep + 1}
          max={QUESTIONS.length}
          className="w-full h-2 bg-gray-200 rounded"
        />
        <div className="text-right mt-1 text-sm text-gray-600">
          {currentStep + 1}/{QUESTIONS.length}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">
          {QUESTIONS[currentStep].text}
        </h2>

        <div className="grid gap-4">
          {[5, 4, 3, 2, 1].map((score) => (
            <button
              key={score}
              onClick={() => handleAnswer(score)}
              className="p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              {getAnswerLabel(score)}
            </button>
          ))}
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
