"use client";

import { useEffect, useState, useRef } from "react";
import { saveTestResult } from "../_actions/test";
import type { MBTITypeKey } from "../data/mbtiTypes";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";

export function SaveResult({ mbtiType }: { mbtiType: MBTITypeKey }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const saveAttemptedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージをチェックして、既に保存済みかどうかを確認
    const storageKey = `mbti_saved_${mbtiType}`;
    const alreadySaved = localStorage.getItem(storageKey);

    if (alreadySaved) {
      setIsSaved(true);
      return;
    }

    const save = async () => {
      if (isSaved || saveAttemptedRef.current) return;

      saveAttemptedRef.current = true;
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("mbtiType", mbtiType);

        const result = await saveTestResult(formData);

        if (result.error) {
          console.error("保存に失敗:", result.error);
          setError(result.error);
          toast.error("保存エラー", {
            description: result.error,
          });
        } else {
          // 保存成功
          setIsSaved(true);
          // 保存成功をローカルストレージに記録
          localStorage.setItem(storageKey, "true");
          toast.success("保存完了", {
            description: "診断結果を保存しました",
          });

          // from=testパラメータを削除した新しいURLに置き換える
          // これにより、リロード時にも保存が再実行されなくなる
          const newUrl = window.location.pathname + `?type=${mbtiType}`;
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

    // コンポーネントマウント時に自動的に保存処理を実行
    save();
  }, [mbtiType, isSaved, router]);

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
