"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ユーザー検索..."
        className="w-full py-1.5 pl-9 pr-4 rounded-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm"
      />
      <button
        type="submit"
        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        <SearchIcon size={16} />
      </button>
    </form>
  );
}
