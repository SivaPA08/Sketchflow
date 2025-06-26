import type { Dispatch, SetStateAction } from "react";
import { useBordStore } from "../global/Items";
import { useUndoStore } from "../global/undo";

export function undofunc() {
  const { undo, setUndo } = useUndoStore.getState();
  if (!undo.length) return;
  const last = undo[undo.length - 1];
  setUndo(undo.slice(0, -1));
  useBordStore.getState().setitems(last);
}

export function clearall() {
  const before = useBordStore.getState().items;
  useUndoStore.getState().setUndo(u => [...u, before]);
  useBordStore.getState().setitems([]);
}

export function deletedselected(selectedId: number | null) {
  if (selectedId == null) return;
  const before = useBordStore.getState().items;
  useUndoStore.getState().setUndo(u => [...u, before]);
  useBordStore.getState().setitems(prev =>
    prev.filter(item => item.id !== selectedId)
  );
}

export function unselect(
  setSelectedId: Dispatch<SetStateAction<number | null>>
) {
  return () => setSelectedId(null);
}

export function reseteverything(
  setSelectedId: Dispatch<SetStateAction<number | null>>,
  setContBg: Dispatch<SetStateAction<string>>,
  setTextSize: Dispatch<SetStateAction<number>>
) {
  const before = useBordStore.getState().items;
  useUndoStore.getState().setUndo(u => [...u, before]);
  useBordStore.getState().setitems([]);
  setSelectedId(null);
  setContBg("white");
  setTextSize(15);
}
