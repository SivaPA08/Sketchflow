import "./App.css";
import "./styles/shapes.css"
import Rectangle from "./comp/Rectangle";
import {useRef, useState} from "react";

interface Item{
  id:number;
  left:number;
  top:number;
  width:number;
  height:number;
}
export default function App() {
  const [items,setitems]=useState<Item[]>([]);
  const boardRef=useRef<HTMLDivElement|null>(null);
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
    }
    setitems(prev=>[...prev,newItem]);
    
  }
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

      <main className="board" ref={boardRef}>
        <div className="scroll-wrap">
          {items.map(
            item=>(
              <Rectangle key={item.id} left={item.left} top={item.top} width={item.width} height={item.height}/>
            )
          )}
          {/* Your horizontal content goes here */}
        </div>
      </main>

      <aside className="rightbar">
        {/* right-sidebar content */}
      </aside>

      <footer className="bottombar">
        <p>Copyright bro</p>
      </footer>
    </div>
  );
}
