import { typeDescriptions, MBTITypeKey } from "@/app/data/mbtiTypes";

export type { MBTITypeKey as MBTIType };

export type TestResult = {
  id: string;
  mbti_type: MBTITypeKey;
  taken_at: string;
};
