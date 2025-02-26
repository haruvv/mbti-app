import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "@/components/features/follows/FollowButton";
import { FollowStats } from "@/components/features/follows/FollowStats";
import Link from "next/link";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = createClient();
  const { userId } = auth();

  // ユーザー情報の取得
  const { data: user, error } = await supabase
    .from("users")
    .select(
      `
      id,
      handle,
      display_name,
      user_profiles (
        id,
        display_name,
        custom_image_url,
        preferred_mbti,
        bio,
        bookmarked_types,
        social_links
      )
    `
    )
    .eq("handle", handle)
    .single();

  if (error || !user) {
    notFound();
  }

  // 現在のユーザーIDを取得
  let currentUserId = null;
  let isFollowing = false;
  let isCurrentUser = false;

  if (userId) {
    const { data: currentUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (currentUser) {
      currentUserId = currentUser.id;
      isCurrentUser = currentUser.id === user.id;

      // 自分自身でない場合のみフォロー状態を確認
      if (!isCurrentUser) {
        const { data: followData } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", currentUser.id)
          .eq("following_id", user.id)
          .maybeSingle();

        isFollowing = !!followData;
      }
    }
  }

  // フォロー数とフォロワー数を取得
  const { data: followCounts } = await supabase.rpc("get_follow_counts", {
    p_user_id: user.id,
  });

  const followingCount = followCounts?.following_count || 0;
  const followersCount = followCounts?.followers_count || 0;

  const displayName = user.user_profiles?.display_name || `@${user.handle}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* プロフィールカード */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* ヘッダー部分 */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

          <div className="px-6 pb-6">
            {/* アバター画像 */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={
                    user.user_profiles?.custom_image_url ||
                    "/default-avatar.png"
                  }
                  alt={displayName}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* プロフィール情報 */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    <p className="text-gray-500">@{user.handle}</p>
                  </div>

                  {/* 自分自身のプロフィールではフォローボタンを表示しない */}
                  {currentUserId && !isCurrentUser && (
                    <FollowButton
                      userId={user.id}
                      initialIsFollowing={isFollowing}
                    />
                  )}

                  {/* 自分自身のプロフィールでは編集ボタンを表示 */}
                  {isCurrentUser && (
                    <Link
                      href="/settings/profile"
                      className="px-4 py-2 rounded-full font-medium transition-colors bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      プロフィールを編集
                    </Link>
                  )}
                </div>

                {/* フォロー・フォロワー情報 */}
                <div className="mb-6">
                  <FollowStats
                    followingCount={followingCount}
                    followersCount={followersCount}
                    handle={user.handle}
                  />
                </div>

                {/* バイオ */}
                {user.user_profiles?.bio && (
                  <div className="mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {user.user_profiles.bio}
                    </p>
                  </div>
                )}

                {/* 好きなタイプ */}
                {user.user_profiles?.preferred_mbti && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">好きなタイプ</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {user.user_profiles.preferred_mbti}:{" "}
                        {
                          typeDescriptions[user.user_profiles.preferred_mbti]
                            ?.title
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* ブックマークしたタイプ */}
                {user.user_profiles?.bookmarked_types &&
                  user.user_profiles.bookmarked_types.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        ブックマークしたタイプ
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {user.user_profiles.bookmarked_types.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {type}: {typeDescriptions[type]?.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* 追加コンテンツセクション */}
        {isCurrentUser && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">アクティビティ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4">
                <h3 className="font-semibold text-indigo-800 mb-2">
                  フォロワー
                </h3>
                <p className="text-gray-600 text-sm">
                  {followersCount > 0
                    ? `${followersCount}人があなたをフォローしています`
                    : "まだフォロワーがいません"}
                </p>
                <Link
                  href={`/profile/${user.handle}/follows?tab=followers`}
                  className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:underline"
                >
                  詳細を見る →
                </Link>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-800 mb-2">
                  フォロー中
                </h3>
                <p className="text-gray-600 text-sm">
                  {followingCount > 0
                    ? `${followingCount}人をフォロー中です`
                    : "まだ誰もフォローしていません"}
                </p>
                <Link
                  href={`/profile/${user.handle}/follows?tab=following`}
                  className="text-purple-600 text-sm font-medium mt-2 inline-block hover:underline"
                >
                  詳細を見る →
                </Link>
              </div>

              <div className="bg-pink-50 rounded-xl p-4">
                <h3 className="font-semibold text-pink-800 mb-2">MBTIタイプ</h3>
                <p className="text-gray-600 text-sm">
                  {user.user_profiles?.preferred_mbti
                    ? `好きなタイプ: ${user.user_profiles.preferred_mbti}`
                    : "好きなタイプが設定されていません"}
                </p>
                <Link
                  href="/settings/profile"
                  className="text-pink-600 text-sm font-medium mt-2 inline-block hover:underline"
                >
                  編集する →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
