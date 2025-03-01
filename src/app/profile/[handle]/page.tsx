import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "@/components/features/follows/FollowButton";
import { FollowStats } from "@/components/features/follows/FollowStats";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
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
  Edit2,
} from "lucide-react";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { Button } from "@/components/ui/button";
import { mbtiColors } from "@/app/data/mbtiColors";

// 最上部でデバッグ管理用の定数を追加
const DEBUG_MODE = process.env.NODE_ENV === "development";

// MBTIキーの型定義を追加
type MBTITypeKey = keyof typeof typeDescriptions;

// MBTIの説明の型定義
interface MBTITypeDescription {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

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

    // ユーザーが見つからない場合、users テーブルで再検索
    let userData = profileUser;
    if (profileError || !profileUser) {
      const { data: userFromUsersTable } = await supabase
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

      if (!userFromUsersTable) {
        console.log(`ユーザー "${handle}" は見つかりませんでした`);
        return notFound();
      }

      userData = userFromUsersTable;
    }

    // null チェックを追加
    if (!userData) {
      return notFound();
    }

    // 現在のユーザーIDを取得
    let loggedInUserId = null; // ログイン中のユーザーのSupabaseID
    let isFollowing = false; // ログイン中のユーザーがこのプロフィールのユーザーをフォローしているか
    let isOwnProfile = false; // 表示中のプロフィールが自分自身のものか

    if (clerkUserId) {
      // ログイン中のユーザーのSupabase IDを取得
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

    // 最新の診断結果を取得
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

    // 表示データを準備
    const profile =
      "user_profiles" in userData
        ? userData.user_profiles[0] || userData
        : userData;
    const displayName = profile.display_name || `@${userData.handle}`;
    const mbtiType = profile.preferred_mbti as MBTITypeKey | null;
    const typeDescription = mbtiType
      ? (typeDescriptions[mbtiType] as MBTITypeDescription)
      : null;
    const joinDate = userData.created_at || profile.created_at;

    // MBTIタイプに基づいた色を設定（ない場合はデフォルト色）
    const typeColor =
      mbtiType && mbtiColors[mbtiType]
        ? mbtiColors[mbtiType]
        : {
            from: "from-slate-700",
            to: "to-gray-800",
            text: "text-slate-700",
          };

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

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* DEBUG_MODEの場合のみデバッグパネルを表示 */}
        {DEBUG_MODE && userData && (
          <DebugPanel data={userData} sections={debugSections} />
        )}

        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* プロフィールカード */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            {/* ヘッダー部分 */}
            <div
              className={`h-32 ${mbtiType ? mbtiColors[mbtiType].bg : "bg-gradient-to-r from-slate-700 to-gray-800"} relative`}
            >
              {/* MBTIタイプを大きく表示 - ヘッダーに追加 */}
              {mbtiType && (
                <div className="absolute bottom-4 right-6">
                  <div
                    className={`${mbtiType === "ISTJ" ? "bg-white text-black" : "bg-white/90 backdrop-blur " + mbtiColors[mbtiType].text} font-bold px-4 py-2 rounded-full shadow-sm text-xl border-2 border-white`}
                  >
                    {mbtiType}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              {/* アバターとプロフィールヘッダー情報 */}
              <div className="relative flex flex-col sm:flex-row sm:items-end -mt-16 mb-6">
                {/* アバター画像 */}
                <div
                  className="relative flex-shrink-0 mb-4 sm:mb-0 mx-auto sm:mx-0"
                  style={{ width: "128px" }}
                >
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                    <Image
                      src={profile.custom_image_url || "/default-avatar.png"}
                      alt={displayName}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* MBTIタイプのバッジをアバター上に配置 */}
                  {mbtiType && (
                    <div
                      className={`absolute -bottom-2 -right-2 ${mbtiColors[mbtiType].bg} ${mbtiType === "ISTJ" ? "text-white" : mbtiColors[mbtiType].text.replace("text-", "text-")} font-bold px-2 py-1 rounded-full text-sm shadow-md border-2 border-white`}
                    >
                      {mbtiType}
                    </div>
                  )}
                </div>

                {/* プロフィール基本情報 */}
                <div className="sm:ml-6 flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold flex flex-wrap items-center justify-center sm:justify-start">
                    {displayName}
                  </h1>
                  <p className="text-gray-500 flex items-center mt-1 justify-center sm:justify-start">
                    <AtSign size={16} className="mr-1" />
                    {userData.handle}
                  </p>
                </div>

                {/* アクションボタン */}
                <div className="mt-4 sm:mt-0 sm:ml-auto flex-shrink-0">
                  {loggedInUserId ? (
                    isOwnProfile ? (
                      <Link href="/profile/edit">
                        <Button className="w-full sm:w-auto gap-2 bg-slate-700 hover:bg-slate-800 text-white border border-slate-600">
                          <Edit2 className="h-4 w-4" />
                          プロフィール編集
                        </Button>
                      </Link>
                    ) : (
                      <FollowButton
                        targetUserId={userData.user_id || userData.id}
                        initialIsFollowing={isFollowing}
                      />
                    )
                  ) : (
                    <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                      ログインするとフォローできます
                    </div>
                  )}
                </div>
              </div>

              {/* フォロー情報 */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <FollowStats
                  userId={userData.user_id || userData.id}
                  handle={userData.handle}
                  followingCount={followingCount}
                  followersCount={followersCount}
                />
              </div>

              {/* プロフィール詳細情報セクション */}
              <div className="space-y-4">
                {/* 自己紹介 */}
                {profile.bio && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <User size={16} className="mr-1.5" />
                      自己紹介
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap break-words overflow-hidden max-w-full">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* プロフィール情報 */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <BadgeCheck size={16} className="mr-1.5 text-indigo-600" />
                    プロフィール情報
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center px-3 py-2 bg-white rounded border border-gray-50">
                      <Calendar size={16} className="mr-1.5 text-gray-500" />
                      <span className="text-sm">
                        登録日: <FormattedDate date={joinDate} />
                      </span>
                    </div>

                    <div className="flex items-center px-3 py-2 bg-white rounded border border-gray-50">
                      <Activity size={16} className="mr-1.5 text-gray-500" />
                      <span className="text-sm">
                        診断回数: {testCount || 0}回
                      </span>
                    </div>
                  </div>
                </div>

                {/* ソーシャルリンク */}
                {(socialLinks.twitter ||
                  socialLinks.instagram ||
                  socialLinks.website) && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Globe size={16} className="mr-1.5" />
                      ソーシャルリンク
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {socialLinks.twitter && (
                        <a
                          href={`https://twitter.com/${socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1.5 bg-white rounded border border-gray-200 text-gray-600 hover:text-blue-400 hover:border-blue-200 transition-colors"
                        >
                          <Twitter size={16} className="mr-1.5" />
                          <span className="text-sm">Twitter</span>
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a
                          href={`https://instagram.com/${socialLinks.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1.5 bg-white rounded border border-gray-200 text-gray-600 hover:text-pink-500 hover:border-pink-200 transition-colors"
                        >
                          <Instagram size={16} className="mr-1.5" />
                          <span className="text-sm">Instagram</span>
                        </a>
                      )}
                      {socialLinks.website && (
                        <a
                          href={socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1.5 bg-white rounded border border-gray-200 text-gray-600 hover:text-green-500 hover:border-green-200 transition-colors"
                        >
                          <Globe size={16} className="mr-1.5" />
                          <span className="text-sm">Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
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
                  <CardHeader className="bg-white border-b border-gray-100">
                    <CardTitle
                      className={`text-lg flex items-center ${mbtiType ? mbtiColors[mbtiType].text : "text-slate-700"}`}
                    >
                      <BadgeCheck
                        className={`mr-2 h-5 w-5 ${typeColor.text}`}
                      />
                      <span className="flex items-center">
                        <span
                          className={`${mbtiType ? `bg-gradient-to-r ${mbtiColors[mbtiType].from} ${mbtiColors[mbtiType].to}` : "bg-gradient-to-r from-slate-700 to-gray-800"} text-white font-bold px-2 py-0.5 rounded mr-2`}
                        >
                          {mbtiType}
                        </span>
                        タイプ情報
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700">
                      <h3 className="font-medium mb-2 text-lg text-slate-700">
                        {typeDescription.name}
                      </h3>
                      <p className="mb-4">{typeDescription.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">
                            強み
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {typeDescription.strengths.map(
                              (strength: string, i: number) => (
                                <li key={i}>{strength}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium text-orange-800 mb-2">
                            弱み
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {typeDescription.weaknesses.map(
                              (weakness: string, i: number) => (
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

              {/* お気に入りMBTIタイプ */}
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
                        {profile.bookmarked_types.map((type: string) => {
                          const typeKey = type as MBTITypeKey;
                          const typeColor = mbtiColors[typeKey] || {
                            from: "from-slate-700",
                            to: "to-gray-800",
                            text: "text-slate-700",
                            bg: "bg-slate-100",
                          };

                          return (
                            <div
                              key={type}
                              className={`text-center p-3 rounded-lg transition-colors ${typeColor.bg} hover:opacity-90`}
                            >
                              <div
                                className={`font-bold text-lg ${typeKey === "ISTJ" ? "text-white" : typeColor.text}`}
                              >
                                {type}
                              </div>
                              <div
                                className={`text-xs ${typeKey === "ISTJ" ? "text-gray-200" : typeColor.text.replace("800", "700")}`}
                              >
                                {typeDescriptions[typeKey]?.name || ""}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            <TabsContent value="posts">
              <div className="text-center py-12 text-gray-500">
                <p>投稿機能は準備中です</p>
              </div>
            </TabsContent>

            <TabsContent value="test">
              {/* 診断結果 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-slate-600" />
                    診断結果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {latestTestResult ? (
                    <div>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium flex items-center">
                            最新の診断結果:
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {latestTestResult.mbti_type}
                            </span>
                            <FormattedDate
                              date={latestTestResult.created_at}
                              className="text-xs text-gray-500"
                            />
                          </span>
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
          className="bg-slate-600 h-full"
          style={{ width: `${100 - percentage}%` }}
        ></div>
        <div
          className="bg-slate-400 h-full"
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
