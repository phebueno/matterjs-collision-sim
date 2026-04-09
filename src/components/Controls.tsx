interface ControlsProps {
  sides: number;
  setSides: (value: number) => void;
  friction: number;
  setFriction: (value: number) => void;
  pointCollision: boolean;
  setPointCollision: (value: boolean) => void;
}

export function Controls({
  sides,
  setSides,
  friction,
  setFriction,
  pointCollision,
  setPointCollision,
}: ControlsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: 200,
      }}
    >
      <label>
        Lados do polígono: <strong>{sides}</strong>
        <input
          type="range"
          min="3"
          max="12"
          value={sides}
          onChange={(e) => setSides(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label>
        Fricção: <strong>{friction.toFixed(3)}</strong>
        <input
          type="range"
          min="0"
          max="0.05"
          step="0.001"
          value={friction}
          onChange={(e) => setFriction(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={pointCollision}
          onChange={(e) => setPointCollision(e.target.checked)}
        />
        Colisão pelo centro
      </label>
    </div>
  );
}
