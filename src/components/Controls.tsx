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
    <div className="flex flex-col gap-4 w-56 font-mono">
      <div className="flex flex-col gap-2 border-b border-crt-border pb-4">
        <span className="text-[10px] tracking-[0.2em] text-crt-dim uppercase">
          Ações
        </span>
        {[
          { label: "+ Adicionar bola", fn: onAddBall },
          { label: "⟳ Resetar bolas", fn: onResetBalls },
          { label: "▸ Lançar aleatório", fn: onLaunchRandom },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            className="w-full text-left text-sm px-3 py-1.5
                       border border-crt-border
                       text-crt-primary
                       hover:bg-crt-border
                       hover:shadow-[0_0_8px_rgba(0,229,204,0.3)]
                       transition-all duration-150 uppercase tracking-wider"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-b border-crt-border pb-4">
        <span className="text-[10px] tracking-[0.2em] text-crt-dim uppercase">
          Parâmetros
        </span>

        {[
          {
            label: "Lados",
            value: sides,
            min: 3,
            max: 12,
            step: 1,
            set: setSides,
          },
          {
            label: "Fricção",
            value: friction,
            min: 0,
            max: 3,
            step: 0.1,
            set: setFriction,
          },
        ].map(({ label, value, min, max, step, set }) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-crt-dim uppercase tracking-wider">
                {label}
              </span>
              <span className="text-crt-amber">
                {typeof value === "number" && !Number.isInteger(value)
                  ? value.toFixed(1)
                  : value}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full accent-crt-primary cursor-pointer"
            />
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer text-crt-dim hover:text-crt-primary transition-colors">
        <input
          type="checkbox"
          checked={pointCollision}
          onChange={(e) => setPointCollision(e.target.checked)}
          className="accent-crt-primary"
        />
        Colisão pelo centro
      </label>

      <div className="flex flex-col gap-3 border-t border-crt-border pt-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`w-full text-left text-sm px-3 py-1.5 border uppercase tracking-wider transition-all duration-150
            ${
              editMode
                ? "border-crt-primary text-crt-bg bg-crt-primary"
                : "border-crt-border text-crt-primary hover:bg-crt-border"
            }`}
        >
          {editMode ? "✓ Editando forma" : "⬡ Editar forma"}
        </button>

        {editMode && (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {vertexValues.map((val, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-crt-dim uppercase text-[10px] tracking-wider">
                  V{i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const n = [...vertexValues];
                      n[i] = Math.max(0, val - 1);
                      setVertexValues(n);
                    }}
                    className="w-5 h-5 border border-crt-border text-crt-primary hover:bg-crt-border transition-colors text-xs"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={val}
                    onChange={(e) => {
                      const n = [...vertexValues];
                      n[i] = Math.max(0, Math.min(10, Number(e.target.value)));
                      setVertexValues(n);
                    }}
                    className="w-8 text-center bg-transparent border border-crt-border text-crt-amber text-xs py-0.5
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => {
                      const n = [...vertexValues];
                      n[i] = Math.min(10, val + 1);
                      setVertexValues(n);
                    }}
                    className="w-5 h-5 border border-crt-border text-crt-primary hover:bg-crt-border transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
