"use client";

import { useEffect, useState } from "react";
import { saveTestResult } from "../_actions/test";
import type { MBTITypeKey } from "../data/mbtiTypes";

export function SaveResult({ mbtiType }: { mbtiType: MBTITypeKey }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const save = async () => {
      try {
        const result = await saveTestResult(mbtiType as any);
        if (!result.success) {
          console.error("保存に失敗:", result.error);
          setError(result.error as string);
        }
      } catch (e) {
        console.error("保存中にエラー発生:", e);
        setError("保存中にエラーが発生しました");
      }
    };

    save();
  }, [mbtiType]);

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return null;
}
