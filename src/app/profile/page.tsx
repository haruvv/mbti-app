import { currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { UsernameForm } from "./UsernameForm";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>ログインが必要です</p>
      </div>
    );
  }

  const supabase = await createClerkSupabaseClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {profile?.username || "ユーザー"}
              </h1>
              <UsernameForm
                clerkId={user.id}
                currentUsername={profile?.username || ""}
              />
            </div>
            <p className="text-gray-600">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">プロフィール情報</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">ユーザーID</p>
                <p className="font-mono text-sm">{profile?.clerk_id}</p>
              </div>
              <div>
                <p className="text-gray-600">作成日</p>
                <p>
                  {new Date(profile?.created_at).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">アカウント設定</h2>
            <div className="space-y-2">
              <button className="text-blue-600 hover:text-blue-800">
                メールアドレスを変更
              </button>
              <button className="text-blue-600 hover:text-blue-800 block">
                パスワードを変更
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
