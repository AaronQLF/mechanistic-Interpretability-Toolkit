"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, LineSeg, vizColors } from "./Stage";
import { eig2, fmt, type Mat2 } from "@/lib/linalg";

export function SpectralSymmetricDemo() {
  // Symmetric 2x2: [a, b; b, c]. We expose three sliders.
  const [a, setA] = useState(1.6);
  const [b, setB] = useState(0.8);
  const [c, setC] = useState(0.4);

  const M: Mat2 = [a, b, b, c];
  const eig = eig2(M);
  const world = { xMin: -4, xMax: 4, yMin: -3, yMax: 3 };

  // Orthogonality check
  let dotEv = 0;
  if (eig) {
    const [e1, e2] = eig.vectors;
    dotEv = e1[0] * e2[0] + e1[1] * e2[1];
  }
  const orthogonal = Math.abs(dotEv) < 1e-3;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={340}
        world={world}
        ariaLabel="Spectral theorem for symmetric matrices: eigenvectors are orthogonal"
      >
        <Grid step={1} />
        <Axes />
        {eig &&
          eig.vectors.map((ev, i) => {
            const lambda = eig.values[i];
            return (
              <g key={i}>
                <LineSeg
                  from={[ev[0] * 8, ev[1] * 8]}
                  to={[-ev[0] * 8, -ev[1] * 8]}
                  color={vizColors.eigen}
                  width={1.5}
                  dashed
                  opacity={0.55}
                />
                <Arrow
                  to={[ev[0] * lambda, ev[1] * lambda]}
                  color={vizColors.eigen}
                  width={2.4}
                  label={`λ${i + 1}=${fmt(lambda)}`}
                  opacity={0.95}
                />
              </g>
            );
          })}
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            symmetric M = [a, b; b, c]
          </div>
          <SymSlider label="a" value={a} onChange={setA} />
          <SymSlider label="b" value={b} onChange={setB} />
          <SymSlider label="c" value={c} onChange={setC} />
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          {eig && (
            <>
              <div className="flex justify-between">
                <span className="text-ink-muted">λ₁, λ₂</span>
                <span className="text-ink">
                  {fmt(eig.values[0])}, {fmt(eig.values[1])}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-1">
                <span className="text-ink-muted">v₁ · v₂</span>
                <span
                  className={
                    orthogonal
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500"
                  }
                >
                  {fmt(dotEv, 4)}
                </span>
              </div>
            </>
          )}
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink-muted">
            For any symmetric M, eigenvectors are always perpendicular (
            <span className="font-mono">v₁ · v₂ = 0</span>) and eigenvalues
            are always real. Try any sliders.
          </p>
        </div>
      </div>
    </div>
  );
}

function SymSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <span className="w-4 text-ink-muted">{label}</span>
      <input
        type="range"
        min={-2}
        max={2}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-amber-600"
        aria-label={label}
      />
      <span className="w-12 text-right text-ink">{fmt(value)}</span>
    </div>
  );
}
