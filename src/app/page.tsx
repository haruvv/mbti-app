import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Brain, Users, Activity, LineChart } from "lucide-react";
import { typeDescriptions } from "./data/mbtiTypes";
import { TypeCard } from "@/components/features/mbti/TypeCard";

export default async function Home() {
  const supabase = createClient();

  // 最新の登録ユーザー数を取得
  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // 最新の診断テスト数を取得
  const { count: testCount } = await supabase
    .from("test_results")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                あなたのパーソナリティを
                <br />
                発見しよう
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                MBTIテストで自分自身をより深く理解し、他の人々とつながりましょう。
                無料診断テストで始めるだけで、あなたの強みと成長の可能性が見えてきます。
              </p>
              <div className="flex flex-wrap gap-4">
                <SignedIn>
                  <Link href="/test">
                    <Button size="lg" className="rounded-full px-8">
                      診断テストを受ける <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-up">
                    <Button size="lg" className="rounded-full px-8">
                      今すぐ登録する <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/test/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8"
                    >
                      診断テストについて
                    </Button>
                  </Link>
                </SignedOut>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="relative h-[400px] w-full">
                  <Image
                    src="/images/hero-image.png"
                    alt="MBTIの16タイプ"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex gap-4 items-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {userCount || 0}+
                      </p>
                      <p className="text-sm text-gray-600">ユーザー</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {testCount || 0}+
                      </p>
                      <p className="text-sm text-gray-600">診断数</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            MBTIを知ると何が変わる？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-blue-500" />}
              title="自己理解の深化"
              description="あなたの思考パターン、行動傾向、価値観を理解し、自分自身をより深く知ることができます。"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="人間関係の向上"
              description="他者との相性や効果的なコミュニケーション方法を知り、より健全な人間関係を構築できます。"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-blue-500" />}
              title="キャリア選択の助け"
              description="あなたの強みを活かせる職業や環境を見つけ、より充実したキャリアを築くヒントが得られます。"
            />
            <FeatureCard
              icon={<LineChart className="h-8 w-8 text-blue-500" />}
              title="個人的成長"
              description="自分の弱点や成長の可能性を理解し、意識的に成長するためのアクションプランを立てられます。"
            />
          </div>
        </div>
      </section>

      {/* コミュニティセクション */}
      <section className="py-16 bg-blue-50">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            MBTIコミュニティに参加しよう
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            同じタイプの人々と交流し、経験を共有したり、異なるタイプの人々から新しい視点を学んだりすることができます。
          </p>
          <Link href="/community">
            <Button className="rounded-full px-8">
              コミュニティを探索する
            </Button>
          </Link>
        </div>
      </section>

      {/* タイプ説明セクション */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            16のパーソナリティタイプ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MbtiTypeCard code="INTJ" name="建築家" />
            <MbtiTypeCard code="INTP" name="論理学者" />
            <MbtiTypeCard code="ENTJ" name="指揮官" />
            <MbtiTypeCard code="ENTP" name="討論者" />
            <MbtiTypeCard code="INFJ" name="提唱者" />
            <MbtiTypeCard code="INFP" name="仲介者" />
            <MbtiTypeCard code="ENFJ" name="主人公" />
            <MbtiTypeCard code="ENFP" name="運動家" />
            <MbtiTypeCard code="ISTJ" name="管理者" />
            <MbtiTypeCard code="ISFJ" name="擁護者" />
            <MbtiTypeCard code="ESTJ" name="幹部" />
            <MbtiTypeCard code="ESFJ" name="領事館" />
            <MbtiTypeCard code="ISTP" name="巨匠" />
            <MbtiTypeCard code="ISFP" name="冒険家" />
            <MbtiTypeCard code="ESTP" name="起業家" />
            <MbtiTypeCard code="ESFP" name="エンターテイナー" />
          </div>
          <div className="text-center mt-8">
            <Link href="/types">
              <Button variant="outline" className="rounded-full px-8">
                すべてのタイプを詳しく見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            あなたのMBTIタイプを見つけましょう
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
            10分程度の診断テストで、あなたの思考パターンや感情の処理方法、世界との関わり方を知ることができます。
          </p>
          <SignedIn>
            <Link href="/test">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
              >
                診断テストを受ける <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
              >
                今すぐ始める <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </SignedOut>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 bg-gray-50 border-t">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} MBTI Community. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 特徴カードコンポーネント
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// タイプカードコンポーネント
function MbtiTypeCard({ code, name }: { code: string; name: string }) {
  return (
    <Link
      href={`/types/${code.toLowerCase()}`}
      className="group transition-transform hover:-translate-y-1"
    >
      <TypeCard type={code} title={name} />
    </Link>
  );
}
