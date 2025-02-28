import { useUserContext } from "@/contexts/UserContext";
import Link from "next/link";
import { User } from "lucide-react";

export function Navbar() {
  const { handle, isHandleLoading } = useUserContext();

  return (
    <Link
      href={`/profile/${handle}`}
      className="flex items-center"
      aria-disabled={isHandleLoading}
    >
      <User className="mr-2 h-5 w-5" />
      マイページ
    </Link>
  );
}
