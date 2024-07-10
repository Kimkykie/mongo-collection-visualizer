// store/relationshipStore.ts
import { create } from 'zustand';
import { Relationship } from '../flow-container/types/relationships';

interface RelationshipState {
  relationships: Relationship[];
  isFetchingRelationships: boolean;
  error: string | null;
  setRelationships: (relationships: Relationship[]) => void;
  setIsFetchingRelationships: (isFetching: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRelationshipStore = create<RelationshipState>((set) => ({
  relationships: [],
  isFetchingRelationships: false,
  error: null,
  setRelationships: (relationships) => set({ relationships }),
  setIsFetchingRelationships: (isFetching) => set({ isFetchingRelationships: isFetching }),
  setError: (error) => set({ error }),
  reset: () => set({ relationships: [], error: null }),
}));