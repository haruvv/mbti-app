import { MBTITypeKey } from "./mbtiTypes";

// MBTIタイプごとの色定義のインターフェース
export interface MBTITypeColor {
  from: string; // グラデーション開始色
  to: string; // グラデーション終了色
  text: string; // テキスト色
  bg: string; // 背景色
  border: string; // ボーダー色
}

// MBTIタイプごとの色定義（落ち着いた色合いに調整）
export const mbtiColors: Record<MBTITypeKey, MBTITypeColor> = {
  // 分析家タイプ - 紫系（柔らかなパステルパープル）
  INTJ: {
    from: "from-purple-300",
    to: "to-purple-200",
    text: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  INTP: {
    from: "from-purple-400",
    to: "to-purple-300",
    text: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  ENTJ: {
    from: "from-purple-500",
    to: "to-purple-400",
    text: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-200",
  },
  ENTP: {
    from: "from-purple-600",
    to: "to-purple-500",
    text: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-200",
  },

  // 外交官タイプ - 緑系（柔らかなパステルグリーン）
  INFJ: {
    from: "from-green-300",
    to: "to-green-200",
    text: "text-green-800",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  INFP: {
    from: "from-green-400",
    to: "to-green-300",
    text: "text-green-800",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  ENFJ: {
    from: "from-green-500",
    to: "to-green-400",
    text: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-200",
  },
  ENFP: {
    from: "from-green-600",
    to: "to-green-500",
    text: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-200",
  },

  // 管理者タイプ - 青系（柔らかなパステルブルー）
  ISTJ: {
    from: "from-blue-300",
    to: "to-blue-200",
    text: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  ISFJ: {
    from: "from-blue-400",
    to: "to-blue-300",
    text: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  ESTJ: {
    from: "from-blue-500",
    to: "to-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  ESFJ: {
    from: "from-blue-600",
    to: "to-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },

  // 探検家タイプ - 黄色/オレンジ系（柔らかなパステルオレンジ＆イエロー）
  ISTP: {
    from: "from-orange-300",
    to: "to-orange-200",
    text: "text-orange-800",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  ISFP: {
    from: "from-orange-400",
    to: "to-orange-300",
    text: "text-orange-800",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  ESTP: {
    from: "from-yellow-300",
    to: "to-yellow-200",
    text: "text-yellow-800",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  ESFP: {
    from: "from-yellow-400",
    to: "to-yellow-300",
    text: "text-yellow-800",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
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
