import { create } from 'zustand';

interface BrainState {
  memory: any[];
  context: string | null;
  setMemory: (memory: any[]) => void;
  setContext: (context: string | null) => void;
}

export const useBrainStore = create<BrainState>((set) => ({
  memory: [],
  context: null,
  setMemory: (memory) => set({ memory }),
  setContext: (context) => set({ context }),
}));
