import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTestResults } from "../_actions/test";
import { typeDescriptions } from "../data/mbtiTypes";
import { UserProfile } from "./UserProfile";
import { getUserProfile } from "../_actions/profile";
import { UsernameForm } from "./UsernameForm";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await getUserProfile(user.id);
  const { data: results } = await getTestResults();

  // 最新の診断結果を取得
  const latestResult = results && results.length > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl pt-8">
        <div className="glass-effect rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 relative overflow-hidden">
            {/* デコレーション要素 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative z-10">
              <div className="flex items-start gap-8">
                <UserProfile
                  imageUrl={profile?.custom_image_url || user.imageUrl}
                  name={profile?.display_name || user.firstName || "ゲスト"}
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {profile?.display_name || user.firstName || "ゲスト"}
                  </h1>
                  <a
                    href="/profile/edit"
                    className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors border border-white/20"
                  >
                    プロフィール編集
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                あなたのMBTI
              </h2>
              {latestResult ? (
                <div className="glass-effect p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-bold text-indigo-600 font-mono">
                        {latestResult.mbti_type}
                      </h3>
                      <p className="text-xl text-gray-700">
                        {typeDescriptions[latestResult.mbti_type].title}
                      </p>
                    </div>
                    <a
                      href={`/result?type=${latestResult.mbti_type}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      詳細を見る →
                    </a>
                  </div>
                  <p className="text-gray-600">
                    {typeDescriptions[latestResult.mbti_type].description}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">まだMBTI診断を受けていません</p>
                  <a
                    href="/test"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                  >
                    診断を始める
                  </a>
                </div>
              )}
            </div>

            {/* 代表的なMBTIタイプの詳細 */}
            {latestResult && (
              <div className="glass-effect p-6 rounded-xl">
                <div className="space-y-4">
                  {/* 既存の表示部分 */}

                  {/* 特徴的な性格の追加 */}
                  <div className="mt-4">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      特徴
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {typeDescriptions[latestResult.mbti_type].traits.map(
                        (trait) => (
                          <div
                            key={trait}
                            className="flex items-center gap-2 text-gray-600"
                          >
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            {trait}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* アドバイスの追加 */}
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                    <h4 className="text-lg font-medium text-indigo-700 mb-2">
                      アドバイス
                    </h4>
                    <p className="text-gray-600">
                      {typeDescriptions[latestResult.mbti_type].advice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 自己紹介 */}
            {profile?.bio && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  自己紹介
                </h2>
                <div className="glass-effect p-6 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}

            {/* お気に入りのタイプ */}
            {profile?.bookmarked_types &&
              profile.bookmarked_types.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    お気に入りのタイプ
                  </h2>
                  <div className="glass-effect p-6 rounded-xl">
                    <div className="flex flex-wrap gap-3">
                      {profile.bookmarked_types.map((type) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50/50 border border-indigo-100"
                        >
                          <span className="font-mono font-bold text-indigo-600">
                            {type}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {
                              typeDescriptions[
                                type as keyof typeof typeDescriptions
                              ].title
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {results && results.length > 1 && (
              <div className="mt-8">
                <details className="group">
                  <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-indigo-600">
                    過去の診断履歴を見る
                  </summary>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {results.slice(1).map((result) => (
                      <div
                        key={result.id}
                        className="glass-effect p-4 rounded-xl"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-lg">
                            {result.mbti_type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(result.taken_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
