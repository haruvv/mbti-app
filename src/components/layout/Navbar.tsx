import { useUser } from "@clerk/nextjs";

const { user } = useUser();
const userHandle = user?.publicMetadata?.handle || user?.id;

// リンクを変更
<Link href={`/profile/${userHandle}`}>
  <User className="mr-2 h-5 w-5" />
  マイページ
</Link>;
