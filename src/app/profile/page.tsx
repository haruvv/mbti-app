import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTestResults } from "../_actions/test";
import { typeDescriptions } from "../data/mbtiTypes";
import { getUserProfile } from "../_actions/profile";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { FollowStats } from "@/components/features/follows/FollowStats";
import { FormattedDate } from "@/components/ui/FormattedDate";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import {
  Settings,
  Twitter,
  Instagram,
  Globe,
  Edit,
  Calendar,
  Star,
  BarChart,
  User,
  BadgeCheck,
  AtSign,
  Activity,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DebugPanel } from "@/components/debug/DebugPanel";

// デバッグ管理用の定数を追加
const DEBUG_MODE = process.env.NODE_ENV === "development";

export default async function ProfilePage() {
  try {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // プロフィール情報を取得
    const { data: profileData, error: profileError } = await getUserProfile(
      user.id
    );

    if (profileError || !profileData) {
      throw new Error(profileError || "プロフィールの取得に失敗しました");
    }

    const { success, data: testResults, error } = await getTestResults();

    // 最新の診断結果を取得
    const latestResult =
      testResults && testResults.length > 0 ? testResults[0] : null;
    const latestMbtiType = latestResult?.mbti_type;

    // Supabaseからユーザー情報を取得
    const supabase = createClient();

    // フォロー数とフォロワー数を取得
    let followingCount = 0;
    let followersCount = 0;

    const { data: followCounts } = await supabase.rpc("get_follow_counts", {
      p_user_id: profileData.user_id,
    });

    followingCount = followCounts?.following_count || 0;
    followersCount = followCounts?.followers_count || 0;

    // 診断回数を取得
    const { count: testCount } = await supabase
      .from("test_results")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileData.user_id);

    // プロフィール表示用データを取得
    const displayName = profileData.display_name || "ゲスト";

    // handleの取得
    let handle = profileData.handle || null;

    // お気に入りタイプの取得
    const bookmarkedTypes = profileData.bookmarked_types || [];

    // ソーシャルリンクの取得
    const socialLinks = profileData.social_links || {};

    // データ取得後
    if (DEBUG_MODE) {
      console.log("取得したテスト結果数:", testResults?.length);
      console.log("テスト結果データ:", testResults);
      console.log("診断統計:", {
        testCount,
        latestTest: latestResult
          ? {
              type: latestResult.mbti_type,
              date: latestResult.created_at,
            }
          : null,
      });
    }

    // デバッグ用データの準備
    const debugData = {
      profile: profileData,
      testCount,
      latestResult,
      followCounts: { followingCount, followersCount },
      socialLinks,
      bookmarkedTypes,
    };

    const debugSections = [
      { title: "プロフィール情報", data: profileData },
      {
        title: "テスト情報",
        data: {
          testCount,
          latestResult,
          testResults: testResults?.slice(0, 3),
        },
      },
      { title: "フォロー情報", data: { followingCount, followersCount } },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* デバッグパネル */}
        <DebugPanel data={debugData} sections={debugSections} />

        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* プロフィールカード */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            {/* ヘッダー部分 */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            <div className="px-6 pb-6">
              {/* アバター画像 */}
              <div className="flex flex-col items-left -mt-16">
                <div className="relative w-32 h-32">
                  {profileData.custom_image_url ? (
                    <div className="w-32 h-32 relative ring-4 ring-indigo-100 rounded-full shadow-md overflow-hidden">
                      <Image
                        src={profileData.custom_image_url}
                        alt={displayName}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* プロフィール情報 */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold flex items-center">
                        {displayName}
                        {latestMbtiType && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {latestMbtiType}
                          </span>
                        )}
                      </h1>
                      {handle && (
                        <p className="text-gray-500 flex items-center mt-1">
                          <AtSign size={16} className="mr-1" />
                          {handle}
                        </p>
                      )}
                    </div>

                    <Button asChild variant="outline" size="sm">
                      <Link href="/profile/edit">
                        <Settings className="mr-2 h-4 w-4" />
                        プロフィール編集
                      </Link>
                    </Button>
                  </div>

                  {/* ユーザー詳細情報 */}
                  <div className="space-y-3 mb-6">
                    {profileData.bio && (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {profileData.bio}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                          <User size={16} className="mr-1.5" />
                          プロフィール情報
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1.5" />
                            <span className="text-sm">
                              登録日:{" "}
                              <FormattedDate date={profileData.created_at} />
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Activity size={16} className="mr-1.5" />
                            <span className="text-sm">
                              診断回数: {testCount || 0}回
                            </span>
                          </div>

                          {latestMbtiType && (
                            <div className="flex items-center">
                              <Star size={16} className="mr-1.5" />
                              <span className="text-sm">
                                最新診断: {latestMbtiType}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ソーシャルリンク */}
                    {(socialLinks.twitter ||
                      socialLinks.instagram ||
                      socialLinks.website) && (
                      <div className="flex gap-3 mt-3">
                        {socialLinks.twitter && (
                          <a
                            href={`https://twitter.com/${socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-400"
                          >
                            <Twitter size={20} />
                          </a>
                        )}
                        {socialLinks.instagram && (
                          <a
                            href={`https://instagram.com/${socialLinks.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-pink-500"
                          >
                            <Instagram size={20} />
                          </a>
                        )}
                        {socialLinks.website && (
                          <a
                            href={socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-green-500"
                          >
                            <Globe size={20} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* フォロー数 */}
                  <FollowStats
                    userId={profileData.user_id}
                    handle={handle}
                    followingCount={followingCount}
                    followersCount={followersCount}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* タブコンテンツ */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 bg-white">
              <TabsTrigger value="profile">プロフィール</TabsTrigger>
              <TabsTrigger value="posts">投稿</TabsTrigger>
              <TabsTrigger value="test">診断結果</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* MBTIタイプ情報 */}
              {latestMbtiType && typeDescriptions[latestMbtiType] && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BadgeCheck className="mr-2 h-5 w-5 text-indigo-500" />
                      {latestMbtiType}タイプ情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700">
                      <h3 className="font-medium mb-2">
                        {typeDescriptions[latestMbtiType].name}
                      </h3>
                      <p className="mb-4">
                        {typeDescriptions[latestMbtiType].description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-indigo-700 mb-2">
                            長所
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {typeDescriptions[latestMbtiType].strengths.map(
                              (strength, i) => (
                                <li key={i}>{strength}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-indigo-700 mb-2">
                            短所
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {typeDescriptions[latestMbtiType].weaknesses.map(
                              (weakness, i) => (
                                <li key={i}>{weakness}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* お気に入りタイプ */}
              {bookmarkedTypes && bookmarkedTypes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Star className="mr-2 h-5 w-5 text-yellow-500" />
                      お気に入りタイプ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {bookmarkedTypes.map((type) => (
                        <div
                          key={type}
                          className="text-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="font-bold text-indigo-600">
                            {type}
                          </div>
                          <div className="text-xs text-gray-500">
                            {typeDescriptions[type]?.name || ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="posts">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-gray-500">
                    <p>投稿機能は準備中です</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-indigo-500" />
                    診断結果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <BarChart className="text-indigo-500 h-5 w-5 mr-2" />
                      <span>合計診断回数</span>
                    </div>
                    <span className="font-semibold text-lg text-indigo-600">
                      {testCount || 0}回
                    </span>
                  </div>

                  {/* 既存のテスト結果表示を保持 */}
                  {latestResult && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          最新の診断結果
                        </h3>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-indigo-600">
                              {latestResult.mbti_type}
                            </span>
                            <FormattedDate
                              date={latestResult.created_at}
                              className="text-xs text-gray-500"
                            />
                          </div>

                          <p className="text-sm mb-6">
                            {
                              typeDescriptions[latestResult.mbti_type]
                                ?.description
                            }
                          </p>

                          <div className="space-y-4">
                            <div>
                              <ScoreBar
                                left="内向型"
                                right="外向型"
                                value={latestResult.e_score}
                              />
                            </div>
                            <div>
                              <ScoreBar
                                left="現実型"
                                right="直感型"
                                value={latestResult.n_score}
                              />
                            </div>
                            <div>
                              <ScoreBar
                                left="論理型"
                                right="感情型"
                                value={latestResult.f_score}
                              />
                            </div>
                            <div>
                              <ScoreBar
                                left="計画型"
                                right="探索型"
                                value={latestResult.p_score}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 以前の診断結果や他のコンテンツも表示 */}
                      {testResults && testResults.length > 1 && (
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">
                            以前の診断結果
                          </h3>
                          <div className="space-y-2">
                            {testResults.slice(1, 5).map((result, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full mr-3 font-medium">
                                    {result.mbti_type.slice(0, 2)}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {result.mbti_type}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      <FormattedDate date={result.created_at} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Link href="/test" className="block mt-6">
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      新しい診断テストを受ける
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (error) {
    console.error("プロフィールページエラー:", error);

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-8">
          プロフィールの読み込み中にエラーが発生しました
        </p>

        {/* 開発環境のみエラー詳細を表示 */}
        {DEBUG_MODE && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-left">
            <h2 className="font-bold text-red-800 mb-2">エラー詳細:</h2>
            <pre className="text-xs overflow-auto p-2 bg-white border border-red-100 rounded">
              {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="text-blue-500 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }
}

function ScoreBar({
  left,
  right,
  value,
  inverted = false,
}: {
  left: string;
  right: string;
  value: number;
  inverted?: boolean;
}) {
  const percentage = inverted ? 100 - value : value;

  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className="flex h-2.5 w-full rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full"
          style={{ width: `${100 - percentage}%` }}
        ></div>
        <div
          className="bg-green-500 h-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">
          {inverted ? value : 100 - value}%
        </span>
        <span className="text-xs text-gray-500">
          {inverted ? 100 - value : value}%
        </span>
      </div>
    </div>
  );
}
