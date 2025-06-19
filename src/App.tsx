import "./App.css";
import "./styles/shapes.css";
import "./styles/rightbar.css";
import Rectangle from "./shapes/Rectangle";
import RoundedRect from "./shapes/RoundedRect";
import Circle from "./shapes/Circle";
import Diamond from "./shapes/Diamond";
import NormalLine from "./lines/normal";
import DashedLine from "./lines/dashedline";
import DottedLine from "./lines/dottedline";
import DoubleLine from "./lines/doubleline";
import { useEffect, useRef, useState, type MouseEvent, type FC } from "react";

export interface ShapeProps {
  left: number;
  top: number;
  width: number;
  height: number;
  bg: string;
  selected: boolean;
  onclick: () => void;
}

export interface LineProps {
  left:number;
  top:number;
  bg:string;
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
  bgColor: string;
  Shape: FC<ShapeProps>;
}
interface ItemLine {
  id: number;
  left:number;
  top:number;
  bgColor:string;
  isLine: true;
  Shape: FC<LineProps>;
}

type BordElement = Item | ItemLine;

export default function App() {
  const [items, setitems] = useState<BordElement[]>([]);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [contBg, setcontBg] = useState<string>("white");
  const [selectedId, setselecteddId] = useState<number | null>(null);
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
      width: 200,
      height: 100,
      bgColor: contBg,
      Shape: ShapeComp,
    };
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

  function addItemLine(Shapecomp: FC<LineProps>) {
    const boardele = boardRef.current;
    if (!boardele) return;

    const visibleW = boardele.clientWidth;
    const visibleH = boardele.clientHeight;
    const scrollX = boardele.scrollLeft;
    const scrollY = boardele.scrollTop;

    const newItem: ItemLine = {
      id: Date.now(),
      left:scrollX+visibleW/2,
      top:scrollY+visibleH/2,
      bgColor:contBg,
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
        PointerPos.current = { x: e.clientX, y: e.clientY };
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
      </header>

      <aside className="leftbar">
        <div className="mainleft">
          <div className="shapes">
            <div className="title">
              <p>Shapes</p>
            </div>
            <div className="contents">
              <button id="rectangle" onClick={() => addItem(Rectangle)}>rect</button>
              <button id="roundedrect" onClick={() => addItem(RoundedRect)}>rr</button>
              <button id="circle" onClick={() => addItem(Circle)}>cir</button>
              <button id="diamond" onClick={() => addItem(Diamond)}>dia</button>
            </div>
          </div>

          <div className="lines">
            <div className="title">
              <p>Lines</p>
            </div>
            <div className="contents">
              <button onClick={() => addItemLine(NormalLine)}>Line</button>
              <button onClick={()=>addItemLine(DashedLine)}>DashedLine</button>
              <button onClick={()=>addItemLine(DottedLine)}>Dottedline</button>
              <button onClick={()=>addItemLine(DoubleLine)}>DoubleLine</button>
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
                  left={item.left}
                  top={item.top}
                  width={item.width}
                  height={item.height}
                  bg={item.bgColor}
                  selected={item.id === selectedId}
                  onclick={() => setselecteddId(item.id)}
                />
              );
            }
          })}
          {/* Your horizontal content goes here */}
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
            <button className="redc" onClick={() => BGofCont("red")}></button>
            <button
              className="whitec"
              onClick={() => BGofCont("white")}
            ></button>
            <button className="aquac" onClick={() => BGofCont("aqua")}></button>
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
            <button className="greyc" onClick={() => BGofCont("grey")}></button>
          </div>
        </div>
        {/* right-sidebar content */}
      </aside>

      <footer className="bottombar">
        <p>Copyright bro</p>
      </footer>
    </div>
  );
}
