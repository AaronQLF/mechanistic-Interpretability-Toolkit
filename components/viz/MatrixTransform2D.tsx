"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, vizColors } from "./Stage";
import { TransformedGrid } from "./TransformedGrid";
import { MatrixInput } from "./MatrixInput";
import { det, fmt, mv, type Mat2 } from "@/lib/linalg";

const PRESETS: { label: string; M: Mat2 }[] = [
  { label: "Identity", M: [1, 0, 0, 1] },
  { label: "Rotate 30°", M: [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)] },
  { label: "Shear x", M: [1, 1, 0, 1] },
  { label: "Scale 2×, ½", M: [2, 0, 0, 0.5] },
  { label: "Reflect x", M: [1, 0, 0, -1] },
  { label: "Project to x", M: [1, 0, 0, 0] },
];

export function MatrixTransform2D({
  initial = [1.2, -0.4, 0.5, 0.9] as Mat2,
}: {
  initial?: Mat2;
}) {
  const [M, setM] = useState<Mat2>(initial);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  const Me1 = mv(M, [1, 0]);
  const Me2 = mv(M, [0, 1]);
  const d = det(M);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="2x2 matrix transformation visualizer"
      >
        <Grid step={1} />
        <Axes />
        <TransformedGrid M={M} step={1} range={6} />
        {/* Original basis (faint) */}
        <Arrow to={[1, 0]} color={vizColors.x} width={1} opacity={0.35} />
        <Arrow to={[0, 1]} color={vizColors.y} width={1} opacity={0.35} />
        {/* Transformed basis */}
        <Arrow to={Me1} color={vizColors.x} width={2.6} label="M e₁" />
        <Arrow to={Me2} color={vizColors.y} width={2.6} label="M e₂" />
      </Stage>
      <div className="space-y-3">
        <MatrixInput value={M} onChange={setM} label="M" min={-2} max={2} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">det M</span>
            <span className={d < 0 ? "text-rose-500" : "text-ink"}>{fmt(d)}</span>
          </div>
          <p className="mt-2 font-sans text-xs text-ink-muted">
            Negative det = the transformation flips orientation. Det 0 = it
            crushes the plane onto a line.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setM(p.M)}
              className="rounded-md border border-line px-2.5 py-1 font-sans text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
