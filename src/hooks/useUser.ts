import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UserWithProfile extends User {
  handle?: string;
  // 必要に応じてユーザープロファイルの他のフィールドを追加
}

export function useUser() {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションをチェック
    const fetchUser = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const currentUser = session.user as UserWithProfile;

          // プロファイル情報を取得（profiles テーブルに保存されていると仮定）
          const { data: profileData } = await supabase
            .from("profiles")
            .select("handle")
            .eq("id", currentUser.id)
            .single();

          if (profileData) {
            currentUser.handle = profileData.handle;
          }

          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as UserWithProfile);
      } else {
        setUser(null);
      }
    });

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ユーザー情報を再取得する関数
  const refreshUser = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("handle")
        .eq("id", user.id)
        .single();

      if (data) {
        setUser((prev) => (prev ? { ...prev, handle: data.handle } : null));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, refreshUser };
}
