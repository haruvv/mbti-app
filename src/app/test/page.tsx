import { currentUser } from "@clerk/nextjs/server";
import { QuestionForm } from "./QuestionForm";
import { QUESTIONS } from "../data/questions";

export default async function TestPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-gradient-x">
      <div className="container mx-auto max-w-3xl pt-8">
        <div className="glass-effect rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 relative overflow-hidden">
            {/* デコレーション要素 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24" />

            {/* コンテンツ */}
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2">
                パーソナリティ診断テスト
              </h1>
              <p className="text-white/90 text-lg">
                あなたの回答から最適なタイプを診断します
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-purple-800 mb-3">
                  ✨ 診断を始める前に
                </h2>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">•</span>
                    質問は全部で60問あります
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">•</span>
                    直感的に回答してください
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">•</span>
                    所要時間は約10分です
                  </li>
                </ul>
              </div>

              {user ? (
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <p className="text-green-800">
                    ログイン済み - 診断結果を保存できます
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                  <p className="text-yellow-800">
                    ログインすると、診断結果を保存できます
                  </p>
                </div>
              )}

              <QuestionForm questions={QUESTIONS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
