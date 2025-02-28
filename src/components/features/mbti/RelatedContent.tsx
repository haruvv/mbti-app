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
      className="mt-8 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        もっと自分について知りたいですか？
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/test/about">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
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
