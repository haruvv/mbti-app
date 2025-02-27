import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/app/_actions/profile";

// 省略...

const { user } = useUser();
const [handle, setHandle] = useState("");

useEffect(() => {
  const fetchProfile = async () => {
    if (user) {
      const { data } = await getUserProfile(user.id);
      setHandle(data?.handle || user.id);
    }
  };

  fetchProfile();
}, [user]);

// リンクを変更
<Link href={`/profile/${handle}`} className="...">
  プロフィールを見る
</Link>;
