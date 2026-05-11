"use client";

import { useMemo, useState } from "react";
import { ProbBars } from "./ProbBars";
import { pct } from "@/lib/prob";

/**
 * Disease-test Bayes' rule explorer:
 *   H_1 = has disease (prior π)
 *   H_2 = does not
 * Likelihoods:
 *   P(positive | disease)    = sensitivity
 *   P(positive | no disease) = 1 - specificity   (false positive rate)
 */

export function BayesUpdater() {
  const [prior, setPrior] = useState(0.01); // base rate of disease
  const [sens, setSens] = useState(0.99); // P(+ | disease)
  const [spec, setSpec] = useState(0.95); // P(- | no disease)
  const [observed, setObserved] = useState<"+" | "-">("+");

  const { priorVec, likeVec, postVec, evidence } = useMemo(() => {
    const priorVec = [prior, 1 - prior];
    // P(obs | H_i)
    const likeIfPositive = [sens, 1 - spec];
    const likeIfNegative = [1 - sens, spec];
    const like = observed === "+" ? likeIfPositive : likeIfNegative;
    const numerators = [priorVec[0] * like[0], priorVec[1] * like[1]];
    const z = numerators[0] + numerators[1] || 1e-12;
    const post = [numerators[0] / z, numerators[1] / z];
    return { priorVec, likeVec: like, postVec: post, evidence: z };
  }, [prior, sens, spec, observed]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3">
        <Trio
          label="Prior  P(H)"
          values={priorVec}
          colors={["rgb(var(--viz-v))", "rgb(var(--ink-subtle))"]}
        />
        <Trio
          label={`Likelihood  P(${observed} | H)`}
          values={likeVec}
          colors={["rgb(var(--viz-w))", "rgb(var(--ink-subtle))"]}
          unnormalized
        />
        <Trio
          label="Posterior  P(H | obs)"
          values={postVec}
          colors={["rgb(var(--accent))", "rgb(var(--ink-subtle))"]}
        />
      </div>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <Slider
            label="Prior P(disease)"
            value={prior}
            min={0.001}
            max={0.5}
            step={0.001}
            onChange={setPrior}
            format={(v) => pct(v, 2)}
          />
          <Slider
            label="Sensitivity P(+ | disease)"
            value={sens}
            min={0.5}
            max={1}
            step={0.005}
            onChange={setSens}
            format={(v) => pct(v, 1)}
          />
          <Slider
            label="Specificity P(− | no disease)"
            value={spec}
            min={0.5}
            max={1}
            step={0.005}
            onChange={setSpec}
            format={(v) => pct(v, 1)}
          />
          <div className="mt-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Observation
            </div>
            <div className="flex gap-2">
              {(["+", "-"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setObserved(o)}
                  className={[
                    "flex-1 rounded-md border px-2 py-1 text-xs transition",
                    observed === o
                      ? "border-accent bg-accent text-white"
                      : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                  ].join(" ")}
                >
                  test {o === "+" ? "positive" : "negative"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row
            label="P(disease | obs)"
            value={pct(postVec[0])}
            highlight
          />
          <Row label="P(obs)" value={pct(evidence)} />
        </div>
      </div>
    </div>
  );
}

function Trio({
  label,
  values,
  colors,
  unnormalized,
}: {
  label: string;
  values: number[];
  colors: string[];
  unnormalized?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper-raised p-3">
      <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {label} {unnormalized && <span className="ml-1 normal-case font-normal text-ink-subtle">(does not sum to 1)</span>}
      </div>
      <ProbBars
        values={values}
        labels={["H₁  disease", "H₂  no disease"]}
        colors={colors}
        height={120}
        width={520}
        yMax={1}
        valueFormat={(v) => pct(v, 1)}
      />
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
        highlight ? "text-base font-semibold text-accent" : "",
      ].join(" ")}
    >
      <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
