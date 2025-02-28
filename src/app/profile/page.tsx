"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserProfile } from "@/app/_actions/profile";
import { Loader2 } from "lucide-react";

export default function ProfileRedirect() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function redirectToHandleProfile() {
      if (!user) return;

      try {
        // ユーザープロフィール情報を取得
        const { data: profileData } = await getUserProfile(user.id);
        // handleを取得（なければuser.idを使用）
        const handle = profileData?.handle || user.id;

        // 対応するハンドルのプロフィールページにリダイレクト
        router.replace(`/profile/${handle}`);
      } catch (error) {
        console.error("プロフィールリダイレクトエラー:", error);
        // エラー時はuser.idを使用
        if (user?.id) {
          router.replace(`/profile/${user.id}`);
        }
      }
    }

    if (isLoaded) {
      redirectToHandleProfile();
    }
  }, [user, isLoaded, router]);

  // リダイレクト中のローディング表示
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
    </div>
  );
}
