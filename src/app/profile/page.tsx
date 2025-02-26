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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    // プロフィール表示用データを取得
    const displayName = profileData.display_name || "ゲスト";

    // handleの取得
    let handle = profileData.handle || null;

    // お気に入りタイプの取得
    const bookmarkedTypes = profileData.bookmarked_types || [];

    // ソーシャルリンクの取得
    const socialLinks = profileData.social_links || {};

    return (
      <div className="container max-w-6xl px-4 py-8">
        {/* プロフィールヘッダー */}
        <div className="relative mb-8">
          {/* カバー画像 */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-xl"></div>

          {/* プロフィール情報 */}
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 px-6 pb-4">
            <div className="relative mb-4 md:mb-0 mr-0 md:mr-6">
              {profileData.custom_image_url ? (
                <Image
                  src={profileData.custom_image_url}
                  alt={displayName}
                  width={130}
                  height={130}
                  className="rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-4 border-white shadow-md flex items-center justify-center text-white text-5xl font-bold">
                  {displayName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">{displayName}</h1>
                {latestMbtiType && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {latestMbtiType}
                  </span>
                )}
              </div>
              {handle && <p className="text-gray-500 mb-3">@{handle}</p>}
              {profileData.bio && (
                <p className="text-gray-700 mb-4 text-center md:text-left">
                  {profileData.bio}
                </p>
              )}

              {/* ソーシャルリンクとフォロー情報 */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {/* ソーシャルリンク */}
                <div className="flex gap-2">
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-500 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>

                {/* フォロー統計 */}
                <div className="flex items-center gap-4">
                  <FollowStats
                    followingCount={followingCount}
                    followersCount={followersCount}
                    handle={handle || ""}
                  />
                </div>
              </div>
            </div>

            {/* 編集ボタン */}
            <div className="absolute top-52 md:top-4 right-4">
              <Link href="/profile/edit">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Edit className="h-4 w-4" />
                  編集
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* タブコンテンツ */}
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm shadow-sm">
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              診断結果
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              お気に入り
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              詳細情報
            </TabsTrigger>
          </TabsList>

          {/* 診断結果タブ */}
          <TabsContent value="results">
            <div className="grid grid-cols-1 gap-6">
              {latestResult ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">最新の診断結果</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <FormattedDate date={latestResult.created_at} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {latestResult.mbti_type}
                          </div>
                          <div className="text-lg text-gray-700 mb-4">
                            {typeDescriptions[
                              latestResult.mbti_type as keyof typeof typeDescriptions
                            ]?.name || ""}
                          </div>
                          <p className="text-sm text-gray-600">
                            {typeDescriptions[
                              latestResult.mbti_type as keyof typeof typeDescriptions
                            ]?.description || ""}
                          </p>
                        </div>
                      </div>

                      <div className="md:w-2/3">
                        <h3 className="text-lg font-medium mb-4">詳細スコア</h3>
                        <div className="space-y-4">
                          <ScoreBar
                            left="内向型 (I)"
                            right="外向型 (E)"
                            value={latestResult.e_score}
                            inverted
                          />
                          <ScoreBar
                            left="現実型 (S)"
                            right="直感型 (N)"
                            value={latestResult.n_score}
                          />
                          <ScoreBar
                            left="思考型 (T)"
                            right="感情型 (F)"
                            value={latestResult.f_score}
                          />
                          <ScoreBar
                            left="認知型 (J)"
                            right="探索型 (P)"
                            value={latestResult.p_score}
                          />
                        </div>

                        <div className="flex justify-between mt-6">
                          <Link href={`/test/history/${latestResult.id}`}>
                            <Button variant="outline" size="sm">
                              詳細を見る
                            </Button>
                          </Link>
                          <Link href="/test">
                            <Button variant="default" size="sm">
                              新しいテストを受ける
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <BarChart className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    まだ診断テストを受けていません
                  </h3>
                  <p className="text-gray-500 mb-6">
                    10分程度のテストであなたのMBTIタイプを診断しましょう
                  </p>
                  <div className="flex justify-center">
                    <Link href="/test">
                      <Button>診断テストを受ける</Button>
                    </Link>
                  </div>
                </Card>
              )}

              {testResults && testResults.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">過去の診断結果</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testResults.slice(1, 5).map((result) => (
                      <Link
                        href={`/test/history/${result.id}`}
                        key={result.id}
                        className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-lg">
                            {result.mbti_type}
                          </span>
                          <FormattedDate
                            date={result.created_at}
                            className="text-sm text-gray-500"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {typeDescriptions[
                            result.mbti_type as keyof typeof typeDescriptions
                          ]?.name || ""}
                        </p>
                      </Link>
                    ))}
                  </div>
                  {testResults.length > 5 && (
                    <div className="text-center mt-4">
                      <Link href="/test/history">
                        <Button variant="link">すべての診断結果を見る</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* お気に入りタブ */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  お気に入りタイプ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarkedTypes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {bookmarkedTypes.map((type) => (
                      <Link
                        key={type}
                        href={`/types/${type.toLowerCase()}`}
                        className="block"
                      >
                        <div className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all h-full">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-blue-600">
                              {type}
                            </span>
                            <span className="text-gray-600">
                              {typeDescriptions[
                                type as keyof typeof typeDescriptions
                              ]?.name || ""}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {typeDescriptions[
                              type as keyof typeof typeDescriptions
                            ]?.description.substring(0, 120)}
                            ...
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">
                      お気に入りに登録したタイプはありません
                    </h3>
                    <p className="text-gray-500 mb-4">
                      タイプページでお気に入りに追加できます
                    </p>
                    <Link href="/types">
                      <Button variant="outline">タイプ一覧を見る</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 詳細情報タブ */}
          <TabsContent value="about">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  詳細プロフィール
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    表示名
                  </h3>
                  <p>{displayName}</p>
                </div>

                {handle && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      ユーザーID
                    </h3>
                    <p>@{handle}</p>
                  </div>
                )}

                {profileData.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      自己紹介
                    </h3>
                    <p>{profileData.bio}</p>
                  </div>
                )}

                {latestMbtiType && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      MBTIタイプ
                    </h3>
                    <p className="flex items-center gap-2">
                      {latestMbtiType}
                      <span className="text-gray-600">
                        (
                        {typeDescriptions[
                          latestMbtiType as keyof typeof typeDescriptions
                        ]?.name || ""}
                        )
                      </span>
                    </p>
                  </div>
                )}

                {Object.keys(socialLinks).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      ソーシャルリンク
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.twitter && (
                        <a
                          href={socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a
                          href={socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition-colors"
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </a>
                      )}
                      {socialLinks.website && (
                        <a
                          href={socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          ウェブサイト
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    アカウント作成日
                  </h3>
                  <p>
                    <FormattedDate date={profileData.created_at} />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("プロフィールページエラー:", error);
    return (
      <div className="container max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-8">
          プロフィールの読み込み中にエラーが発生しました。
          再度お試しいただくか、問題が続く場合はサポートまでご連絡ください。
        </p>
        <Button asChild>
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    );
  }
}

// スコアバーコンポーネント
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
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
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
