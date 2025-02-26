import { typeDescriptions, MBTITypeKey } from "@/app/data/mbtiTypes";

export type { MBTITypeKey as MBTIType };

export type TestResult = {
  id: string;
  mbti_type: MBTITypeKey;
  created_at: string;
};
