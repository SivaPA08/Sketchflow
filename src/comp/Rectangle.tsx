import { useState, useRef, type CSSProperties, type MouseEvent } from "react";

type Point = { x: number; y: number };

export default function Rectangle() {
  const [pos, setPos] = useState<Point>({ x: 50, y: 50 });
  const dragging = useRef(false);
  const startPointer = useRef<Point>({ x: 0, y: 0 });
  const startPos = useRef<Point>({ x: 0, y: 0 });

  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    dragging.current = true;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
    window.addEventListener('mousemove', onMouseMove as any)
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    setPos({
      x: startPos.current.x + dx,
      y: startPos.current.y + dy,
    });
  }

  function onMouseUp() {
    dragging.current = false;
    window.removeEventListener('mousemove', onMouseMove as any);
    window.removeEventListener('mouseup', onMouseUp);
  }

  const style: CSSProperties = {
    width: '100px',
    height: '100px',
    backgroundColor: 'red',
    position: 'absolute',
    left: pos.x,
    top: pos.y,
    cursor: 'grab',
  };

  return <div style={style} onMouseDown={onMouseDown} />;
}
