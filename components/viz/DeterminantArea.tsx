"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, Polygon2, vizColors } from "./Stage";
import { MatrixInput } from "./MatrixInput";
import { det, fmt, mv, type Mat2 } from "@/lib/linalg";

export function DeterminantArea() {
  const [M, setM] = useState<Mat2>([1.4, -0.6, 0.5, 1.1]);
  const world = { xMin: -4, xMax: 4, yMin: -3, yMax: 3 };
  const e1 = mv(M, [1, 0]);
  const e2 = mv(M, [0, 1]);
  const sum = mv(M, [1, 1]);
  const d = det(M);
  const flipped = d < 0;
  const fill = flipped
    ? "rgba(225, 29, 72, 0.18)"
    : "rgba(180, 83, 9, 0.18)";
  const stroke = flipped
    ? "rgba(225, 29, 72, 0.5)"
    : "rgba(180, 83, 9, 0.55)";
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Determinant as signed area of the unit square's image"
      >
        <Grid step={1} />
        <Axes />
        {/* Original unit square */}
        <Polygon2
          points={[
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ]}
          fill="rgba(120, 113, 108, 0.12)"
          stroke="rgba(120, 113, 108, 0.5)"
          strokeWidth={1}
        />
        {/* Image of unit square */}
        <Polygon2
          points={[[0, 0], e1, sum, e2]}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
        <Arrow to={e1} color={vizColors.x} width={2.2} label="M e₁" />
        <Arrow to={e2} color={vizColors.y} width={2.2} label="M e₂" />
      </Stage>
      <div className="space-y-3">
        <MatrixInput value={M} onChange={setM} label="M" min={-2} max={2} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">det M</span>
            <span className={flipped ? "text-rose-500" : "text-ink"}>
              {fmt(d, 3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">|det|</span>
            <span className="text-ink">{fmt(Math.abs(d), 3)}</span>
          </div>
          <p className="mt-2 font-sans text-xs text-ink-muted">
            |det| is the area of the parallelogram. Sign tells you whether
            orientation flipped (red).
          </p>
          {Math.abs(d) < 0.05 && (
            <p className="mt-2 rounded bg-rose-500/10 p-2 font-sans text-xs text-rose-600 dark:text-rose-400">
              Singular: the parallelogram has collapsed to a line segment.
              Rank dropped from 2 to 1.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
