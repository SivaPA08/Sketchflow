import React, { useRef } from "react"
import type { CSSProperties } from "react"

export default function Rect() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const style: CSSProperties = {
    border: "5px solid black",
    padding: "10px",
    minWidth: "100px",
    minHeight: "100px",
    backgroundColor: "red",
    resize: "none",
    width: "300px",
    height: "150px",
    boxSizing: "border-box",
  }

  const ballStyle: CSSProperties = {
    width: "14px",
    height: "14px",
    backgroundColor: "blue",
    borderRadius: "50%",
    position: "absolute",
    zIndex: 1000,      // make sure it's above textarea
    opacity: 0,        // hidden by default
    transition: "opacity 0.3s ease",
    border: "2px solid white",  // White border for better visibility
    boxSizing: "border-box",
  }

  const handleMouseDown =
    (direction: "top" | "right" | "bottom" | "left") =>
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!textareaRef.current) return

      const startX = e.clientX
      const startY = e.clientY
      const startWidth = textareaRef.current.offsetWidth
      const startHeight = textareaRef.current.offsetHeight

      function onMouseMove(event: MouseEvent) {
        if (!textareaRef.current) return
        const dx = event.clientX - startX
        const dy = event.clientY - startY

        if (direction === "right") {
          textareaRef.current.style.width = `${startWidth + dx}px`
        } else if (direction === "left") {
          textareaRef.current.style.width = `${startWidth - dx}px`
        } else if (direction === "bottom") {
          textareaRef.current.style.height = `${startHeight + dy}px`
        } else if (direction === "top") {
          textareaRef.current.style.height = `${startHeight - dy}px`
        }
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    }

  return (
    <>
      <style>{`
        .resizable-container:hover .resizer-ball {
          opacity: 1 !important;
        }
      `}</style>

      <div
        className="resizable-container"
        style={{ position: "relative", display: "inline-block" }}
      >
        <textarea
          ref={textareaRef}
          id="rect"
          style={style}
          defaultValue="Text"
        />

        {/* Top ball */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            top: "-10px",       // a bit above the border
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "ns-resize",
          }}
          onMouseDown={handleMouseDown("top")}
          title="Resize Top"
        />

        {/* Right ball */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            right: "-10px",     // outside right border
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "ew-resize",
          }}
          onMouseDown={handleMouseDown("right")}
          title="Resize Right"
        />

        {/* Bottom ball */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            bottom: "-10px",    // outside bottom border
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "ns-resize",
          }}
          onMouseDown={handleMouseDown("bottom")}
          title="Resize Bottom"
        />

        {/* Left ball */}
        <div
          className="resizer-ball"
          style={{
            ...ballStyle,
            left: "-10px",      // outside left border
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "ew-resize",
          }}
          onMouseDown={handleMouseDown("left")}
          title="Resize Left"
        />
      </div>
    </>
  )
}
