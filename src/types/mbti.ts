import { MBTITypeKey } from "@/app/data/mbtiTypes";

export type { MBTITypeKey as MBTIType };

export type TestResult = {
  id: string;
  mbti_type: MBTITypeKey;
  created_at: string;
};

export type MBTITypeDescription = {
  title: string;
  description: string;
  traits: string[];
  advice: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  famousPeople: string[];
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

export interface TypeDescription {
  title: string;
  description: string;
}
