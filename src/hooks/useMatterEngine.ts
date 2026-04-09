import { useEffect, useRef } from "react";
import Matter from "matter-js";

const { Engine, Runner, Bodies, Composite } = Matter;

export function useMatterEngine(width: number, height: number) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);

  useEffect(() => {
    const engine = Engine.create({ gravity: { y: 0.5 } });
    engineRef.current = engine;

    const walls = [
      Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
      Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
      Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
      Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }),
    ];

    const balls = Array.from({ length: 8 }, () =>
      Bodies.circle(
        Math.random() * (width - 80) + 40,
        Math.random() * (height / 2),
        20 + Math.random() * 20,
        { restitution: 0.8, friction: 0.01 },
      ),
    );

    Composite.add(engine.world, [...walls, ...balls]);
    bodiesRef.current = balls;

    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(engine.world, false);
    };
  }, [width, height]);

  return { engineRef, bodiesRef };
}
