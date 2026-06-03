"use client";

import { useMemo, useState } from "react";
import { Stage, Grid, LineSeg } from "@/components/viz/Stage";

export function RandomWalkBrownian() {
  const [steps, setSteps] = useState(120);
  const [sigma, setSigma] = useState(0.15);
  const [seed, setSeed] = useState(0);

  const path = useMemo(() => {
    let rng = seed;
    const next = () => {
      rng = (rng * 1664525 + 1013904223) % 2 ** 32;
      return rng / 2 ** 32 - 0.5;
    };
    const pts: [number, number][] = [[0, 0]];
    let x = 0;
    let y = 0;
    for (let i = 1; i <= steps; i++) {
      x += 1;
      y += sigma * next() * 2;
      pts.push([x, y]);
    }
    return pts;
  }, [steps, sigma, seed]);

  const world = useMemo(() => {
    let minY = 0;
    let maxY = 0;
    for (const [, yy] of path) {
      minY = Math.min(minY, yy);
      maxY = Math.max(maxY, yy);
    }
    const padY = Math.max(0.5, (maxY - minY) * 0.15);
    return {
      xMin: -2,
      xMax: steps + 2,
      yMin: minY - padY,
      yMax: maxY + padY,
    };
  }, [path, steps]);

  return (
    <div className="space-y-3 p-2 font-sans text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-ink-muted">
          steps
          <input
            type="range"
            min={20}
            max={300}
            value={steps}
            onChange={(e) => setSteps(+e.target.value)}
            className="ml-2 accent-accent"
          />
        </label>
        <label className="text-xs text-ink-muted">
          σ step
          <input
            type="range"
            min={5}
            max={50}
            value={sigma * 100}
            onChange={(e) => setSigma(+e.target.value / 100)}
            className="ml-2 accent-accent"
          />
        </label>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded border border-line px-2 py-1 text-xs"
        >
          New path
        </button>
      </div>
      <Stage width={560} height={220} world={world} ariaLabel="Random walk path">
        <Grid step={Math.max(20, Math.round(steps / 8))} />
        {path.slice(1).map((p, i) => (
          <LineSeg
            key={i}
            from={path[i] as [number, number]}
            to={p as [number, number]}
            color="rgb(var(--accent))"
            width={1.5}
          />
        ))}
      </Stage>
    </div>
  );
}
