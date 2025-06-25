import type { Dispatch, SetStateAction } from "react";
import type { BordElement } from "../App";
import { useBordStore } from "../global/Items";

export function undofunc(
  setundoitem: Dispatch<SetStateAction<BordElement[][]>>
) {
  const setitems = useBordStore.getState().setitems;
  setundoitem((prev) => {
    if (prev.length === 0) return prev;
    const lastState = prev[prev.length - 1];
    setitems(lastState);
    return prev.slice(0, prev.length - 1);
  });
}

export function clearall(
    setundoitems:Dispatch<SetStateAction<BordElement[][]>>
) {
    const items=useBordStore.getState().items;
  const setitems = useBordStore.getState().setitems;
  setundoitems(prev=>[...prev,items])
  setitems([]);
}

export function deletedselected(
    selectedId: number | null,
    setundoitems: Dispatch<SetStateAction<BordElement[][]>>
  ) {
    if (selectedId == null) return;
  
    const setitems = useBordStore.getState().setitems;
    const items = useBordStore.getState().items;
  
    setundoitems((prev) => {
      const last = prev[prev.length - 1];
      const isSame =
        last && JSON.stringify(last) === JSON.stringify(items);
  
      if (isSame) return prev;
      return [...prev, items];
    });
  
    setitems((prev) => prev.filter((item) => item.id !== selectedId));
  }

export function unselect(
  selectedId: Dispatch<SetStateAction<number | null>>
) {
  return () => selectedId(null);
}

export function reseteverything(
  setSelectedId: Dispatch<SetStateAction<number | null>>,
  setContBg: Dispatch<SetStateAction<string>>,
  setTextSize: Dispatch<SetStateAction<number>>
) {
  const setitems = useBordStore.getState().setitems;
  setitems([]);
  setSelectedId(null);
  setContBg("white");
  setTextSize(15);
}
