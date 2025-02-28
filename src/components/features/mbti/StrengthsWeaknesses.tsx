import React from "react";
import { MBTITypeKey, typeDescriptions } from "@/app/data/mbtiTypes";
import { CheckCircle, AlertCircle } from "lucide-react";
import { ContentCard } from "@/components/ui/layout/ContentCard";
import { motion } from "framer-motion";

interface StrengthsWeaknessesProps {
  type: MBTITypeKey;
}

export function StrengthsWeaknesses({ type }: StrengthsWeaknessesProps) {
  const typeData = typeDescriptions[type];

  if (!typeData) return null;

  return (
    <ContentCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-emerald-800">
              <CheckCircle className="mr-2 h-5 w-5" />
              強み
            </h3>
            <ul className="space-y-2">
              {typeData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-800">
              <AlertCircle className="mr-2 h-5 w-5" />
              課題
            </h3>
            <ul className="space-y-2">
              {typeData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </ContentCard>
  );
}
