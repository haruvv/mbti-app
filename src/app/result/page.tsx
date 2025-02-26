import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MBTITypeKey, typeDescriptions } from "../data/mbtiTypes";
import Link from "next/link";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { TypeDescription } from "@/components/features/mbti/TypeDescription";
import { SaveResult } from "./SaveResult";
import { RefreshCw, User } from "lucide-react";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; from?: string }>;
}) {
  const user = await currentUser();
  const params = await searchParams;
  const mbtiType = params.type as MBTITypeKey;

  // MBTIタイプのバリデーション
  if (!mbtiType || !/^[EI][NS][TF][JP]$/.test(mbtiType)) {
    redirect("/test");
  }

  const typeData = typeDescriptions[mbtiType];
  if (!typeData) {
    redirect("/test");
  }

  // 新規の診断結果の場合のみ保存を試みる
  const isNewResult = params.from === "test";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-gradient-x">
      {/* ユーザーが認証済みで新規結果の場合、自動保存コンポーネントを表示 */}
      {user && isNewResult && <SaveResult mbtiType={mbtiType} />}

      <div className="container mx-auto max-w-4xl pt-8 pb-16">
        {/* 結果ヘッダー */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 text-gray-800">
            あなたの診断結果
          </h1>
          <div className="inline-block bg-white rounded-full px-6 py-2 shadow-md">
            <p className="text-gray-600 text-lg">
              あなたのMBTIタイプは
              <span className="font-bold text-indigo-600 text-2xl mx-1">
                {mbtiType}
              </span>
              です
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 左カラム - タイプカードと操作ボタン */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
              <TypeCard type={mbtiType} title={typeData.title} large />

              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="/test"
                  className="flex items-center justify-center py-3 px-5 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-medium"
                >
                  <RefreshCw size={18} className="mr-2" />
                  もう一度診断する
                </Link>

                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center justify-center py-3 px-5 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    <User size={18} className="mr-2" />
                    プロフィールに戻る
                  </Link>
                ) : (
                  <Link
                    href="/sign-up"
                    className="flex items-center justify-center py-3 px-5 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                  >
                    アカウント登録して結果を保存
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 右カラム - タイプ説明 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 transition-all">
              <TypeDescription type={mbtiType} />

              {/* 適職セクション - typeData.careersが存在する場合のみ表示 */}
              {typeData.careers && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">
                    このタイプの適職
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {typeData.careers.map((career, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                        {career}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 有名人セクション - typeData.famousPeopleが存在する場合のみ表示 */}
              {typeData.famousPeople && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">
                    同じタイプの有名人
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {typeData.famousPeople.map((person, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-lg px-4 py-2 text-sm"
                      >
                        {person}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
