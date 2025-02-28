import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Cookie,
  Eye,
  UserCheck,
  Users,
  Server,
  RefreshCw,
  MessageSquare,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/layout/PageContainer";
import { ContentCard } from "@/components/ui/layout/ContentCard";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer maxWidth="3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-gray-600">
          プライバシーポリシー
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          当サービスにおける個人情報の取り扱いについて
        </p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-slate-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-indigo-700 text-sm">
            本プライバシーポリシーは、「MBTI診断アプリ」（以下、「当サービス」）が提供するサービスにおける個人情報の取り扱いについて定めたものです。
            サービスを利用することにより、本ポリシーに同意いただいたものとみなします。
          </p>
        </div>
      </div>

      <ContentCard className="prose prose-indigo max-w-none">
        <div className="space-y-8">
          <section>
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第1条（個人情報の定義）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed">
                「個人情報」とは、個人情報保護法にいう「個人情報」を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述などにより特定の個人を識別できる情報（他の情報と容易に照合することで、特定の個人を識別できることを含む）をいいます。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <UserCheck className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第2条（個人情報の収集方法）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-3">
                当サービスでは、MBTI診断テストの回答データを取得しますが、氏名や住所などの情報は収集しておりません。
              </p>
              <p className="text-gray-700 leading-relaxed">
                また、ユーザーが本サービスを利用する過程で、Cookie情報、アクセスログ、IPアドレス、ブラウザ情報、端末情報などを自動的に取得する場合があります。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Eye className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第3条（個人情報を収集・利用する目的）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                当サービスは、収集した情報を以下の目的で利用します。
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>本サービスの提供・運営のため</li>
                <li>診断結果の表示および保存のため</li>
                <li>サービスの利用状況の分析および品質向上のため</li>
                <li>本サービスの改善、新サービスの開発等に役立てるため</li>
                <li>その他上記の利用目的に付随する目的</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第4条（個人情報の第三者提供）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-3">
                当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく第三者に個人情報を提供することはありません。
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">法令に基づく場合：</span>
                  個人情報保護法その他の法令で認められる場合
                </li>
                <li>
                  <span className="font-medium">緊急時の保護：</span>
                  人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
                </li>
                <li>
                  <span className="font-medium">公衆衛生・児童育成：</span>
                  公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                </li>
                <li>
                  <span className="font-medium">公的機関への協力：</span>
                  国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行するうえで協力する必要がある場合
                </li>
              </ol>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <RefreshCw className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第5条（個人情報の開示・訂正・利用停止・削除）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed">
                当サービスでは、個人を特定できる情報を収集していないため、個別の開示・訂正・利用停止・削除の対応は行っておりません。ただし、何らかの理由でユーザーの情報に関するお問い合わせがある場合は、第9条に記載の窓口までご連絡ください。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Cookie className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第6条（Cookie等の使用について）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-3">
                当サービスは、ユーザーの利便性向上やアクセス解析のため、Cookieを使用する場合があります。ユーザーがブラウザの設定を変更することにより、Cookieの受け取りを拒否することも可能です。ただし、その場合は本サービスの一部機能が利用できなくなる場合があります。
              </p>
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-medium">
                    Googleアナリティクスの利用：
                  </span>
                  当サービスは、アクセス解析ツールとしてGoogleアナリティクスを利用する場合があります。Googleアナリティクスはデータ収集のためにCookieを使用しており、収集されるデータはGoogle社のプライバシーポリシーに基づいて管理されています。詳細はGoogleのプライバシーポリシーをご確認ください。
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <Server className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第7条（セキュリティ対策）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed">
                当サービスは、取得した情報を正確かつ最新の内容に保ち、不正アクセス、紛失、改ざん、漏えい等を防止するためにセキュリティシステムの維持や管理体制の整備など必要な措置を講じます。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <RefreshCw className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第8条（プライバシーポリシーの変更）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                当サービスは、法令または本ポリシーに特別の定めがある場合を除き、ユーザーへ通知することなく、本ポリシーを変更することができます。
              </p>
              <p className="text-gray-700 leading-relaxed">
                当サービスが別途定める場合を除き、変更後のプライバシーポリシーは、当サービスのウェブサイト上に掲載したときから効力を生じるものとします。
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 m-0">
                第9条（お問い合わせ窓口）
              </h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 leading-relaxed mb-2">
                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
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
