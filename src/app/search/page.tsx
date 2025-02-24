import { UserSearch } from "@/components/features/search/UserSearch";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ユーザー検索</h1>
      <UserSearch />
    </div>
  );
}
