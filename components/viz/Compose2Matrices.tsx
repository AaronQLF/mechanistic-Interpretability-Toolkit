"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, vizColors } from "./Stage";
import { TransformedGrid } from "./TransformedGrid";
import { MatrixInput } from "./MatrixInput";
import { fmt, mm, mv, type Mat2 } from "@/lib/linalg";

export function Compose2Matrices() {
  const [A, setA] = useState<Mat2>([1, -0.5, 0.5, 1]);
  const [B, setB] = useState<Mat2>([1, 0, 1, 1]);
  const AB = mm(A, B);
  const BA = mm(B, A);
  const [order, setOrder] = useState<"AB" | "BA">("AB");
  const M = order === "AB" ? AB : BA;
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  const Me1 = mv(M, [1, 0]);
  const Me2 = mv(M, [0, 1]);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Composition of two matrix transformations"
      >
        <Grid step={1} />
        <Axes />
        <TransformedGrid M={M} step={1} range={6} />
        <Arrow to={[1, 0]} color={vizColors.x} width={1} opacity={0.3} />
        <Arrow to={[0, 1]} color={vizColors.y} width={1} opacity={0.3} />
        <Arrow to={Me1} color={vizColors.x} width={2.6} label="(M e₁)" />
        <Arrow to={Me2} color={vizColors.y} width={2.6} label="(M e₂)" />
      </Stage>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOrder("AB")}
            className={`flex-1 rounded-md border px-3 py-1.5 font-mono text-sm transition ${
              order === "AB"
                ? "border-accent bg-accent text-white"
                : "border-line text-ink-muted hover:border-ink-muted hover:text-ink"
            }`}
          >
            apply B then A
          </button>
          <button
            type="button"
            onClick={() => setOrder("BA")}
            className={`flex-1 rounded-md border px-3 py-1.5 font-mono text-sm transition ${
              order === "BA"
                ? "border-accent bg-accent text-white"
                : "border-line text-ink-muted hover:border-ink-muted hover:text-ink"
            }`}
          >
            apply A then B
          </button>
        </div>
        <MatrixInput value={A} onChange={setA} label="A" min={-2} max={2} step={0.05} />
        <MatrixInput value={B} onChange={setB} label="B" min={-2} max={2} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            {order === "AB" ? "AB =" : "BA ="}
          </div>
          <div className="mt-1 grid grid-cols-2 gap-1">
            <div className="rounded bg-paper p-1.5 text-center text-ink">{fmt(M[0])}</div>
            <div className="rounded bg-paper p-1.5 text-center text-ink">{fmt(M[1])}</div>
            <div className="rounded bg-paper p-1.5 text-center text-ink">{fmt(M[2])}</div>
            <div className="rounded bg-paper p-1.5 text-center text-ink">{fmt(M[3])}</div>
          </div>
          <p className="mt-2 font-sans text-ink-muted">
            Try toggling order. Unless A and B happen to commute, AB ≠ BA.
          </p>
        </div>
      </div>
    </div>
  );
}
