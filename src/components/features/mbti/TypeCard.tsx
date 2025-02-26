import React from "react";
import { MBTITypeKey, typeDescriptions } from "@/app/data/mbtiTypes";

interface TypeCardProps {
  type: MBTITypeKey;
  title: string;
  large?: boolean;
}

export function TypeCard({ type, title, large = false }: TypeCardProps) {
  const typeData = typeDescriptions[type];
  const colorClass =
    {
      ISTJ: "bg-blue-100 text-blue-800 border-blue-200",
      ISFJ: "bg-green-100 text-green-800 border-green-200",
      INFJ: "bg-purple-100 text-purple-800 border-purple-200",
      INTJ: "bg-indigo-100 text-indigo-800 border-indigo-200",
      ISTP: "bg-cyan-100 text-cyan-800 border-cyan-200",
      ISFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
      INFP: "bg-violet-100 text-violet-800 border-violet-200",
      INTP: "bg-blue-100 text-blue-800 border-blue-200",
      ESTP: "bg-orange-100 text-orange-800 border-orange-200",
      ESFP: "bg-amber-100 text-amber-800 border-amber-200",
      ENFP: "bg-pink-100 text-pink-800 border-pink-200",
      ENTP: "bg-rose-100 text-rose-800 border-rose-200",
      ESTJ: "bg-red-100 text-red-800 border-red-200",
      ESFJ: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ENFJ: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
      ENTJ: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }[type] || "bg-gray-100 text-gray-800 border-gray-200";

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
