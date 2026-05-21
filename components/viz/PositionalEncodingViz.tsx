"use client";

import { useMemo, useState } from "react";

const SEQ_LEN = 16;
const D = 16;

type Mode = "sinusoidal" | "rope" | "alibi";

function sinusoidal(pos: number, dim: number, d: number): number {
  const i = Math.floor(dim / 2);
  const denom = Math.pow(10000, (2 * i) / d);
  return dim % 2 === 0 ? Math.sin(pos / denom) : Math.cos(pos / denom);
}

// Build a (SEQ_LEN x D) absolute encoding to add to embeddings.
function buildSinusoidal(): number[][] {
  return Array.from({ length: SEQ_LEN }, (_, p) =>
    Array.from({ length: D }, (_, k) => sinusoidal(p, k, D))
  );
}

// RoPE rotates pairs (k, k+1) of the query/key by an angle θ_k · pos.
// We can't visualize the rotation directly without picking a query, so we
// show the resulting Q · K dot product as a function of relative position.
function buildRoPEDotMatrix(): number[][] {
  const thetas: number[] = [];
  for (let k = 0; k < D; k += 2) {
    thetas.push(1 / Math.pow(10000, k / D));
  }
  // Q and K start equal; their dot product after RoPE depends only on (i - j).
  // For two equal vectors x ∈ R^D, ⟨R_θ_i x, R_θ_j x⟩ = Σ_k cos(θ_k (i - j)).
  return Array.from({ length: SEQ_LEN }, (_, i) =>
    Array.from({ length: SEQ_LEN }, (_, j) => {
      let s = 0;
      for (const t of thetas) s += Math.cos(t * (i - j));
      return s / thetas.length;
    })
  );
}

// ALiBi adds a linear penalty −m * |i − j| to the attention scores before softmax.
// Different heads get different m. We show the resulting bias matrix for one head.
function buildALiBiBias(slope = 0.4): number[][] {
  return Array.from({ length: SEQ_LEN }, (_, i) =>
    Array.from({ length: SEQ_LEN }, (_, j) => -slope * Math.abs(i - j))
  );
}

export function PositionalEncodingViz() {
  const [mode, setMode] = useState<Mode>("sinusoidal");

  const { matrix, descr, range, rows, cols } = useMemo(() => {
    if (mode === "sinusoidal") {
      const M = buildSinusoidal();
      return {
        matrix: M,
        descr:
          "Sinusoidal absolute encoding. Each row is the position vector p_i added directly to the token embedding. Low frequencies on the left (k small) wrap slowly; high frequencies on the right wrap quickly.",
        range: [-1, 1] as [number, number],
        rows: "position i",
        cols: "channel k",
      };
    }
    if (mode === "rope") {
      const M = buildRoPEDotMatrix();
      return {
        matrix: M,
        descr:
          "RoPE: rotates query and key by an angle that depends on absolute position. The visible quantity is ⟨Q_i, K_j⟩ for two equal vectors — it depends only on i − j, exactly the relative-position invariance you wanted.",
        range: [-0.5, 1] as [number, number],
        rows: "query position i",
        cols: "key position j",
      };
    }
    const M = buildALiBiBias(0.4);
    return {
      matrix: M,
      descr:
        "ALiBi adds a linear bias −m · |i − j| to the attention scores before softmax. Same penalty for every query/key pair at the same relative distance; no learned parameters at all.",
      range: [-Math.max(SEQ_LEN, 1) * 0.4, 0] as [number, number],
      rows: "query position i",
      cols: "key position j",
    };
  }, [mode]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["sinusoidal", "rope", "alibi"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={[
              "rounded-md border px-3 py-1 font-mono text-xs transition",
              m === mode
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {m === "sinusoidal"
              ? "sinusoidal (absolute)"
              : m === "rope"
                ? "RoPE (rotary)"
                : "ALiBi (linear bias)"}
          </button>
        ))}
      </div>

      <Heatmap matrix={matrix} range={range} xLabel={cols} yLabel={rows} />

      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        {descr}
      </p>
    </div>
  );
}

function Heatmap({
  matrix,
  range,
  xLabel,
  yLabel,
}: {
  matrix: number[][];
  range: [number, number];
  xLabel: string;
  yLabel: string;
}) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const cell = 22;
  const padL = 60;
  const padT = 30;
  const padB = 30;
  const padR = 10;
  const w = padL + cols * cell + padR;
  const h = padT + rows * cell + padB;

  const colorFor = (v: number) => {
    const [lo, hi] = range;
    const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo + 1e-9)));
    if (lo < 0) {
      const c = (t - 0.5) * 2;
      if (c >= 0) {
        const a = Math.min(1, c);
        return `rgba(217, 119, 6, ${a.toFixed(3)})`;
      } else {
        const a = Math.min(1, -c);
        return `rgba(2, 132, 199, ${a.toFixed(3)})`;
      }
    }
    return `rgba(217, 119, 6, ${t.toFixed(3)})`;
  };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      style={{ display: "block", maxWidth: 640 }}
      role="img"
      aria-label="Position encoding heatmap"
    >
      <text
        x={padL + (cols * cell) / 2}
        y={padT - 12}
        fontSize={10}
        fontFamily="ui-monospace, monospace"
        fill="rgb(var(--ink-muted))"
        textAnchor="middle"
      >
        {xLabel} →
      </text>
      <text
        x={padL - 14}
        y={padT + (rows * cell) / 2}
        fontSize={10}
        fontFamily="ui-monospace, monospace"
        fill="rgb(var(--ink-muted))"
        textAnchor="middle"
        transform={`rotate(-90, ${padL - 14}, ${padT + (rows * cell) / 2})`}
      >
        {yLabel} →
      </text>
      {matrix.map((row, i) =>
        row.map((v, j) => (
          <rect
            key={`${i}-${j}`}
            x={padL + j * cell}
            y={padT + i * cell}
            width={cell - 1}
            height={cell - 1}
            fill={colorFor(v)}
          >
            <title>
              ({i}, {j}) = {v.toFixed(2)}
            </title>
          </rect>
        ))
      )}
      <text
        x={padL + cols * cell + 4}
        y={padT + 8}
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fill="rgb(var(--ink-subtle))"
      >
        +
      </text>
      <text
        x={padL + cols * cell + 4}
        y={padT + rows * cell - 2}
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fill="rgb(var(--ink-subtle))"
      >
        {range[0] < 0 ? "−" : "0"}
      </text>
    </svg>
  );
}
