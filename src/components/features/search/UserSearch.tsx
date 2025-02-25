"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SearchResult = {
  id: string;
  handle: string;
  display_name: string | null;
  user_profiles: {
    display_name: string | null;
    custom_image_url: string | null;
  };
  is_following?: boolean;
};

export function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const searchUsers = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.users || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery]);

  // プロフィールページへの遷移とリセット処理を行う関数
  const handleUserSelect = (handle: string) => {
    setQuery(""); // 検索欄をクリア
    setResults([]); // 検索結果をクリア
    router.push(`/profile/${handle}`);
  };

  // 表示名を取得するヘルパー関数
  function getDisplayName(user: SearchResult): string {
    return (
      user.user_profiles?.display_name ||
      user.display_name ||
      `@${user.handle}` ||
      "Unknown User"
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ユーザーIDまたは表示名で検索..."
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* 検索結果のドロップダウン */}
      {query.trim() && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">検索中...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((user) => (
                <li key={user.handle}>
                  <button
                    onClick={() => handleUserSelect(user.handle)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-8 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={
                            user.user_profiles?.custom_image_url ||
                            "/default-avatar.png"
                          }
                          alt={getDisplayName(user)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          {getDisplayName(user)}
                        </span>
                        <span className="text-sm text-gray-500">
                          @{user.handle}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              ユーザーが見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
}
