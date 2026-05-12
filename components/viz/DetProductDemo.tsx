"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Polygon2, Arrow, vizColors } from "./Stage";
import { MatrixInput } from "./MatrixInput";
import { det, fmt, mm, mv, type Mat2 } from "@/lib/linalg";

export function DetProductDemo() {
  const [A, setA] = useState<Mat2>([1.2, 0.3, -0.2, 1.4]);
  const [B, setB] = useState<Mat2>([0.9, -0.5, 0.4, 1.1]);
  const AB = mm(A, B);
  const dA = det(A);
  const dB = det(B);
  const dAB = det(AB);
  const product = dA * dB;
  const matches = Math.abs(dAB - product) < 1e-9;

  const world = { xMin: -3.5, xMax: 3.5, yMin: -2.5, yMax: 2.5 };

  const square: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const afterB = square.map((p) => mv(B, p)) as unknown as [number, number][];
  const afterAB = square.map((p) => mv(AB, p)) as unknown as [number, number][];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={340}
        world={world}
        ariaLabel="Determinant of a product equals product of determinants"
      >
        <Grid step={1} />
        <Axes />
        <Polygon2
          points={square}
          fill="rgba(120,113,108,0.10)"
          stroke="rgba(120,113,108,0.45)"
          strokeWidth={1}
        />
        <Polygon2
          points={afterB}
          fill="rgba(59,130,246,0.14)"
          stroke="rgba(59,130,246,0.55)"
          strokeWidth={1.2}
        />
        <Polygon2
          points={afterAB}
          fill="rgba(180,83,9,0.16)"
          stroke="rgba(180,83,9,0.65)"
          strokeWidth={1.5}
        />
        <Arrow to={mv(AB, [1, 0])} color={vizColors.x} width={2} label="(AB)e₁" />
        <Arrow to={mv(AB, [0, 1])} color={vizColors.y} width={2} label="(AB)e₂" />
      </Stage>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <MatrixInput value={A} onChange={setA} label="A" min={-2} max={2} step={0.05} />
          <MatrixInput value={B} onChange={setB} label="B" min={-2} max={2} step={0.05} />
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">det A</span>
            <span className="text-ink">{fmt(dA, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">det B</span>
            <span className="text-ink">{fmt(dB, 3)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-1">
            <span className="text-ink-muted">det A · det B</span>
            <span className="text-ink">{fmt(product, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">det(AB)</span>
            <span className={matches ? "text-emerald-600 dark:text-emerald-400" : "text-ink"}>
              {fmt(dAB, 3)}
            </span>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Grey = unit square. Blue = its image under B. Orange = image under
          AB. The orange area is always exactly{" "}
          <span className="font-mono">|det A · det B|</span>.
        </p>
      </div>
    </div>
  );
}
