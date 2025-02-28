import { typeDescriptions } from "../data/mbtiTypes";
import { TypeCard } from "@/components/features/mbti/TypeCard";
import Link from "next/link";

export default function TypesPage() {
  // MBTIタイプのグループ
  const groups = {
    analysts: ["INTJ", "INTP", "ENTJ", "ENTP"],
    diplomats: ["INFJ", "INFP", "ENFJ", "ENFP"],
    sentinels: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    explorers: ["ISTP", "ISFP", "ESTP", "ESFP"],
  };

  const groupTitles = {
    analysts: "分析家タイプ",
    diplomats: "外交官タイプ",
    sentinels: "管理者タイプ",
    explorers: "探検家タイプ",
  };

  const groupDescriptions = {
    analysts: "論理的で戦略的な思考を持ち、複雑な問題解決を得意とするタイプ",
    diplomats: "共感力が高く、人間関係を重視し、理想を追求するタイプ",
    sentinels: "責任感が強く、秩序と安定を重んじる実務的なタイプ",
    explorers: "柔軟で適応力があり、実践的なスキルに長けているタイプ",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 p-4 animate-gradient-x">
      <div className="container mx-auto max-w-6xl pt-8 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">MBTIタイプ一覧</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            MBTIは16の性格タイプに分類され、それぞれに特徴的な強みや弱み、行動パターンがあります。
            あなたに合ったタイプを見つけて、自己理解を深めましょう。
          </p>
        </div>

        {Object.entries(groups).map(([groupKey, types]) => (
          <div key={groupKey} className="mb-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {groupTitles[groupKey as keyof typeof groupTitles]}
              </h2>
              <p className="text-gray-600">
                {groupDescriptions[groupKey as keyof typeof groupDescriptions]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {types.map((type) => (
                <Link
                  key={type}
                  href={`/types/${type.toLowerCase()}`}
                  className="group transition-transform hover:-translate-y-1"
                >
                  <TypeCard type={type} title={typeDescriptions[type].title} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
