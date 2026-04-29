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
  onResetBalls: () => void;
  onLaunchRandom: () => void;
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
  onLaunchRandom,
  onResetBalls,
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
          max="3"
          step="0.01"
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

      <button className="controls-button" onClick={onResetBalls}>
        Resetar bolas
      </button>
      <button className="controls-button" onClick={onLaunchRandom}>
        Lançar aleatório
      </button>

      {editMode &&
        vertexValues.map((val, i) => (
          <div key={i} className="controls-vertex">
            <span className="controls-label-text">V{i + 1}</span>
            <div className="controls-vertex-input">
              <button
                onClick={() => {
                  const next = [...vertexValues];
                  next[i] = Math.max(0, val - 1);
                  setVertexValues(next);
                }}
              >
                −
              </button>
              <input
                type="number"
                min="0"
                max="10"
                value={val}
                onChange={(e) => {
                  const next = [...vertexValues];
                  next[i] = Math.max(0, Math.min(10, Number(e.target.value)));
                  setVertexValues(next);
                }}
              />
              <button
                onClick={() => {
                  const next = [...vertexValues];
                  next[i] = Math.min(10, val + 1);
                  setVertexValues(next);
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
