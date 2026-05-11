"use client";

import { useMemo, useState } from "react";
import { ProbBars } from "./ProbBars";
import { entropy, normalize, softmax } from "@/lib/prob";

const K = 8;

export function EntropyMeter() {
  const [shape, setShape] = useState(0); // 0 = peak on one entry, 1 = uniform
  const [skew, setSkew] = useState(0); // bias toward later entries

  // We build the distribution as softmax over a tilt vector: logits = (1-shape) * tilt
  // tilt = base * (1 - 2*(i / (K-1))) + skew*(i/(K-1))
  // At shape=1 logits are all 0 -> uniform; at shape=0 logits are extreme.
  const p = useMemo(() => {
    const baseStrength = 6 * (1 - shape);
    const logits: number[] = [];
    for (let i = 0; i < K; i++) {
      const t = i / (K - 1);
      // a hill centered at 2 of K-1
      const hill = -Math.pow((t - 0.25), 2) * 16;
      logits.push(baseStrength * hill + skew * (t - 0.5) * 8);
    }
    return softmax(logits);
  }, [shape, skew]);

  const H = entropy(p, 2);
  const Hmax = Math.log2(K);
  const Hnorm = H / Hmax;
  // perplexity = 2^H
  const perp = Math.pow(2, H);

  const LABELS = Array.from({ length: K }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            distribution
          </div>
          <ProbBars
            values={p}
            labels={LABELS}
            yMax={1}
            height={200}
            valueFormat={(v) => (v * 100).toFixed(0) + "%"}
            yLabel="probability"
          />
        </div>
        <EntropyBar Hnorm={Hnorm} />
      </div>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <Slider
            label="Sharpness  ←  flat ··· peaked  →"
            value={1 - shape}
            min={0}
            max={1}
            step={0.005}
            onChange={(v) => setShape(1 - v)}
            format={(v) => v.toFixed(2)}
            reverse
          />
          <Slider
            label="Skew  ←  left ··· right  →"
            value={skew}
            min={-1}
            max={1}
            step={0.01}
            onChange={setSkew}
            format={(v) => v.toFixed(2)}
          />
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="H(p)" value={`${H.toFixed(3)} bits`} highlight />
          <Row label="max H" value={`${Hmax.toFixed(3)} bits`} />
          <Row label="H / max H" value={Hnorm.toFixed(3)} />
          <div className="my-2 border-t border-line" />
          <Row
            label="perplexity = 2ᴴ"
            value={perp.toFixed(2)}
          />
        </div>
      </div>
    </div>
  );
}

function EntropyBar({ Hnorm }: { Hnorm: number }) {
  const w = 560;
  const h = 56;
  const padL = 30;
  const padR = 30;
  const innerW = w - padL - padR;
  return (
    <div className="rounded-lg border border-line bg-paper-raised p-3">
      <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        H / log₂ K
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label="Entropy meter">
        <rect
          x={padL}
          y={20}
          width={innerW}
          height={16}
          fill="rgb(var(--paper-sunken))"
          rx={8}
        />
        <rect
          x={padL}
          y={20}
          width={Math.max(0, Math.min(1, Hnorm)) * innerW}
          height={16}
          fill="rgb(var(--accent))"
          rx={8}
        />
        <text
          x={padL}
          y={14}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
        >
          peaky (low surprise)
        </text>
        <text
          x={padL + innerW}
          y={14}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
          textAnchor="end"
        >
          uniform (max surprise)
        </text>
        <text
          x={padL + Math.max(0, Math.min(1, Hnorm)) * innerW}
          y={52}
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--accent))"
          textAnchor="middle"
        >
          ▲
        </text>
      </svg>
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
  format,
  reverse,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  reverse?: boolean;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-amber-600"
        style={reverse ? { direction: "rtl" } : undefined}
      />
      <div className="text-right font-mono text-xs text-ink">{format(value)}</div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
      ].join(" ")}
    >
      <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
