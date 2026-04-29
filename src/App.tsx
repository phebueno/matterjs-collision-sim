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
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="font-mono text-crt-primary text-2xl tracking-[0.3em] uppercase border-b border-crt-border pb-3 w-full text-center">
        ▸ Simulador de Colisões
      </h1>

      <div className="flex flex-row gap-6 items-center">
        <div
          className="relative border-2 border-crt-border p-1 
                        shadow-[0_0_20px_rgba(0,229,204,0.15)] 
                        before:content-[''] before:absolute before:inset-0 
                        before:border before:border-crt-dim before:pointer-events-none"
        >
          <SimulatorCanvas
            ref={simulatorRef}
            sides={sides}
            friction={friction}
            pointCollision={pointCollision}
            editMode={editMode}
            vertexValues={vertexValues}
            setVertexValues={setVertexValues}
          />
        </div>

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
