"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toggleFollow } from "@/app/_actions/follows";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

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
  const [followLoading, setFollowLoading] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const { isSignedIn } = useAuth();

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

  // フォロー状態を切り替える関数
  const handleToggleFollow = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("フォローするにはログインが必要です");
      return;
    }

    setFollowLoading(userId);

    try {
      const { success, isFollowing, error } = await toggleFollow(userId);

      if (success) {
        // 結果リストを更新
        setResults(
          results.map((user) =>
            user.id === userId ? { ...user, is_following: isFollowing } : user
          )
        );

        toast.success(
          isFollowing ? "フォローしました" : "フォロー解除しました"
        );
      } else {
        toast.error(error || "操作に失敗しました");
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
      toast.error("操作に失敗しました");
    } finally {
      setFollowLoading(null);
    }
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

  // プロフィール画像のURLを取得するヘルパー関数
  function getProfileImageUrl(user: SearchResult): string {
    return user.user_profiles?.custom_image_url || "/default-avatar.png";
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ユーザーを検索..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <ul className="py-1">
            {results.map((user) => (
              <li
                key={user.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => handleUserSelect(user.handle)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={getProfileImageUrl(user)}
                      alt={getDisplayName(user)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{getDisplayName(user)}</p>
                    <p className="text-sm text-gray-500">@{user.handle}</p>
                  </div>
                </div>

                {isSignedIn && (
                  <button
                    onClick={(e) => handleToggleFollow(user.id, e)}
                    disabled={followLoading === user.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.is_following
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } transition-colors`}
                  >
                    {followLoading === user.id ? (
                      <span className="inline-block h-4 w-4 border-2 border-current rounded-full border-t-transparent animate-spin"></span>
                    ) : user.is_following ? (
                      "フォロー中"
                    ) : (
                      "フォロー"
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
