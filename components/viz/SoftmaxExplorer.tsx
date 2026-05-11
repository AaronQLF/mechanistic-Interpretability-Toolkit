"use client";

import { useMemo, useState } from "react";
import { ProbBars } from "./ProbBars";
import { pct, softmax } from "@/lib/prob";

const TOKENS = ["the", "a", "cat", "dog", "model", "</s>"];

export function SoftmaxExplorer() {
  const [logits, setLogits] = useState<number[]>([2.4, 1.8, 1.0, 0.7, 0.3, -1.2]);
  const [T, setT] = useState(1);

  const probs = useMemo(() => softmax(logits, T), [logits, T]);
  const argmax = useMemo(() => {
    let k = 0;
    for (let i = 1; i < logits.length; i++) if (logits[i] > logits[k]) k = i;
    return k;
  }, [logits]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            logits  (raw scores, can be any real number)
          </div>
          <ProbBars
            values={logits}
            labels={TOKENS}
            yMax={5}
            yMin={-3}
            height={180}
            highlight={argmax}
            colors={TOKENS.map((_, i) =>
              i === argmax ? "rgb(var(--accent))" : "rgb(var(--viz-v))"
            )}
            valueFormat={(v) => v.toFixed(2)}
            yLabel="logit"
            onChange={(i, v) => {
              setLogits((prev) => {
                const next = [...prev];
                next[i] = v;
                return next;
              });
            }}
          />
        </div>
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            softmax(logits / T)  (a real distribution)
          </div>
          <ProbBars
            values={probs}
            labels={TOKENS}
            yMax={1}
            height={180}
            highlight={argmax}
            colors={TOKENS.map((_, i) =>
              i === argmax ? "rgb(var(--accent))" : "rgb(var(--viz-w))"
            )}
            valueFormat={(v) => pct(v, 1)}
            yLabel="probability"
          />
        </div>
      </div>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <label
            htmlFor="temp"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle"
          >
            temperature  T
          </label>
          <input
            id="temp"
            type="range"
            min={0.1}
            max={5}
            step={0.05}
            value={T}
            onChange={(e) => setT(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between font-mono text-xs">
            <span className="text-ink-subtle">0.1 (sharp)</span>
            <span className="text-ink">T = {T.toFixed(2)}</span>
            <span className="text-ink-subtle">5 (flat)</span>
          </div>
          <p className="mt-3 font-serif text-xs leading-relaxed text-ink-muted">
            Drag the logit bars to reshape the input. Slide temperature
            to interpolate between &ldquo;peaky argmax&rdquo; (T → 0)
            and &ldquo;uniform&rdquo; (T → ∞).
          </p>
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            argmax token
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">{TOKENS[argmax]}</span>
            <span className="text-accent">{pct(probs[argmax])}</span>
          </div>
          <div className="mt-3 border-t border-line pt-2">
            <button
              type="button"
              onClick={() => {
                setLogits([2.4, 1.8, 1.0, 0.7, 0.3, -1.2]);
                setT(1);
              }}
              className="w-full rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
