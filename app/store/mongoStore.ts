// store/mongoStore.ts
import { create } from 'zustand';
import { Collection } from '../flow-container/types/collections';

interface MongoState {
  mongoURI: string;
  databaseName: string | null;
  collections: Collection[];
  isConnecting: boolean;
  error: string | null;
  setMongoURI: (uri: string) => void;
  setDatabaseInfo: (name: string, collections: Collection[]) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMongoStore = create<MongoState>((set) => ({
  mongoURI: '',
  databaseName: null,
  collections: [],
  isConnecting: false,
  error: null,
  setMongoURI: (uri) => set({ mongoURI: uri }),
  setDatabaseInfo: (name, collections) => set({ databaseName: name, collections }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setError: (error) => set({ error }),
  reset: () => set({ mongoURI: '', databaseName: null, collections: [], error: null }),
}));