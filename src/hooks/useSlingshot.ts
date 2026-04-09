import { useRef, useState } from "react";
import Matter from "matter-js";
import type p5Types from "p5";

interface DragState {
  bx: number;
  by: number;
  mx: number;
  my: number;
}

interface SlingshotHandlers {
  dragState: DragState | null;
  onMouseDown: (p5: p5Types) => void;
  onMouseDrag: (p5: p5Types) => void;
  onMouseRelease: (p5: p5Types) => void;
}

export function useSlingshot(
  bodiesRef: React.RefObject<Matter.Body[]>,
): SlingshotHandlers {
  const dragRef = useRef<{
    body: Matter.Body;
    startX: number;
    startY: number;
  } | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const onMouseDown = (p5: p5Types) => {
    const bodies = bodiesRef.current.filter((b) => b.label === "ball");
    for (const body of bodies) {
      const r = (body as any).visualRadius ?? body.circleRadius;
      const d = Math.hypot(
        p5.mouseX - body.position.x,
        p5.mouseY - body.position.y,
      );
      if (d < r + 8) {
        (body as any).isWaiting = false;
        dragRef.current = {
          body,
          startX: body.position.x,
          startY: body.position.y,
        };
        setDragState({
          bx: body.position.x,
          by: body.position.y,
          mx: p5.mouseX,
          my: p5.mouseY,
        });
        break;
      }
    }
  };

  const onMouseDrag = (p5: p5Types) => {
    if (!dragRef.current) return;
    const { startX, startY, body } = dragRef.current;

    Matter.Body.setPosition(body, { x: p5.mouseX, y: p5.mouseY });
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(body, 0);

    setDragState({ bx: startX, by: startY, mx: p5.mouseX, my: p5.mouseY });
  };
  const onMouseRelease = (p5: p5Types) => {
    if (!dragRef.current) return;
    const { body, startX, startY } = dragRef.current;

    const power = 0.08;
    const vx = (startX - p5.mouseX) * power;
    const vy = (startY - p5.mouseY) * power;

    Matter.Body.setVelocity(body, { x: vx, y: vy });

    dragRef.current = null;
    setDragState(null);
  };

  return { dragState, onMouseDown, onMouseDrag, onMouseRelease };
}
