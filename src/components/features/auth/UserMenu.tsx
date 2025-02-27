import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/app/_actions/profile";
import Link from "next/link";
import { User } from "lucide-react";

export function UserMenu() {
  const { user } = useUser();
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const { data } = await getUserProfile(user.id);
          setHandle(data?.handle || user.id);
        } catch (error) {
          console.error("プロフィール取得エラー:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="flex flex-col space-y-1 p-2">
      <Link
        href={`/profile/${handle}`}
        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
        aria-disabled={isLoading}
      >
        <User className="w-4 h-4 mr-2" />
        プロフィール
      </Link>
    </div>
  );
}
