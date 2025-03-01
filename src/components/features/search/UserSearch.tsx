"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

// ユーザーのイニシャルを取得する関数を追加
const getInitial = (name: string): string => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

// 検索結果の型定義を修正して id フィールドも許容する
type UserSearchResult = {
  id?: string; // RPC関数からの結果用
  user_id?: string; // フォールバック結果用
  display_name: string;
  custom_image_url?: string;
  handle?: string;
};

export default function UserSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 検索クエリのデバウンス処理
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 検索結果の外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 検索クエリが変更されたら検索を実行
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedSearchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // APIエンドポイントを使用した検索
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        const data = await response.json();
        setResults(data.users || []);
      } catch (error) {
        console.error("検索エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    searchUsers();
  }, [debouncedSearchQuery]);

  // 検索ボックスにフォーカスしたとき
  const handleFocus = () => {
    setIsOpen(true);
  };

  // 検索クエリを変更したとき
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  // 検索ボックスをクリアする
  const handleClear = () => {
    setSearchQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  // ユーザープロフィールに移動したとき
  const handleUserSelect = (handle: string) => {
    if (!handle) return;

    setIsOpen(false);
    setSearchQuery("");
    setResults([]);

    // リンクを使ってクライアント側で遷移させる（エラーを避けるため）
    router.push(`/profile/${handle}`);
  };

  return (
    <div className="relative">
      {/* 検索ボックス */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="ユーザーを検索..."
          className="w-full p-2 pl-10 pr-10 text-sm border rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleClear}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* 検索結果 */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((user) => (
                <li
                  // id と user_id の両方をサポートする一意のキー設定
                  key={user.id || user.user_id || `user-${Math.random()}`}
                  className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => user.handle && handleUserSelect(user.handle)}
                >
                  <div className="flex items-center p-3">
                    <div className="flex-shrink-0 w-10 h-10 relative">
                      {user.custom_image_url ? (
                        <Image
                          src={user.custom_image_url}
                          alt={user.display_name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {getInitial(user.display_name)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user.display_name}</p>
                      {user.handle && (
                        <p className="text-xs text-gray-500">@{user.handle}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchQuery ? (
            <div className="p-4 text-center text-gray-500">
              ユーザーが見つかりませんでした
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              ユーザー名またはIDを入力してください
            </div>
          )}
        </div>
      )}
    </div>
  );
}
