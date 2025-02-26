import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTestResults } from "../_actions/test";
import { typeDescriptions } from "../data/mbtiTypes";
import { getUserProfile } from "../_actions/profile";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { FollowStats } from "@/components/features/follows/FollowStats";
import { FormattedDate } from "@/components/ui/FormattedDate";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { Settings, Twitter, Instagram, Globe } from "lucide-react";

export default async function ProfilePage() {
  try {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // プロフィール情報を取得
    const { data: profileData, error: profileError } = await getUserProfile(
      user.id
    );

    if (profileError || !profileData) {
      throw new Error(profileError || "プロフィールの取得に失敗しました");
    }

    const { success, data: testResults, error } = await getTestResults();

    // 最新の診断結果を取得
    const latestResult =
      testResults && testResults.length > 0 ? testResults[0] : null;
    const latestMbtiType = latestResult?.mbti_type;

    // Supabaseからユーザー情報を取得
    const supabase = createClient();

    // フォロー数とフォロワー数を取得
    let followingCount = 0;
    let followersCount = 0;

    const { data: followCounts } = await supabase.rpc("get_follow_counts", {
      p_user_id: profileData.user_id,
    });

    followingCount = followCounts?.following_count || 0;
    followersCount = followCounts?.followers_count || 0;

    // プロフィール表示用データを取得
    const displayName = profileData.display_name || "ゲスト";

    // handleの取得（必要な場合はRPCから取得）
    let handle = null;
    const { data: userData } = await supabase
      .from("user_profiles")
      .select("handle")
      .eq("user_id", profileData.user_id)
      .single();

    if (userData) {
      handle = userData.handle;
    }

    const bio = profileData.bio || "";
    const preferredMbti = profileData.preferred_mbti || latestMbtiType;
    const profileImage = profileData.custom_image_url;
    const bookmarkedTypes = profileData.bookmarked_types || [];
    const socialLinks = profileData.social_links || {};

    return (
      <div className="container max-w-4xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* プロフィール情報（左側） */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border">
              {/* プロフィール画像 */}
              <div className="relative w-32 h-32 mb-4">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={displayName}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* ユーザー名とハンドル */}
              <h1 className="text-2xl font-bold">{displayName}</h1>
              {handle && (
                <p className="text-gray-500 text-sm mb-2">@{handle}</p>
              )}

              {/* フォロー・フォロワー情報 */}
              <FollowStats
                followingCount={followingCount}
                followersCount={followersCount}
              />

              {/* MBTI タイプ */}
              {preferredMbti && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {preferredMbti}
                </div>
              )}

              {/* 自己紹介 */}
              {bio && (
                <div className="mt-4 text-gray-600 text-left w-full">
                  <p className="whitespace-pre-wrap break-words">{bio}</p>
                </div>
              )}

              {/* ソーシャルリンク */}
              {Object.keys(socialLinks).length > 0 && (
                <div className="flex gap-2 mt-4">
                  {socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-500"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500"
                    >
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              )}

              {/* 編集リンク */}
              <div className="mt-6 w-full">
                <Link
                  href="/profile/edit"
                  className="w-full flex items-center justify-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors"
                >
                  <Settings size={16} />
                  プロフィールを編集
                </Link>
              </div>
            </div>
          </div>

          {/* メインコンテンツ（右側） */}
          <div className="md:col-span-2 space-y-6">
            {/* 最新の診断結果 */}
            {latestResult && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">最新の診断結果</h2>
                  <FormattedDate
                    date={latestResult.created_at}
                    className="text-sm text-gray-500"
                  />
                </div>

                <div className="mb-4">
                  <TypeCard
                    type={latestResult.mbti_type}
                    description={
                      typeDescriptions[
                        latestResult.mbti_type as keyof typeof typeDescriptions
                      ]?.short || ""
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/result/${latestResult.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            )}

            {/* お気に入りタイプ */}
            {bookmarkedTypes && bookmarkedTypes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">お気に入りタイプ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookmarkedTypes.map((type) => (
                    <TypeCard
                      key={type}
                      type={type}
                      description={
                        typeDescriptions[type as keyof typeof typeDescriptions]
                          ?.short || ""
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 診断テストCTA */}
            {!latestResult && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
                <h2 className="text-xl font-bold mb-2">
                  あなたのMBTIタイプを発見しよう！
                </h2>
                <p className="mb-4">
                  簡単な質問に答えて、あなたの性格タイプを診断します。
                </p>
                <Link
                  href="/test"
                  className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  診断を開始する
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Profile page error:", error);
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">エラー</h1>
        <p className="mb-8">
          {error instanceof Error
            ? error.message
            : "プロフィールの取得に失敗しました"}
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }
}
