"use client";

import { useState } from "react";

const D_IN = 4;
const D_HID = 6;
const D_OUT = 4;

function relu(x: number): number {
  return Math.max(0, x);
}

function makeMatrix(rows: number, cols: number, seed: number): number[][] {
  let s = seed;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return (s / 233280) * 2 - 1;
  };
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => r())
  );
}

const W1 = makeMatrix(D_HID, D_IN, 11);
const b1 = Array.from({ length: D_HID }, (_, i) => 0.1 * (i - 2));
const W2 = makeMatrix(D_OUT, D_HID, 23);
const b2 = Array.from({ length: D_OUT }, () => 0);

function matvec(M: number[][], v: number[]): number[] {
  return M.map((row) => row.reduce((acc, w, j) => acc + w * v[j], 0));
}

function add(a: number[], b: number[]): number[] {
  return a.map((x, i) => x + b[i]);
}

function magBar(v: number, max = 2): { neg: boolean; pct: number } {
  const pct = Math.max(0, Math.min(100, (Math.abs(v) / max) * 100));
  return { neg: v < 0, pct };
}

export function MLPBlock() {
  const [x, setX] = useState<number[]>([0.4, -0.3, 1.0, 0.2]);

  const z1 = add(matvec(W1, x), b1);
  const h = z1.map(relu);
  const y = add(matvec(W2, h), b2);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-4">
        <Column title="input  x" values={x} accent="x" editable onChange={setX} />
        <Column title="z = W₁x + b₁" values={z1} accent="muted" />
        <Column title="h = ReLU(z)" values={h} accent="hidden" />
        <Column title="y = W₂h + b₂" values={y} accent="out" />
      </div>
      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        A two-layer MLP with hidden width 6, ReLU activation. Drag the
        input bars on the left; watch the pre-activation, hidden, and
        output update in lockstep. Notice how ReLU zeros out about half
        of the hidden coordinates on every input.
      </p>
    </div>
  );
}

function Column({
  title,
  values,
  accent,
  editable,
  onChange,
}: {
  title: string;
  values: number[];
  accent: "x" | "muted" | "hidden" | "out";
  editable?: boolean;
  onChange?: (v: number[]) => void;
}) {
  const accentClass =
    accent === "x"
      ? "border-blue-500/40 bg-blue-500/5"
      : accent === "out"
        ? "border-accent/40 bg-[rgb(var(--accent-soft))]/40"
        : accent === "hidden"
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-line bg-paper-sunken";

  const barColor =
    accent === "x"
      ? "rgb(var(--viz-x))"
      : accent === "out"
        ? "rgb(var(--accent))"
        : accent === "hidden"
          ? "rgb(var(--viz-y))"
          : "rgb(var(--viz-v))";

  return (
    <div className={`rounded-lg border ${accentClass} p-3`}>
      <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
        {title}
      </div>
      <div className="space-y-1.5">
        {values.map((v, i) => {
          const { neg, pct } = magBar(v);
          return (
            <div key={i}>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-ink-subtle">{i}</span>
                <span className="text-ink-muted">
                  {v >= 0 ? "+" : ""}
                  {v.toFixed(2)}
                </span>
              </div>
              <div className="relative mt-0.5 h-2 rounded bg-paper">
                <div
                  className="absolute top-0 h-2 rounded"
                  style={{
                    width: `${pct / 2}%`,
                    [neg ? "right" : "left"]: "50%",
                    background: barColor,
                  }}
                />
                <div className="absolute left-1/2 top-0 h-2 w-px bg-line" />
              </div>
              {editable && onChange && (
                <input
                  type="range"
                  min={-2}
                  max={2}
                  step={0.05}
                  value={v}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = parseFloat(e.target.value);
                    onChange(next);
                  }}
                  className="mt-0.5 w-full accent-blue-600"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
