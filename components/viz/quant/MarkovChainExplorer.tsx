"use client";

import { useMemo, useState } from "react";

/** Two-state Markov chain with adjustable transition matrix (rows sum to 1). */
export function MarkovChainExplorer() {
  const [pStayA, setPStayA] = useState(0.7);
  const [pStayB, setPStayB] = useState(0.6);
  const pAB = 1 - pStayA;
  const pBA = 1 - pStayB;

  const stationary = useMemo(() => {
    const det = pBA + pAB;
    if (det < 1e-9) return [0.5, 0.5];
    const piB = pAB / (pAB + pBA);
    const piA = 1 - piB;
    return [piA, piB];
  }, [pAB, pBA]);

  const [steps, setSteps] = useState(400);
  const [startA, setStartA] = useState(1);
  const [run, setRun] = useState(0);

  const freq = useMemo(() => {
    let state = startA > 0.5 ? 0 : 1;
    let a = 0;
    let b = 0;
    let rng = run + 1;
    const next = () => {
      rng = (rng * 1103515245 + 12345) % 2 ** 31;
      return rng / 2 ** 31;
    };
    for (let i = 0; i < steps; i++) {
      const u = next();
      if (state === 0) {
        if (u < pStayA) state = 0;
        else state = 1;
      } else {
        if (u < pStayB) state = 1;
        else state = 0;
      }
      if (state === 0) a++;
      else b++;
    }
    return [a / steps, b / steps];
  }, [pStayA, pStayB, steps, startA, run]);

  return (
    <div className="space-y-4 p-2 font-sans text-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold text-ink-muted">From A</p>
          <label className="text-xs">
            P(A→A)
            <input
              type="range"
              min={1}
              max={99}
              value={Math.round(pStayA * 100)}
              onChange={(e) => setPStayA(+e.target.value / 100)}
              className="w-full accent-accent"
            />
            <span className="font-mono">{pStayA.toFixed(2)}</span>
          </label>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-muted">From B</p>
          <label className="text-xs">
            P(B→B)
            <input
              type="range"
              min={1}
              max={99}
              value={Math.round(pStayB * 100)}
              onChange={(e) => setPStayB(+e.target.value / 100)}
              className="w-full accent-accent"
            />
            <span className="font-mono">{pStayB.toFixed(2)}</span>
          </label>
        </div>
      </div>
      <div className="rounded border border-line bg-paper-raised p-3 font-mono text-xs">
        <div>π(A) ≈ {stationary[0].toFixed(3)} · π(B) ≈ {stationary[1].toFixed(3)}</div>
        <div className="mt-2 text-ink-muted">
          Empirical after {steps} steps: A {freq[0].toFixed(3)}, B {freq[1].toFixed(3)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="text-xs text-ink-muted">
          steps
          <input
            type="number"
            min={50}
            max={50000}
            step={50}
            value={steps}
            onChange={(e) => setSteps(+e.target.value)}
            className="ml-2 w-24 rounded border border-line bg-paper px-1 font-mono"
          />
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={startA > 0.5}
            onChange={(e) => setStartA(e.target.checked ? 1 : 0)}
          />
          start in A
        </label>
        <button
          type="button"
          onClick={() => setRun((x) => x + 1)}
          className="rounded-md bg-accent px-2 py-1 text-xs text-white"
        >
          Resimulate
        </button>
      </div>
    </div>
  );
}
