import { notFound } from "next/navigation";
import { getTestResultById } from "@/app/_actions/test";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { TypeDescription } from "@/components/features/mbti/TypeDescription";
import { FormattedDate } from "@/components/ui/FormattedDate";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export default async function TestHistoryDetailPage({
  params,
}: {
  params: { uuid: string };
}) {
  const { uuid } = params;

  // 特定のテスト結果を取得
  const { data: testResult, error } = await getTestResultById(uuid);

  if (error || !testResult) {
    notFound();
  }

  const mbtiType = testResult.mbti_type;
  const typeData = typeDescriptions[mbtiType];

  if (!typeData) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center text-teal-700 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>診断履歴へ戻る</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          診断結果: {mbtiType}
        </h1>

        <div className="flex items-center justify-center mb-8 text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <FormattedDate date={testResult.created_at} /> に診断
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TypeCard type={mbtiType} title={typeData.title} large />

            <div className="mt-6 space-y-4">
              <Link
                href="/test"
                className="block text-center py-2 px-4 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                もう一度診断する
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <TypeDescription
              type={mbtiType}
              typeData={typeData}
              mbtiType={mbtiType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
