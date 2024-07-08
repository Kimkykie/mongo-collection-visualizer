// types/collections.ts
export interface Field {
    type: string;
    fields?: Record<string, Field>;
  }

  export interface Collection {
    name: string;
    fields: Record<string, Field>;
    count: number;
  }