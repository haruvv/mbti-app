import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Shield,
  AlertTriangle,
  XCircle,
  Scale,
  Pencil,
  Layers,
  Gavel,
  MessageSquare,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/layout/PageContainer";
import { ContentCard } from "@/components/ui/layout/ContentCard";

export default function TermsPage() {
  return (
    <PageContainer maxWidth="3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-gray-600">
          利用規約
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          当サービスをご利用いただく際の規約について
        </p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-slate-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-indigo-700 text-sm">
            本利用規約は、「MBTI診断アプリ」が提供するサービスのご利用条件を定めたものです。
            サービスをご利用いただくことで、本規約に同意いただいたものとみなします。
          </p>
        </div>
      </div>

      <ContentCard className="prose prose-indigo max-w-none">
        <div className="space-y-8">
          <section>
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-slate-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第1条（適用）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                本規約は、ユーザーと「MBTI診断アプリ」運営チーム（以下、「運営者」といいます。）との間で締結される本サービスの利用に関する一切の関係について適用されます。
              </p>
              <p className="text-gray-700 leading-relaxed">
                運営者は、本サービスに関し、本規約のほか、ガイドラインや注意書き等を定めることがあります。これらは本規約の一部を構成するものとします。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第2条（利用条件）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed">
                本サービスは、インターネットに接続可能な環境を持つユーザーが無料で利用できます。ただし、通信料等の費用はユーザー負担となります。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第3条（診断結果について）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                本サービスで提供するMBTI診断は、あくまで参考情報であり、診断結果の正確性や特定の目的への適合性を保証するものではありません。
              </p>
              <p className="text-gray-700 leading-relaxed">
                ユーザーは診断結果を自己の責任において利用するものとし、診断結果に起因して生じた損害について、運営者は一切の責任を負いません。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第4条（禁止事項）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>法令または公序良俗に違反する行為</li>
                <li>運営者のサーバーに過度の負荷をかける行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>
                  本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為
                </li>
                <li>他のユーザーや第三者を誹謗中傷する行為</li>
                <li>診断結果を改ざんし、虚偽の結果として公表・共有する行為</li>
                <li>
                  本サービスを商用目的で無断利用する行為（営利目的での診断実施等）
                </li>
                <li>その他、運営者が不適切と判断する行為</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <XCircle className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第5条（サービスの一時停止・変更・終了）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                運営者は、以下の場合に、事前の通知なく本サービスの全部または一部の提供を停止、変更、または終了することができます。
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>本サービスの保守点検または更新を行う場合</li>
                <li>
                  地震、落雷、火災、停電、天災などの不可抗力により、本サービスの提供が困難となった場合
                </li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、運営者が必要と判断した場合</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                運営者は、本サービスの提供の停止、変更、終了によりユーザーに生じた損害について、一切の責任を負いません。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Scale className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第6条（保証の否認および免責事項）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                運営者は、本サービスの内容（診断結果を含む）について、正確性、完全性、特定目的への適合性などを明示的にも黙示的にも保証しておりません。
              </p>
              <p className="text-gray-700 leading-relaxed">
                本サービスに起因してユーザーに生じたあらゆる損害について、法令で定める場合を除き、運営者は一切の責任を負いません。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Layers className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第7条（知的財産権）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed">
                本サービスに関する著作権、特許権、商標権、その他一切の知的財産権は、運営者または正当な権利者に帰属します。ユーザーは、本サービスのコンテンツを無断で複製、転用、販売等の二次利用をしてはなりません。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Pencil className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第8条（利用規約の変更）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                運営者は、必要と判断した場合には、ユーザーへの通知なしに本規約を変更することができます。
              </p>
              <p className="text-gray-700 leading-relaxed">
                変更後の規約は、本サービス上に掲載した時点で効力を生じるものとし、ユーザーが本サービスを利用する場合は、変更後の規約に同意したものとみなします。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Gavel className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第9条（準拠法・裁判管轄）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                本規約の解釈にあたっては、日本法を準拠法とします。
              </p>
              <p className="text-gray-700 leading-relaxed">
                本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第10条（お問い合わせ窓口）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                本規約に関するお問い合わせは、下記の窓口までお願いいたします。
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="mb-0">
                  <span className="font-medium">運営者名:</span>{" "}
                  MBTI診断アプリ運営チーム
                  <br />
                  <span className="font-medium">Eメールアドレス:</span>{" "}
                  mbtiapp3@gmail.com
                </p>
              </div>
            </div>
          </section>
        </div>
      </ContentCard>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> ホームに戻る
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
