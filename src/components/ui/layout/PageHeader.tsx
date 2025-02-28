"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  tip?: string;
  icon?: LucideIcon;
  delay?: number;
};

export function PageHeader({
  title,
  subtitle,
  tip,
  icon: Icon,
  delay = 0,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="text-center mb-8"
    >
      {Icon && (
        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon className="h-7 w-7 text-white" />
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 text-center mb-2 max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
      {tip && (
        <p className="text-sm text-teal-600 text-center font-medium">{tip}</p>
      )}
    </motion.div>
  );
}
