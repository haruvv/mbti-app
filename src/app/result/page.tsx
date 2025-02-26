import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MBTITypeKey, typeDescriptions } from "../data/mbtiTypes";
import { saveTestResult } from "../_actions/test";
import Link from "next/link";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { TypeDescription } from "@/components/features/mbti/TypeDescription";

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
      <div className="container mx-auto max-w-4xl pt-8 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">あなたの診断結果</h1>
          <p className="text-gray-600">
            あなたのMBTIタイプは<span className="font-bold">{mbtiType}</span>
            です
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TypeCard type={mbtiType} title={typeData.title} large />

            {user && isNewResult && (
              <form action={saveTestResult}>
                <input type="hidden" name="mbtiType" value={mbtiType} />
                <button
                  type="submit"
                  className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  結果を保存する
                </button>
              </form>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/test"
                className="text-center py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                もう一度診断する
              </Link>

              {user ? (
                <Link
                  href="/profile"
                  className="text-center py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  プロフィールに戻る
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className="text-center py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  アカウント登録して結果を保存
                </Link>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <TypeDescription type={mbtiType} />
          </div>
        </div>
      </div>
    </div>
  );
}
