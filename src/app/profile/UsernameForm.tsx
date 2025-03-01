"use client";

import { useState } from "react";
import { toast } from "sonner";

export function UsernameForm({
  currentUsername = "",
}: {
  clerkId: string;
  currentUsername: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUsername);

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-white/80 hover:text-white transition-colors text-sm"
      >
        ユーザー名を{currentUsername ? "変更" : "設定"}する →
      </button>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        // ここにユーザー名を更新するロジックを追加
        toast.success("ユーザー名を更新しました");
        setIsEditing(false);
      }}
    >
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm"
        placeholder="ユーザー名を入力"
        autoFocus
      />
      <button
        type="submit"
        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
      >
        保存
      </button>
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setUsername(currentUsername);
        }}
        className="text-white/60 hover:text-white/80 px-3 py-1 rounded-lg text-sm transition-colors"
      >
        キャンセル
      </button>
    </form>
  );
}
