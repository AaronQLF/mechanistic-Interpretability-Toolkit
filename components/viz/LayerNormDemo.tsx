"use client";

import { useState } from "react";

const D = 8;

export function LayerNormDemo() {
  const [x, setX] = useState<number[]>([1.5, -0.4, 2.1, 0.3, -1.2, 0.9, -0.7, 0.0]);
  const [gamma, setGamma] = useState<number>(1);
  const [beta, setBeta] = useState<number>(0);

  const mean = x.reduce((a, b) => a + b, 0) / D;
  const variance = x.reduce((acc, v) => acc + (v - mean) ** 2, 0) / D;
  const std = Math.sqrt(variance + 1e-5);
  const normalized = x.map((v) => (v - mean) / std);
  const output = normalized.map((v) => gamma * v + beta);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-3">
        <Bars
          title="input  x"
          values={x}
          accent="muted"
          editable
          onChange={setX}
          range={3}
        />
        <Bars
          title="(x − μ) / σ"
          values={normalized}
          accent="hidden"
          range={3}
        />
        <Bars
          title="γ (x − μ)/σ + β"
          values={output}
          accent="out"
          range={3}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
        <Stat label="mean μ" value={mean.toFixed(3)} />
        <Stat label="std σ" value={std.toFixed(3)} />
        <Stat
          label="‖normalized‖"
          value={Math.sqrt(normalized.reduce((a, b) => a + b * b, 0)).toFixed(3)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Slider
          label="γ  (learned scale)"
          value={gamma}
          min={0}
          max={3}
          step={0.05}
          onChange={setGamma}
        />
        <Slider
          label="β  (learned shift)"
          value={beta}
          min={-2}
          max={2}
          step={0.05}
          onChange={setBeta}
        />
      </div>

      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        LayerNorm subtracts the mean and divides by the (per-token) std,
        then re-applies a learned γ and β. Try editing any input bar —
        the middle column always has mean 0 and std 1, no matter what
        you do to the input. The output (right) is the normalized
        vector after γ, β.
      </p>
    </div>
  );
}

function Bars({
  title,
  values,
  accent,
  editable,
  onChange,
  range,
}: {
  title: string;
  values: number[];
  accent: "muted" | "hidden" | "out";
  editable?: boolean;
  onChange?: (v: number[]) => void;
  range: number;
}) {
  const accentClass =
    accent === "out"
      ? "border-accent/40 bg-[rgb(var(--accent-soft))]/40"
      : accent === "hidden"
        ? "border-emerald-500/40 bg-emerald-500/5"
        : "border-line bg-paper-sunken";
  const barColor =
    accent === "out"
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
          const pct = Math.max(0, Math.min(100, (Math.abs(v) / range) * 100));
          const neg = v < 0;
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
                  min={-3}
                  max={3}
                  step={0.05}
                  value={v}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = parseFloat(e.target.value);
                    onChange(next);
                  }}
                  className="mt-0.5 w-full accent-amber-600"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper-sunken px-3 py-2 font-mono text-sm">
      <div className="font-sans text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
        {label}
      </div>
      <div className="text-ink">{value}</div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-md border border-line bg-paper-sunken p-3 font-sans text-sm">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wide text-ink-subtle">
          {label}
        </span>
        <span className="font-mono text-ink">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-amber-600"
      />
    </div>
  );
}
