import React from "react";
import { MBTITypeKey } from "@/app/data/mbtiTypes";
import { Users, Heart } from "lucide-react";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import { motion } from "framer-motion";

interface RelationshipInfoProps {
  type: MBTITypeKey;
}

export function RelationshipInfo({ type }: RelationshipInfoProps) {
  const relationshipInfo = {
    communication: type.includes("E")
      ? "会話を通じて考えを整理する傾向があり、活発なディスカッションを好みます。"
      : "内省的で、発言する前に考えをまとめる傾向があります。",
    conflict: type.includes("T")
      ? "論理的アプローチで問題解決を図り、感情より事実を重視します。"
      : "人間関係の調和を重視し、皆が満足する解決策を探します。",
    teamwork: type.includes("J")
      ? "計画的で構造化されたチーム環境を好み、明確な目標と締め切りを設定します。"
      : "柔軟性を重視し、状況に応じて計画を調整することを好みます。",
  };

  return (
    <ContentCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-800">
          <Users className="mr-2 h-5 w-5" />
          対人関係の特徴
        </h3>
        <div className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg border border-indigo-100">
            <div className="font-semibold mb-2 text-indigo-700">
              コミュニケーションスタイル
            </div>
            <p>{relationshipInfo.communication}</p>
          </div>
          <div className="bg-white/50 p-4 rounded-lg border border-indigo-100">
            <div className="font-semibold mb-2 text-indigo-700">対立解決</div>
            <p>{relationshipInfo.conflict}</p>
          </div>
          <div className="bg-white/50 p-4 rounded-lg border border-indigo-100">
            <div className="font-semibold mb-2 text-indigo-700">
              チームワーク
            </div>
            <p>{relationshipInfo.teamwork}</p>
          </div>
        </div>
      </motion.div>
    </ContentCard>
  );
}
