interface ControlsProps {
  sides: number;
  setSides: (value: number) => void;
  friction: number;
  setFriction: (value: number) => void;
  pointCollision: boolean;
  setPointCollision: (value: boolean) => void;
  onAddBall: () => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  vertexValues: number[];
  setVertexValues: (value: number[]) => void;
}

export function Controls({
  sides,
  setSides,
  friction,
  setFriction,
  pointCollision,
  setPointCollision,
  onAddBall,
  editMode,
  setEditMode,
  vertexValues,
  setVertexValues,
}: ControlsProps) {
  return (
    <div className="controls">
      <button className="controls-button" onClick={onAddBall}>
        + Adicionar bola
      </button>

      <label className="controls-label">
        Lados do polígono: <strong>{sides}</strong>
        <input
          type="range"
          min="3"
          max="12"
          value={sides}
          onChange={(e) => setSides(Number(e.target.value))}
        />
      </label>

      <label className="controls-label">
        Fricção: <strong>{friction.toFixed(3)}</strong>
        <input
          type="range"
          min="0"
          max="0.05"
          step="0.001"
          value={friction}
          onChange={(e) => setFriction(Number(e.target.value))}
        />
      </label>

      <label className="controls-checkbox">
        <input
          type="checkbox"
          checked={pointCollision}
          onChange={(e) => setPointCollision(e.target.checked)}
        />
        Colisão pelo centro
      </label>

      <button
        className={`controls-button ${editMode ? "controls-button--active" : ""}`}
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "✓ Editando forma" : "Editar forma"}
      </button>

      {editMode &&
        vertexValues.map((val, i) => (
          <label key={i} className="controls-label">
            Vértice {i + 1}: <strong>{val}</strong>
            <input
              type="range"
              min="0"
              max="10"
              value={val}
              onChange={(e) => {
                const next = [...vertexValues];
                next[i] = Number(e.target.value);
                setVertexValues(next);
              }}
            />
          </label>
        ))}
    </div>
  );
}
