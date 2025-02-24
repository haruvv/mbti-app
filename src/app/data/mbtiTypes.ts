export type MBTITypeDescription = {
  title: string;
  description: string;
  traits: string[];
  advice: string;
};

export type MBTITypeKey =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export const typeDescriptions: Record<MBTITypeKey, MBTITypeDescription> = {
  INTJ: {
    title: "建築家",
    description: "想像力豊かで戦略的な思考を持つ革新者",
    traits: [
      "論理的で戦略的な思考を持つ",
      "独立心が強く、自立している",
      "高い基準を持ち、完璧を求める",
      "複雑な問題解決を得意とする",
    ],
    advice:
      "他者との協力や感情面での配慮を意識すると、より良い結果が得られるでしょう",
  },
  INTP: {
    title: "論理学者",
    description:
      "理論的で分析的な思考者。物事の原理を解明することに喜びを感じます。独創的なアイデアで技術革新を推進します。",
    traits: [
      "深い分析力と論理的思考を持つ",
      "知識への探求心が強い",
      "独自の視点で問題にアプローチする",
      "内向的で思索にふけることが多い",
    ],
    advice:
      "理論だけでなく実践に目を向け、行動に移すタイミングを見極めると良いでしょう",
  },
  ENTJ: {
    title: "指揮官",
    description:
      "生まれながらのリーダー。合理的で決断力があり、効率性を追求します。複雑な問題を解決する能力に優れ、目標達成のために組織を導きます。",
    traits: [
      "決断力とリーダーシップを発揮する",
      "目標達成への強い意志を持つ",
      "効率性と成果を重視する",
      "自信に満ち溢れている",
    ],
    advice:
      "他者の意見に耳を傾け、柔軟性を持つことでさらに信頼を得られるでしょう",
  },
  ENTP: {
    title: "討論者",
    description:
      "独創的で知的好奇心が旺盛。新しいアイデアを生み出す才能があり、論理的な討論を好みます。破りな発想で常識を打ち破ります。",
    traits: [
      "斬新なアイデアを生み出す",
      "討論や知的挑戦を楽しむ",
      "柔軟で適応力が高い",
      "好奇心が強く多角的に考える",
    ],
    advice:
      "アイデアを実行に移す計画性を持つと、より大きな成果を上げられるでしょう",
  },
  INFJ: {
    title: "提唱者",
    description:
      "理想主義的なビジョナリー。深い洞察力で人間性を理解し、社会をより良くするために行動します。神秘的なオーラを持ちます。",
    traits: [
      "深い共感力と洞察力を持つ",
      "理想を追求する情熱がある",
      "他者のために行動する傾向がある",
      "内省的で感受性が豊か",
    ],
    advice:
      "自己犠牲に陥らず、自分のニーズにも目を向けるとバランスが取れるでしょう",
  },
  INFP: {
    title: "仲介者",
    description:
      "情熱的な理想主義者。共感力が高く、内面的な価値観を大切にします。創造的な表現を通じて世界に貢献します。",
    traits: [
      "感受性と共感力が強い",
      "独自の価値観を大切にする",
      "創造的で芸術的な才能を持つ",
      "内向的で穏やかな性格",
    ],
    advice: "現実的な目標設定を意識すると、理想を形にしやすくなるでしょう",
  },
  ENFJ: {
    title: "主人公",
    description:
      "カリスマ性あふれる指導者。他人の可能性を引き出す才能があり、チームの調和を重視します。社会貢献への情熱が強いです。",
    traits: [
      "カリスマ性と影響力を持つ",
      "他者を励ますのが得意",
      "社交的で温かい性格",
      "調和と協力を重視する",
    ],
    advice: "自分自身の時間や感情を大切にし、過度な負担を避けると良いでしょう",
  },
  ENFP: {
    title: "冒険家",
    description: "情熱的で創造的な自由思考家",
    traits: [
      "好奇心旺盛で新しいアイデアを生み出す",
      "人々との交流を楽しむ",
      "柔軟で適応力がある",
      "熱意と創造性に溢れている",
    ],
    advice:
      "プロジェクトの完遂や詳細への注意を心がけると、より成功につながるでしょう",
  },
  ISTJ: {
    title: "堅実家",
    description:
      "信頼性の高い実務家。事実と経験を重視し、正確に仕事を遂行します。伝統を守り、責任を果たすことを誇りとします。",
    traits: [
      "責任感が強く信頼できる",
      "事実と詳細にこだわる",
      "計画的で組織的な性格",
      "伝統やルールを尊重する",
    ],
    advice: "新しい方法にも目を向け、柔軟性を取り入れると視野が広がるでしょう",
  },
  ISFJ: {
    title: "擁護者",
    description:
      "献身的な保護者。控えめながらも深い共感力で人を支えます。細やかな気配りと持続的な支援を得意とします。",
    traits: [
      "思いやりと共感力がある",
      "細部に注意を払う",
      "信頼性が高く献身的",
      "穏やかで安定感がある",
    ],
    advice: "自分の感情や限界を主張することで、バランスを保てるでしょう",
  },
  ESTJ: {
    title: "管理者",
    description:
      "有能な組織運営者。伝統と秩序を重んじ、効率的なシステムを構築します。責任感が強く実務能力に優れます。",
    traits: [
      "実践的で効率を重視する",
      "リーダーシップを発揮する",
      "責任感が強く信頼される",
      "秩序と規則を大切にする",
    ],
    advice: "他者の感情や異なる視点に配慮すると、より良い関係を築けるでしょう",
  },
  ESFJ: {
    title: "領事官",
    description:
      "献身的な援助者。周囲との調和を大切にし、実践的な方法で人々を支えます。社会的責任を果たすことに喜びを感じます。",
    traits: [
      "社交的で温かい性格",
      "他者を支えることに喜びを感じる",
      "実践的で具体的な支援を行う",
      "調和と協力を重視する",
    ],
    advice: "自分のニーズも大切にし、過剰な責任感を避けると良いでしょう",
  },
  ISTP: {
    title: "巨匠",
    description:
      "実用的な問題解決者。機械システムの理解に優れ、即座に適切な対応ができます。自由と自立を何より尊びます。",
    traits: [
      "実践的で手先が器用",
      "冷静で分析的な判断力を持つ",
      "自由と独立を求める",
      "状況に即座に対応できる",
    ],
    advice: "長期的な計画を立てることで、さらなる成果を上げられるでしょう",
  },
  ISFP: {
    title: "冒険家",
    description:
      "感受性豊かな芸術家。現在の瞬間を大切にし、美的感覚を通じて自己表現します。柔軟でオープンマインドな性質です。",
    traits: [
      "感受性と美的センスが豊か",
      "穏やかで柔軟な性格",
      "現在の瞬間を楽しむ",
      "内向的で自由を愛する",
    ],
    advice: "目標や優先順位を明確にすると、行動がより効果的になるでしょう",
  },
  ESTP: {
    title: "起業家",
    description:
      "機転の利く現実主義者。臨機応変に行動し、即座に結果を出します。リスクを恐れず、現実的な問題解決が得意です。",
    traits: [
      "行動力と決断力がある",
      "現実的で即座に対応する",
      "社交的でエネルギッシュ",
      "リスクを楽しむ傾向がある",
    ],
    advice: "長期的な影響を考慮し、衝動的な行動を抑えると良いでしょう",
  },
  ESFP: {
    title: "エンターテイナー",
    description:
      "陽気なムードメーカー。周囲を楽しませる才能があり、その場の空気を明るくします。五感で感じる現実を大切にします。",
    traits: [
      "明るく社交的な性格",
      "周囲を楽しませるのが得意",
      "五感を通じて楽しむ",
      "柔軟で楽観的",
    ],
    advice: "将来の計画や責任に目を向けると、安定感が増すでしょう",
  },
} as const;
