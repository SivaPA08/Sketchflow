import { create } from "zustand";
import type { BordElement } from "../App";

interface UndoState {
  undo: BordElement[][];
  setUndo: (
    updater: BordElement[][] | ((prev: BordElement[][]) => BordElement[][])
  ) => void;
}

export const useUndoStore = create<UndoState>((set, get) => ({
  undo: [],
  setUndo: (updater) => {
    if (typeof updater === "function") {
      set({ undo: updater(get().undo) });
    } else {
      set({ undo: updater });
    }
  },
}));
