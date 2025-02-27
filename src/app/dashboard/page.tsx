import { currentUser } from "@clerk/nextjs/server";
import { getUserProfile } from "@/app/_actions/profile";

// 省略...

const user = await currentUser();
const { data: profileData } = await getUserProfile(user.id);
const handle = profileData?.handle || user.id;

// リンクを変更
<Link
  href={`/profile/${handle}`}
  className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
>
  <User className="mr-2 h-4 w-4" />
  マイページを見る
</Link>;
