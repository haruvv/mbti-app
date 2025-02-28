import React from "react";
import { MBTITypeKey, typeDescriptions } from "@/app/data/mbtiTypes";
import { getTypeColorClass } from "@/app/data/mbtiColors";

interface TypeCardProps {
  type: MBTITypeKey;
  title: string;
  large?: boolean;
}

export function TypeCard({ type, title, large = false }: TypeCardProps) {
  const typeData = typeDescriptions[type];
  const colorClass = getTypeColorClass(type);

  return (
    <div
      className={`rounded-xl border ${colorClass} p-4 text-center ${
        large ? "py-8" : ""
      }`}
    >
      <div className="font-mono font-bold text-2xl mb-2">{type}</div>
      <div className={large ? "text-xl font-medium" : "font-medium"}>
        {title}
      </div>
      {large && typeData && (
        <div className="mt-4 text-sm">
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="text-left">
              <span className="font-semibold">エネルギーの方向:</span>{" "}
              {type.startsWith("E") ? "外向型" : "内向型"}
            </div>
            <div className="text-left">
              <span className="font-semibold">情報収集:</span>{" "}
              {type.includes("S") ? "現実的" : "直感的"}
            </div>
            <div className="text-left">
              <span className="font-semibold">判断の仕方:</span>{" "}
              {type.includes("T") ? "論理的" : "感情的"}
            </div>
            <div className="text-left">
              <span className="font-semibold">行動スタイル:</span>{" "}
              {type.includes("J") ? "計画的" : "柔軟的"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
