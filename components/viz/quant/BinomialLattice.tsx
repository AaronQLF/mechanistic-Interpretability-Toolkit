"use client";

import { useMemo, useState } from "react";

export function BinomialLattice({
  periods = 3,
}: {
  periods?: number;
}) {
  const [u, setU] = useState(1.15);
  const [d, setD] = useState(0.87);
  const [S0, setS0] = useState(100);
  const [K, setK] = useState(100);
  const [r, setR] = useState(0.02);
  const [T, setT] = useState(1);
  const n = Math.min(periods, 5);

  const tree = useMemo(() => {
    const dt = T / n;
    const disc = Math.exp(-r * dt);
    const p = (Math.exp(r * dt) - d) / (u - d);
    const clampP = Math.min(0.999, Math.max(0.001, p));
    const nodes: number[][] = [];
    for (let i = 0; i <= n; i++) {
      const row: number[] = [];
      for (let j = 0; j <= i; j++) {
        const ex = n - i;
        const upMoves = j;
        row.push(S0 * u ** upMoves * d ** (ex - upMoves));
      }
      nodes.push(row);
    }
    const val: number[][] = nodes.map((row) => row.map(() => 0));
    for (let j = 0; j <= n; j++) {
      val[n][j] = Math.max(0, nodes[n][j] - K);
    }
    for (let i = n - 1; i >= 0; i--) {
      for (let j = 0; j <= i; j++) {
        val[i][j] =
          disc *
          (clampP * val[i + 1][j + 1] + (1 - clampP) * val[i + 1][j]);
      }
    }
    return { nodes, val, p: clampP, disc };
  }, [S0, K, r, T, n, u, d]);

  const cell = 52;
  const pad = 24;
  const width = pad * 2 + (n + 1) * cell;
  const height = pad * 2 + (n + 1) * cell;

  return (
    <div className="space-y-4 p-2 font-sans text-sm">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <label className="text-xs text-ink-muted">
          S₀
          <input
            type="number"
            value={S0}
            onChange={(e) => setS0(Number(e.target.value))}
            className="mt-1 w-full rounded border border-line bg-paper px-1 py-0.5 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          K
          <input
            type="number"
            value={K}
            onChange={(e) => setK(Number(e.target.value))}
            className="mt-1 w-full rounded border border-line bg-paper px-1 py-0.5 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          u
          <input
            type="number"
            step={0.01}
            value={u}
            onChange={(e) => setU(Number(e.target.value))}
            className="mt-1 w-full rounded border border-line bg-paper px-1 py-0.5 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          d
          <input
            type="number"
            step={0.01}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            className="mt-1 w-full rounded border border-line bg-paper px-1 py-0.5 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          r, T
          <div className="mt-1 flex gap-1">
            <input
              type="number"
              step={0.005}
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              className="w-1/2 rounded border border-line bg-paper px-1 py-0.5 font-mono"
            />
            <input
              type="number"
              step={0.1}
              value={T}
              onChange={(e) => setT(Number(e.target.value))}
              className="w-1/2 rounded border border-line bg-paper px-1 py-0.5 font-mono"
            />
          </div>
        </label>
      </div>
      <p className="text-xs text-ink-muted">
        Risk-neutral prob p ≈ {tree.p.toFixed(3)} · European call value at root ≈{" "}
        <span className="font-mono text-accent">{tree.val[0][0].toFixed(2)}</span>
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        className="max-w-xl"
        role="img"
        aria-label="Binomial stock tree and option values"
      >
        {tree.nodes.map((row, i) =>
          row.map((S, j) => {
            const x = pad + j * cell + (n - i) * (cell / 2);
            const y = pad + i * cell;
            const V = tree.val[i][j];
            return (
              <g key={`${i}-${j}`}>
                {j < row.length - 1 && (
                  <line
                    x1={x}
                    y1={y + 14}
                    x2={x + cell / 2}
                    y2={y + cell - 8}
                    stroke="rgb(var(--line))"
                    strokeWidth={1}
                  />
                )}
                {j > 0 && (
                  <line
                    x1={x}
                    y1={y + 14}
                    x2={x - cell / 2}
                    y2={y + cell - 8}
                    stroke="rgb(var(--line))"
                    strokeWidth={1}
                  />
                )}
                <rect
                  x={x - 24}
                  y={y - 10}
                  width={48}
                  height={36}
                  rx={4}
                  fill="rgb(var(--paper-raised))"
                  stroke="rgb(var(--accent))"
                  strokeWidth={0.8}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill="rgb(var(--ink-muted))"
                  fontFamily="ui-monospace,monospace"
                >
                  {S.toFixed(0)}
                </text>
                <text
                  x={x}
                  y={y + 18}
                  textAnchor="middle"
                  fontSize={9}
                  fill="rgb(var(--accent))"
                  fontFamily="ui-monospace,monospace"
                >
                  {V.toFixed(1)}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
