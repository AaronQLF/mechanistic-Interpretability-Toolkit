"use client";

import { useMemo, useState } from "react";
import { ProbBars } from "./ProbBars";
import { entropy, greedy, normalize, pct, softmax, topK, topP } from "@/lib/prob";

type Mode = "greedy" | "temperature" | "top-k" | "top-p";

// A representative "real" next-token distribution: one big winner, a few
// plausible alternatives, a long tail of small probabilities.
const TOKENS = [
  "the", "a", "an", "this", "that", "my", "our", "some", "every", "any",
] as const;
const BASE_LOGITS = [3.2, 2.6, 2.2, 1.4, 1.0, 0.6, 0.3, 0.0, -0.4, -0.9];

export function SamplingExplorer() {
  const [mode, setMode] = useState<Mode>("temperature");
  const [T, setT] = useState(1);
  const [k, setK] = useState(3);
  const [pCut, setPCut] = useState(0.8);

  const base = useMemo(() => softmax(BASE_LOGITS, 1), []);
  const truncated = useMemo(() => {
    switch (mode) {
      case "greedy":
        return greedy(base);
      case "temperature":
        return softmax(BASE_LOGITS, T);
      case "top-k":
        return topK(base, k);
      case "top-p":
        return topP(base, pCut);
    }
  }, [mode, base, T, k, pCut]);

  const H = entropy(truncated, 2);

  const argmax = (() => {
    let m = 0;
    for (let i = 1; i < truncated.length; i++)
      if (truncated[i] > truncated[m]) m = i;
    return m;
  })();

  const keptIdx = new Set<number>();
  truncated.forEach((p, i) => {
    if (p > 1e-9) keptIdx.add(i);
  });

  const tokenColors = TOKENS.map((_, i) =>
    keptIdx.has(i) ? "rgb(var(--viz-w))" : "rgb(var(--ink-subtle))"
  );

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            model&apos;s raw next-token distribution
          </div>
          <div className="font-mono text-[10px] text-ink-subtle">
            argmax = {TOKENS[argmax]}
          </div>
        </div>
        <ProbBars
          values={base}
          labels={TOKENS}
          colors={TOKENS.map((_, i) =>
            keptIdx.has(i) ? "rgb(var(--viz-v))" : "rgb(var(--ink-subtle))"
          )}
          yMax={Math.max(0.5, base[argmax] + 0.05)}
          height={170}
          valueFormat={(v) => pct(v, 1)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            after {mode} (renormalized)
          </div>
          <ProbBars
            values={truncated}
            labels={TOKENS}
            colors={tokenColors}
            yMax={Math.max(0.5, Math.max(...truncated) + 0.05)}
            height={170}
            highlight={argmax}
            valueFormat={(v) => (v > 0.001 ? pct(v, 1) : "")}
          />
          <div className="mt-1 font-mono text-[10px] text-ink-subtle">
            H = {H.toFixed(2)} bits   ·   tokens retained: {keptIdx.size}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Strategy
            </div>
            <div className="flex flex-wrap gap-2">
              {(["greedy", "temperature", "top-k", "top-p"] as Mode[]).map(
                (m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={[
                      "rounded-md border px-2 py-1 text-xs transition",
                      mode === m
                        ? "border-accent bg-accent text-white"
                        : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {m}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
            {mode === "temperature" && (
              <Slider
                label="temperature T"
                value={T}
                min={0.1}
                max={3}
                step={0.05}
                onChange={setT}
                format={(v) => v.toFixed(2)}
              />
            )}
            {mode === "top-k" && (
              <Slider
                label="k"
                value={k}
                min={1}
                max={TOKENS.length}
                step={1}
                onChange={(v) => setK(Math.round(v))}
                format={(v) => String(Math.round(v))}
              />
            )}
            {mode === "top-p" && (
              <Slider
                label="cumulative mass p"
                value={pCut}
                min={0.1}
                max={1}
                step={0.01}
                onChange={setPCut}
                format={(v) => pct(v, 0)}
              />
            )}
            {mode === "greedy" && (
              <p className="font-serif text-xs text-ink-muted">
                Greedy picks the single argmax token with probability 1.
                It&apos;s deterministic — same input, same output, every
                time.
              </p>
            )}
          </div>
        </div>
      </div>
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
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
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
      />
      <div className="text-right font-mono text-xs text-ink">{format(value)}</div>
    </div>
  );
}
