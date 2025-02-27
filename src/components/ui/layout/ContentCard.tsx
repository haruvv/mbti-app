"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ContentCardProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function ContentCard({
  children,
  delay = 0.2,
  className = "",
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-50 p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
