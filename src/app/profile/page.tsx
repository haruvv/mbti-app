"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useTestResult } from "@/hooks/useTestResult";
import MBTITypeDisplay from "@/components/MBTITypeDisplay";

export default function ProfilePage() {
  const { user } = useUser();
  const { getTestHistory } = useTestResult();
  const [testHistory, setTestHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getTestHistory();
      setTestHistory(history);
    };
    loadHistory();
  }, []);

  if (!user) return null;

  const latestType = testHistory[0]?.mbti_type;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">マイプロフィール</h1>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                プロフィール情報
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  名前: {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-600">
                  メール: {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            {latestType && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  あなたのタイプ
                </h2>
                <MBTITypeDisplay type={latestType} />
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                診断履歴
              </h2>
              {testHistory.length > 0 ? (
                <div className="space-y-4">
                  {testHistory.map((result) => (
                    <div
                      key={result.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-600">
                          {result.mbti_type}
                        </span>
                        <span className="text-gray-500">
                          {new Date(result.taken_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">まだ診断履歴がありません</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
