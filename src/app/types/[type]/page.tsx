import { typeDescriptions } from "@/app/data/mbtiTypes";
import { MBTITypeKey } from "@/types/mbti";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { TypeDescription } from "@/components/features/mbti/TypeDescription";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const mbtiType = type.toUpperCase();

  // 有効なMBTIタイプかチェック
  if (!typeDescriptions[mbtiType]) {
    notFound();
  }

  const typeData = typeDescriptions[mbtiType];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          MBTIタイプ詳細: {mbtiType}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TypeCard
              type={mbtiType as MBTITypeKey}
              title={typeData.title}
              large
            />

            <div className="mt-6 space-y-4">
              <Link
                href="/test"
                className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                自分のタイプを診断する
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <TypeDescription
              type={mbtiType as MBTITypeKey}
              typeData={typeData}
              mbtiType={mbtiType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
