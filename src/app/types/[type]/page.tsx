import { typeDescriptions } from "@/app/data/mbtiTypes";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-gradient-x">
      <div className="container mx-auto max-w-4xl pt-8 pb-16">
        <div className="mb-6">
          <Link
            href="/types"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            ← タイプ一覧に戻る
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TypeCard type={mbtiType} title={typeData.title} large />

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
            <TypeDescription type={mbtiType} />
          </div>
        </div>
      </div>
    </div>
  );
}
