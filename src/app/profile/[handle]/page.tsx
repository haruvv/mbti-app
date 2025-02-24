import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { typeDescriptions } from "@/app/data/mbtiTypes";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = createClient();

  // ユーザー情報の取得
  const { data: user, error } = await supabase
    .from("users")
    .select(
      `
      handle,
      user_profiles (
        display_name,
        custom_image_url,
        preferred_mbti,
        bio,
        bookmarked_types
      )
    `
    )
    .eq("handle", handle)
    .single();

  if (error || !user) {
    notFound();
  }

  const profile = user.user_profiles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl pt-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* プロフィールヘッダー */}
          <div className="p-8">
            <div className="flex items-start gap-6">
              <div className="relative size-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image
                  src={profile?.custom_image_url || "/default-avatar.png"}
                  alt={profile?.display_name || user.handle}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {profile?.display_name || "名称未設定"}
                </h1>
                <p className="text-gray-500">@{user.handle}</p>
                {profile?.preferred_mbti && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                      {profile.preferred_mbti}タイプ
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 自己紹介 */}
            {profile?.bio && (
              <div className="mt-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* お気に入りのタイプ */}
            {profile?.bookmarked_types &&
              profile.bookmarked_types.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">
                    お気に入りのタイプ
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {profile.bookmarked_types.map((type) => (
                      <div
                        key={type}
                        className="p-4 rounded-lg border border-gray-100 bg-gray-50"
                      >
                        <h3 className="font-medium text-gray-900">
                          {type}タイプ
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {typeDescriptions[type]?.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
