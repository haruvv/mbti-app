import { DebugPanel } from "@/components/debug/DebugPanel";

// 既存のインポートと定数はそのまま
// ...

export default async function TestResultsPage() {
  // 既存のコード...

  // デバッグデータを準備
  const debugData = {
    results: testResults,
    user: userData,
  };

  return (
    <div className="container mx-auto py-8">
      {/* デバッグパネル */}
      <DebugPanel data={debugData} />

      {/* 既存のコンテンツは変更なし */}
    </div>
  );
}
