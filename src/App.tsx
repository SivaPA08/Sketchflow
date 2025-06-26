import "./App.css";
import "./styles/shapes.css";
import "./styles/rightbar.css";
import "./styles/textsize.css";
import "./styles/topbar.css";
import Rectangle from "./shapes/Rectangle";
import RoundedRect from "./shapes/RoundedRect";
import Circle from "./shapes/Circle";
import Diamond from "./shapes/Diamond";
import Heading from "./shapes/Heading";
import Paragraph from "./shapes/Paragraph";
import NormalLine from "./lines/normal";
import DashedLine from "./lines/dashedline";
import DottedLine from "./lines/dottedline";
import DoubleLine from "./lines/doubleline";
import { useEffect, useRef, useState, type MouseEvent, type FC } from "react";
import {
    clearall,
    deletedselected,
    redofunc,
    reseteverything,
    undofunc,
    unselect,
} from "./helper/operation";
import { useBordStore } from "./global/Items";
import { useUndoStore } from "./global/undo";

export interface ShapeProps {
    id: number;
    left: number;
    top: number;
    width: number;
    height: number;
    bg: string;
    textsize: number;
    selected: boolean;
    onclick: () => void;
}

export interface LineProps {
    id: number;
    left: number;
    top: number;
    bg: string;
    selected: boolean;
    onClick: () => void;
}

interface Item {
    id: number;
    isLine: false;
    left: number;
    top: number;
    width: number;
    height: number;
    textsize: number;
    bgColor: string;
    Shape: FC<ShapeProps>;
}
interface ItemLine {
    id: number;
    left: number;
    top: number;
    bgColor: string;
    isLine: true;
    Shape: FC<LineProps>;
}

export type BordElement = Item | ItemLine;

export default function App() {
    const items = useBordStore((s) => s.items);
    const setitems = useBordStore((s) => s.setitems);

    const boardRef = useRef<HTMLDivElement | null>(null);
    const [contBg, setcontBg] = useState<string>("white");
    const [selectedId, setselecteddId] = useState<number | null>(null);
    const [textsize, settextsize] = useState<number>(15);
    function addItem(ShapeComp: FC<ShapeProps>) {
        const boardele = boardRef.current;
        if (!boardele) return;
        const visibleW = boardele.clientWidth;
        const visibleH = boardele.clientHeight;
        const scrollX = boardele.scrollLeft;
        const scrollY = boardele.scrollTop;
        const newItem: Item = {
            id: Date.now(),
            isLine: false,
            left: scrollX + visibleW / 2,
            top: scrollY + visibleH / 2,
            width: 120,
            height: 60,
            bgColor: contBg,
            textsize: textsize,
            Shape: ShapeComp,
        };
        const curritem=useBordStore.getState().items;
        useUndoStore.getState().setUndo(prev=>[...prev,curritem])
        setitems((prev) => [...prev, newItem]);
    }
    function BGofCont(color: string) {
        setcontBg(color);
        setitems((previtem) =>
            previtem.map((item) =>
                item.id === selectedId ? { ...item, bgColor: color } : item
            )
        );
    }
    function SizeofText(fontsize: number) {
        settextsize(fontsize);
        setitems((prev) =>
            prev.map((item) =>
                item.id === selectedId ? { ...item, textsize: textsize } : item
            )
        );
    }

    function addItemLine(Shapecomp: FC<LineProps>) {
        const boardele = boardRef.current;
        if (!boardele) return;

        const visibleW = boardele.clientWidth;
        const visibleH = boardele.clientHeight;
        const scrollX = boardele.scrollLeft;
        const scrollY = boardele.scrollTop;

        const newItem: ItemLine = {
            id: Date.now(),
            left: scrollX + visibleW / 2,
            top: scrollY + visibleH / 2,
            bgColor: contBg,
            isLine: true,
            Shape: Shapecomp,
        };
        setitems((prev) => [...prev, newItem]);
    }

    //Board Dragging:
    const PointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const IsPointerDragging = useRef<boolean>(false);
    function MouseDownForPointer(e: MouseEvent) {
        if (e.button != 2) return;
        IsPointerDragging.current = true;
        PointerPos.current = { x: e.clientX, y: e.clientY };
    }
    useEffect(() => {
        function MouseMovePointer(e: MouseEvent) {
            if (IsPointerDragging.current && boardRef.current) {
                const dx = e.clientX - PointerPos.current.x;
                const dy = e.clientY - PointerPos.current.y;
                const speedFactor = 0.5;
                boardRef.current.scrollLeft -= dx * speedFactor;
                boardRef.current.scrollTop -= dy * speedFactor;
                PointerPos.current = {
                    x: e.clientX,
                    y: e.clientY,
                };
            }
        }
        function MouseUpPointer() {
            IsPointerDragging.current = false;
        }
        window.addEventListener("mousemove", MouseMovePointer as any);
        window.addEventListener("mouseup", MouseUpPointer);
        return () => {
            window.removeEventListener("mousemove", MouseMovePointer as any);
            window.removeEventListener("mouseup", MouseUpPointer);
        };
    }, [IsPointerDragging, PointerPos]);
    return (
        <div className="bdy">
            <header className="topbar">
                <h3>SketchFlow</h3>
                <div className="operations">
                    <button
                        onClick={() =>
                            window.open(
                                "https://sivapa08.github.io/Sketchflow/",
                                "_blank"
                            )
                        }
                    >
                        new
                    </button>
                    <button onClick={()=>undofunc()}>undo</button>
                    <button onClick={()=>redofunc()}>redo</button>
                    <button onClick={() => deletedselected(selectedId)}>
                        delete
                    </button>
                    <button onClick={() => clearall()}>clear</button>
                    <button onClick={() => unselect(setselecteddId)()}>
                        unselect
                    </button>
                    <button
                        onClick={() =>
                            reseteverything(
                                setselecteddId,
                                setcontBg,
                                settextsize
                            )
                        }
                    >
                        reset
                    </button>
                </div>
            </header>

            <aside className="leftbar">
                <div className="mainleft">
                    <div className="shapes">
                        <div className="title">
                            <p>Shapes</p>
                        </div>
                        <div className="contents">
                            <button
                                id="heading"
                                onClick={() => addItem(Heading)}
                            ></button>
                            <button
                                id="paragraph"
                                onClick={() => addItem(Paragraph)}
                            ></button>
                            <button
                                id="rectangle"
                                onClick={() => addItem(Rectangle)}
                            ></button>
                            <button
                                id="roundedrect"
                                onClick={() => addItem(RoundedRect)}
                            ></button>
                            <button
                                id="circle"
                                onClick={() => addItem(Circle)}
                            ></button>
                            <button
                                id="diamond"
                                onClick={() => addItem(Diamond)}
                            ></button>
                        </div>
                    </div>

                    <div className="lines">
                        <div className="title">
                            <p>Lines</p>
                        </div>
                        <div className="contents">
                            <button
                                id="line"
                                onClick={() => addItemLine(NormalLine)}
                            ></button>
                            <button
                                id="dashedline"
                                onClick={() => addItemLine(DashedLine)}
                            ></button>
                            <button
                                id="dottedline"
                                onClick={() => addItemLine(DottedLine)}
                            ></button>
                            <button
                                id="doubleline"
                                onClick={() => addItemLine(DoubleLine)}
                            ></button>
                        </div>
                    </div>
                </div>
            </aside>

            <main
                className="board"
                ref={boardRef}
                onMouseDown={MouseDownForPointer}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className="scroll-wrap">
                    {items.map((item) => {
                        if (item.isLine) {
                            const Linecomp = item.Shape as FC<LineProps>;
                            return (
                                <Linecomp
                                    key={item.id}
                                    id={item.id}
                                    left={item.left}
                                    top={item.top}
                                    bg={item.bgColor}
                                    selected={item.id === selectedId}
                                    onClick={() => setselecteddId(item.id)}
                                />
                            );
                        } else {
                            const Shapecomp = item.Shape as FC<ShapeProps>;
                            return (
                                <Shapecomp
                                    key={item.id}
                                    id={item.id}
                                    left={item.left}
                                    top={item.top}
                                    width={item.width}
                                    height={item.height}
                                    bg={item.bgColor}
                                    textsize={item.textsize}
                                    selected={item.id === selectedId}
                                    onclick={() => setselecteddId(item.id)}
                                />
                            );
                        }
                    })}
                </div>
            </main>

            <aside className="rightbar">
                <div className="bgcolordiv">
                    <div className="title">BG color</div>
                    <div className="colors">
                        <button
                            className="wheatc"
                            onClick={() => BGofCont("wheat")}
                        ></button>
                        <button
                            className="redc"
                            onClick={() => BGofCont("red")}
                        ></button>
                        <button
                            className="whitec"
                            onClick={() => BGofCont("white")}
                        ></button>
                        <button
                            className="aquac"
                            onClick={() => BGofCont("aqua")}
                        ></button>
                        <button
                            className="yellowc"
                            onClick={() => BGofCont("yellow")}
                        ></button>
                        <button
                            className="orangec"
                            onClick={() => BGofCont("orange")}
                        ></button>
                        <button
                            className="greenyc"
                            onClick={() => BGofCont("yellowgreen")}
                        ></button>
                        <button
                            className="violetc"
                            onClick={() => BGofCont("violet")}
                        ></button>
                        <button
                            className="greyc"
                            onClick={() => BGofCont("grey")}
                        ></button>
                    </div>
                </div>

                <div className="textsize">
                    <p style={{ color: "white" }}>FontSize</p>
                    <input
                        type="range"
                        min={10}
                        max={50}
                        value={textsize}
                        onInput={(e) =>
                            SizeofText(
                                Number((e.target as HTMLInputElement).value)
                            )
                        }
                    />
                    <output id="textsizeoutput" style={{ color: "white" }}>
                        {textsize}
                    </output>
                </div>
            </aside>

            <footer className="bottombar">
                <p>Copyright bro</p>
            </footer>
        </div>
    );
}
