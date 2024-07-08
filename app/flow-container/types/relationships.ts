// types/relationships.ts
export interface Relationship {
    source: string;
    target: string;
    sourceField: string;
    targetField: string;
    confidence: number;
  }