import { useRef, useState } from "react";
import {
  SimulatorCanvas,
  type SimulatorCanvasHandle,
} from "./components/SimulatorCanvas";
import { Controls } from "./components/Controls";

export default function App() {
  const [sides, setSides] = useState<number>(5);
  const [friction, setFriction] = useState<number>(0.1);
  const [pointCollision, setPointCollision] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [vertexValues, setVertexValues] = useState<number[]>(Array(6).fill(10));
  const simulatorRef = useRef<SimulatorCanvasHandle>(null);

  const handleSetSides = (n: number) => {
    setSides(n);
    setVertexValues(Array(n).fill(10));
  };

  return (
    <main className="app">
      <h1 className="app-title">Simulador de Colisões</h1>
      <div className="app-content">
        <SimulatorCanvas
          ref={simulatorRef}
          sides={sides}
          friction={friction}
          pointCollision={pointCollision}
          editMode={editMode}
          vertexValues={vertexValues}
          setVertexValues={setVertexValues}
        />
        <Controls
          sides={sides}
          setSides={handleSetSides}
          friction={friction}
          setFriction={setFriction}
          pointCollision={pointCollision}
          setPointCollision={setPointCollision}
          onAddBall={() => simulatorRef.current?.addBall()}
          onResetBalls={() => simulatorRef.current?.resetBalls()}
          onLaunchRandom={() => simulatorRef.current?.launchRandom()}
          editMode={editMode}
          setEditMode={setEditMode}
          vertexValues={vertexValues}
          setVertexValues={setVertexValues}
        />
      </div>
    </main>
  );
}
