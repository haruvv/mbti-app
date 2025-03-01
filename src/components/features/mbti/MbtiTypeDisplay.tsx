import React from "react";
import { MBTITypeKey } from "@/types/mbti";
import { motion } from "framer-motion";

interface MbtiTypeDisplayProps {
  type: MBTITypeKey;
  title: string;
  description?: string;
}

export function MbtiTypeDisplay({
  type,
  title,
  description,
}: MbtiTypeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-center gap-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="text-sm text-gray-500">({type})</div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className={`text-center typeColor.bg rounded-lg p-3`}>
          <div className="text-2xl font-bold">{type.charAt(0)}</div>
          <div className="text-xs mt-1">
            {type.charAt(0) === "I" ? "内向型" : "外向型"}
          </div>
        </div>
        <div className={`text-center typeColor.bg rounded-lg p-3`}>
          <div className="text-2xl font-bold">{type.charAt(1)}</div>
          <div className="text-xs mt-1">
            {type.charAt(1) === "S" ? "現実的" : "直感的"}
          </div>
        </div>
        <div className={`text-center typeColor.bg rounded-lg p-3`}>
          <div className="text-2xl font-bold">{type.charAt(2)}</div>
          <div className="text-xs mt-1">
            {type.charAt(2) === "T" ? "論理的" : "感情的"}
          </div>
        </div>
        <div className={`text-center typeColor.bg rounded-lg p-3`}>
          <div className="text-2xl font-bold">{type.charAt(3)}</div>
          <div className="text-xs mt-1">
            {type.charAt(3) === "J" ? "計画的" : "柔軟的"}
          </div>
        </div>
      </div>

      {description && <p className="text-gray-600 mb-6">{description}</p>}
    </motion.div>
  );
}
