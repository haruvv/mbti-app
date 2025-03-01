import { MBTITypeKey } from "@/app/data/mbtiTypes";

export type { MBTITypeKey as MBTIType };

export type TestResult = {
  id: string;
  mbti_type: MBTITypeKey;
  created_at: string;
};

export type MBTITypeKey =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ";

export interface TypeDescription {
  title: string;
  description: string;
}
