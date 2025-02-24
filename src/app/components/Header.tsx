import { getUserProfile } from "@/app/_actions/profile";

export async function Header() {
  const user = await currentUser();
  if (!user) return null;

  // プロフィール情報を取得
  const { data: profile } = await getUserProfile(user.id);
  const imageUrl = profile?.custom_image_url || user.imageUrl;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="text-xl font-bold text-gray-800">
            MBTI App
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-8 h-8">
                <Image
                  src={imageUrl}
                  alt="プロフィール"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {profile?.display_name || user.firstName || "ゲスト"}
              </span>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
