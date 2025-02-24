import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { typeDescriptions, type MBTITypeKey } from "../data/mbtiTypes";
import { SaveResult } from "./SaveResult";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await currentUser();
  const params = await searchParams;
  const mbtiType = params.type as MBTITypeKey;

  // MBTIタイプのバリデーション
  if (!mbtiType || !/^[EI][NS][TF][JP]$/.test(mbtiType)) {
    redirect("/test");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {user && <SaveResult mbtiType={mbtiType} />}
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              あなたは
              {
                typeDescriptions[mbtiType as keyof typeof typeDescriptions]
                  .title
              }
            </h1>
            <div className="flex gap-3 mt-4">
              {mbtiType.split("").map((letter, index) => (
                <div
                  key={index}
                  className="bg-white/20 rounded-lg px-4 py-2 font-bold"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {
                typeDescriptions[mbtiType as keyof typeof typeDescriptions]
                  .description
              }
            </p>

            {!user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  ログインすると、診断結果を保存できます。
                </p>
              </div>
            )}

            <div className="mt-8">
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                もう一度診断する
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
