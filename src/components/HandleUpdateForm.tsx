import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";

export function HandleUpdateForm() {
  const { user, refreshUser } = useUser();
  const [newHandle, setNewHandle] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // ハンドル更新が許可されているかチェック
    async function checkUpdateAllowed() {
      const { data, error } = await supabase.rpc(
        "check_handle_update_allowed",
        {
          p_user_id: user.id,
        }
      );

      if (error) {
        console.error("Error checking handle update permission:", error);
      } else {
        setIsAllowed(data);
      }
    }

    checkUpdateAllowed();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !isAllowed) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase.rpc("update_user_handle", {
        p_user_id: user.id,
        p_new_handle: newHandle,
      });

      if (error) throw error;

      setSuccess(true);
      setNewHandle("");
      refreshUser();
    } catch (err: any) {
      console.error("Error updating handle:", err);
      setError(err.message || "ハンドルの更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAllowed) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
        ハンドルは14日間に一度しか更新できません。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="handle" className="block text-sm font-medium">
          新しいハンドル
        </label>
        <input
          type="text"
          id="handle"
          value={newHandle}
          onChange={(e) => setNewHandle(e.target.value)}
          pattern="^[a-z0-9_]{1,15}$"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="新しいハンドル（例: my_handle_123）"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          1〜15文字の小文字、数字、アンダースコアのみ使用可能です
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
          ハンドルが正常に更新されました
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
      >
        {isLoading ? "更新中..." : "ハンドルを更新"}
      </button>
    </form>
  );
}
