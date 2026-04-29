import Sketch from "react-p5";
import Matter from "matter-js";
import {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { usePolygonArena } from "../hooks/usePolygonArena";
import { useSlingshot } from "../hooks/useSlingshot";
import type p5Types from "p5";

const WIDTH = 600;
const HEIGHT = 600;

export interface SimulatorCanvasHandle {
  addBall: () => void;
  resetBalls: () => void;
  launchRandom: () => void;
}

interface SimulatorCanvasProps {
  sides: number;
  friction: number;
  pointCollision: boolean;
  editMode: boolean;
  vertexValues: number[];
  setVertexValues: (value: number[]) => void;
}

export const SimulatorCanvas = forwardRef<
  SimulatorCanvasHandle,
  SimulatorCanvasProps
>(
  (
    {
      sides,
      friction,
      pointCollision,
      editMode,
      vertexValues,
      setVertexValues,
    },
    ref,
  ): React.ReactElement => {
    const engineRef = useRef<Matter.Engine | null>(null);
    const bodiesRef = useRef<Matter.Body[]>([]);
    const [, forceUpdate] = useState<number>(0);
    const [engineReady, setEngineReady] = useState(false);
    const dragVertexRef = useRef<number | null>(null);
    const makeCollisionRadius = () => (pointCollision ? 4 : 18);
    const frictionRef = useRef(friction);

    useImperativeHandle(ref, () => ({
      addBall,
      launchRandom,
      resetBalls,
    }));

    useEffect(() => {
      frictionRef.current = friction;
    }, [friction]);

    useEffect(() => {
      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 0 },
        positionIterations: 20,
        velocityIterations: 16,
      });
      engine.constraintIterations = 4;
      (Matter.Resolver as any)._slop = 0;
      (engine as any).enableSleeping = false;
      (Matter.Resolver as any)._restingThresh = 0.001;
      (Matter.Resolver as any)._restingThreshTangent = 0.001;
      engineRef.current = engine;
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);

      Matter.Events.on(engine, "collisionStart", (event) => {
        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          if ((bodyA as any).isWaiting) (bodyA as any).isWaiting = false;
          if ((bodyB as any).isWaiting) (bodyB as any).isWaiting = false;
        });
      });

      Matter.Events.on(engine, "beforeUpdate", () => {
        bodiesRef.current.forEach((ball) => {
          if ((ball as any).isWaiting) return;

          const vel = ball.velocity;
          const speed = Matter.Body.getSpeed(ball);

          if (speed < 0.2) {
            Matter.Body.setVelocity(ball, { x: 0, y: 0 });
            return;
          }

          const drag = frictionRef.current / speed;
          const factor = Math.max(0, 1 - drag);
          Matter.Body.setVelocity(ball, {
            x: vel.x * factor,
            y: vel.y * factor,
          });
        });
      });

      const ball = Matter.Bodies.circle(
        WIDTH / 2,
        HEIGHT / 2,
        makeCollisionRadius(),
        {
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          slop: 0,
          label: "ball",
        },
      );
      (ball as any).visualRadius = 18;
      (ball as any).usePointStyle = pointCollision;
      Matter.Composite.add(engine.world, ball);
      bodiesRef.current = [ball];

      setEngineReady(true);

      return () => {
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
        Matter.Composite.clear(engine.world, false);
        engineRef.current = null;
        bodiesRef.current = [];
      };
    }, []);

    const { outerVertsRef, innerVertsRef } = usePolygonArena(
      engineReady ? engineRef.current : null,
      sides,
      WIDTH,
      HEIGHT,
      vertexValues,
    );

    const { dragState, ...slingshotHandlers } = useSlingshot(bodiesRef);

    const onMouseDown = (p5: p5Types) => {
      if (editMode) {
        const verts = innerVertsRef.current;
        for (let i = 0; i < verts.length; i++) {
          const d = Math.hypot(p5.mouseX - verts[i].x, p5.mouseY - verts[i].y);
          if (d < 14) {
            dragVertexRef.current = i;
            return;
          }
        }
        return;
      }
      slingshotHandlers.onMouseDown(p5);
    };

    const onMouseDrag = (p5: p5Types) => {
      if (editMode && dragVertexRef.current !== null) {
        const i = dragVertexRef.current;
        const cx = WIDTH / 2,
          cy = HEIGHT / 2;
        const outer = outerVertsRef.current[i];
        const axisLen = Math.hypot(outer.x - cx, outer.y - cy);
        const axisDx = (outer.x - cx) / axisLen;
        const axisDy = (outer.y - cy) / axisLen;
        const dot = (p5.mouseX - cx) * axisDx + (p5.mouseY - cy) * axisDy;
        const t = Math.max(0, Math.min(axisLen, dot)) / axisLen;
        const next = [...vertexValues];
        next[i] = Math.round(t * 10);
        setVertexValues(next);
        return;
      }
      slingshotHandlers.onMouseDrag(p5);
    };

    const onMouseRelease = (p5: p5Types) => {
      if (editMode) {
        dragVertexRef.current = null;
        return;
      }
      slingshotHandlers.onMouseRelease(p5);
    };

    const addBall = () => {
      if (!engineRef.current) return;
      const ball = Matter.Bodies.circle(
        WIDTH / 2,
        HEIGHT / 2,
        makeCollisionRadius(),
        {
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          label: "ball",
        },
      );
      (ball as any).isWaiting = true;
      (ball as any).visualRadius = 18;
      (ball as any).usePointStyle = pointCollision;
      Matter.Composite.add(engineRef.current.world, ball);
      bodiesRef.current = [...bodiesRef.current, ball];
      forceUpdate((n) => n + 1);
    };

    const resetBalls = () => {
      if (!engineRef.current) return;
      const balls = Matter.Composite.allBodies(engineRef.current.world).filter(
        (b) => b.label === "ball",
      );
      Matter.Composite.remove(engineRef.current.world, balls);

      const ball = Matter.Bodies.circle(
        WIDTH / 2,
        HEIGHT / 2,
        makeCollisionRadius(),
        {
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          slop: 0,
          label: "ball",
        },
      );
      (ball as any).visualRadius = 18;
      (ball as any).usePointStyle = pointCollision;
      Matter.Composite.add(engineRef.current.world, ball);
      bodiesRef.current = [ball];
      forceUpdate((n) => n + 1);
    };

    const launchRandom = () => {
      const speed = 25;

      bodiesRef.current.forEach((ball) => {
        (ball as any).isWaiting = false;
        const angle = Math.random() * Math.PI * 2;
        Matter.Body.setVelocity(ball, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        });
      });
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

      const outerVerts = outerVertsRef.current;
      if (outerVerts.length > 0) {
        p5.stroke(180, 30, 40);
        p5.strokeWeight(1);
        (p5.drawingContext as CanvasRenderingContext2D).setLineDash([4, 6]);
        p5.noFill();
        p5.beginShape();
        outerVerts.forEach((v) => p5.vertex(v.x, v.y));
        p5.endShape(p5.CLOSE);
        (p5.drawingContext as CanvasRenderingContext2D).setLineDash([]);
      }

      const innerVerts = innerVertsRef.current;
      if (innerVerts.length > 0) {
        p5.stroke(180, 60, 70);
        p5.strokeWeight(3);
        p5.noFill();
        p5.beginShape();
        innerVerts.forEach((v) => p5.vertex(v.x, v.y));
        p5.endShape(p5.CLOSE);

        if (editMode) {
          innerVerts.forEach((v, i) => {
            p5.noStroke();
            p5.fill(60, 80, 100);
            p5.circle(v.x, v.y, dragVertexRef.current === i ? 16 : 10);
          });
        }
      }

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
        const isWaiting = (body as any).isWaiting;
        const r = (body as any).visualRadius ?? body.circleRadius;
        const usePointStyle = (body as any).usePointStyle;

        if (usePointStyle) {
          p5.stroke(hue, 75, 95);
          p5.strokeWeight(2);
          p5.fill(hue, 30, 20, 15);
          p5.circle(body.position.x, body.position.y, r * 2);

          p5.fill(hue, 90, 100);
          p5.noStroke();
          p5.circle(body.position.x, body.position.y, 6);
        } else {
          p5.noStroke();
          p5.fill(hue, isWaiting ? 40 : 75, isWaiting ? 70 : 95);
          p5.circle(body.position.x, body.position.y, r * 2);
        }

        if (isWaiting && !dragState) {
          p5.stroke(hue, 60, 100);
          p5.strokeWeight(1.5);
          p5.noFill();
          p5.circle(body.position.x, body.position.y, r * 2 + 10);
        }
      });
    };

    return (
      <div style={{ width: "600px", flexShrink: 0 }}>
        <Sketch
          setup={setup}
          draw={draw}
          mousePressed={onMouseDown}
          mouseDragged={onMouseDrag}
          mouseReleased={onMouseRelease}
        />
      </div>
    );
  },
);
