import { useEffect, useRef, type RefObject } from "react";
import Matter from "matter-js";

export function usePolygonArena(
  engine: Matter.Engine | null,
  sides: number,
  width: number,
  height: number,
): RefObject<{ x: number; y: number; }[]> {
  const vertsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!engine) return;

    const { Bodies, Composite } = Matter;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;

    const old = Composite.allBodies(engine.world).filter(
      (b) => b.isStatic && b.label === "wall",
    );
    Composite.remove(engine.world, old);

    const walls = [];
    for (let i = 0; i < sides; i++) {
      const a1 = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 1) / sides) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + radius * Math.cos(a1);
      const y1 = cy + radius * Math.sin(a1);
      const x2 = cx + radius * Math.cos(a2);
      const y2 = cy + radius * Math.sin(a2);

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1);

      walls.push(
        Bodies.rectangle(mx, my, len, 8, {
          isStatic: true,
          angle,
          restitution: 1,
          friction: 0,
          frictionStatic: 0,
          slop: 0,
          label: "wall",
        }),
      );
    }

    const verts = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      verts.push({
        x: cx + radius * Math.cos(a),
        y: cy + radius * Math.sin(a),
      });
    }
    vertsRef.current = verts;

    Composite.add(engine.world, walls);
  }, [engine, sides, width, height]);

  return vertsRef;
}
