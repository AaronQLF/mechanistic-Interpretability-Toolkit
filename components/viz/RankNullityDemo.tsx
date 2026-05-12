"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, LineSeg, vizColors } from "./Stage";
import { MatrixInput } from "./MatrixInput";
import { det, fmt, mv, type Mat2, type Vec2 } from "@/lib/linalg";

export function RankNullityDemo() {
  const [M, setM] = useState<Mat2>([1.2, 0.6, 0.6, 0.3]);
  const world = { xMin: -3.5, xMax: 3.5, yMin: -2.5, yMax: 2.5 };

  const d = det(M);
  const eps = 1e-3;
  const a = M[0], b = M[1], c = M[2], dd = M[3];
  const isZero =
    Math.abs(a) < eps &&
    Math.abs(b) < eps &&
    Math.abs(c) < eps &&
    Math.abs(dd) < eps;

  let rank: 0 | 1 | 2;
  if (isZero) rank = 0;
  else if (Math.abs(d) < eps) rank = 1;
  else rank = 2;
  const nullity = (2 - rank) as 0 | 1 | 2;

  // Image: span of columns (if rank>=1, take first nonzero column direction).
  const col1: Vec2 = [a, c];
  const col2: Vec2 = [b, dd];
  const nz1 = Math.hypot(col1[0], col1[1]) > eps;
  const imageDir: Vec2 = nz1 ? col1 : col2;
  const imLen = Math.hypot(imageDir[0], imageDir[1]);
  const imUnit: Vec2 = imLen > eps ? [imageDir[0] / imLen, imageDir[1] / imLen] : [1, 0];

  // Kernel: vectors v with Mv = 0. For rank 1, kernel is 1D direction.
  // Solve [a b; c d] v = 0. If b != 0, v = (-b, a); else if d != 0, v = (-d, c); else use (1, 0).
  let kerDir: Vec2;
  if (Math.abs(b) > eps) kerDir = [-b, a];
  else if (Math.abs(dd) > eps) kerDir = [-dd, c];
  else if (Math.abs(a) > eps) kerDir = [0, 1];
  else if (Math.abs(c) > eps) kerDir = [0, 1];
  else kerDir = [1, 0];
  const kerLen = Math.hypot(kerDir[0], kerDir[1]);
  const kerUnit: Vec2 = kerLen > eps ? [kerDir[0] / kerLen, kerDir[1] / kerLen] : [1, 0];

  // To illustrate kernel: pick a few points on the kernel line, apply M, all should land at origin.
  const probes: Vec2[] = [
    [kerUnit[0] * 1.4, kerUnit[1] * 1.4],
    [kerUnit[0] * -2.2, kerUnit[1] * -2.2],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={340}
        world={world}
        ariaLabel="Rank and nullity of a 2x2 matrix"
      >
        <Grid step={1} />
        <Axes />

        {/* Image subspace */}
        {rank === 1 && (
          <LineSeg
            from={[imUnit[0] * 6, imUnit[1] * 6]}
            to={[-imUnit[0] * 6, -imUnit[1] * 6]}
            color={vizColors.sum}
            width={2}
            opacity={0.55}
          />
        )}

        {/* Kernel subspace */}
        {rank === 1 && (
          <LineSeg
            from={[kerUnit[0] * 6, kerUnit[1] * 6]}
            to={[-kerUnit[0] * 6, -kerUnit[1] * 6]}
            color={vizColors.eigen}
            width={2}
            dashed
            opacity={0.7}
          />
        )}

        {/* Column vectors */}
        <Arrow to={col1} color={vizColors.x} width={2.2} label="M e₁" />
        <Arrow to={col2} color={vizColors.y} width={2.2} label="M e₂" />

        {/* Probe arrows: kernel vectors all map to 0 */}
        {rank < 2 &&
          probes.map((p, i) => (
            <g key={i}>
              <Arrow
                from={[0, 0]}
                to={p}
                color={vizColors.eigen}
                width={1.5}
                opacity={0.5}
                dashed
              />
              {/* image of p under M */}
              <Arrow
                from={[0, 0]}
                to={mv(M, p)}
                color={vizColors.eigen}
                width={1.5}
                opacity={0.9}
              />
            </g>
          ))}
      </Stage>
      <div className="space-y-3">
        <MatrixInput value={M} onChange={setM} label="M" min={-2} max={2} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">det M</span>
            <span className="text-ink">{fmt(d, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">rank</span>
            <span className="text-ink">{rank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">nullity</span>
            <span className="text-ink">{nullity}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2">
            <span className="text-ink-muted">rank + nullity</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {rank + nullity} = n
            </span>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Slide the entries until the columns become parallel — det → 0, rank
          drops to 1, and a kernel line appears (dashed). Vectors on that line
          map to the origin.
        </p>
      </div>
    </div>
  );
}
