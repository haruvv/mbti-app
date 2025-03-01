import React from "react";
import { MBTITypeKey } from "@/types/mbti";
import { BookOpen } from "lucide-react";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import { motion } from "framer-motion";

interface LearningStyleProps {
  type: MBTITypeKey;
}

export function LearningStyle({ type }: LearningStyleProps) {
  const learningStyle = {
    preferred: type.includes("N")
      ? "概念的な学習を好み、パターンや関連性を見つけることに長けています。"
      : "具体的で実用的な学習を好み、実践を通じて理解を深めます。",
    environment: type.includes("I")
      ? "静かな環境で集中して学ぶことで最大の効果を発揮します。"
      : "他者との対話や議論を通じて学ぶことで理解が深まります。",
    challenges: type.includes("P")
      ? "柔軟性がある反面、締め切りや構造化された学習には苦戦することがあります。"
      : "計画的に学習できる反面、予期せぬ変更に適応するのに時間がかかることがあります。",
  };

  return (
    <ContentCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-green-800">
          <BookOpen className="mr-2 h-5 w-5" />
          学習スタイル
        </h3>
        <div className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg border border-green-100">
            <div className="font-semibold mb-2 text-green-700">
              好みの学習方法
            </div>
            <p>{learningStyle.preferred}</p>
          </div>
          <div className="bg-white/50 p-4 rounded-lg border border-green-100">
            <div className="font-semibold mb-2 text-green-700">
              理想的な学習環境
            </div>
            <p>{learningStyle.environment}</p>
          </div>
          <div className="bg-white/50 p-4 rounded-lg border border-green-100">
            <div className="font-semibold mb-2 text-green-700">
              学習における課題
            </div>
            <p>{learningStyle.challenges}</p>
          </div>
        </div>
      </motion.div>
    </ContentCard>
  );
}
