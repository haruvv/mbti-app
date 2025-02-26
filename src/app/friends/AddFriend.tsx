"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sendFriendRequest } from "../_actions/friends";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Search } from "lucide-react";

type UserSearchResult = {
  id: string;
  handle: string;
  display_name?: string | null;
  user_profiles: {
    display_name: string | null;
    custom_image_url: string | null;
    preferred_mbti: string | null;
  } | null;
};

export function AddFriend() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  // 検索結果をクリア
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
    }
  }, [query]);

  // 検索処理
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("検索キーワードを入力してください");
      return;
    }

    setIsSearching(true);

    try {
      const supabase = createClient();
      const searchTerm = query.trim();

      // RPC関数を使用した検索（より効率的）
      const { data, error } = await supabase.rpc("search_users", {
        search_term: searchTerm,
      });

      // RPCが実装されていない場合のフォールバック
      if (
        error &&
        error.message.includes('function "search_users" does not exist')
      ) {
        console.log("RPCが見つからないため、通常の検索を使用します");

        // 通常の検索（ハンドル名またはディスプレイネームで検索）
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("users")
          .select(
            `
            id,
            handle,
            display_name,
            user_profiles (
              display_name,
              custom_image_url,
              preferred_mbti
            )
          `
          )
          .or(
            `handle.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,user_profiles->display_name.ilike.%${searchTerm}%`
          )
          .limit(10);

        if (fallbackError) {
          throw fallbackError;
        }

        setSearchResults(fallbackData || []);
      } else if (error) {
        throw error;
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("検索中にエラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  // フレンドリクエスト送信
  const handleSendRequest = async (handle: string) => {
    setSendingTo(handle);

    try {
      const result = await sendFriendRequest(handle);

      if (result.success) {
        toast.success("フレンドリクエストを送信しました");
        // 成功したら検索結果から削除
        setSearchResults((prev) =>
          prev.filter((user) => user.handle !== handle)
        );
      } else {
        toast.error(result.error || "リクエスト送信に失敗しました");
      }
    } catch (error) {
      toast.error("エラーが発生しました");
    } finally {
      setSendingTo(null);
    }
  };

  // ユーザーの表示名を取得する関数
  const getDisplayName = (user: UserSearchResult) => {
    // 優先順位: user_profiles.display_name > users.display_name > handle
    return user.user_profiles?.display_name || user.display_name || user.handle;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">フレンドを追加</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ユーザー名を検索"
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSearching}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isSearching ? "検索中..." : "検索"}
        </button>
      </form>

      {/* 検索結果 */}
      {searchResults.length > 0 ? (
        <div className="space-y-3 mt-4">
          <h3 className="text-sm font-medium text-gray-500">検索結果</h3>
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={
                      user.user_profiles?.custom_image_url ||
                      "/default-avatar.png"
                    }
                    alt={getDisplayName(user)}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // 画像読み込みエラー時にデフォルト画像を表示
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium">{getDisplayName(user)}</div>
                  <div className="text-sm text-gray-500">@{user.handle}</div>
                  {user.user_profiles?.preferred_mbti && (
                    <div className="text-xs mt-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded inline-block">
                      {user.user_profiles.preferred_mbti}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(user.handle)}
                disabled={sendingTo === user.handle}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {sendingTo === user.handle ? "送信中..." : "リクエスト送信"}
              </button>
            </div>
          ))}
        </div>
      ) : query.trim() && !isSearching ? (
        <div className="text-center py-6 text-gray-500">
          該当するユーザーが見つかりませんでした
        </div>
      ) : null}
    </div>
  );
}
