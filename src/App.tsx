import { useState } from "react";
import { SimulatorCanvas } from "./components/SimulatorCanvas";
import { Controls } from "./components/Controls";
import "./App.css";

export default function App() {
  const [sides, setSides] = useState<number>(5);
  const [friction, setFriction] = useState<number>(0.008);
  const [pointCollision, setPointCollision] = useState<boolean>(false);

  return (
    <main className="app">
      <SimulatorCanvas
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
      />
    </main>
  );
}
