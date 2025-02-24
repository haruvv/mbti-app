import { QUESTIONS } from "../data/questions";

export function calculateMBTIType(answers: number[]): string {
  type DimensionKey = "EI" | "SN" | "TF" | "JP";
  const dimensions: Record<DimensionKey, { [key: string]: number }> = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };

  answers.forEach((score, index) => {
    const question = QUESTIONS[index];
    const value = question.positive ? score - 3 : 3 - score;
    const dim = question.dimension as DimensionKey;

    if (value > 0) {
      dimensions[dim][question.dimension[0]] += Math.abs(value);
    } else {
      dimensions[dim][question.dimension[1]] += Math.abs(value);
    }
  });

  return Object.entries(dimensions)
    .map(([dim, scores]) => {
      const [first, second] = Object.entries(scores);
      return first[1] >= second[1] ? first[0] : second[0];
    })
    .join("");
}
