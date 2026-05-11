"use client";

import { useMemo, useState } from "react";
import { normalize, pct } from "@/lib/prob";

type Preset = "independent" | "correlated" | "anti-correlated" | "diagonal";

// 4x4 joint distributions (unnormalized). Rows = X, Cols = Y.
const PRESETS: Record<Preset, number[][]> = {
  independent: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
  ],
  correlated: [
    [4, 2, 1, 0.5],
    [2, 4, 2, 1],
    [1, 2, 4, 2],
    [0.5, 1, 2, 4],
  ],
  "anti-correlated": [
    [0.5, 1, 2, 4],
    [1, 2, 4, 2],
    [2, 4, 2, 1],
    [4, 2, 1, 0.5],
  ],
  diagonal: [
    [5, 0.2, 0.2, 0.2],
    [0.2, 5, 0.2, 0.2],
    [0.2, 0.2, 5, 0.2],
    [0.2, 0.2, 0.2, 5],
  ],
};

const X_LABELS = ["x₁", "x₂", "x₃", "x₄"];
const Y_LABELS = ["y₁", "y₂", "y₃", "y₄"];

export function JointHeatmap() {
  const [preset, setPreset] = useState<Preset>("correlated");
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const { joint, marginalX, marginalY } = useMemo(() => {
    const raw = PRESETS[preset];
    const flat = raw.flat();
    const norm = normalize(flat);
    const joint: number[][] = [];
    for (let i = 0; i < 4; i++) joint.push(norm.slice(i * 4, i * 4 + 4));
    const marginalX = joint.map((row) => row.reduce((a, b) => a + b, 0));
    const marginalY = Array.from({ length: 4 }, (_, j) =>
      joint.reduce((acc, row) => acc + row[j], 0)
    );
    return { joint, marginalX, marginalY };
  }, [preset]);

  const conditional = useMemo(() => {
    if (hoverRow !== null) {
      const denom = marginalX[hoverRow] || 1e-12;
      return {
        kind: "x" as const,
        row: hoverRow,
        values: joint[hoverRow].map((v) => v / denom),
      };
    }
    if (hoverCol !== null) {
      const denom = marginalY[hoverCol] || 1e-12;
      return {
        kind: "y" as const,
        col: hoverCol,
        values: joint.map((row) => row[hoverCol] / denom),
      };
    }
    return null;
  }, [hoverRow, hoverCol, joint, marginalX, marginalY]);

  const maxJoint = Math.max(...joint.flat());

  const cell = 56;
  const padL = 64;
  const padT = 48;
  const w = padL + cell * 4 + 90;
  const h = padT + cell * 4 + 90;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="Joint distribution heatmap with marginals on the edges"
        style={{ display: "block" }}
      >
        {/* y-axis label (X variable down the side) */}
        <text
          x={16}
          y={padT + (cell * 4) / 2}
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-muted))"
          textAnchor="middle"
          transform={`rotate(-90, 16, ${padT + (cell * 4) / 2})`}
        >
          X
        </text>
        <text
          x={padL + (cell * 4) / 2}
          y={16}
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-muted))"
          textAnchor="middle"
        >
          Y
        </text>

        {/* Column labels */}
        {Y_LABELS.map((l, j) => (
          <text
            key={`yl-${j}`}
            x={padL + j * cell + cell / 2}
            y={padT - 8}
            fontSize={11}
            fontFamily="ui-monospace, monospace"
            fill={hoverCol === j ? "rgb(var(--accent))" : "rgb(var(--ink-muted))"}
            textAnchor="middle"
          >
            {l}
          </text>
        ))}

        {/* Row labels */}
        {X_LABELS.map((l, i) => (
          <text
            key={`xl-${i}`}
            x={padL - 10}
            y={padT + i * cell + cell / 2 + 4}
            fontSize={11}
            fontFamily="ui-monospace, monospace"
            fill={hoverRow === i ? "rgb(var(--accent))" : "rgb(var(--ink-muted))"}
            textAnchor="end"
          >
            {l}
          </text>
        ))}

        {/* Heatmap cells */}
        {joint.map((row, i) =>
          row.map((p, j) => {
            const t = p / (maxJoint || 1);
            const x = padL + j * cell;
            const y = padT + i * cell;
            const isHighlighted = hoverRow === i || hoverCol === j;
            return (
              <g
                key={`${i}-${j}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => {
                  setHoverRow(i);
                  setHoverCol(j);
                }}
                onMouseLeave={() => {
                  setHoverRow(null);
                  setHoverCol(null);
                }}
              >
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={cell - 4}
                  height={cell - 4}
                  rx={4}
                  fill="rgb(var(--accent))"
                  opacity={Math.max(0.08, t * 0.9)}
                  stroke={isHighlighted ? "rgb(var(--accent))" : "rgb(var(--line))"}
                  strokeWidth={isHighlighted ? 1.6 : 1}
                />
                <text
                  x={x + cell / 2}
                  y={y + cell / 2 + 4}
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  fill={t > 0.5 ? "white" : "rgb(var(--ink))"}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {(p * 100).toFixed(1)}
                </text>
              </g>
            );
          })
        )}

        {/* Row marginals on the right */}
        <text
          x={padL + cell * 4 + 12}
          y={padT - 8}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
        >
          P(X)
        </text>
        {marginalX.map((m, i) => {
          const x = padL + cell * 4 + 6;
          const y = padT + i * cell;
          return (
            <g key={`mx-${i}`}>
              <rect
                x={x}
                y={y + 8}
                width={Math.max(2, m * 220)}
                height={cell - 16}
                fill="rgb(var(--viz-v))"
                opacity={hoverRow === i ? 0.9 : 0.5}
                rx={2}
              />
              <text
                x={x + Math.max(2, m * 220) + 6}
                y={y + cell / 2 + 4}
                fontSize={10}
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink-muted))"
              >
                {(m * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}

        {/* Column marginals along the bottom */}
        <text
          x={padL - 10}
          y={padT + cell * 4 + 14}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
          textAnchor="end"
        >
          P(Y)
        </text>
        {marginalY.map((m, j) => {
          const x = padL + j * cell;
          const y = padT + cell * 4 + 6;
          const barH = Math.max(2, m * 220);
          return (
            <g key={`my-${j}`}>
              <rect
                x={x + 8}
                y={y}
                width={cell - 16}
                height={barH}
                fill="rgb(var(--viz-w))"
                opacity={hoverCol === j ? 0.9 : 0.5}
                rx={2}
              />
              <text
                x={x + cell / 2}
                y={y + barH + 12}
                fontSize={10}
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink-muted))"
                textAnchor="middle"
              >
                {(m * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Preset
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as Preset[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPreset(k)}
                className={[
                  "rounded-md border px-2 py-1 text-xs transition",
                  preset === k
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            Conditional slice
          </div>
          {conditional ? (
            <div className="mt-2 space-y-1">
              <div className="text-ink-muted">
                {conditional.kind === "x"
                  ? `P(Y | X = ${X_LABELS[conditional.row]})`
                  : `P(X | Y = ${Y_LABELS[conditional.col]})`}
              </div>
              <div className="space-y-1">
                {conditional.values.map((v, k) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-ink-muted">
                      {conditional.kind === "x" ? Y_LABELS[k] : X_LABELS[k]}
                    </span>
                    <span className="text-ink">{pct(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-2 font-serif text-xs text-ink-muted">
              Hover a row or column to see <code>P(Y | X = x)</code> or{" "}
              <code>P(X | Y = y)</code>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
