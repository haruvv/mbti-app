"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";

// コンテキストの型定義
type UserContextType = {
  handle: string;
  isHandleLoading: boolean;
  updateHandle: (newHandle: string) => void;
  refreshHandle: () => Promise<void>;
};

// デフォルト値を持つコンテキストの作成
const UserContext = createContext<UserContextType>({
  handle: "",
  isHandleLoading: true,
  updateHandle: () => {},
  refreshHandle: async () => {},
});

// プロバイダーコンポーネント
export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [handle, setHandle] = useState<string>("");
  const [isHandleLoading, setIsHandleLoading] = useState(true);

  // fetchUserHandleをuseCallbackでメモ化
  const fetchUserHandle = useCallback(async () => {
    if (!user) return;

    setIsHandleLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("プロフィール取得エラー");

      const data = await response.json();
      const userHandle = data.handle || user.id;

      setHandle(userHandle);
      localStorage.setItem("userHandle", userHandle);
      sessionStorage.setItem("userHandle", userHandle);
    } catch (error) {
      console.error("ハンドル取得エラー:", error);
      setHandle(user.id);
    } finally {
      setIsHandleLoading(false);
    }
  }, [user]);

  // ハンドル情報を更新する
  const updateHandle = (newHandle: string) => {
    setHandle(newHandle);
    localStorage.setItem("userHandle", newHandle);
  };

  useEffect(() => {
    if (isLoaded) {
      const cachedHandle = localStorage.getItem("userHandle");
      if (cachedHandle && user) {
        setHandle(cachedHandle);
        setIsHandleLoading(false);
      } else {
        fetchUserHandle();
      }
    }
  }, [user, isLoaded, fetchUserHandle]);

  return (
    <UserContext.Provider
      value={{
        handle,
        isHandleLoading,
        updateHandle,
        refreshHandle: fetchUserHandle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// カスタムフック
export function useUserContext() {
  return useContext(UserContext);
}
