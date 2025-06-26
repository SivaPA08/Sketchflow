import { create } from "zustand";
import type { BordElement } from "../App";

interface RedoState {
  redo: BordElement[][];
  setRedo: (
    updater: BordElement[][] | ((prev: BordElement[][]) => BordElement[][])
  ) => void;
}

export const useRedoStore = create<RedoState>((set, get) => ({
  redo: [],
  setRedo: (updater) => {
    if (typeof updater === "function") {
      set({ redo: updater(get().redo) });
    } else {
      set({ redo: updater });
    }
  },
}));
