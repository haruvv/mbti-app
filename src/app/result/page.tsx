"use client";

import { useSearchParams } from "next/navigation";
import {
  Brain,
  Users,
  FileText,
  Share2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Star,
  Heart,
  BookOpen,
  Lightbulb,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { typeDescriptions } from "../data/mbtiTypes";
import { PageContainer } from "@/components/ui/layout/PageContainer";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const mbtiType = searchParams.get("type") || "";
  const fromTest = searchParams.get("from") === "test";
  const hasError = searchParams.get("error") === "true";
  const [description, setDescription] = useState<any>(null);

  useEffect(() => {
    if (
      mbtiType &&
      typeDescriptions[mbtiType as keyof typeof typeDescriptions]
    ) {
      setDescription(
        typeDescriptions[mbtiType as keyof typeof typeDescriptions]
      );
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

  // 対人関係の詳細情報（mbtiTypes.tsに追加する前のダミーデータ）
  const relationshipInfo = {
    communication: mbtiType.includes("E")
      ? "会話を通じて考えを整理する傾向があり、活発なディスカッションを好みます。"
      : "内省的で、発言する前に考えをまとめる傾向があります。",
    conflict: mbtiType.includes("T")
      ? "論理的アプローチで問題解決を図り、感情より事実を重視します。"
      : "人間関係の調和を重視し、皆が満足する解決策を探します。",
    teamwork: mbtiType.includes("J")
      ? "計画的で構造化されたチーム環境を好み、明確な目標と締め切りを設定します。"
      : "柔軟性を重視し、状況に応じて計画を調整することを好みます。",
  };

  // 学習スタイル情報（mbtiTypes.tsに追加する前のダミーデータ）
  const learningStyle = {
    preferred: mbtiType.includes("N")
      ? "概念的な学習を好み、パターンや関連性を見つけることに長けています。"
      : "具体的で実用的な学習を好み、実践を通じて理解を深めます。",
    environment: mbtiType.includes("I")
      ? "静かな環境で集中して学ぶことで最大の効果を発揮します。"
      : "他者との対話や議論を通じて学ぶことで理解が深まります。",
    challenges: mbtiType.includes("P")
      ? "柔軟性がある反面、締め切りや構造化された学習には苦戦することがあります。"
      : "計画的に学習できる反面、予期せぬ変更に適応するのに時間がかかることがあります。",
  };

  return (
    <PageContainer maxWidth="6xl">
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex flex-wrap items-center gap-1 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {description?.title || "タイプ不明"}
                    </h2>
                    <div className="text-sm text-gray-500">({mbtiType})</div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <div className="text-center bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {mbtiType.charAt(0)}
                      </div>
                      <div className="text-xs mt-1">
                        {mbtiType.charAt(0) === "I" ? "内向型" : "外向型"}
                      </div>
                    </div>
                    <div className="text-center bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {mbtiType.charAt(1)}
                      </div>
                      <div className="text-xs mt-1">
                        {mbtiType.charAt(1) === "N" ? "直感型" : "感覚型"}
                      </div>
                    </div>
                    <div className="text-center bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {mbtiType.charAt(2)}
                      </div>
                      <div className="text-xs mt-1">
                        {mbtiType.charAt(2) === "T" ? "思考型" : "感情型"}
                      </div>
                    </div>
                    <div className="text-center bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {mbtiType.charAt(3)}
                      </div>
                      <div className="text-xs mt-1">
                        {mbtiType.charAt(3) === "J" ? "判断型" : "知覚型"}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {description?.description || "タイプの説明が見つかりません"}
                  </p>

                  {/* 既存のコンテンツ（特徴、強み、弱みなど） */}
                  {/* ... */}
                </motion.div>
              </ContentCard>
            </div>

            <div className="space-y-6">
              {/* アドバイスカード */}
              <ContentCard delay={0.3} className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  アドバイス
                </h3>
                <p className="text-gray-700">
                  {description?.advice || "特定のアドバイスはありません"}
                </p>
              </ContentCard>

              {/* アクションボタン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
              >
                <h3 className="font-medium text-gray-800 mb-3 text-center">
                  アクション
                </h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" /> 詳細レポートを見る
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" /> 結果をシェアする
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                    <Users className="h-4 w-4 mr-2" /> 相性診断をする
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentCard>
              <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                キャリアと適性
              </h3>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  向いている職業
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {description?.careers?.map(
                    (career: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                      >
                        {career}
                      </span>
                    )
                  )}
                </div>

                <h4 className="font-medium text-gray-800 mb-2">仕事の進め方</h4>
                <p className="text-gray-700 mb-4">
                  {mbtiType.includes("J")
                    ? "計画的かつ体系的に仕事を進めることを好みます。締め切りを守り、プロジェクトを効率的に完了させることを重視します。"
                    : "柔軟に対応しながら仕事を進めることを好みます。新しい情報や変化する状況に適応しながら、創造的に問題を解決します。"}
                </p>

                <h4 className="font-medium text-gray-800 mb-2">
                  理想的な職場環境
                </h4>
                <p className="text-gray-700">
                  {mbtiType.includes("I")
                    ? "集中できる静かな環境で、自律的に働ける職場が理想的です。深い思考や専門性を活かせる場所で力を発揮します。"
                    : "人々との交流が多く、アイデアを共有できる活気ある環境が理想的です。チームワークや協力を通じて最大の成果を上げられます。"}
                </p>
              </div>
            </ContentCard>

            <ContentCard>
              <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                学習スタイル
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    好む学習方法
                  </h4>
                  <p className="text-gray-700">{learningStyle.preferred}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    理想的な学習環境
                  </h4>
                  <p className="text-gray-700">{learningStyle.environment}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    学習上の課題
                  </h4>
                  <p className="text-gray-700">{learningStyle.challenges}</p>
                </div>
              </div>
            </ContentCard>

            <ContentCard className="lg:col-span-2">
              <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                有名人とロールモデル
              </h3>

              <p className="text-gray-700 mb-4">
                以下の有名人はあなたと同じ{mbtiType}
                タイプと言われています。彼らの思考や行動パターンから、
                自分自身の特性をより深く理解するヒントを得られるかもしれません。
              </p>

              <div className="flex flex-wrap gap-3">
                {description?.famousPeople?.map(
                  (person: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                    >
                      {person}
                    </span>
                  )
                )}
              </div>
            </ContentCard>
          </div>
        </TabsContent>

        <TabsContent value="relationships">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentCard>
              <h3 className="text-xl font-bold text-rose-600 mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                対人関係の特徴
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    コミュニケーションスタイル
                  </h4>
                  <p className="text-gray-700">
                    {relationshipInfo.communication}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    対立への対処法
                  </h4>
                  <p className="text-gray-700">{relationshipInfo.conflict}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    チームワーク
                  </h4>
                  <p className="text-gray-700">{relationshipInfo.teamwork}</p>
                </div>
              </div>
            </ContentCard>

            <ContentCard>
              <h3 className="text-xl font-bold text-amber-600 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                相性の良いタイプ
              </h3>

              <p className="text-gray-700 mb-4">
                MBTIの相性理論によると、以下のタイプとは特に良い関係を築きやすいと言われています。
                ただし、あらゆる性格タイプの人と良い関係を築くことは可能です。
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* 相性の良いタイプの例（実際のデータに置き換える） */}
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="font-bold text-amber-700 mb-1">
                    {mbtiType.includes("I") ? "E" : "I"}
                    {mbtiType.includes("N") ? "S" : "N"}
                    {mbtiType.includes("T") ? "F" : "T"}
                    {mbtiType.includes("J") ? "P" : "J"}
                  </div>
                  <div className="text-sm text-gray-600">相補的な特性</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="font-bold text-amber-700 mb-1">
                    {mbtiType.includes("I") ? "I" : "E"}
                    {mbtiType.includes("N") ? "N" : "S"}
                    {mbtiType.includes("T") ? "T" : "F"}
                    {mbtiType.includes("J") ? "J" : "P"}
                  </div>
                  <div className="text-sm text-gray-600">類似した価値観</div>
                </div>
              </div>

              <p className="text-sm text-gray-500 italic">
                ※相性は個人の成熟度や価値観など、多くの要因に左右されます。
                MBTIタイプだけで人間関係の成功は判断できません。
              </p>
            </ContentCard>
          </div>
        </TabsContent>

        <TabsContent value="growth">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentCard>
              <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                成長のためのアドバイス
              </h3>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  開発すべき領域
                </h4>
                <ul className="space-y-2">
                  {/* タイプに基づいたアドバイス例（実際のデータに置き換える） */}
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <span>
                      {mbtiType.includes("I")
                        ? "時には自分の殻を破り、新しい人々や状況に自ら飛び込んでみることで視野が広がります。"
                        : "内省の時間を意識的に取り、自分自身と深く向き合う習慣をつけると、より深い洞察が得られます。"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <span>
                      {mbtiType.includes("N")
                        ? "理論や概念だけでなく、具体的な詳細や現実的な側面にも注意を払うと、よりバランスの取れた判断ができます。"
                        : "目の前の事実だけでなく、長期的な可能性や全体像を考えることで、新たな視点や機会を発見できます。"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <span>
                      {mbtiType.includes("T")
                        ? "論理的分析だけでなく、感情や価値観も意思決定に取り入れることで、より包括的な判断ができます。"
                        : "感情に配慮しつつも、時には客観的で論理的な分析を取り入れることで、より堅実な判断ができます。"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <span>
                      {mbtiType.includes("J")
                        ? "時には計画を緩め、予期せぬ状況や機会に柔軟に対応することで、新たな可能性が開けます。"
                        : "重要なタスクに対しては明確な期限と計画を設定することで、アイデアをより効果的に実現できます。"}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  ストレス管理のヒント
                </h4>
                <p className="text-gray-700 mb-3">
                  {mbtiType.includes("I")
                    ? "ストレスを感じたときは、一人の時間を確保して内省し、エネルギーを回復させましょう。"
                    : "ストレスを感じたときは、信頼できる友人と交流したり、アクティブな活動に参加したりして気分をリフレッシュしましょう。"}
                </p>
                <p className="text-gray-700">
                  {mbtiType.includes("J")
                    ? "予期せぬ変化に対処するため、柔軟性を持つことを心がけ、「完璧」への執着を手放すことも大切です。"
                    : "優先順位を明確にし、重要なタスクに集中することで、選択肢の多さに圧倒されることを防げます。"}
                </p>
              </div>
            </ContentCard>

            <ContentCard>
              <h3 className="text-xl font-bold text-indigo-600 mb-4">
                自己啓発のためのリソース
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    おすすめの書籍
                  </h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• 「自分のタイプを知り、最大限に活かす方法」</li>
                    <li>• 「{mbtiType}型のための成功戦略」</li>
                    <li>• 「心理学で解き明かす人間関係」</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    実践的なエクササイズ
                  </h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• 毎日の振り返り日記をつける</li>
                    <li>
                      •{" "}
                      {mbtiType.includes("I")
                        ? "週に一度は新しい社交的な場に参加する"
                        : "週に一度は内省の時間を確保する"}
                    </li>
                    <li>
                      •{" "}
                      {mbtiType.includes("J")
                        ? "計画を立てずに即興的な活動を試みる"
                        : "重要なタスクに対して明確な期限を設定する"}
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-800 mb-2">
                    次のステップ
                  </h4>
                  <p className="text-gray-700 mb-3">
                    自分の強みを最大限に活かし、弱みを補完するために具体的な行動計画を立てましょう。
                    小さな変化から始めて、徐々に自分自身の可能性を広げていくことが大切です。
                  </p>
                  <p className="text-indigo-600 font-medium">
                    他のMBTIタイプについても学ぶことで、周囲の人々との関係をより深く理解できるようになります。
                  </p>
                </div>
              </div>
            </ContentCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* 関連情報セクション */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          もっと自分について知りたいですか？
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/test/about">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
              MBTIについてもっと学ぶ <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/types">
            <Button variant="outline">他のタイプを探索する</Button>
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  );
}
