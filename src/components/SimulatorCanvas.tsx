import Sketch from "react-p5";
import Matter from "matter-js";
import { useRef, useEffect, useState } from "react";
import { usePolygonArena } from "../hooks/usePolygonArena";
import { useSlingshot } from "../hooks/useSlingshot";
import type p5Types from "p5";

const WIDTH = 600;
const HEIGHT = 600;

interface SimulatorCanvasProps {
  sides: number;
  friction: number;
}

export function SimulatorCanvas({ sides, friction }: SimulatorCanvasProps) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const [, forceUpdate] = useState<number>(0);

  useEffect(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, 18, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      label: "ball",
    });
    Matter.Composite.add(engine.world, ball);
    bodiesRef.current = [ball];

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(engine.world, false);
      engineRef.current = null;
      bodiesRef.current = [];
    };
  }, []);

  useEffect(() => {
    bodiesRef.current.forEach((b) => {
      b.frictionAir = friction;
    });
  }, [friction]);

  usePolygonArena(engineRef.current, sides, WIDTH, HEIGHT);

  const { dragState, onMouseDown, onMouseDrag, onMouseRelease } =
    useSlingshot(bodiesRef);

  const addBall = () => {
    if (!engineRef.current) return;
    const ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, 18, {
      restitution: 1,
      friction: 0,
      frictionAir: friction,
      label: "ball",
    });
    (ball as any).isWaiting = true;
    Matter.Composite.add(engineRef.current.world, ball);
    bodiesRef.current = [...bodiesRef.current, ball];
    forceUpdate((n) => n + 1);
  };

  const setup = (p5: p5Types, parent: Element) => {
    p5.createCanvas(WIDTH, HEIGHT).parent(parent);
    p5.colorMode(p5.HSB, 360, 100, 100);
  };

  const draw = (p5: p5Types) => {
    p5.background(230, 25, 10);

    if (!engineRef.current) return;

    bodiesRef.current.forEach((body) => {
      if ((body as any).isWaiting) {
        Matter.Body.setPosition(body, { x: WIDTH / 2, y: HEIGHT / 2 });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
      }
    });

    const walls = Matter.Composite.allBodies(engineRef.current.world).filter(
      (b) => b.label === "wall",
    );

    p5.fill(180, 60, 70);
    p5.noStroke();
    walls.forEach((wall) => {
      const verts = wall.vertices;
      p5.beginShape();
      verts.forEach((v) => p5.vertex(v.x, v.y));
      p5.endShape(p5.CLOSE);
    });

    if (dragState) {
      p5.stroke(60, 80, 90);
      p5.strokeWeight(2);
      p5.line(dragState.bx, dragState.by, dragState.mx, dragState.my);
      p5.noFill();
      p5.stroke(60, 60, 60);
      p5.strokeWeight(1);
      p5.circle(dragState.bx, dragState.by, 36 + 8);
    }

    bodiesRef.current.forEach((body, i) => {
      const hue = (i * 55) % 360;
      const isStatic = body.isStatic;
      p5.noStroke();
      p5.fill(hue, isStatic ? 40 : 75, isStatic ? 70 : 95);
      p5.circle(body.position.x, body.position.y, body.circleRadius * 2);

      if (isStatic && !dragState) {
        p5.stroke(hue, 60, 100);
        p5.strokeWeight(1.5);
        p5.noFill();
        p5.circle(body.position.x, body.position.y, body.circleRadius * 2 + 10);
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={onMouseDown}
        mouseDragged={onMouseDrag}
        mouseReleased={onMouseRelease}
      />
      <button
        onClick={addBall}
        style={{ padding: "8px 24px", borderRadius: "6px", cursor: "pointer" }}
      >
        + Adicionar bola
      </button>
    </div>
  );
}
