import "./style/scrollbar.css"
import React, { useState, useRef, type CSSProperties } from "react";
import type { ShapeProps } from "../App";
type EdgeHandle = "top" | "right" | "bottom" | "left";
type Point = { x: number; y: number };
type Dims = { width: number; height: number };


export default function Rectangle(
  {left,top,width,height,bg,textsize,selected,onclick}: ShapeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [dims, setDims] = useState<Dims>({ width: width, height: height });
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState<Point>({ x: left, y: top });
  const [editing, setEditing] = useState(false);

  // refs
  const resizingRef = useRef<EdgeHandle | null>(null);
  const dragRef = useRef(false);

  const startDims = useRef<Dims>({ width: 0, height: 0 });
  const startMouse = useRef<Point>({ x: 0, y: 0 });
  const startPos = useRef<Point>({ x: 0, y: 0 });

  // Handlers
  const handleResizeMouseDown = (edge: EdgeHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);

    resizingRef.current = edge;
    startDims.current = { ...dims };
    startPos.current = { ...pos };
    startMouse.current = { x: e.clientX, y: e.clientY };

    window.addEventListener("mousemove", onResizeMouseMove);
    window.addEventListener("mouseup", onResizeMouseUp);
  };

  const onResizeMouseMove = (e: MouseEvent) => {
    const edge = resizingRef.current;
    if (!edge) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    let newW = startDims.current.width;
    let newH = startDims.current.height;
    let newX = startPos.current.x;
    let newY = startPos.current.y;

    if (edge === "right") newW += dx;
    if (edge === "left") { newW -= dx; newX += dx; }
    if (edge === "bottom") newH += dy;
    if (edge === "top") { newH -= dy; newY += dy; }

    setDims({ width: Math.max(newW, 50), height: Math.max(newH, 30) });
    setPos({ x: newX, y: newY });
  };

  const onResizeMouseUp = () => {
    resizingRef.current = null;
    window.removeEventListener("mousemove", onResizeMouseMove);
    window.removeEventListener("mouseup", onResizeMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (resizingRef.current || editing) return;
    dragRef.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };

    window.addEventListener("mousemove", onDragMouseMove);
    window.addEventListener("mouseup", onDragMouseUp);
  };

  const onDragMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    setPos({ x: startPos.current.x + dx, y: startPos.current.y + dy });
  };

  const onDragMouseUp = () => {
    dragRef.current = false;
    window.removeEventListener("mousemove", onDragMouseMove);
    window.removeEventListener("mouseup", onDragMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
    dragRef.current = false;
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleBlur = () => setEditing(false);

  // Styles
  const containerStyle: CSSProperties = {
    position: "absolute",
    left: pos.x,
    top: pos.y,
    width: dims.width,
    height: dims.height,
    border:selected?"2px solid blue":"none",
    //border: "2px solid black",
    background: "transparent",
    cursor: editing ? "text" : (dragRef.current ? "grabbing" : "grab"),
  };

  const textareaStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    border: "none",
    background: bg,
    padding: 8,
    fontSize: textsize,
    resize: "none",
    pointerEvents: editing ? "auto" : "none",
  };

  const handleStyle = (posHandle: EdgeHandle): CSSProperties => {
    const size = 12;
    const offset = -size / 2;
    const base: CSSProperties = {
      width: size,
      height: size,
      backgroundColor: "white",
      border: "2px solid #333",
      borderRadius: "50%",
      position: "absolute",
      display: hovered || Boolean(resizingRef.current) ? "block" : "none",
      cursor: (posHandle === "top" || posHandle === "bottom") ? "ns-resize" : "ew-resize",
    };
    switch (posHandle) {
      case "top":
        return { ...base, top: offset, left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { ...base, bottom: offset, left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { ...base, left: offset, top: "50%", transform: "translateY(-50%)" };
      case "right":
        return { ...base, right: offset, top: "50%", transform: "translateY(-50%)" };
    }
  };

  return (
    <div
      onClick={onclick}
      ref={textareaRef as React.Ref<HTMLDivElement>}
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <textarea
        ref={textareaRef}
        style={textareaStyle}
        className="scrollbar"
        onBlur={handleBlur}
        defaultValue={"text"}
      />
      {(["top", "right", "bottom", "left"] as EdgeHandle[]).map(handle => (
        <div
          key={handle}
          style={handleStyle(handle)}
          onMouseDown={e => handleResizeMouseDown(handle, e)}
        />
      ))}
    </div>
  );
}