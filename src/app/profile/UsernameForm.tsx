"use client";

import { useState } from "react";
import { updateUsername } from "../_actions/profile";

export function UsernameForm({
  clerkId,
  currentUsername,
}: {
  clerkId: string;
  currentUsername: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUsername);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim()) {
      setError("ユーザー名を入力してください");
      return;
    }

    const result = await updateUsername(clerkId, username);

    if (result.success) {
      setIsEditing(false);
      setError(null);
    } else {
      setError(result.error as string);
    }
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        編集
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-2 py-1 border rounded text-sm"
        placeholder="ユーザー名"
        autoFocus
      />
      <button
        type="submit"
        className="text-sm bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
      >
        保存
      </button>
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setUsername(currentUsername);
          setError(null);
        }}
        className="text-sm text-gray-600 hover:text-gray-800"
      >
        キャンセル
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
