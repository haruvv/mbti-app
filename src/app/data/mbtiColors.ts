import { MBTITypeKey } from "./mbtiTypes";

// MBTIタイプごとの色定義のインターフェース
export interface MBTITypeColor {
  from: string; // グラデーション開始色
  to: string; // グラデーション終了色
  text: string; // テキスト色
  bg: string; // 背景色
  border: string; // ボーダー色
}

// MBTIタイプごとの色定義
export const mbtiColors: Record<MBTITypeKey, MBTITypeColor> = {
  // 分析家タイプ
  INTJ: {
    from: "from-indigo-600",
    to: "to-indigo-800",
    text: "text-indigo-800",
    bg: "bg-indigo-100",
    border: "border-indigo-200",
  },
  INTP: {
    from: "from-blue-600",
    to: "to-blue-800",
    text: "text-blue-800",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  ENTJ: {
    from: "from-indigo-600",
    to: "to-indigo-800",
    text: "text-indigo-800",
    bg: "bg-indigo-100",
    border: "border-indigo-200",
  },
  ENTP: {
    from: "from-rose-600",
    to: "to-rose-800",
    text: "text-rose-800",
    bg: "bg-rose-100",
    border: "border-rose-200",
  },

  // 外交官タイプ
  INFJ: {
    from: "from-purple-600",
    to: "to-purple-800",
    text: "text-purple-800",
    bg: "bg-purple-100",
    border: "border-purple-200",
  },
  INFP: {
    from: "from-violet-600",
    to: "to-violet-800",
    text: "text-violet-800",
    bg: "bg-violet-100",
    border: "border-violet-200",
  },
  ENFJ: {
    from: "from-fuchsia-600",
    to: "to-fuchsia-800",
    text: "text-fuchsia-800",
    bg: "bg-fuchsia-100",
    border: "border-fuchsia-200",
  },
  ENFP: {
    from: "from-pink-600",
    to: "to-pink-800",
    text: "text-pink-800",
    bg: "bg-pink-100",
    border: "border-pink-200",
  },

  // 管理者タイプ
  ISTJ: {
    from: "from-black",
    to: "to-gray-800",
    text: "text-white",
    bg: "bg-black",
    border: "border-black",
  },
  ISFJ: {
    from: "from-green-600",
    to: "to-green-800",
    text: "text-green-800",
    bg: "bg-green-100",
    border: "border-green-200",
  },
  ESTJ: {
    from: "from-red-600",
    to: "to-red-800",
    text: "text-red-800",
    bg: "bg-red-100",
    border: "border-red-200",
  },
  ESFJ: {
    from: "from-yellow-600",
    to: "to-yellow-800",
    text: "text-yellow-800",
    bg: "bg-yellow-100",
    border: "border-yellow-200",
  },

  // 探検家タイプ
  ISTP: {
    from: "from-cyan-600",
    to: "to-cyan-800",
    text: "text-cyan-800",
    bg: "bg-cyan-100",
    border: "border-cyan-200",
  },
  ISFP: {
    from: "from-emerald-600",
    to: "to-emerald-800",
    text: "text-emerald-800",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
  },
  ESTP: {
    from: "from-orange-600",
    to: "to-orange-800",
    text: "text-orange-800",
    bg: "bg-orange-100",
    border: "border-orange-200",
  },
  ESFP: {
    from: "from-amber-600",
    to: "to-amber-800",
    text: "text-amber-800",
    bg: "bg-amber-100",
    border: "border-amber-200",
  },
};

// カラークラスを生成するユーティリティ関数
export function getTypeColorClass(type: MBTITypeKey): string {
  const color = mbtiColors[type];
  return `${color.bg} ${color.text} ${color.border}`;
}

// グラデーションクラスを生成するユーティリティ関数
export function getTypeGradientClass(type: MBTITypeKey): string {
  const color = mbtiColors[type];
  return `bg-gradient-to-r ${color.from} ${color.to}`;
}
