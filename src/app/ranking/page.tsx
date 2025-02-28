import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { typeDescriptions } from "../data/mbtiTypes";
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

  // タイプごとの診断回数を取得
  const { data: testStats, error: testError } = await supabase.rpc(
    "get_mbti_test_counts"
  );

  let testCountMap: Record<string, number> = {};

  if (testError || !testStats) {
    console.error("Error fetching test counts:", testError);
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
    testStats.forEach((stat: { mbti_type: string; count: number }) => {
      testCountMap[stat.mbti_type] = stat.count;
    });
  }

  // 診断テストの総数を計算
  const totalTestCount = Object.values(testCountMap).reduce(
    (sum, count) => sum + count,
    0
  );

  // MBTIタイプを設定しているユーザー数
  const usersWithMbti = Object.values(mbtiCountMap).reduce(
    (sum, count) => sum + count,
    0
  );

  // ランキングデータを作成
  const ranking: MbtiRanking[] = Object.entries(mbtiCountMap)
    .map(([mbti_type, count]) => ({
      mbti_type,
      count,
      percentage: usersWithMbti
        ? Math.round((count / usersWithMbti) * 1000) / 10
        : 0,
      rank: 0,
    }))
    .sort((a, b) => b.count - a.count);

  ranking.forEach((item, index) => {
    item.rank = index + 1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* タイトル */}
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          MBTIタイプランキング
        </h1>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 総ユーザー数（青） */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">総ユーザー数</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalUserCount || 0}人
              </p>
            </div>
          </div>

          {/* MBTIタイプ設定済み（緑） */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">MBTIタイプ設定済み</p>
              <p className="text-2xl font-bold text-gray-800">
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

          {/* 未設定ユーザー（オレンジ） */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-orange-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">未設定ユーザー</p>
              <p className="text-2xl font-bold text-gray-800">
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

          {/* 診断テスト実行回数（ピンク） */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-pink-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">診断テスト実行回数</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalTestCount}回
              </p>
            </div>
          </div>
        </div>

        {/* ランキングテーブル */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              人気MBTIタイプ
            </h2>
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
              <tbody className="divide-y divide-gray-100">
                {ranking.map((item) => (
                  <tr
                    key={item.mbti_type}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {item.rank <= 3 ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                              item.rank === 1
                                ? "bg-blue-600"
                                : item.rank === 2
                                  ? "bg-green-500"
                                  : "bg-orange-500"
                            }`}
                          >
                            {item.rank}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {item.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">
                          {item.mbti_type}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {typeDescriptions[item.mbti_type]?.title || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.count}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {item.percentage}%
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/types/${item.mbti_type.toLowerCase()}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        詳細を見る
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* タイプ分布の可視化 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            MBTIタイプ分布
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {ranking.map((item) => (
              <div
                key={`bar-${item.mbti_type}`}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">
                    {item.mbti_type}
                  </span>
                  <span className="text-sm text-gray-500">{item.count}人</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
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
