import type { Dispatch, SetStateAction } from "react";
import { useBordStore } from "../global/Items";
import { useUndoStore } from "../global/undo";
import { useRedoStore } from "../global/redo";

export function undofunc() {
    const { undo, setUndo } = useUndoStore.getState();
    if (!undo.length) return;
    const current = useBordStore.getState().items;
    useRedoStore.getState().setRedo(r => [...r, current]);
    const last = undo[undo.length - 1];
    setUndo(undo.slice(0, -1));
    useBordStore.getState().setitems(last);
  }
  
export function redofunc() {
    const { redo, setRedo } = useRedoStore.getState();
    if (!redo.length) return;

    const current = useBordStore.getState().items;
    useUndoStore.getState().setUndo((u) => [...u, current]);

    const next = redo[redo.length - 1];
    useBordStore.getState().setitems(next);

    setRedo(redo.slice(0, -1));
}

export function clearall() {
    const before = useBordStore.getState().items;
    useUndoStore.getState().setUndo((u) => [...u, before]);
    useBordStore.getState().setitems([]);
    useRedoStore.getState().setRedo([]);
}

export function deletedselected(selectedId: number | null) {
    if (selectedId == null) return;
    const before = useBordStore.getState().items;
    useUndoStore.getState().setUndo((u) => [...u, before]);
    useBordStore
        .getState()
        .setitems((prev) => prev.filter((item) => item.id !== selectedId));
    useRedoStore.getState().setRedo([]);
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
    useUndoStore.getState().setUndo([]);
    useBordStore.getState().setitems([]);
    setSelectedId(null);
    setContBg("white");
    setTextSize(15);
}
