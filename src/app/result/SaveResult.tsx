"use client";

import { useEffect, useState, useRef } from "react";
import { saveTestResult } from "../_actions/test";
import type { MBTITypeKey } from "../data/mbtiTypes";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export function SaveResult({ mbtiType }: { mbtiType: MBTITypeKey }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const saveAttemptedRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isNewResult = searchParams.get("from") === "test";

  useEffect(() => {
    const resultId = isNewResult
      ? uuidv4()
      : searchParams.get("resultId") || "unknown";

    const storageKey = `mbti_result_${resultId}`;
    const alreadySaved = localStorage.getItem(storageKey);

    console.log("ストレージキー:", storageKey);
    console.log("新規テスト結果:", isNewResult);
    console.log("保存済みフラグ:", alreadySaved);

    if (alreadySaved === "true") {
      console.log("保存済みと判定");
      setIsSaved(true);
      return;
    }

    if (!isNewResult) {
      console.log("新規テスト結果ではないため保存しない");
      return;
    }

    const save = async () => {
      if (isSaved || saveAttemptedRef.current) return;

      saveAttemptedRef.current = true;
      setIsLoading(true);

      try {
        const answers = JSON.parse(
          localStorage.getItem("mbti_answers") || "{}"
        );

        let eScore = 50;
        let nScore = 50;
        let fScore = 50;
        let pScore = 50;

        if (mbtiType.includes("E")) eScore = 75;
        if (mbtiType.includes("I")) eScore = 25;
        if (mbtiType.includes("N")) nScore = 75;
        if (mbtiType.includes("S")) nScore = 25;
        if (mbtiType.includes("F")) fScore = 75;
        if (mbtiType.includes("T")) fScore = 25;
        if (mbtiType.includes("P")) pScore = 75;
        if (mbtiType.includes("J")) pScore = 25;

        const formData = new FormData();
        formData.append("mbtiType", mbtiType);
        formData.append("eScore", eScore.toString());
        formData.append("nScore", nScore.toString());
        formData.append("fScore", fScore.toString());
        formData.append("pScore", pScore.toString());

        console.log("保存処理開始...");
        const result = await saveTestResult(formData);
        console.log("保存結果:", result);

        if (result.error) {
          console.error("保存に失敗:", result.error);
          setError(result.error);
          toast.error("保存エラー", {
            description: result.error,
          });
        } else {
          setIsSaved(true);
          localStorage.setItem(storageKey, "true");
          toast.success("保存完了", {
            description: "診断結果を保存しました",
          });

          const newUrl =
            window.location.pathname + `?type=${mbtiType}&resultId=${resultId}`;
          window.history.replaceState({}, "", newUrl);
        }
      } catch (e) {
        console.error("保存中にエラー発生:", e);
        setError("保存中にエラーが発生しました");
        toast.error("エラー", {
          description: "保存中にエラーが発生しました",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isNewResult) {
      save();
    }
  }, [mbtiType, isSaved, isNewResult, searchParams]);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 text-indigo-600 bg-white rounded-xl px-4 py-2 shadow-md border border-indigo-100">
        <LoadingSpinner className="h-4 w-4" />
        <span className="text-sm">診断結果を保存中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-red-50 text-red-600 rounded-xl px-4 py-2 shadow-md border border-red-100 text-sm">
        保存エラー: {error}
      </div>
    );
  }

  if (isSaved) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-600 rounded-xl px-4 py-2 shadow-md border border-green-100 text-sm">
        診断結果を保存しました
      </div>
    );
  }

  return null;
}
