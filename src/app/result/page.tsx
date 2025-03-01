"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Brain, Share2, Lightbulb, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { PageContainer } from "@/components/ui/layout/PageContainer";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { mbtiColors } from "@/app/data/mbtiColors";
import { getTypeDescription, getCareerOptions } from "@/app/_utils/mbtiResult";
import { MbtiTypeDisplay } from "@/components/features/mbti/MbtiTypeDisplay";
import { RelationshipInfo } from "@/components/features/mbti/RelationshipInfo";
import { LearningStyle } from "@/components/features/mbti/LearningStyle";
import { StrengthsWeaknesses } from "@/components/features/mbti/StrengthsWeaknesses";
import { RelatedContent } from "@/components/features/mbti/RelatedContent";
import { CompatibilityInfo } from "@/components/features/mbti/CompatibilityInfo";
import { SaveResult } from "@/app/result/SaveResult";
import { MBTITypeKey, TypeDescription } from "@/types/mbti";

// useSearchParamsを使用するコンポーネントを分離
function ResultContent() {
  const searchParams = useSearchParams();
  const mbtiType = searchParams.get("type") || "";
  const hasError = searchParams.get("error") === "true";
  const [description, setDescription] = useState<TypeDescription | null>(null);

  useEffect(() => {
    const typeDesc = getTypeDescription(mbtiType);
    if (typeDesc) {
      setDescription(typeDesc);
    }
  }, [mbtiType]);

  if (!mbtiType) {
    return (
      <PageContainer>
        <div className="text-center pt-8">
          <h1 className="text-3xl font-bold mb-4">
            タイプ情報が見つかりません
          </h1>
          <p className="mb-8">診断を最初からやり直してください。</p>
          <Link href="/test">
            <Button>診断ページへ戻る</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  // MBTIタイプが有効か確認
  const isValidType = mbtiType in typeDescriptions;
  if (!isValidType) {
    return (
      <PageContainer>
        <div className="text-center pt-8">
          <h1 className="text-3xl font-bold mb-4">無効なMBTIタイプです</h1>
          <p className="mb-8">診断を最初からやり直してください。</p>
          <Link href="/test">
            <Button>診断ページへ戻る</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const validMbtiType = mbtiType as MBTITypeKey;
  const careerOptions = getCareerOptions(validMbtiType);
  const typeColor = mbtiColors[validMbtiType];

  return (
    <PageContainer maxWidth="6xl">
      {isValidType && <SaveResult mbtiType={validMbtiType} />}

      <PageHeader
        title={`あなたは${mbtiType}型です`}
        subtitle={
          hasError
            ? "診断中に問題が発生しましたが、一般的なタイプを表示しています。"
            : description?.title
              ? `「${description.title}」タイプの特徴`
              : "あなたのMBTIタイプ結果"
        }
        icon={Brain}
      />

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="w-full max-w-2xl mx-auto bg-white/50 p-1">
          <TabsTrigger value="overview" className="flex-1">
            概要
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1">
            詳細分析
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex-1">
            対人関係
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex-1">
            成長と発展
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ContentCard>
                {description && (
                  <MbtiTypeDisplay
                    type={validMbtiType}
                    title={description.title}
                    description={description.description}
                  />
                )}
              </ContentCard>

              <StrengthsWeaknesses type={validMbtiType} />
            </div>

            <div className="space-y-6">
              <ContentCard
                className={`p-5 ${typeColor.bg} border-l-4 ${typeColor.border}`}
              >
                <h3 className={`text-lg font-bold mb-3 ${typeColor.text}`}>
                  このタイプの主な特徴
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className={`${typeColor.text} mr-2`}>•</span>
                    <span>
                      {mbtiType.includes("E")
                        ? "外向的で社交的"
                        : "内向的で静かな時間を好む"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className={`${typeColor.text} mr-2`}>•</span>
                    <span>
                      {mbtiType.includes("S")
                        ? "具体的で実用的な情報を重視する"
                        : "抽象的なアイデアや可能性を重視する"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className={`${typeColor.text} mr-2`}>•</span>
                    <span>
                      {mbtiType.includes("T")
                        ? "論理と客観性に基づいて判断する"
                        : "感情と人間関係を考慮して判断する"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className={`${typeColor.text} mr-2`}>•</span>
                    <span>
                      {mbtiType.includes("J")
                        ? "計画的で体系的に行動する"
                        : "柔軟で適応性のある行動を好む"}
                    </span>
                  </li>
                </ul>
              </ContentCard>

              <ContentCard>
                <h3 className="text-lg font-bold mb-3">関連するキャリア</h3>
                <div className="flex flex-wrap gap-2">
                  {careerOptions.map((career: string, index: number) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </ContentCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StrengthsWeaknesses type={validMbtiType} />
            <LearningStyle type={validMbtiType} />
          </div>
        </TabsContent>

        <TabsContent value="relationships">
          <div className="space-y-6">
            <RelationshipInfo type={validMbtiType} />
            <CompatibilityInfo type={validMbtiType} />
          </div>
        </TabsContent>

        <TabsContent value="growth">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentCard>
              <h3 className="text-xl font-semibold mb-4 flex items-center text-teal-800">
                <Lightbulb className="mr-2 h-5 w-5" />
                成長のためのアドバイス
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {mbtiType.includes("I")
                    ? "時には自分の考えを積極的に表現し、新しい社交的な機会に挑戦してみましょう。"
                    : "一人で静かに内省する時間を作り、深く考える機会を大切にしましょう。"}
                </p>
                <p className="text-gray-600">
                  {mbtiType.includes("S")
                    ? "時には大局的な視点で物事を見て、将来の可能性について考えてみましょう。"
                    : "理論だけでなく、具体的な事実やデータにも注目し、現実的な視点を取り入れましょう。"}
                </p>
                <p className="text-gray-600">
                  {mbtiType.includes("T")
                    ? "判断する際に、人々の感情や価値観も考慮することで、より包括的な決断ができます。"
                    : "時には感情を脇に置き、論理的に分析することで、より客観的な視点を得られます。"}
                </p>
                <p className="text-gray-600">
                  {mbtiType.includes("J")
                    ? "時には計画を緩め、予期せぬ機会や変化を受け入れる柔軟性を持ちましょう。"
                    : "重要なプロジェクトには期限や目標を設定し、より構造化されたアプローチを試みましょう。"}
                </p>
              </div>
            </ContentCard>

            <ContentCard>
              <h3 className="text-xl font-semibold mb-4 flex items-center text-teal-800">
                <Award className="mr-2 h-5 w-5" />
                潜在的な才能
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  あなたのMBTIタイプは特定の才能や強みと関連していることがあります。
                  これらを認識し、活用することで、個人的および職業的な成長を促進できます。
                </p>
                <div className="bg-white/50 p-4 rounded-lg border border-teal-100">
                  <div className="font-semibold mb-2 text-teal-700">
                    注目すべき才能
                  </div>
                  <ul className="space-y-2">
                    {mbtiType.includes("I") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>深い集中力と思考力</span>
                      </li>
                    )}
                    {mbtiType.includes("E") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>人を惹きつけるコミュニケーション能力</span>
                      </li>
                    )}
                    {mbtiType.includes("N") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>創造的で革新的な思考</span>
                      </li>
                    )}
                    {mbtiType.includes("S") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>実用的で信頼性の高い問題解決</span>
                      </li>
                    )}
                    {mbtiType.includes("T") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>論理的分析と客観的判断</span>
                      </li>
                    )}
                    {mbtiType.includes("F") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>共感力と人間関係の構築</span>
                      </li>
                    )}
                    {mbtiType.includes("J") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>計画立案と組織化の能力</span>
                      </li>
                    )}
                    {mbtiType.includes("P") && (
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span>適応力と柔軟性</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </ContentCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* 関連情報セクション */}
      <RelatedContent />

      <div className="mt-8 text-center">
        <Button className="bg-teal-700 hover:bg-teal-800 text-white">
          <Share2 className="h-4 w-4 mr-2" />
          結果をシェアする
        </Button>
      </div>
    </PageContainer>
  );
}

// ページコンポーネント
export default function ResultPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}
