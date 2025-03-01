import React from "react";
import { MBTITypeKey } from "@/app/data/mbtiTypes";
import { Heart } from "lucide-react";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import { motion } from "framer-motion";
import { getCompatibleTypes } from "@/app/_utils/mbtiResult";
import Link from "next/link";
import { mbtiColors } from "@/app/data/mbtiColors";

interface CompatibilityInfoProps {
  type: MBTITypeKey;
}

export function CompatibilityInfo({ type }: CompatibilityInfoProps) {
  const compatibility = getCompatibleTypes(type);

  return (
    <ContentCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-rose-800">
          <Heart className="mr-2 h-5 w-5" />
          相性のいいタイプ
        </h3>
        <p className="mb-4 text-gray-600">
          MBTIタイプには相性の良さがあります。あなたのタイプと相性がよいタイプは以下の通りです。
        </p>

        <div className="mb-6">
          <div className="font-semibold mb-2 text-rose-700">ベストマッチ</div>
          <div className="flex flex-wrap gap-2">
            {compatibility.bestMatch.map((matchType, index) => (
              <Link href={`/types/${matchType.toLowerCase()}`} key={index}>
                <span
                  className={`${mbtiColors[matchType as MBTITypeKey].bg} ${mbtiColors[matchType as MBTITypeKey].text} px-3 py-1 rounded-full text-sm font-medium border ${mbtiColors[matchType as MBTITypeKey].border} hover:shadow-md transition-shadow`}
                >
                  {matchType}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold mb-2 text-rose-700">
            相性の良いタイプ
          </div>
          <div className="flex flex-wrap gap-2">
            {compatibility.goodMatch.map((matchType, index) => (
              <Link href={`/types/${matchType.toLowerCase()}`} key={index}>
                <span
                  className={`bg-white/80 ${mbtiColors[matchType as MBTITypeKey].text} px-3 py-1 rounded-full text-sm font-medium border ${mbtiColors[matchType as MBTITypeKey].border} hover:shadow-md transition-shadow`}
                >
                  {matchType}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white/50 p-4 rounded-lg border border-rose-100 mt-4">
          <div className="font-semibold mb-2 text-rose-700">
            なぜ相性がいいの？
          </div>
          <p>{compatibility.reason}</p>
        </div>
      </motion.div>
    </ContentCard>
  );
}
