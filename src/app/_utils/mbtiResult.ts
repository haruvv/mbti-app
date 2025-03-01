import { typeDescriptions } from "@/app/data/mbtiTypes";
import { MBTITypeKey } from "@/types/mbti";

// MBTIタイプの詳細データを取得する
export function getTypeDescription(mbtiType: string) {
  if (!mbtiType || !typeDescriptions[mbtiType as MBTITypeKey]) {
    return null;
  }
  return typeDescriptions[mbtiType as MBTITypeKey];
}

// 関連するキャリアオプションを取得する（例の関数）
export function getCareerOptions(mbtiType: MBTITypeKey) {
  const careerSuggestions = {
    // 分析家タイプ
    INTJ: [
      "研究者",
      "システムアナリスト",
      "科学者",
      "エンジニア",
      "プログラマー",
    ],
    INTP: [
      "ソフトウェア開発者",
      "数学者",
      "教授",
      "科学者",
      "システムアナリスト",
    ],
    ENTJ: ["経営者", "起業家", "弁護士", "コンサルタント", "政治家"],
    ENTP: ["起業家", "弁護士", "マーケター", "発明家", "エンジニア"],

    // 外交官タイプ
    INFJ: ["カウンセラー", "心理学者", "作家", "教師", "芸術家"],
    INFP: ["作家", "カウンセラー", "社会福祉士", "心理学者", "アーティスト"],
    ENFJ: ["教師", "カウンセラー", "コーチ", "人事マネージャー", "セラピスト"],
    ENFP: [
      "ジャーナリスト",
      "カウンセラー",
      "コンサルタント",
      "マーケター",
      "イベントプランナー",
    ],

    // 管理者タイプ
    ISTJ: ["会計士", "プロジェクトマネージャー", "軍人", "警察官", "法律関係"],
    ISFJ: ["看護師", "教師", "福祉士", "事務員", "カスタマーサービス"],
    ESTJ: ["マネージャー", "軍人", "銀行員", "行政官", "警察官"],
    ESFJ: ["教師", "看護師", "カウンセラー", "ソーシャルワーカー", "人事担当"],

    // 探検家タイプ
    ISTP: ["技術者", "パイロット", "機械工", "法執行官", "エンジニア"],
    ISFP: ["アーティスト", "デザイナー", "音楽家", "フローリスト", "看護師"],
    ESTP: ["起業家", "営業担当", "マーケター", "警察官", "消防士"],
    ESFP: [
      "エンターテイナー",
      "イベントプランナー",
      "セールスパーソン",
      "ツアーガイド",
      "フィットネスインストラクター",
    ],
  };

  return careerSuggestions[mbtiType] || [];
}

// 対人関係の情報を取得する
export function getRelationshipInfo(mbtiType: string) {
  return {
    communication: mbtiType.includes("E")
      ? "会話を通じて考えを整理する傾向があり、活発なディスカッションを好みます。"
      : "内省的で、発言する前に考えをまとめる傾向があります。",
    conflict: mbtiType.includes("T")
      ? "論理的アプローチで問題解決を図り、感情より事実を重視します。"
      : "人間関係の調和を重視し、皆が満足する解決策を探します。",
    teamwork: mbtiType.includes("J")
      ? "計画的で構造化されたチーム環境を好み、明確な目標と締め切りを設定します。"
      : "柔軟性を重視し、状況に応じて計画を調整することを好みます。",
  };
}

// 学習スタイルの情報を取得する
export function getLearningStyle(mbtiType: string) {
  return {
    preferred: mbtiType.includes("N")
      ? "概念的な学習を好み、パターンや関連性を見つけることに長けています。"
      : "具体的で実用的な学習を好み、実践を通じて理解を深めます。",
    environment: mbtiType.includes("I")
      ? "静かな環境で集中して学ぶことで最大の効果を発揮します。"
      : "他者との対話や議論を通じて学ぶことで理解が深まります。",
    challenges: mbtiType.includes("P")
      ? "柔軟性がある反面、締め切りや構造化された学習には苦戦することがあります。"
      : "計画的に学習できる反面、予期せぬ変更に適応するのに時間がかかることがあります。",
  };
}

// 相性のいいMBTIタイプを取得する
export function getCompatibleTypes(mbtiType: MBTITypeKey) {
  const compatibilityMap: Record<
    MBTITypeKey,
    {
      bestMatch: MBTITypeKey[];
      goodMatch: MBTITypeKey[];
      reason: string;
    }
  > = {
    // 分析家タイプ
    INTJ: {
      bestMatch: ["ENFP", "ENTP"],
      goodMatch: ["INFJ", "INFP", "ENTJ"],
      reason:
        "ENFPとENTPは、INTJの論理的思考と計画性を補完する創造性と柔軟性をもたらします。",
    },
    INTP: {
      bestMatch: ["ENTJ", "ENFJ"],
      goodMatch: ["INFJ", "ENTP", "INTJ"],
      reason:
        "ENTJとENFJは、INTPの分析力と創造性を現実の成果に変換する能力を持ちます。",
    },
    ENTJ: {
      bestMatch: ["INTP", "ISTP"],
      goodMatch: ["ENFP", "ENTP", "INTJ"],
      reason:
        "INTPとISTPは、ENTJに深い分析と実践的な問題解決能力をもたらします。",
    },
    ENTP: {
      bestMatch: ["INTJ", "INFJ"],
      goodMatch: ["INTP", "ENFJ", "ENFP"],
      reason:
        "INTJとINFJは、ENTPの創造的なアイデアを体系化する能力を持ちます。",
    },

    // 外交官タイプ
    INFJ: {
      bestMatch: ["ENTP", "ENFP"],
      goodMatch: ["INFP", "INTJ", "ENFJ"],
      reason:
        "ENTPとENFPは、INFJの直観と深い洞察力に活力と多様な視点をもたらします。",
    },
    INFP: {
      bestMatch: ["ENFJ", "ENTJ"],
      goodMatch: ["INFJ", "ENFP", "INTJ"],
      reason:
        "ENFJとENTJは、INFPの理想と創造性を現実の成果に変換する能力を持ちます。",
    },
    ENFJ: {
      bestMatch: ["INFP", "ISFP"],
      goodMatch: ["INTP", "ENFP", "INFJ"],
      reason:
        "INFPとISFPは、ENFJの社交性と指導力にユニークな視点と真正さをもたらします。",
    },
    ENFP: {
      bestMatch: ["INTJ", "INFJ"],
      goodMatch: ["ENFJ", "ENTP", "INFP"],
      reason: "INTJとINFJは、ENFPの熱意と創造性に方向性と深みをもたらします。",
    },

    // 管理者タイプ
    ISTJ: {
      bestMatch: ["ESFP", "ESTP"],
      goodMatch: ["ISFJ", "ESTJ", "ISTP"],
      reason: "ESFPとESTPは、ISTJの実用性と秩序に自発性と活力をもたらします。",
    },
    ISFJ: {
      bestMatch: ["ESFP", "ESTP"],
      goodMatch: ["ISTJ", "ESFJ", "ISFP"],
      reason:
        "ESFPとESTPは、ISFJの思いやりと忠実さに楽しさと冒険をもたらします。",
    },
    ESTJ: {
      bestMatch: ["ISFP", "ISTP"],
      goodMatch: ["ISTJ", "ESFJ", "ESTP"],
      reason: "ISFPとISTPは、ESTJの効率と構造に柔軟性と創造性をもたらします。",
    },
    ESFJ: {
      bestMatch: ["ISFP", "ISTP"],
      goodMatch: ["ISFJ", "ESTJ", "ESFP"],
      reason:
        "ISFPとISTPは、ESFJの社交性と親切さに独自性と落ち着きをもたらします。",
    },

    // 探検家タイプ
    ISTP: {
      bestMatch: ["ESTJ", "ESFJ"],
      goodMatch: ["ISTJ", "ESTP", "ENTJ"],
      reason:
        "ESTJとESFJは、ISTPの実用的なスキルと独立性に構造と社会的つながりをもたらします。",
    },
    ISFP: {
      bestMatch: ["ESTJ", "ESFJ"],
      goodMatch: ["ISFJ", "ESFP", "ENFJ"],
      reason:
        "ESTJとESFJは、ISFPの芸術的感性と柔軟性に安定と組織をもたらします。",
    },
    ESTP: {
      bestMatch: ["ISTJ", "ISFJ"],
      goodMatch: ["ESTJ", "ISTP", "ESFP"],
      reason:
        "ISTJとISFJは、ESTPの活力と適応性に責任感と信頼性をもたらします。",
    },
    ESFP: {
      bestMatch: ["ISTJ", "ISFJ"],
      goodMatch: ["ESFJ", "ISFP", "ESTP"],
      reason:
        "ISTJとISFJは、ESFPのカリスマ性と自発性に安定と継続性をもたらします。",
    },
  };

  return (
    compatibilityMap[mbtiType] || { bestMatch: [], goodMatch: [], reason: "" }
  );
}
