"use client";

import { useState } from "react";
import { ProbBars } from "./ProbBars";
import { normalize, pct, sum } from "@/lib/prob";

type Preset = "uniform" | "spiked" | "bimodal" | "almost-deterministic";

const PRESETS: Record<Preset, number[]> = {
  uniform: [1, 1, 1, 1, 1, 1],
  spiked: [0.5, 1.2, 4, 1.2, 0.5, 0.2],
  bimodal: [3, 1, 0.2, 0.2, 1, 3],
  "almost-deterministic": [0.05, 0.05, 0.05, 6, 0.05, 0.05],
};

const LABELS = ["A", "B", "C", "D", "E", "F"];

/** Editable categorical distribution. Bars can be dragged in [0,1]; we
 *  normalize on display so it stays a real probability distribution. */
export function DistributionEditor() {
  const [raw, setRaw] = useState<number[]>(() => [...PRESETS.spiked]);

  const p = normalize(raw);
  const total = sum(raw);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <ProbBars
          values={p}
          labels={LABELS}
          yMax={1}
          height={240}
          showValues
          valueFormat={(v) => (v * 100).toFixed(0) + "%"}
          yLabel="P(X = x)"
          onChange={(i, v) => {
            // Map screen [0,1] back to raw weight: keep total stable-ish so
            // dragging feels predictable.
            setRaw((prev) => {
              const next = [...prev];
              const otherTotal = total - prev[i];
              const want = Math.max(0.0001, v);
              // Solve: want = next[i] / (next[i] + otherTotal)
              // => next[i] = want * otherTotal / (1 - want)
              const eps = 0.001;
              const wClamped = Math.min(1 - eps, want);
              next[i] = (wClamped * otherTotal) / (1 - wClamped);
              return next;
            });
          }}
        />
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as Preset[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setRaw([...PRESETS[k]])}
                className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
              >
                {k}
              </button>
            ))}
          </div>
          <p className="mt-3 font-serif text-xs leading-relaxed text-ink-muted">
            Drag a bar&apos;s top edge to reshape the distribution.
            Everything renormalizes so the bars always sum to 100%.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            distribution
          </div>
          <div className="space-y-1">
            {p.map((pi, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-ink-muted">{LABELS[i]}</span>
                <span className="text-ink">{pct(pi)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-2">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Σ</span>
              <span className="text-ink">{pct(p.reduce((a, b) => a + b, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
