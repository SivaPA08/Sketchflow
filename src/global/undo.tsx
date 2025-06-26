import { create } from "zustand";
import type { BordElement } from "../App";
import { useBordStore } from "./Items";

type UndoRedoStore = {
    undoStack: BordElement[][];
    redoStack: BordElement[][];
    pushUndo: () => void;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
};

function cloneItems(items: BordElement[]): BordElement[] {
    return items.map(item => ({ ...item }));
}

export const useUndoRedoStore = create<UndoRedoStore>((set, get) => ({
    undoStack: [],
    redoStack: [],

    pushUndo: () => {
        const { items } = useBordStore.getState();
        set((state) => ({
            undoStack: [...state.undoStack, cloneItems(items)],
            redoStack: [],
        }));
    },

    undo: () => {
        const { undoStack, redoStack } = get();
        if (undoStack.length === 0) return;
        const prevState = undoStack[undoStack.length - 1];
        const { setitems, items } = useBordStore.getState();
        setitems(prevState);
        set({
            undoStack: undoStack.slice(0, -1),
            redoStack: [...redoStack, cloneItems(items)],
        });
    },

    redo: () => {
        const { redoStack, undoStack } = get();
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];
        const { setitems, items } = useBordStore.getState();
        setitems(nextState);
        set({
            redoStack: redoStack.slice(0, -1),
            undoStack: [...undoStack, cloneItems(items)],
        });
    },

    clearHistory: () => {
        set({ undoStack: [], redoStack: [] });
    },
}));
