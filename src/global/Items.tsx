import { create } from "zustand";
import type { BordElement } from "../App";

type BoardStore = {
  items: BordElement[];
  setitems: (
    itemsOrUpdater: BordElement[] | ((prev: BordElement[]) => BordElement[])
  ) => void;
};

export const useBordStore = create<BoardStore>((set, get) => ({
  items: [],
  setitems: (itemsOrUpdater) => {
    if (typeof itemsOrUpdater === "function") {
      set({ items: (itemsOrUpdater as (prev: BordElement[]) => BordElement[])(get().items) });
    } else {
      set({ items: itemsOrUpdater });
    }
  },
}));
