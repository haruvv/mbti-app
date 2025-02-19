export type Question = {
  id: number;
  dimension: "EI" | "SN" | "TF" | "JP";
  text: string;
  positive: boolean;
};

export const QUESTIONS: Question[] = [
  // E-I 次元（1-15）
  {
    id: 1,
    dimension: "EI",
    text: "初対面の人とでもすぐに打ち解ける方だ",
    positive: true,
  },
  {
    id: 2,
    dimension: "EI",
    text: "大勢でにぎやかに過ごすより、一人で過ごす方が好きだ",
    positive: false,
  },
  {
    id: 3,
    dimension: "EI",
    text: "人に話を聞いてもらうのが好きだ",
    positive: true,
  },
  {
    id: 4,
    dimension: "EI",
    text: "自分の考えを人に話すのは苦手だ",
    positive: false,
  },
  {
    id: 5,
    dimension: "EI",
    text: "パーティーやイベントの主催者になることが多い",
    positive: true,
  },
  {
    id: 6,
    dimension: "EI",
    text: "他人のプライベートに深入りするのは避ける",
    positive: false,
  },
  {
    id: 7,
    dimension: "EI",
    text: "新しい人と会うとエネルギーをもらえる",
    positive: true,
  },
  {
    id: 8,
    dimension: "EI",
    text: "長時間人と一緒にいると疲れる",
    positive: false,
  },
  {
    id: 9,
    dimension: "EI",
    text: "自分の考えを率直に表現する方だ",
    positive: true,
  },
  {
    id: 10,
    dimension: "EI",
    text: "観察する時間を多く取る方だ",
    positive: false,
  },
  {
    id: 11,
    dimension: "EI",
    text: "人前で話すことに緊張しない",
    positive: true,
  },
  {
    id: 12,
    dimension: "EI",
    text: "深い人間関係を築くのに時間がかかる",
    positive: false,
  },
  {
    id: 13,
    dimension: "EI",
    text: "リーダーシップを発揮するのが自然だ",
    positive: true,
  },
  {
    id: 14,
    dimension: "EI",
    text: "他人の意見に左右されやすい",
    positive: false,
  },
  {
    id: 15,
    dimension: "EI",
    text: "社交的な場面で主導権を握ることが多い",
    positive: true,
  },

  // S-N 次元（16-30）
  {
    id: 16,
    dimension: "SN",
    text: "現実的な事実より可能性を重視する",
    positive: true,
  },
  {
    id: 17,
    dimension: "SN",
    text: "具体的な事実を正確に記憶している",
    positive: false,
  },
  {
    id: 18,
    dimension: "SN",
    text: "未来の可能性について考えるのが好きだ",
    positive: true,
  },
  {
    id: 19,
    dimension: "SN",
    text: "五感で感じる情報を重視する",
    positive: false,
  },
  {
    id: 20,
    dimension: "SN",
    text: "比喩や暗喩を使うのが得意だ",
    positive: true,
  },
  {
    id: 21,
    dimension: "SN",
    text: "物事をあるがままに見る方だ",
    positive: false,
  },
  {
    id: 22,
    dimension: "SN",
    text: "抽象的な概念を理解するのが好きだ",
    positive: true,
  },
  { id: 23, dimension: "SN", text: "実際の経験を重視する", positive: false },
  {
    id: 24,
    dimension: "SN",
    text: "アイデアの可能性に興奮する",
    positive: true,
  },
  {
    id: 25,
    dimension: "SN",
    text: "詳細な情報を正確に処理できる",
    positive: false,
  },
  {
    id: 26,
    dimension: "SN",
    text: "物事の背後にある意味を探求する",
    positive: true,
  },
  { id: 27, dimension: "SN", text: "現在の現実を大切にする", positive: false },
  { id: 28, dimension: "SN", text: "理論的な話に没頭できる", positive: true },
  {
    id: 29,
    dimension: "SN",
    text: "実際に手を動かす作業が好きだ",
    positive: false,
  },
  {
    id: 30,
    dimension: "SN",
    text: "未来のビジョンを描くのが得意だ",
    positive: true,
  },

  // T-F 次元（31-45）
  { id: 31, dimension: "TF", text: "論理的な整合性を重視する", positive: true },
  {
    id: 32,
    dimension: "TF",
    text: "他人の感情を敏感に察知する",
    positive: false,
  },
  {
    id: 33,
    dimension: "TF",
    text: "公平性を保つために感情を抑える",
    positive: true,
  },
  {
    id: 34,
    dimension: "TF",
    text: "調和を乱すことを極端に嫌う",
    positive: false,
  },
  { id: 35, dimension: "TF", text: "批判を受け入れやすい", positive: true },
  {
    id: 36,
    dimension: "TF",
    text: "他人を傷つけないように配慮する",
    positive: false,
  },
  { id: 37, dimension: "TF", text: "効率性を最優先する", positive: true },
  {
    id: 38,
    dimension: "TF",
    text: "チームの雰囲気を大切にする",
    positive: false,
  },
  {
    id: 39,
    dimension: "TF",
    text: "客観的事実に基づいて判断する",
    positive: true,
  },
  {
    id: 40,
    dimension: "TF",
    text: "個人的な価値観を重視する",
    positive: false,
  },
  {
    id: 41,
    dimension: "TF",
    text: "論理的な矛盾を指摘するのが得意だ",
    positive: true,
  },
  {
    id: 42,
    dimension: "TF",
    text: "人間関係の微妙なニュアンスを読む",
    positive: false,
  },
  {
    id: 43,
    dimension: "TF",
    text: "目標達成のためなら厳しい判断もできる",
    positive: true,
  },
  { id: 44, dimension: "TF", text: "他人の気持ちを優先する", positive: false },
  {
    id: 45,
    dimension: "TF",
    text: "感情より合理性を選ぶことが多い",
    positive: true,
  },

  // J-P 次元（46-60）
  { id: 46, dimension: "JP", text: "計画を立てて行動する方だ", positive: true },
  {
    id: 47,
    dimension: "JP",
    text: "柔軟に状況に対応するのが好きだ",
    positive: false,
  },
  { id: 48, dimension: "JP", text: "締め切りは厳守する", positive: true },
  {
    id: 49,
    dimension: "JP",
    text: "予定外の出来事を楽しめる",
    positive: false,
  },
  {
    id: 50,
    dimension: "JP",
    text: "物事を整理整頓するのが得意だ",
    positive: true,
  },
  {
    id: 51,
    dimension: "JP",
    text: "決断を先延ばしにしがちだ",
    positive: false,
  },
  {
    id: 52,
    dimension: "JP",
    text: "目標達成のために計画的に行動する",
    positive: true,
  },
  {
    id: 53,
    dimension: "JP",
    text: "新しい機会に柔軟に対応できる",
    positive: false,
  },
  { id: 54, dimension: "JP", text: "スケジュール管理が得意だ", positive: true },
  {
    id: 55,
    dimension: "JP",
    text: "複数の選択肢を残しておきたい",
    positive: false,
  },
  { id: 56, dimension: "JP", text: "結論を急ぐ方だ", positive: true },
  {
    id: 57,
    dimension: "JP",
    text: "状況の変化に合わせて方針を変えられる",
    positive: false,
  },
  { id: 58, dimension: "JP", text: "規則正しい生活を好む", positive: true },
  {
    id: 59,
    dimension: "JP",
    text: "即興で物事を進めるのが好きだ",
    positive: false,
  },
  { id: 60, dimension: "JP", text: "事前準備を入念にする方だ", positive: true },
];
