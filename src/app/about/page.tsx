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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-5xl py-16">
        <div className="space-y-12">
          {/* ヒーローセクション */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800">
              MBTIで自分を再発見
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              MBTIは、あなたの内面に眠る個性や可能性を引き出すためのツールです。自分自身を深く知ることで、新たな成長の一歩を踏み出しましょう。
            </p>
          </div>

          {/* 4つの軸の説明 */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-xl p-6">
                <CardTitle className="text-red-700 text-lg font-semibold">
                  外向(E) vs 内向(I)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  この軸は、あなたがエネルギーをどこから受け取るかを表します。外向型は交流や新しい出会いから刺激を得るのに対し、内向型の人は一人の時間や静かな環境でエネルギーを回復します。それぞれの特性があなたらしさを彩ります。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-xl p-6">
                <CardTitle className="text-green-700 text-lg font-semibold">
                  感覚(S) vs 直感(N)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  この軸は、情報の受け取り方を示します。感覚型は現実的なデータや細部に着目し、直感型は全体像や未来の可能性を重視します。あなたの視点が、世界の見方をユニークなものにします。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl p-6">
                <CardTitle className="text-orange-700 text-lg font-semibold">
                  思考(T) vs 感情(F)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  この軸は、あなたが意思決定をする際に何を重視するかを示します。思考型は論理と客観性で判断し、感情型は共感や価値観に基づいて決断します。どちらも、あなたの人間性を豊かにする大切な要素です。
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6">
                <CardTitle className="text-blue-700 text-lg font-semibold">
                  判断(J) vs 知覚(P)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  この軸は、あなたの日常の進め方や働き方に関わります。判断型は計画性と秩序を好み、知覚型は柔軟で即応的なスタイルを持ちます。どちらのアプローチも、あなたのライフスタイルを形作る大切なピースです。
                </p>
              </CardContent>
            </Card>
          </div>

          {/* よくある質問 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              よくある質問
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-slate-800 font-medium hover:text-slate-900">
                  MBTIの結果は変動するものですか？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  はい、MBTIの結果はあなたの成長やライフステージの変化に伴って変わることがあります。定期的に見直すことで、自己理解がさらに深まります。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-slate-800 font-medium hover:text-slate-900">
                  MBTI診断の信頼性はどの程度ですか？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  MBTIは、あなたの性格の傾向を把握するための有用なツールです。ただし、すべての側面を網羅するものではないため、自己理解の一助としてご利用いただくことをお勧めします。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-slate-800 font-medium hover:text-slate-900">
                  どのタイプが優れているのでしょうか？
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  どのタイプにも独自の強みと魅力があります。大切なのは、自分自身の特性を理解し、それを最大限に活かす方法を見つけることです。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTAセクション */}
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">
              今すぐ、新たな自分と出会おう
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              わずか60問の診断で、あなたの隠れた可能性や個性が明らかになります。未知なる自分に挑戦する準備はできていますか？
            </p>
            <Link href="/test">
              <Button className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 text-white px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity shadow-md">
                無料診断を始める
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
