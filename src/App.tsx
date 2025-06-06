import "./App.css";
import "./styles/shapes.css"
import Rectangle from "./shapes/Rectangle";
import {useEffect, useRef, useState, type MouseEvent} from "react";

interface Item{
  id:number;
  left:number;
  top:number;
  width:number;
  height:number;
  bgColor:string;
}
export default function App() {
  const [items,setitems]=useState<Item[]>([]);
  const boardRef=useRef<HTMLDivElement|null>(null);
  const [contBg,setcontBg]=useState<string>("white")
  const [selectedId,setselecteddId]=useState<number |null>(null);
  function addItem(){
    const boardele=boardRef.current;
    if(!boardele) return;
    
    const visibleW=boardele.clientWidth;
    const visibleH=boardele.clientHeight;
    const scrollX=boardele.scrollLeft;
    const scrollY=boardele.scrollTop;
    const newItem:Item={
      id:Date.now(),
      left:scrollX+visibleW/2,
      top:scrollY+visibleH/2,
      width:200,
      height:100,
      bgColor:contBg,
    }
    setitems(prev=>[...prev,newItem]);
    
  }
  function BGofCont(color:string){
    setcontBg(color);
    setitems(previtem=>
      previtem.map(item=>
        item.id===selectedId?{...item,bgColor:color}:item
      )
    )
  }


  //Board Dragging:
  const PointerPos=useRef<{x:number;y:number}>({x:0,y:0});
  const IsPointerDragging=useRef<boolean>(false);
  function MouseDownForPointer(e:MouseEvent){
    if(e.button!=2) return;
    IsPointerDragging.current=true;
    PointerPos.current={x:e.clientX,y:e.clientY};
  }
  useEffect(() => {
    function MouseMovePointer(e: MouseEvent) {
      if (IsPointerDragging.current && boardRef.current) {
        const dx = e.clientX - PointerPos.current.x;
        const dy = e.clientY - PointerPos.current.y;
        const speedFactor=0.5;
        boardRef.current.scrollLeft -= dx * speedFactor;
        boardRef.current.scrollTop -= dy * speedFactor;
        PointerPos.current={x:e.clientX,y:e.clientY}
      }
    }
    function MouseUpPointer(){
      IsPointerDragging.current=false;
    }
    window.addEventListener('mousemove',MouseMovePointer as any);
    window.addEventListener('mouseup',MouseUpPointer)
    return ()=>{
      window.removeEventListener('mousemove',MouseMovePointer as any);
      window.removeEventListener('mouseup',MouseUpPointer);
    }
  }, [IsPointerDragging,PointerPos]);
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
            <button onClick={addItem}>Rectangle</button>
          </div>
        </div>

        <div className="lines">
          <div className="title">
            <p>Lines</p>
          </div>
          <div className="contents">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum a possimus minima sunt nam quas sed. Sint, reprehenderit corporis nulla reiciendis nihil temporibus fugit eveniet possimus ratione quae, rem aut.
          </div>
        </div>

        <div className="moreshapes">
          <div className="title">
            <p>More Shapes</p>
          </div>
          <div className="contents">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum a possimus minima sunt nam quas sed. Sint, reprehenderit corporis nulla reiciendis nihil temporibus fugit eveniet possimus ratione quae, rem aut.
          </div>
        </div>
        </div>
      </aside>

      <main className="board" 
        ref={boardRef} 
        onMouseDown={MouseDownForPointer}
        onContextMenu={(e)=>e.preventDefault()}
        >
        <div className="scroll-wrap">
          {items.map(
            item=>(
              <Rectangle 
                key={item.id} 
                left={item.left} 
                top={item.top} 
                width={item.width} 
                height={item.height} 
                bg={item.bgColor} 
                selected={item.id===selectedId} 
                onclick={()=>setselecteddId(item.id)}
              />
            )
          )}
          {/* Your horizontal content goes here */}
        </div>
      </main>

      <aside className="rightbar">
        <button onClick={()=>BGofCont("black")}>Black</button>
        <button onClick={()=>BGofCont("red")}>Red</button>
        <button onClick={()=>BGofCont("white")}>White</button>
        {/* right-sidebar content */}
      </aside>

      <footer className="bottombar">
        <p>Copyright bro</p>
      </footer>
    </div>
  );
}
