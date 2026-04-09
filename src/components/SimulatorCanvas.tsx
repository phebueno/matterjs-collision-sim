import Sketch from "react-p5";
import Matter from "matter-js";
import { useMatterEngine } from "../hooks/useMatterEngine";

const WIDTH = 600;
const HEIGHT = 400;

export function SimulatorCanvas() {
  const { engineRef, bodiesRef } = useMatterEngine(WIDTH, HEIGHT);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    p5.colorMode(p5.HSB, 360, 100, 100);
  };

  const draw = (p5) => {
    p5.background(220, 20, 12);

    bodiesRef.current.forEach((body, i) => {
      const hue = (i * 40) % 360;
      p5.fill(hue, 70, 90);
      p5.noStroke();
      p5.circle(body.position.x, body.position.y, body.circleRadius * 2);
    });
  };

  const mousePressed = (p5) => {
    const newBall = Matter.Bodies.circle(
      p5.mouseX,
      p5.mouseY,
      20 + Math.random() * 20,
      { restitution: 0.8, friction: 0.01 },
    );
    Matter.Composite.add(engineRef.current.world, newBall);
    bodiesRef.current = [...bodiesRef.current, newBall];
  };

  return <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />;
}
