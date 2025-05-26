import React, { useRef } from "react";
import type { CSSProperties } from "react";

export default function Rect({
  impstyle,
  mousedown,
}: {
  impstyle: CSSProperties;
  mousedown: React.MouseEventHandler<HTMLTextAreaElement>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const containerStyle: CSSProperties = {
    position: "absolute",      // moved here
    display: "inline-block",   // keep inline
    ...impstyle,               // your x/y from App
  };

  const textareaStyle: CSSProperties = {
    border: "5px solid black",
    padding: "10px",
    minWidth: "100px",
    minHeight: "100px",
    backgroundColor: "red",
    resize: "none",
    width: "300px",
    height: "150px",
    boxSizing: "border-box",
  };

  const ballStyle: CSSProperties = {
    width: "14px",
    height: "14px",
    backgroundColor: "blue",
    borderRadius: "50%",
    position: "absolute",
    zIndex: 1000,
    opacity: 0,
    transition: "opacity 0.3s ease",
    border: "2px solid white",
    boxSizing: "border-box",
  };

  const handleMouseDown =
    (direction: "top" | "right" | "bottom" | "left") =>
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!textareaRef.current) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = textareaRef.current.offsetWidth;
      const startH = textareaRef.current.offsetHeight;

      function onMouseMove(evt: MouseEvent) {
        if (!textareaRef.current) return;
        const dx = evt.clientX - startX;
        const dy = evt.clientY - startY;
        if (direction === "right") {
          textareaRef.current.style.width = `${startW + dx}px`;
        } else if (direction === "left") {
          textareaRef.current.style.width = `${startW - dx}px`;
        } else if (direction === "bottom") {
          textareaRef.current.style.height = `${startH + dy}px`;
        } else {
          textareaRef.current.style.height = `${startH - dy}px`;
        }
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

  return (
    <>
      <style>{`
        .resizable-container:hover .resizer-ball {
          opacity: 1 !important;
        }
      `}</style>

      <div className="resizable-container" style={containerStyle}>
        <textarea
          ref={textareaRef}
          style={textareaStyle}
          defaultValue="Text"
          onMouseDown={mousedown}
        />

        {/* Top */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "ns-resize",
          }}
          onMouseDown={handleMouseDown("top")}
        />
        {/* Right */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            right: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "ew-resize",
          }}
          onMouseDown={handleMouseDown("right")}
        />
        {/* Bottom */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "ns-resize",
          }}
          onMouseDown={handleMouseDown("bottom")}
        />
        {/* Left */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "ew-resize",
          }}
          onMouseDown={handleMouseDown("left")}
        />
      </div>
    </>
  );
}
