import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function RelatedContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8 bg-gray-50 bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
        もっと自分について知りたいですか？
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/test/about">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
            MBTIについてもっと学ぶ <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/types">
          <Button variant="outline">他のタイプを探索する</Button>
        </Link>
      </div>
    </motion.div>
  );
}
