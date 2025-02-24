import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/_actions/profile";
import { getTestResults } from "@/app/_actions/test";
import { typeDescriptions } from "@/app/data/mbtiTypes";
import { ProfileForm } from "./ProfileForm";

export default async function EditProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await getUserProfile(user.id);
  const { data: results } = await getTestResults();

  // 過去の診断結果からMBTIタイプの選択肢を作成（重複を除去）
  const mbtiOptions = results
    ? Array.from(new Set(results.map((result) => result.mbti_type))).map(
        (type) => ({
          type,
          title: typeDescriptions[type].title,
        })
      )
    : [];

  if (profileError) {
    // エラー処理は簡潔に
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
                preferredMbti: profile?.preferred_mbti || "",
              }}
              mbtiOptions={mbtiOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
