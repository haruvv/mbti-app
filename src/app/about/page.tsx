import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl py-12">
        <div className="space-y-8">
          {/* ヒーローセクション */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              MBTIについて
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              MBTIは、あなたの思考や行動の傾向を理解するための優れた指標です
            </p>
          </div>

          {/* 4つの軸の説明 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-600">
                  外向(E) vs 内向(I)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  エネルギーの方向性を表します。外向型は外部の人や活動からエネルギーを得る一方、内向型は内部の思考や静かな時間から活力を得ます。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">
                  感覚(S) vs 直感(N)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  情報の収集方法を表します。感覚型は具体的な事実や詳細に注目し、直感型は可能性やパターンを重視します。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-pink-600">
                  思考(T) vs 感情(F)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  意思決定の方法を表します。思考型は論理的な分析に基づいて判断し、感情型は価値観や人間関係を考慮します。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-600">
                  判断(J) vs 知覚(P)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  生活態度を表します。判断型は計画的で秩序を好み、知覚型は柔軟で適応的なアプローチを好みます。
                </p>
              </CardContent>
            </Card>
          </div>

          {/* よくある質問 */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">よくある質問</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  MBTIの結果は変わることがありますか？
                </AccordionTrigger>
                <AccordionContent>
                  はい、変わることがあります。MBTIは現在の傾向を示すものであり、経験や環境の変化によって変化する可能性があります。定期的に診断を受けることで、自己理解を深めることができます。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  MBTIの結果は絶対的なものですか？
                </AccordionTrigger>
                <AccordionContent>
                  いいえ、MBTIは自己理解のための道具であり、絶対的な評価ではありません。個人の複雑な性格を完全に表現することはできませんが、自己理解や他者理解の助けとなります。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  どのタイプが一番良いのですか？
                </AccordionTrigger>
                <AccordionContent>
                  すべてのタイプには独自の強みと課題があり、「最良」のタイプは存在しません。重要なのは、自分の特徴を理解し、それを活かしながら成長することです。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTAセクション */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              あなたのMBTIタイプを見つけましょう
            </h2>
            <p className="text-gray-600">
              60の質問で、あなたらしさの本質に迫ります
            </p>
            <Link href="/test">
              <Button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-8 py-6 rounded-xl text-lg hover:opacity-90">
                無料で診断を始める
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
