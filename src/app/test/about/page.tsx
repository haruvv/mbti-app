"use client";

import Link from "next/link";
import {
  Brain,
  Users,
  BookOpen,
  History,
  BarChart,
  Lightbulb,
  Heart,
  Zap,
  ArrowRight,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/layout/PageContainer";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function TestAboutPage() {
  return (
    <PageContainer maxWidth="4xl">
      <PageHeader
        title="MBTIタイプ診断について"
        subtitle="MBTIは自己理解と他者理解を深めるための優れたツールです"
        icon={Brain}
      />

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="w-full max-w-2xl mx-auto bg-white/50 p-1">
          <TabsTrigger value="overview" className="flex-1">
            概要
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            歴史と背景
          </TabsTrigger>
          <TabsTrigger value="types" className="flex-1">
            16タイプ
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex-1">
            活用法
          </TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCard>
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                MBTIとは
              </h2>
              <p className="text-gray-700 mb-4">
                MBTIは「マイヤーズ・ブリッグス・タイプ指標」の略で、カール・ユングの心理学理論に基づいて開発された性格タイプ分類法です。
                この診断では、あなたの思考と行動パターンを分析し、16のタイプのうちどれに最も近いかを判定します。
              </p>

              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-lg mb-2">診断の内容</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>質問数：全60問</li>
                  <li>所要時間：約10分</li>
                  <li>回答方法：5つの選択肢からより自分に近い方を選びます</li>
                </ul>
              </div>

              <p className="text-gray-700">
                MBTIは職場、学校、カウンセリング、自己啓発など、様々な場面で活用されています。
                自分自身を知ることで、より良い人間関係や進路選択、自己成長につなげることができます。
              </p>
            </ContentCard>

            <ContentCard>
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-500" />
                MBTIの4つの軸
              </h2>

              <ul className="space-y-3">
                <li className="p-3 bg-blue-50 rounded flex items-start">
                  <div className="w-8 h-8 mr-3 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold">
                    E/I
                  </div>
                  <div>
                    <span className="font-medium">外向型(E) vs. 内向型(I)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      エネルギーを外部の人や活動から得るか、内側の考えや感情から得るか
                    </p>
                  </div>
                </li>

                <li className="p-3 bg-green-50 rounded flex items-start">
                  <div className="w-8 h-8 mr-3 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 font-bold">
                    S/N
                  </div>
                  <div>
                    <span className="font-medium">感覚型(S) vs. 直感型(N)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      情報を具体的な事実として捉えるか、パターンや可能性として捉えるか
                    </p>
                  </div>
                </li>

                <li className="p-3 bg-purple-50 rounded flex items-start">
                  <div className="w-8 h-8 mr-3 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center text-purple-600 font-bold">
                    T/F
                  </div>
                  <div>
                    <span className="font-medium">思考型(T) vs. 感情型(F)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      論理と客観的な基準で決断するか、価値観と人間関係を重視して決断するか
                    </p>
                  </div>
                </li>

                <li className="p-3 bg-orange-50 rounded flex items-start">
                  <div className="w-8 h-8 mr-3 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-600 font-bold">
                    J/P
                  </div>
                  <div>
                    <span className="font-medium">判断型(J) vs. 知覚型(P)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      計画的で秩序立った生活を好むか、柔軟でオープンな生活を好むか
                    </p>
                  </div>
                </li>
              </ul>
            </ContentCard>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <ContentCard>
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                MBTIを理解する利点
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-indigo-700 mb-2">
                    自己理解を深める
                  </h3>
                  <p className="text-gray-700 text-sm">
                    自分の強みや弱み、意思決定のパターン、エネルギーの得方などを理解することで、
                    自分自身をより深く知ることができます。
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-700 mb-2">
                    人間関係の改善
                  </h3>
                  <p className="text-gray-700 text-sm">
                    他者のタイプを理解することで、コミュニケーションの齟齬を減らし、
                    より良い関係を構築するための洞察を得られます。
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">
                    キャリア選択のガイド
                  </h3>
                  <p className="text-gray-700 text-sm">
                    自分のパーソナリティタイプに合った職業や働き方を見つけることで、
                    より充実したキャリアを構築できます。
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-700 mb-2">
                    個人的成長
                  </h3>
                  <p className="text-gray-700 text-sm">
                    自分の不得意な領域や盲点を認識し、それらを意識的に発展させることで、
                    より全体的な成長を目指せます。
                  </p>
                </div>
              </div>
            </ContentCard>
          </motion.div>
        </TabsContent>

        {/* 歴史と背景タブ */}
        <TabsContent value="history">
          <ContentCard>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <History className="h-5 w-5 mr-2 text-orange-600" />
              MBTIの歴史と発展
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">起源と開発</h3>
                <p className="text-gray-700">
                  MBTIは、カール・グスタフ・ユングの心理学的タイプ理論（1921年）に基づいています。
                  キャサリン・クック・ブリッグスと彼女の娘イザベル・ブリッグス・マイヤーズが、
                  ユングの理論を実用的な診断ツールに発展させました。
                  第二次世界大戦中、マイヤーズは人々が自分の強みを活かせる仕事を見つける助けとなるよう、
                  最初のMBTI質問票を開発しました。
                </p>
              </div>

              <div className="pl-4 border-l-4 border-indigo-100">
                <p className="italic text-gray-600">
                  「人は偶然に違いがあるのではなく、人々が情報を収集し処理する好みの方法に
                  基本的な違いがあるのです。」
                  <span className="block mt-1 text-right">
                    ― イザベル・ブリッグス・マイヤーズ
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">現代の適用</h3>
                <p className="text-gray-700">
                  1975年に設立されたマイヤーズ・ブリッグス財団がMBTIの開発と研究を継続しています。
                  現在、MBTIは世界中の企業、教育機関、カウンセリング現場で広く使用されており、
                  多くの言語に翻訳され、文化的な適応も行われています。
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2">研究と批評</h3>
                <p className="text-gray-700">
                  MBTIは広く使用されていますが、学術心理学の中では批判も存在します。
                  主な批判点は信頼性（結果の一貫性）や妥当性（測定の正確さ）に関するものです。
                  MBTIはあくまで自己理解のためのツールとして捉え、科学的な診断ツールというより
                  自己探求の出発点として活用するのが良いでしょう。
                </p>
              </div>
            </div>
          </ContentCard>
        </TabsContent>

        {/* 16タイプタブ */}
        <TabsContent value="types">
          <ContentCard>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              16のパーソナリティタイプ
            </h2>

            <p className="text-gray-700 mb-6">
              MBTIでは4つの軸の組み合わせにより、16の異なるパーソナリティタイプが定義されています。
              各タイプには独自の特性、強み、成長の機会があります。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 分析家グループ */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2 text-center">
                  分析家タイプ
                </h3>
                <ul className="space-y-2">
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/INTJ"
                      className="block hover:text-blue-600"
                    >
                      <span className="font-bold">INTJ</span>
                      <span className="block text-xs text-gray-600">
                        建築家
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/INTP"
                      className="block hover:text-blue-600"
                    >
                      <span className="font-bold">INTP</span>
                      <span className="block text-xs text-gray-600">
                        論理学者
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ENTJ"
                      className="block hover:text-blue-600"
                    >
                      <span className="font-bold">ENTJ</span>
                      <span className="block text-xs text-gray-600">
                        指揮官
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ENTP"
                      className="block hover:text-blue-600"
                    >
                      <span className="font-bold">ENTP</span>
                      <span className="block text-xs text-gray-600">
                        討論者
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 外交官グループ */}
              <div className="bg-green-50 p-3 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2 text-center">
                  外交官タイプ
                </h3>
                <ul className="space-y-2">
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/INFJ"
                      className="block hover:text-green-600"
                    >
                      <span className="font-bold">INFJ</span>
                      <span className="block text-xs text-gray-600">
                        提唱者
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/INFP"
                      className="block hover:text-green-600"
                    >
                      <span className="font-bold">INFP</span>
                      <span className="block text-xs text-gray-600">
                        仲介者
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ENFJ"
                      className="block hover:text-green-600"
                    >
                      <span className="font-bold">ENFJ</span>
                      <span className="block text-xs text-gray-600">
                        主人公
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ENFP"
                      className="block hover:text-green-600"
                    >
                      <span className="font-bold">ENFP</span>
                      <span className="block text-xs text-gray-600">
                        冒険家
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 管理者グループ */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2 text-center">
                  管理者タイプ
                </h3>
                <ul className="space-y-2">
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ISTJ"
                      className="block hover:text-purple-600"
                    >
                      <span className="font-bold">ISTJ</span>
                      <span className="block text-xs text-gray-600">
                        管理者
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ISFJ"
                      className="block hover:text-purple-600"
                    >
                      <span className="font-bold">ISFJ</span>
                      <span className="block text-xs text-gray-600">
                        擁護者
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ESTJ"
                      className="block hover:text-purple-600"
                    >
                      <span className="font-bold">ESTJ</span>
                      <span className="block text-xs text-gray-600">幹部</span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ESFJ"
                      className="block hover:text-purple-600"
                    >
                      <span className="font-bold">ESFJ</span>
                      <span className="block text-xs text-gray-600">
                        領事官
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 探検家グループ */}
              <div className="bg-orange-50 p-3 rounded-lg">
                <h3 className="font-medium text-orange-800 mb-2 text-center">
                  探検家タイプ
                </h3>
                <ul className="space-y-2">
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ISTP"
                      className="block hover:text-orange-600"
                    >
                      <span className="font-bold">ISTP</span>
                      <span className="block text-xs text-gray-600">巨匠</span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ISFP"
                      className="block hover:text-orange-600"
                    >
                      <span className="font-bold">ISFP</span>
                      <span className="block text-xs text-gray-600">
                        冒険家
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ESTP"
                      className="block hover:text-orange-600"
                    >
                      <span className="font-bold">ESTP</span>
                      <span className="block text-xs text-gray-600">
                        起業家
                      </span>
                    </Link>
                  </li>
                  <li className="bg-white p-2 rounded text-center">
                    <Link
                      href="/types/ESFP"
                      className="block hover:text-orange-600"
                    >
                      <span className="font-bold">ESFP</span>
                      <span className="block text-xs text-gray-600">
                        エンターテイナー
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </ContentCard>
        </TabsContent>

        {/* 活用法タブ */}
        <TabsContent value="applications">
          <ContentCard>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-purple-600" />
              MBTIの活用方法
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  <Heart className="h-4 w-4 mr-2 text-pink-500" />
                  人間関係での活用
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6 space-y-3">
                    <p className="text-gray-700">
                      MBTIは、異なるコミュニケーションスタイルや価値観を理解するのに役立ちます。
                      例えば、思考型（T）の人はより論理的な会話を好み、感情型（F）の人は
                      感情的な共感を重視する傾向があります。
                    </p>

                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h4 className="font-medium text-pink-700 mb-1">
                        実践方法
                      </h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          相手のMBTIタイプを理解し、そのタイプが好むコミュニケーション方法で話す
                        </li>
                        <li>
                          対立が生じた場合、タイプの違いから生じている可能性を考慮する
                        </li>
                        <li>
                          自分とは異なるタイプの視点や強みを尊重する姿勢を持つ
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                  キャリア開発と職場での活用
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6 space-y-3">
                    <p className="text-gray-700">
                      自分のMBTIタイプに適した職業や働き方を知ることで、より満足度の高いキャリア選択ができます。
                      また、チーム内の多様なタイプの強みを活かすことで、プロジェクトの成功率を高められます。
                    </p>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-1">
                        実践方法
                      </h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          自分のタイプが持つ強みを活かせる役割や業務を積極的に担当する
                        </li>
                        <li>
                          チーム内の多様なタイプの強みを認識し、適材適所の配置を考える
                        </li>
                        <li>
                          苦手な領域は、その領域が得意なタイプのメンバーとコラボレーションする
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                  自己成長と自己理解
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6 space-y-3">
                    <p className="text-gray-700">
                      MBTIは自分の思考パターン、意思決定方法、エネルギーの得方などを理解するのに役立ちます。
                      これにより、自分の強みを最大限に活かし、弱みを補完する方法を見つけることができます。
                    </p>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-medium text-yellow-700 mb-1">
                        実践方法
                      </h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                          自分のタイプが持つ「影の部分」（あまり発達していない機能）を意識的に発展させる
                        </li>
                        <li>
                          ストレス下での自分の反応パターンを理解し、より健全な対処法を開発する
                        </li>
                        <li>
                          自分のタイプの成長の道筋を意識し、段階的な自己成長を目指す
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ContentCard>

          <div className="mt-6">
            <ContentCard>
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                さらに学ぶためのリソース
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-indigo-800 mb-2">
                    おすすめの書籍
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-indigo-500" />
                      <span>
                        「タイプで分かる心理学」イザベル・ブリッグス・マイヤーズ著
                      </span>
                    </li>
                    <li className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-indigo-500" />
                      <span>「MBTIへの招待」桜井陽子著</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">
                    オンラインリソース
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-purple-500" />
                      <a
                        href="https://www.myersbriggs.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:underline"
                      >
                        Myers & Briggs Foundation (英語)
                      </a>
                    </li>
                    <li className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-purple-500" />
                      <a
                        href="https://www.16personalities.com/ja"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:underline"
                      >
                        16Personalities (日本語)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </ContentCard>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          あなたのMBTIタイプを見つけよう
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          無料の診断テストを通じて、あなたのパーソナリティタイプを発見し、
          自己理解を深めてみませんか？
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/test">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-6 text-lg">
              診断テストを開始する <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/types">
            <Button variant="outline" size="lg">
              16タイプ一覧を見る
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
