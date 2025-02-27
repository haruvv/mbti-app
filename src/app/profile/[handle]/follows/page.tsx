import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "@/components/features/follows/FollowButton";
import { Tabs } from "@/components/ui/tabs";

export default async function UserFollowsPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { handle } = await params;
  const { tab = "following" } = await searchParams;

  const supabase = createClient();
  const { userId: clerkUserId } = await auth();

  // ユーザー情報の取得
  const { data: user, error } = await supabase
    .from("user_profiles")
    .select("user_id, handle")
    .eq("handle", handle)
    .single();

  if (error || !user) {
    console.error("User fetch error:", error);
    notFound();
  }

  // 現在のユーザーIDを取得
  let currentUserId = null;
  if (clerkUserId) {
    const { data: currentUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (currentUser) {
      currentUserId = currentUser.id;
    }
  }

  // フォロー/フォロワーの取得
  let followData: any[] = [];
  let totalCount = 0;

  // デバッグ用にパラメータを表示
  console.log("RPC params:", {
    p_user_id: user.user_id,
    p_type: tab,
    p_limit: 50,
    p_offset: 0,
  });

  const { data: followResult, error: followError } = await supabase.rpc(
    "get_user_follows",
    {
      p_user_id: user.user_id,
      p_type: tab,
      p_limit: 50,
      p_offset: 0,
    }
  );

  if (followError) {
    console.error("Follow data fetch error:", followError);
  }

  // デバッグ用に結果を表示
  console.log("Follow result:", followResult);

  if (followResult) {
    followData = followResult.users || [];
    totalCount = followResult.total_count || 0;

    // フォロー状態を確認
    if (currentUserId && followData && followData.length > 0) {
      const { data: followingData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const followingIds = followingData?.map((f) => f.following_id) || [];

      // フォロー状態を各ユーザーに追加
      followData.forEach((user) => {
        user.is_following = followingIds.includes(user.id);
      });
    }
  }

  // タブの設定
  const tabs = [
    {
      id: "following",
      label: "フォロー中",
      href: `/profile/${handle}/follows?tab=following`,
      isActive: tab === "following",
    },
    {
      id: "followers",
      label: "フォロワー",
      href: `/profile/${handle}/follows?tab=followers`,
      isActive: tab === "followers",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Link
                href={`/profile/${handle}`}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold">
                @{handle}の{tab === "following" ? "フォロー" : "フォロワー"}
              </h1>
            </div>

            <Tabs tabs={tabs} />

            <div className="mt-6">
              {!followData || followData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {tab === "following"
                    ? "まだ誰もフォローしていません"
                    : "まだフォロワーがいません"}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {followData.map((followUser) => (
                    <li
                      key={followUser.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <Link
                        href={`/profile/${followUser.handle}`}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={
                              followUser.custom_image_url ||
                              "/default-avatar.png"
                            }
                            alt={
                              followUser.profile_display_name ||
                              followUser.display_name ||
                              followUser.handle
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {followUser.profile_display_name ||
                              followUser.display_name ||
                              `@${followUser.handle}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{followUser.handle}
                          </p>
                        </div>
                      </Link>

                      {/* 自分自身でない場合のみフォローボタンを表示 */}
                      {currentUserId && currentUserId !== followUser.id && (
                        <FollowButton
                          userId={followUser.id}
                          initialIsFollowing={followUser.is_following || false}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
