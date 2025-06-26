import { useState, useRef, useEffect, type MouseEvent, type FC } from "react";

export interface LineProps {
    left: number;
    top: number;
    length?: number;
    bg: string;
    selected: boolean;
    onClick: () => void;
}

type Cord = { x1: number; y1: number; x2: number; y2: number };

const NormalLine: FC<LineProps> = ({
    left,
    top,
    length: defaultLength = 100,
    bg,
    selected,
    onClick,
}) => {
    const [cord, setCord] = useState<Cord>({
        x1: left,
        y1: top,
        x2: left + defaultLength,
        y2: top,
    });
    const dragging = useRef<"line" | "start" | "end" | null>(null);
    const offset = useRef({ x: 0, y: 0 });
    const [ishover,setishover]=useState<boolean>(false)
    const length = Math.hypot(cord.x2 - cord.x1, cord.y2 - cord.y1);
    const angle =
        (Math.atan2(cord.y2 - cord.y1, cord.x2 - cord.x1) * 180) / Math.PI;
    const midX = (cord.x1 + cord.x2) / 2;
    const midY = (cord.y1 + cord.y2) / 2;

    function onMouseDownPart(
        part: "line" | "start" | "end",
        e: MouseEvent<HTMLDivElement>
    ) {
        e.stopPropagation();
        if (part === "line") {
            onClick();
        }
        dragging.current = part;
        offset.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseMove(e: MouseEvent) {
        if (!dragging.current) return;
        const dx = e.clientX - offset.current.x;
        const dy = e.clientY - offset.current.y;

        setCord((prev) => {
            if (dragging.current === "line") {
                return {
                    x1: prev.x1 + dx,
                    y1: prev.y1 + dy,
                    x2: prev.x2 + dx,
                    y2: prev.y2 + dy,
                };
            }
            if (dragging.current === "start") {
                return { ...prev, x1: prev.x1 + dx, y1: prev.y1 + dy };
            }
            return { ...prev, x2: prev.x2 + dx, y2: prev.y2 + dy };
        });

        offset.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseUp() {
        dragging.current = null;
    }

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove as any);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove as any);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return (
        <>
            <div
                onMouseDown={(e) => onMouseDownPart("line", e)}
                onMouseEnter={()=>setishover(true)}
                onMouseLeave={()=>setishover(false)}
                style={{
                    position: "absolute",
                    left: midX - length / 2,
                    top: midY - 2.5,
                    width: length,
                    height: 0,
                    border: "2px solid " + bg,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "center",
                    cursor: "grab",
                }}
            />

            <div
                onMouseDown={(e) => onMouseDownPart("start", e)}
                onMouseEnter={()=>setishover(true)}
                onMouseLeave={()=>setishover(false)}
                style={{
                    position: "absolute",
                    left: cord.x1 - 8,
                    top: cord.y1 - 8,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: (selected || ishover)? "white" : "transparent",
                    cursor: "pointer",
                    border:(selected || ishover)?"1px solid black":"none",
                }}
            />

            <div
                onMouseDown={(e) => onMouseDownPart("end", e)}
                onMouseEnter={()=>setishover(true)}
                onMouseLeave={()=>setishover(false)}
                style={{
                    position: "absolute",
                    left: cord.x2 - 8,
                    top: cord.y2 - 8,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: (selected || ishover)? "white" : "transparent",
                    cursor: "pointer",
                    border:(selected || ishover)?"1px solid black":"none"
                }}
            />
        </>
    );
};

export default NormalLine;
