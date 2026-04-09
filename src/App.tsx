import { useState } from "react";
import { SimulatorCanvas } from "./components/SimulatorCanvas";
import { Controls } from "./components/Controls";
import "./App.css";

export default function App() {
  const [sides, setSides] = useState<number>(6);
  const [friction, setFriction] = useState<number>(0.008);

  return (
    <main className="app">
      <SimulatorCanvas sides={sides} friction={friction} />
      <Controls
        sides={sides}
        setSides={setSides}
        friction={friction}
        setFriction={setFriction}
      />
    </main>
  );
}
