import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function useUserHandle() {
  const { user, isLoaded } = useUser();
  const [handle, setHandle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // ユーザーハンドル情報を取得する
  const fetchUserHandle = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("プロフィール取得エラー");

      const data = await response.json();
      const userHandle = data.handle || user.id;

      setHandle(userHandle);
      localStorage.setItem("userHandle", userHandle); // キャッシュとして保存
    } catch (error) {
      console.error("ハンドル取得エラー:", error);
      // エラー時はユーザーIDをフォールバックとして使用
      setHandle(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  // ハンドル情報を更新する
  const updateHandle = (newHandle: string) => {
    setHandle(newHandle);
    localStorage.setItem("userHandle", newHandle);
  };

  useEffect(() => {
    if (isLoaded) {
      // ローカルストレージにキャッシュがあればそれを使用
      const cachedHandle = localStorage.getItem("userHandle");
      if (cachedHandle && user) {
        setHandle(cachedHandle);
        setIsLoading(false);
      } else {
        fetchUserHandle();
      }
    }
  }, [user, isLoaded]);

  return { handle, isLoading, updateHandle, refreshHandle: fetchUserHandle };
}
