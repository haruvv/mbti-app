import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/_actions/profile";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { getTestResults } from "@/app/_actions/test";
import { ProfileForm } from "./ProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await getUserProfile(user.id);
  const { data: results } = await getTestResults();

  // 最新の診断結果を取得
  const latestResult = results && results.length > 0 ? results[0] : null;

  // 全てのMBTIタイプを選択肢として使用
  const mbtiOptions = Object.entries(typeDescriptions).map(([type, data]) => ({
    type,
    title: data.title,
  }));

  // getUserProfileの呼び出し後に、usersテーブルからhandleも取得
  const supabase = createClient();
  const { data: userData } = await supabase
    .from("users")
    .select("handle")
    .eq("clerk_id", user.id)
    .single();

  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="container mx-auto max-w-2xl pt-8">
          <div className="bg-white rounded-xl p-6 text-red-600">
            プロフィールの取得に失敗しました。
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="glass-effect rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-white">プロフィール設定</h1>
          </div>
          <div className="p-6">
            <ProfileForm
              userId={user.id}
              initialData={{
                displayName: profile?.display_name || "",
                imageUrl: profile?.custom_image_url || user.imageUrl,
                preferredMbti: latestResult?.mbti_type || null,
                bio: profile?.bio || "",
                bookmarkedTypes: profile?.bookmarked_types || [],
                handle: userData?.handle || "",
              }}
              mbtiOptions={mbtiOptions}
              latestMbtiType={latestResult?.mbti_type || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
