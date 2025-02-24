"use client";

import { useSearchParams } from "next/navigation";

const typeDescriptions = {
  ENTJ: {
    title: "指揮官型",
    description:
      "生まれながらのリーダー。合理的で決断力があり、効率性を追求します。複雑な問題を解決する能力に優れ、目標達成のために組織を導きます。",
  },
  ENTP: {
    title: "討論者型",
    description:
      "独創的で知的好奇心が旺盛。新しいアイデアを生み出す才能があり、論理的な討論を好みます。型破りな発想で常識を打ち破ります。",
  },
  INTJ: {
    title: "建築家型",
    description:
      "戦略的思考に優れた天才型。長期的なビジョンを描き、複雑なシステムを構築します。知識の追求に情熱を注ぎます。",
  },
  INTP: {
    title: "論理学者型",
    description:
      "理論的で分析的な思考者。物事の原理を解明することに喜びを感じます。独創的なアイデアで技術革新を推進します。",
  },
  ENFJ: {
    title: "主人公型",
    description:
      "カリスマ性あふれる指導者。他人の可能性を引き出す才能があり、チームの調和を重視します。社会貢献への情熱が強いです。",
  },
  ENFP: {
    title: "広報運動家型",
    description:
      "自由奔放なアイデアマン。可能性に満ちた世界を夢見て、人々をインスパイアします。社交的で創造性が豊かです。",
  },
  INFJ: {
    title: "提唱者型",
    description:
      "理想主義的なビジョナリー。深い洞察力で人間性を理解し、社会をより良くするために行動します。神秘的なオーラを持ちます。",
  },
  INFP: {
    title: "仲介者型",
    description:
      "情熱的な理想主義者。共感力が高く、内面的な価値観を大切にします。創造的な表現を通じて世界に貢献します。",
  },
  ESTJ: {
    title: "管理者型",
    description:
      "有能な組織運営者。伝統と秩序を重んじ、効率的なシステムを構築します。責任感が強く実務能力に優れます。",
  },
  ESFJ: {
    title: "領事官型",
    description:
      "献身的な援助者。周囲との調和を大切にし、実践的な方法で人々を支えます。社会的責任を果たすことに喜びを感じます。",
  },
  ISTJ: {
    title: "堅実家型",
    description:
      "信頼性の高い実務家。事実と経験を重視し、正確に仕事を遂行します。伝統を守り、責任を果たすことを誇りとします。",
  },
  ISFJ: {
    title: "擁護者型",
    description:
      "献身的な保護者。控えめながらも深い共感力で人を支えます。細やかな気配りと持続的な支援を得意とします。",
  },
  ESTP: {
    title: "起業家型",
    description:
      "機転の利く現実主義者。臨機応変に行動し、即座に結果を出します。リスクを恐れず、現実的な問題解決が得意です。",
  },
  ESFP: {
    title: "エンターテイナー型",
    description:
      "陽気なムードメーカー。周囲を楽しませる才能があり、その場の空気を明るくします。五感で感じる現実を大切にします。",
  },
  ISTP: {
    title: "巨匠型",
    description:
      "実用的な問題解決者。機械システムの理解に優れ、即座に適切な対応ができます。自由と自立を何より尊びます。",
  },
  ISFP: {
    title: "冒険家型",
    description:
      "感受性豊かな芸術家。現在の瞬間を大切にし、美的感覚を通じて自己表現します。柔軟でオープンマインドな性質です。",
  },
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as keyof typeof typeDescriptions;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {typeDescriptions[type].title}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 leading-relaxed">
          {typeDescriptions[type].description}
        </p>
        <div className="mt-8 grid grid-cols-4 gap-4 text-center">
          {type.split("").map((letter, index) => (
            <div key={index} className="p-3 bg-blue-100 rounded">
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
