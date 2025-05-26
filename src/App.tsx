import React, { useState, useEffect, type CSSProperties } from "react";
import Rect from "./comp/rect";

export default function App() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Use React's MouseEvent type for the textarea
  function mousedown(e: React.MouseEvent<HTMLTextAreaElement>) {
    setDrag(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  }

  useEffect(() => {
    function mousemove(e: MouseEvent) {
      if (!drag) return;
      setPos({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }

    function mouseup() {
      setDrag(false);
    }

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [drag, offset]);

  const style: CSSProperties = {
    position: "absolute",
    left: pos.x,
    top: pos.y,
    cursor: drag ? 'grabbing' : 'grab',
  };

  return (
    <div>
      <Rect impstyle={style} mousedown={mousedown} />
    </div>
  );
}
