import { create } from "zustand";
import type { BordElement } from "../App";

type UndoRedoStore = {
    undoStack: BordElement[][];
    redoStack: BordElement[][];
    pushUndo: (items: BordElement[]) => void;
    undo: (
        setItems: (items: BordElement[]) => void,
        currentItems: BordElement[]
    ) => void;
    redo: (
        setItems: (items: BordElement[]) => void,
        currentItems: BordElement[]
    ) => void;
    clearHistory: () => void;
};

export const useUndoRedoStore = create<UndoRedoStore>((set, get) => ({
    undoStack: [],
    redoStack: [],

    pushUndo: (items) => {
        set((state) => ({
            undoStack: [...state.undoStack, JSON.parse(JSON.stringify(items))],
            redoStack: [],
        }));
    },

    undo: (setItems, currentItems) => {
        const { undoStack, redoStack } = get();
        if (undoStack.length === 0) return;
        const prevState = undoStack[undoStack.length - 1];
        setItems(prevState);
        set({
            undoStack: undoStack.slice(0, -1),
            redoStack: [...redoStack, JSON.parse(JSON.stringify(currentItems))],
        });
    },

    redo: (setItems, currentItems) => {
        const { redoStack, undoStack } = get();
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];
        setItems(nextState);
        set({
            redoStack: redoStack.slice(0, -1),
            undoStack: [...undoStack, JSON.parse(JSON.stringify(currentItems))],
        });
    },

    clearHistory: () => {
        set({ undoStack: [], redoStack: [] });
    },
}));
