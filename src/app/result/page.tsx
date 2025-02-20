"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTestResult } from "@/hooks/useTestResult";
import { typeDescriptions } from "../data/mbtiTypes";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as keyof typeof typeDescriptions;
  const { saveTestResult } = useTestResult();

  useEffect(() => {
    let isSaved = false;

    const save = async () => {
      if (type && !isSaved) {
        await saveTestResult(type);
        isSaved = true;
      }
    };

    save();
  }, [type]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              あなたは{typeDescriptions[type].title}
            </h1>
            <div className="flex gap-3 mt-4">
              {type.split("").map((letter, index) => (
                <div
                  key={index}
                  className="bg-white/20 rounded-lg px-4 py-2 font-bold"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {typeDescriptions[type].description}
            </p>

            <div className="mt-8">
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                もう一度診断する
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
