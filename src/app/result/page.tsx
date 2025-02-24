import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { typeDescriptions, type MBTITypeKey } from "../data/mbtiTypes";
import { SaveResult } from "./SaveResult";
import { getTestResults } from "../_actions/test";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { type?: string; from?: string };
}) {
  const user = await currentUser();
  const mbtiType = searchParams.type as MBTITypeKey;

  // MBTIタイプのバリデーション
  if (!mbtiType || !/^[EI][NS][TF][JP]$/.test(mbtiType)) {
    redirect("/test");
  }

  const type = typeDescriptions[mbtiType];
  if (!type) {
    redirect("/test");
  }

  // 新規の診断結果の場合のみ保存を試みる
  const isNewResult = searchParams.from === "test";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-gradient-x">
      <div className="container mx-auto max-w-5xl pt-8">
        <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden">
          {/* ヘッダーセクション */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
            {/* デコレーション要素 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.1),transparent_50%)]" />

            {/* コンテンツ */}
            <div className="relative z-10 px-12 pt-16 pb-20">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm mb-8 border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>診断結果</span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-8xl font-bold text-white font-mono tracking-wider">
                      {mbtiType}
                    </h1>
                    <h2 className="text-4xl font-bold text-white/90">
                      {type.title}
                    </h2>
                  </div>
                  <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
                    {type.description}
                  </p>
                </div>
                {user && isNewResult && (
                  <div className="mt-8">
                    <SaveResult mbtiType={mbtiType} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-12 py-16 space-y-20">
            {/* 特徴セクション */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  パーソナリティの特徴
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {type.traits.map((trait, i) => (
                  <div
                    key={i}
                    className="group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-indigo-50"
                  >
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-gray-700 text-lg">{trait}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* アドバイスセクション */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  成長のためのアドバイス
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl transform -rotate-1" />
                <div className="relative bg-white rounded-2xl p-10 shadow-sm border border-indigo-100">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {type.advice}
                  </p>
                </div>
              </div>
            </section>

            {/* ナビゲーションボタン */}
            <div className="flex justify-center gap-6 pt-8">
              <a
                href="/test"
                className="group relative min-w-[200px] text-center px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] duration-300"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">再診断を行う</span>
              </a>
              <a
                href="/profile"
                className="group relative min-w-[200px] text-center px-8 py-4 rounded-xl bg-white text-indigo-600 font-medium transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] duration-300 border border-indigo-100"
              >
                <div className="absolute inset-0 bg-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">プロフィールへ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
