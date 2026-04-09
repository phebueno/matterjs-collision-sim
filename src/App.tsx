import { useRef, useState } from "react";
import {
  SimulatorCanvas,
  type SimulatorCanvasHandle,
} from "./components/SimulatorCanvas";
import { Controls } from "./components/Controls";

export default function App() {
  const [sides, setSides] = useState<number>(6);
  const [friction, setFriction] = useState<number>(0.008);
  const [pointCollision, setPointCollision] = useState<boolean>(false);
  const simulatorRef = useRef<SimulatorCanvasHandle>(null);

  return (
    <main className="app">
      <h1 className="app-title">Simulador de Colisões</h1>
       <div className="app-content">
        <SimulatorCanvas
          ref={simulatorRef}
          sides={sides}
          friction={friction}
          pointCollision={pointCollision}
        />
        <Controls
          sides={sides}
          setSides={setSides}
          friction={friction}
          setFriction={setFriction}
          pointCollision={pointCollision}
          setPointCollision={setPointCollision}
          onAddBall={() => simulatorRef.current?.addBall()}
        />
      </div>
    </main>
  );
}
