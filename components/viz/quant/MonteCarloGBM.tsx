"use client";

import { useMemo, useState } from "react";

function boxMuller(): [number, number] {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return [
    Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v),
    Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v),
  ];
}

export function MonteCarloGBM() {
  const [S0, setS0] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [r, setR] = useState(0.02);
  const [sigma, setSigma] = useState(0.2);
  const [paths, setPaths] = useState(200);
  const [batch, setBatch] = useState(0);

  const stats = useMemo(() => {
    void batch;
    let sumPay = 0;
    let sumSq = 0;
    for (let i = 0; i < paths; i++) {
      const [z] = boxMuller();
      const ST = S0 * Math.exp((r - 0.5 * sigma * sigma) * T + sigma * Math.sqrt(T) * z);
      const pay = Math.max(0, ST - K);
      sumPay += pay;
      sumSq += pay * pay;
    }
    const mean = sumPay / paths;
    const varSample = Math.max(0, sumSq / paths - mean * mean);
    const stderr = Math.sqrt(varSample / paths);
    const disc = Math.exp(-r * T);
    return { mean: mean * disc, stderr: stderr * disc };
  }, [S0, K, T, r, sigma, paths, batch]);

  return (
    <div className="space-y-4 p-2 font-sans text-sm">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <label className="text-xs text-ink-muted">
          S₀
          <input
            type="number"
            value={S0}
            onChange={(e) => setS0(+e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          K
          <input
            type="number"
            value={K}
            onChange={(e) => setK(+e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          T
          <input
            type="number"
            step={0.1}
            value={T}
            onChange={(e) => setT(+e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          r
          <input
            type="number"
            step={0.01}
            value={r}
            onChange={(e) => setR(+e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          σ
          <input
            type="number"
            step={0.05}
            value={sigma}
            onChange={(e) => setSigma(+e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
        <label className="text-xs text-ink-muted">
          Paths
          <input
            type="number"
            min={50}
            max={20000}
            step={50}
            value={paths}
            onChange={(e) => setPaths(+e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
      </div>
      <div className="rounded border border-line bg-paper-raised p-3 font-mono text-sm">
        <div>
          MC call estimate:{" "}
          <span className="text-accent">{stats.mean.toFixed(3)}</span>
        </div>
        <div className="text-xs text-ink-muted">
          Std error ≈ {stats.stderr.toFixed(4)} (i.i.d. paths)
        </div>
      </div>
      <button
        type="button"
        onClick={() => setBatch((b) => b + 1)}
        className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white"
      >
        Resample
      </button>
    </div>
  );
}
