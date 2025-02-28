import { useUserContext } from "@/contexts/UserContext";
import Link from "next/link";
import { User } from "lucide-react";

export function UserMenu() {
  const { handle, isHandleLoading } = useUserContext();

  return (
    <div className="flex flex-col space-y-1 p-2">
      <Link
        href={`/profile/${handle}`}
        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
        aria-disabled={isHandleLoading}
      >
        <User className="w-4 h-4 mr-2" />
        プロフィール
      </Link>
    </div>
  );
}
