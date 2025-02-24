"use client";

import { useEffect, useState } from "react";
import { saveTestResult } from "../_actions/test";
import type { MBTITypeKey } from "../data/mbtiTypes";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SaveResult({ mbtiType }: { mbtiType: MBTITypeKey }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const save = async () => {
      setIsLoading(true);
      try {
        const result = await saveTestResult(mbtiType as any);
        if (!result.success) {
          console.error("保存に失敗:", result.error);
          setError(result.error as string);
          toast.error("エラー", {
            description: result.error as string,
          });
        } else if (result.message) {
          // 既に保存済みの場合
          toast(result.message);
        } else {
          // 保存成功
          toast.success("保存完了", {
            description: "診断結果を保存しました",
          });
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

    save();
  }, [mbtiType]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <LoadingSpinner className="h-4 w-4" />
        <span className="text-sm">保存中...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return null;
}
