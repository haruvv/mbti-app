"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  className?: string;
};

export function PageContainer({
  children,
  maxWidth = "3xl",
  className = "",
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>

      <div
        className={`container mx-auto max-w-${maxWidth} pt-12 pb-16 relative z-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
