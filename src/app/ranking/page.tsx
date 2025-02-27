import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { typeDescriptions } from "../data/mbtiTypes";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import { PieChart, BarChart3, Users, Award, LineChart } from "lucide-react";

type MbtiRanking = {
  mbti_type: string;
  count: number;
  percentage: number;
  rank: number;
};

export default async function RankingPage() {
  const supabase = createClient();

  // すべてのユーザー数を取得
  const { count: totalUserCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  // MBTIタイプごとのユーザー数を取得
  const { data: mbtiCounts, error } = await supabase
    .from("user_profiles")
    .select("preferred_mbti")
    .not("preferred_mbti", "is", null);

  if (error) {
    console.error("Error fetching MBTI counts:", error);
  }

  // MBTIタイプごとのカウントを集計
  const mbtiCountMap: Record<string, number> = {};
  mbtiCounts?.forEach((user) => {
    const type = user.preferred_mbti as string;
    if (type) {
      mbtiCountMap[type] = (mbtiCountMap[type] || 0) + 1;
    }
  });

  // タイプごとの診断回数を取得（修正版 - RPC関数を使用）
  const { data: testStats, error: testError } = await supabase.rpc(
    "get_mbti_test_counts"
  );

  // RPCが利用できない場合のフォールバック
  let testCountMap: Record<string, number> = {};

  if (testError || !testStats) {
    console.error("Error fetching test counts:", testError);

    // 代替アプローチ：単純にすべての結果を取得して集計
    const { data: allTests } = await supabase
      .from("test_results")
      .select("mbti_type");

    if (allTests) {
      allTests.forEach((test) => {
        const type = test.mbti_type;
        testCountMap[type] = (testCountMap[type] || 0) + 1;
      });
    }
  } else {
    // RPC関数が成功した場合
    testStats.forEach((stat: { mbti_type: string; count: number }) => {
      testCountMap[stat.mbti_type] = stat.count;
    });
  }

  // 診断テストの総数を計算
  const totalTestCount = Object.values(testCountMap).reduce(
    (sum, count) => sum + count,
    0
  );

  // ランキングデータを作成
  const ranking: MbtiRanking[] = Object.entries(mbtiCountMap)
    .map(([mbti_type, count]) => ({
      mbti_type,
      count,
      percentage: totalUserCount
        ? Math.round((count / totalUserCount) * 1000) / 10
        : 0,
      rank: 0, // 後で設定
    }))
    .sort((a, b) => b.count - a.count);

  // ランク付け
  ranking.forEach((item, index) => {
    item.rank = index + 1;
  });

  // MBTIタイプを設定しているユーザー数
  const usersWithMbti = ranking.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          MBTIタイプランキング
        </h1>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">総ユーザー数</p>
              <p className="text-2xl font-bold">{totalUserCount || 0}人</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">MBTIタイプ設定済み</p>
              <p className="text-2xl font-bold">
                {usersWithMbti}人
                <span className="text-sm font-normal text-gray-500 ml-1">
                  (
                  {totalUserCount
                    ? Math.round((usersWithMbti / totalUserCount) * 100)
                    : 0}
                  %)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-3 bg-pink-100 rounded-full mr-4">
              <PieChart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">未設定ユーザー</p>
              <p className="text-2xl font-bold">
                {totalUserCount ? totalUserCount - usersWithMbti : 0}人
                <span className="text-sm font-normal text-gray-500 ml-1">
                  (
                  {totalUserCount
                    ? Math.round(
                        ((totalUserCount - usersWithMbti) / totalUserCount) *
                          100
                      )
                    : 0}
                  %)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <LineChart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">診断テスト実行回数</p>
              <p className="text-2xl font-bold">{totalTestCount}回</p>
            </div>
          </div>
        </div>

        {/* ランキングテーブル */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">人気MBTIタイプ</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    順位
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    人数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    割合
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    詳細
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ranking.map((item) => (
                  <tr key={item.mbti_type} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {item.rank <= 3 ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                              item.rank === 1
                                ? "bg-yellow-400"
                                : item.rank === 2
                                  ? "bg-gray-400"
                                  : "bg-amber-600"
                            }`}
                          >
                            {item.rank}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-medium">
                            {item.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="font-medium">{item.mbti_type}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {typeDescriptions[item.mbti_type]?.title || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.count}</td>
                    <td className="px-4 py-3">{item.percentage}%</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/types/${item.mbti_type.toLowerCase()}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        詳細を見る
                      </Link>
                    </td>
                  </tr>
                ))}
                {ranking.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      まだデータがありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* タイプ分布の可視化（簡易） */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">MBTIタイプ分布</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {ranking.map((item) => (
              <div
                key={`bar-${item.mbti_type}`}
                className="bg-gray-50 rounded-lg p-3 relative"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{item.mbti_type}</span>
                  <span className="text-sm text-gray-500">{item.count}人</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-600 h-4 rounded-full"
                    style={{
                      width: `${item.percentage > 0 ? Math.max(5, item.percentage) : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
