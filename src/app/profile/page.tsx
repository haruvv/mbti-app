import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTestResults } from "../_actions/test";
import { typeDescriptions } from "../data/mbtiTypes";
import { UserProfile } from "./UserProfile";
import { UsernameForm } from "./UsernameForm";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: results, error } = await getTestResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-gradient-x">
      <div className="container mx-auto max-w-4xl pt-8">
        <div className="glass-effect rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 relative overflow-hidden">
            {/* デコレーション要素 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative z-10 flex items-center gap-6">
              <UserProfile
                imageUrl={user.imageUrl}
                firstName={user.firstName}
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.firstName || "ゲスト"}さんのプロフィール
                </h1>
                <UsernameForm
                  clerkId={user.id}
                  currentUsername={user.username || ""}
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              診断履歴
            </h2>

            {error ? (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100">
                エラーが発生しました: {error}
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="glass-effect p-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-indigo-600">
                        {typeDescriptions[result.mbti_type].title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(result.taken_at)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-2 font-mono">
                      {result.mbti_type}
                    </div>
                    <p className="text-gray-600 line-clamp-3">
                      {typeDescriptions[result.mbti_type].description}
                    </p>
                    <a
                      href={`/result?type=${result.mbti_type}`}
                      className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      詳細を見る →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                まだ診断結果がありません
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <a
                href="/test"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                新しい診断を始める
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
