"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Polygon2, Arrow, vizColors } from "./Stage";
import { MatrixInput } from "./MatrixInput";
import { fmt, mv, svd2, type Mat2 } from "@/lib/linalg";

export function EckartYoungDemo() {
  const [M, setM] = useState<Mat2>([1.4, 0.9, 0.6, 1.2]);
  const [k, setK] = useState<number>(2);

  const svd = svd2(M);
  // Build rank-k approximation M_k = sum_{i=1..k} sigma_i u_i v_i^T
  const cosU = Math.cos(svd.thetaU);
  const sinU = Math.sin(svd.thetaU);
  const cosV = Math.cos(svd.thetaV);
  const sinV = Math.sin(svd.thetaV);
  const u1: [number, number] = [cosU, sinU];
  const u2: [number, number] = [-sinU, cosU];
  const v1: [number, number] = [cosV, sinV];
  const v2: [number, number] = [-sinV, cosV];
  const s1 = svd.sigma[0];
  const s2 = svd.sigma[1];

  // Outer products (u v^T): rows = u, cols = v
  const op = (
    u: [number, number],
    v: [number, number]
  ): Mat2 => [u[0] * v[0], u[0] * v[1], u[1] * v[0], u[1] * v[1]];

  const t1 = op(u1, v1);
  const t2 = op(u2, v2);

  let Mk: Mat2;
  if (k === 0) Mk = [0, 0, 0, 0];
  else if (k === 1)
    Mk = [s1 * t1[0], s1 * t1[1], s1 * t1[2], s1 * t1[3]];
  else
    Mk = [
      s1 * t1[0] + s2 * t2[0],
      s1 * t1[1] + s2 * t2[1],
      s1 * t1[2] + s2 * t2[2],
      s1 * t1[3] + s2 * t2[3],
    ];

  // Error in Frobenius norm: ||M - Mk||_F = sqrt(sum sigma_i^2 for i > k)
  let err = 0;
  if (k === 0) err = Math.sqrt(s1 * s1 + s2 * s2);
  else if (k === 1) err = s2;
  else err = 0;

  const totalEnergy = Math.sqrt(s1 * s1 + s2 * s2);
  const captured = totalEnergy > 1e-9 ? Math.sqrt(Math.max(0, totalEnergy * totalEnergy - err * err)) / totalEnergy : 0;

  const world = { xMin: -3.5, xMax: 3.5, yMin: -2.5, yMax: 2.5 };

  const square: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const imageM = square.map((p) => mv(M, p)) as unknown as [number, number][];
  const imageMk = square.map((p) => mv(Mk, p)) as unknown as [number, number][];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={340}
        world={world}
        ariaLabel="Eckart-Young: best rank-k approximation"
      >
        <Grid step={1} />
        <Axes />
        <Polygon2
          points={imageM}
          fill="rgba(120,113,108,0.10)"
          stroke="rgba(120,113,108,0.55)"
          strokeWidth={1}
        />
        <Polygon2
          points={imageMk}
          fill="rgba(225,29,72,0.16)"
          stroke="rgba(225,29,72,0.65)"
          strokeWidth={1.4}
        />
        <Arrow to={mv(M, [1, 0])} color={vizColors.x} width={1.6} opacity={0.5} />
        <Arrow to={mv(M, [0, 1])} color={vizColors.y} width={1.6} opacity={0.5} />
        <Arrow to={mv(Mk, [1, 0])} color={vizColors.x} width={2.2} label="(Mₖ)e₁" />
        <Arrow to={mv(Mk, [0, 1])} color={vizColors.y} width={2.2} label="(Mₖ)e₂" />
      </Stage>
      <div className="space-y-3">
        <MatrixInput value={M} onChange={setM} label="M" min={-2} max={2} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-ink-muted">k =</span>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={k}
              onChange={(e) => setK(parseInt(e.target.value, 10))}
              className="flex-1 accent-amber-600"
              aria-label="rank cutoff k"
            />
            <span className="w-6 text-right text-ink">{k}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">σ₁, σ₂</span>
            <span className="text-ink">
              {fmt(s1)}, {fmt(s2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-line pt-1">
            <span className="text-ink-muted">‖M − Mₖ‖_F</span>
            <span className="text-ink">{fmt(err, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">energy kept</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {fmt(captured * 100, 1)}%
            </span>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Grey = image of unit square under <span className="font-mono">M</span>;
          pink = image under the best rank-<span className="font-mono">k</span>{" "}
          approximation. Drop <span className="font-mono">k</span> to 1 and the
          parallelogram flattens onto the dominant singular direction.
        </p>
      </div>
    </div>
  );
}
