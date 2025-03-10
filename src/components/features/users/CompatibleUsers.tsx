import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";

// 互換性のあるユーザーの型定義
type CompatibleUser = {
  id: string;
  custom_image_url: string | null;
  display_name: string | null;
  profile_display_name: string | null;
  handle: string;
  mbti_type: string;
  bio: string | null;
};

export function CompatibleUsers() {
  const { user } = useUser();
  const [compatibleUsers, setCompatibleUsers] = useState<CompatibleUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchCompatibleUsers() {
      setLoading(true);
      const { data, error } = await supabase.rpc("find_compatible_users", {
        p_user_id: user.id,
        p_limit: 10,
        p_offset: 0,
      });

      if (error) {
        console.error("Error fetching compatible users:", error);
      } else {
        setCompatibleUsers(data.users || []);
      }
      setLoading(false);
    }

    fetchCompatibleUsers();
  }, [user?.id]);

  if (loading) return <div>相性の良いユーザーを検索中...</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">相性の良いユーザー</h2>
      {compatibleUsers.length === 0 ? (
        <p>相性の良いユーザーが見つかりませんでした</p>
      ) : (
        <ul className="space-y-4">
          {compatibleUsers.map((user) => (
            <li key={user.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                {user.custom_image_url && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={user.custom_image_url}
                      alt="ユーザー画像"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">
                    {user.display_name || user.profile_display_name}
                  </h3>
                  <p className="text-sm text-gray-600">@{user.handle}</p>
                  <p className="text-sm">{user.mbti_type}</p>
                </div>
              </div>
              {user.bio && <p className="mt-2">{user.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
