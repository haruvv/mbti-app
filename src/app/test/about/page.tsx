import Link from "next/link";

export default function TestAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 animate-gradient-x">
      <div className="container mx-auto max-w-3xl pt-12 pb-16">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            MBTIタイプ診断について
          </h1>

          <div className="space-y-6 text-gray-700">
            <p>
              MBTIは「マイヤーズ・ブリッグス・タイプ指標」の略で、カール・ユングの心理学理論に基づいて開発された性格タイプ分類法です。
              この診断では、あなたの思考と行動パターンを分析し、16のタイプのうちどれに最も近いかを判定します。
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">診断の内容</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>質問数：全20問</li>
                <li>所要時間：約5分</li>
                <li>回答方法：2つの選択肢からより自分に近い方を選びます</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">MBTIの4つの軸</h2>
              <ul className="space-y-3">
                <li className="p-3 bg-blue-50 rounded">
                  <span className="font-medium">外向型(E) vs. 内向型(I)</span>：
                  エネルギーを外部から得るか、内部から得るか
                </li>
                <li className="p-3 bg-green-50 rounded">
                  <span className="font-medium">感覚型(S) vs. 直感型(N)</span>：
                  情報を具体的に捉えるか、パターンや可能性として捉えるか
                </li>
                <li className="p-3 bg-yellow-50 rounded">
                  <span className="font-medium">思考型(T) vs. 感情型(F)</span>：
                  論理と客観性を重視するか、価値観と調和を重視するか
                </li>
                <li className="p-3 bg-purple-50 rounded">
                  <span className="font-medium">判断型(J) vs. 知覚型(P)</span>：
                  計画と決断を好むか、適応性と柔軟性を好むか
                </li>
              </ul>
            </div>

            <p>
              診断結果はあくまで自己理解のための参考情報です。
              人間の性格は複雑で多面的なため、結果に完全に一致する必要はありません。
            </p>

            <div className="flex justify-center mt-8">
              <Link
                href="/test"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-md"
              >
                診断テストを開始する
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
