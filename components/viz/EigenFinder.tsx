"use client";

import { useState } from "react";
import {
  Stage,
  Grid,
  Axes,
  Arrow,
  DragPoint,
  LineSeg,
  vizColors,
} from "./Stage";
import { TransformedGrid } from "./TransformedGrid";
import { MatrixInput } from "./MatrixInput";
import { eig2, fmt, mv, normalize, type Mat2, type Vec2 } from "@/lib/linalg";

export function EigenFinder() {
  const [M, setM] = useState<Mat2>([2, 1, 0, 1.2]);
  const [v, setV] = useState<Vec2>([1.6, 1]);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  const Mv = mv(M, v);
  const eig = eig2(M);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Visualizing eigenvectors of a 2x2 matrix"
      >
        <Grid step={1} />
        <Axes />
        <TransformedGrid M={M} step={1} range={6} opacity={0.25} />
        {eig &&
          eig.vectors.map((ev, i) => {
            const lambda = eig.values[i];
            return (
              <g key={i}>
                <LineSeg
                  from={[ev[0] * 6, ev[1] * 6]}
                  to={[-ev[0] * 6, -ev[1] * 6]}
                  color={vizColors.eigen}
                  width={1.5}
                  dashed
                  opacity={0.7}
                />
                <Arrow
                  to={[ev[0] * lambda, ev[1] * lambda]}
                  color={vizColors.eigen}
                  width={2}
                  label={`λ${i + 1}=${fmt(lambda)}`}
                  opacity={0.85}
                />
              </g>
            );
          })}
        <Arrow to={v} color={vizColors.v} width={2.5} label="v" />
        <Arrow to={Mv} color={vizColors.sum} width={2.5} label="M v" />
        <DragPoint value={v} onChange={setV} color={vizColors.v} bounds={world} />
      </Stage>
      <div className="space-y-3">
        <MatrixInput value={M} onChange={setM} label="M" min={-2} max={2.5} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            eigenvalues
          </div>
          {eig ? (
            <div className="mt-1 space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-muted">λ₁</span>
                <span className="text-ink">{fmt(eig.values[0], 3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">λ₂</span>
                <span className="text-ink">{fmt(eig.values[1], 3)}</span>
              </div>
              <p className="mt-2 font-sans text-xs text-ink-muted">
                Drag <span className="font-mono">v</span> onto a dashed line:
                Mv will become parallel to v, scaled by λ.
              </p>
              {alignedEigen(v, eig.vectors) && (
                <div className="mt-2 rounded bg-pink-500/10 p-2 font-sans text-xs text-pink-700 dark:text-pink-300">
                  Aligned with an eigenvector — Mv is just a stretch.
                </div>
              )}
            </div>
          ) : (
            <p className="mt-1 text-amber-600 dark:text-amber-400">
              No real eigenvalues — this matrix rotates without preserving any
              real direction.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function alignedEigen(v: Vec2, evs: [Vec2, Vec2]): boolean {
  const u = normalize(v);
  return evs.some((e) => {
    const c = u[0] * e[0] + u[1] * e[1];
    return Math.abs(Math.abs(c) - 1) < 0.04;
  });
}
