"use client";

import { useMemo, useState } from "react";
import { ProbBars } from "./ProbBars";
import { crossEntropy, entropy, kl, normalize } from "@/lib/prob";

type Preset = "matched" | "model-wrong" | "model-overconfident" | "model-flat";

const PRESETS: Record<Preset, { p: number[]; q: number[] }> = {
  matched: {
    p: [0.05, 0.1, 0.6, 0.15, 0.07, 0.03],
    q: [0.05, 0.1, 0.6, 0.15, 0.07, 0.03],
  },
  "model-wrong": {
    p: [0.05, 0.1, 0.6, 0.15, 0.07, 0.03],
    q: [0.1, 0.6, 0.05, 0.1, 0.1, 0.05],
  },
  "model-overconfident": {
    p: [0.05, 0.1, 0.6, 0.15, 0.07, 0.03],
    q: [0.01, 0.02, 0.92, 0.03, 0.01, 0.01],
  },
  "model-flat": {
    p: [0.05, 0.1, 0.6, 0.15, 0.07, 0.03],
    q: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
  },
};

const LABELS = ["A", "B", "C", "D", "E", "F"];

export function KLExplorer() {
  const [pRaw, setPRaw] = useState<number[]>([...PRESETS.matched.p]);
  const [qRaw, setQRaw] = useState<number[]>([...PRESETS["model-wrong"].q]);

  const p = useMemo(() => normalize(pRaw), [pRaw]);
  const q = useMemo(() => normalize(qRaw), [qRaw]);

  const Hp = entropy(p, 2);
  const CE = crossEntropy(p, q, 2);
  const KLpq = kl(p, q, 2);
  const KLqp = kl(q, p, 2);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              true distribution  P  (data)
            </div>
          </div>
          <ProbBars
            values={p}
            labels={LABELS}
            colors={LABELS.map(() => "rgb(var(--viz-v))")}
            yMax={1}
            height={200}
            valueFormat={(v) => (v * 100).toFixed(0) + "%"}
            onChange={(i, v) => {
              const total = pRaw.reduce((a, b) => a + b, 0);
              const otherTotal = total - pRaw[i];
              const eps = 0.001;
              const wClamped = Math.min(1 - eps, Math.max(eps, v));
              const next = [...pRaw];
              next[i] = (wClamped * otherTotal) / (1 - wClamped);
              setPRaw(next);
            }}
          />
        </div>
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            model distribution  Q  (predicted)
          </div>
          <ProbBars
            values={q}
            labels={LABELS}
            colors={LABELS.map(() => "rgb(var(--viz-w))")}
            yMax={1}
            height={200}
            valueFormat={(v) => (v * 100).toFixed(0) + "%"}
            onChange={(i, v) => {
              const total = qRaw.reduce((a, b) => a + b, 0);
              const otherTotal = total - qRaw[i];
              const eps = 0.001;
              const wClamped = Math.min(1 - eps, Math.max(eps, v));
              const next = [...qRaw];
              next[i] = (wClamped * otherTotal) / (1 - wClamped);
              setQRaw(next);
            }}
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-sunken p-4 font-mono text-sm">
          <Row label="H(P)" value={`${Hp.toFixed(3)} bits`} subtle />
          <Row
            label="H(P, Q) = cross-entropy"
            value={`${CE.toFixed(3)} bits`}
            highlight
          />
          <div className="my-2 border-t border-line" />
          <Row label="KL(P ‖ Q)" value={`${KLpq.toFixed(3)} bits`} highlight />
          <Row
            label="KL(Q ‖ P)"
            value={`${KLqp.toFixed(3)} bits`}
            subtle
          />
          <p className="mt-3 font-sans text-xs text-ink-muted">
            <strong>Identity:</strong> H(P, Q) = H(P) + KL(P ‖ Q). Try
            it — the equation should balance to within rounding error.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as Preset[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setPRaw([...PRESETS[k].p]);
                  setQRaw([...PRESETS[k].q]);
                }}
                className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
              >
                {k}
              </button>
            ))}
          </div>
          <p className="mt-3 font-serif text-xs text-ink-muted">
            Drag either chart&apos;s bars. The numbers below the
            charts recompute instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  subtle,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
        subtle ? "opacity-70" : "",
      ].join(" ")}
    >
      <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
