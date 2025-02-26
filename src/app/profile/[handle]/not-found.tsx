import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">ユーザーが見つかりません</h1>
      <p className="text-lg mb-8">
        お探しのユーザープロフィールは存在しないか、削除された可能性があります。
      </p>
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
