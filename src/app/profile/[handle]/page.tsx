import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "@/components/features/follows/FollowButton";
import { FollowStats } from "@/components/features/follows/FollowStats";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormattedDate } from "@/components/ui/FormattedDate";
import {
  Twitter,
  Instagram,
  Globe,
  Calendar,
  Star,
  BarChart,
  User,
  BadgeCheck,
  AtSign,
  Activity,
} from "lucide-react";
import { DebugPanel } from "@/components/debug/DebugPanel";

// 最上部でデバッグ管理用の定数を追加
const DEBUG_MODE = process.env.NODE_ENV === "development";

export default async function UserProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { handle } = await params;
  const { tab } = (await searchParams) || {};
  const activeTab = tab || "profile";
  const supabase = createClient();

  // Clerkから取得したログインユーザーID - 非同期処理を待つ
  const { userId: clerkUserId } = await auth();

  // デバッグログ
  if (DEBUG_MODE)
    console.log("Debug: リクエストパラメータ", { handle, tab, clerkUserId });

  try {
    // ユーザー情報の取得（詳細データを含む）
    const { data: profileUser, error: profileError } = await supabase
      .from("user_profiles")
      .select(
        `
        id,
        user_id,
        display_name,
        custom_image_url,
        preferred_mbti,
        bio,
        bookmarked_types,
        social_links,
        handle,
        created_at,
        updated_at
      `
      )
      .eq("handle", handle)
      .single();

    // デバッグログ
    if (DEBUG_MODE) {
      console.log("user_profiles検索結果:", {
        success: !profileError,
        data: profileUser,
        error: profileError,
      });
    }

    // ユーザーが見つからない場合、users テーブルで再検索
    let userData = profileUser;
    if (profileError || !profileUser) {
      const { data: userFromUsersTable, error: usersError } = await supabase
        .from("users")
        .select(
          `
          id,
          handle,
          display_name,
          created_at,
          user_profiles (
            id,
            display_name,
            custom_image_url,
            preferred_mbti,
            bio,
            bookmarked_types,
            social_links,
            handle,
            created_at,
            updated_at
          )
        `
        )
        .eq("handle", handle)
        .single();

      if (DEBUG_MODE) {
        console.log("users検索結果:", {
          success: !usersError,
          data: userFromUsersTable,
          error: usersError,
        });
      }

      if (!userFromUsersTable) {
        console.log(`ユーザー "${handle}" は見つかりませんでした`);
        return notFound();
      }

      userData = userFromUsersTable;
    }

    // 現在のユーザーIDを取得
    let loggedInUserId = null; // ログイン中のユーザーのSupabaseID
    let isFollowing = false; // ログイン中のユーザーがこのプロフィールのユーザーをフォローしているか
    let isOwnProfile = false; // 表示中のプロフィールが自分自身のものか

    if (clerkUserId) {
      const { data: loggedInUser } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkUserId)
        .single();

      if (loggedInUser) {
        loggedInUserId = loggedInUser.id;
        isOwnProfile =
          loggedInUser.id === userData.id ||
          loggedInUser.id === userData.user_id;

        // 自分自身のプロフィールでない場合のみフォロー状態を確認
        if (!isOwnProfile) {
          const { data: followData } = await supabase
            .from("follows")
            .select("*")
            .eq("follower_id", loggedInUser.id)
            .eq("following_id", userData.user_id || userData.id)
            .maybeSingle();

          isFollowing = !!followData;
        }
      }
    }

    // フォロー数とフォロワー数を取得
    const { data: followCounts } = await supabase.rpc("get_follow_counts", {
      p_user_id: userData.user_id || userData.id,
    });

    const followingCount = followCounts?.following_count || 0;
    const followersCount = followCounts?.followers_count || 0;

    // テスト結果を取得（もしあれば）
    const { data: testResults } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_id", userData.user_id || userData.id)
      .order("created_at", { ascending: false })
      .limit(1);

    // 診断回数を取得
    const { count: testCount } = await supabase
      .from("test_results")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userData.user_id || userData.id);

    const latestTestResult = testResults?.[0];

    // デバッグログ
    if (DEBUG_MODE) {
      console.log("診断統計:", {
        testCount,
        latestTest: latestTestResult
          ? {
              type: latestTestResult.mbti_type,
              date: latestTestResult.created_at,
            }
          : null,
      });
    }

    // 表示データを準備
    const profile = userData.user_profiles || userData;
    const displayName = profile.display_name || `@${userData.handle}`;
    const mbtiType = profile.preferred_mbti;
    const typeDescription = mbtiType ? typeDescriptions[mbtiType] : null;
    const joinDate = userData.created_at || profile.created_at;

    // ソーシャルリンクの処理
    const socialLinks = profile.social_links || {};

    // デバッグセクションを定義
    const debugSections = [
      { title: "ユーザーデータ", data: userData },
      {
        title: "フォロー情報",
        data: {
          followingCount,
          followersCount,
          isFollowing,
          isOwnProfile,
        },
      },
      { title: "テスト結果", data: latestTestResult },
    ];

    // デバッグビュー（開発環境でのみ表示）
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* 共通デバッグパネルに置き換え */}
        <DebugPanel data={userData} sections={debugSections} />

        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* プロフィールカード */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            {/* ヘッダー部分 */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            <div className="px-6 pb-6">
              {/* アバター画像 */}
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  <Image
                    src={profile.custom_image_url || "/default-avatar.png"}
                    alt={displayName}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* プロフィール情報 */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold flex items-center">
                        {displayName}
                        {mbtiType && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {mbtiType}
                          </span>
                        )}
                      </h1>
                      <p className="text-gray-500 flex items-center mt-1">
                        <AtSign size={16} className="mr-1" />
                        {userData.handle}
                      </p>
                    </div>

                    {/* フォローボタン表示 */}
                    {loggedInUserId && !isOwnProfile && (
                      <FollowButton
                        targetUserId={userData.user_id || userData.id}
                        initialIsFollowing={isFollowing}
                      />
                    )}
                  </div>

                  {/* ユーザー詳細情報 */}
                  <div className="space-y-3 mb-6">
                    {profile.bio && (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {profile.bio}
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
                              登録日: <FormattedDate date={joinDate} />
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Activity size={16} className="mr-1.5" />
                            <span className="text-sm">
                              診断回数: {testCount || 0}回
                            </span>
                          </div>
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
                    userId={userData.user_id || userData.id}
                    handle={userData.handle}
                    followingCount={followingCount}
                    followersCount={followersCount}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* タブコンテンツ */}
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="mb-6 bg-white">
              <TabsTrigger value="profile">プロフィール</TabsTrigger>
              <TabsTrigger value="posts">投稿</TabsTrigger>
              <TabsTrigger value="test">診断結果</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* MBTIタイプ情報 */}
              {mbtiType && typeDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BadgeCheck className="mr-2 h-5 w-5 text-indigo-500" />
                      {mbtiType}タイプ情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700">
                      <h3 className="font-medium mb-2">
                        {typeDescription.name}
                      </h3>
                      <p className="mb-4">{typeDescription.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-indigo-700 mb-2">
                            長所
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {typeDescription.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-indigo-700 mb-2">
                            短所
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {typeDescription.weaknesses.map((weakness, i) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* お気に入りタイプ */}
              {profile.bookmarked_types &&
                profile.bookmarked_types.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        お気に入りタイプ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {profile.bookmarked_types.map((type) => (
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
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>まだ投稿がありません</p>
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

                  {latestTestResult ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          最新の診断結果
                        </h3>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-indigo-600">
                              {latestTestResult.mbti_type}
                            </span>
                            <FormattedDate
                              date={latestTestResult.created_at}
                              className="text-xs text-gray-500"
                            />
                          </div>

                          {/* 既存の診断結果の詳細表示 */}
                          {latestTestResult.scores && (
                            <div className="space-y-4">
                              <TypeBar
                                left="内向的 (I)"
                                right="外向的 (E)"
                                value={latestTestResult.scores.E || 50}
                              />
                              <TypeBar
                                left="現実的 (S)"
                                right="直感的 (N)"
                                value={latestTestResult.scores.N || 50}
                              />
                              <TypeBar
                                left="論理的 (T)"
                                right="感情的 (F)"
                                value={latestTestResult.scores.F || 50}
                              />
                              <TypeBar
                                left="計画的 (J)"
                                right="柔軟的 (P)"
                                value={latestTestResult.scores.P || 50}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>まだ診断結果がありません</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (error) {
    // エラーハンドリング
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

// タイプバーコンポーネント
function TypeBar({
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
