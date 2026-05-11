"use client";

import { useMemo, useState } from "react";
import { ProbBars } from "./ProbBars";
import { kl, pct, softmax } from "@/lib/prob";

/**
 * A tiny "logit lens" toy:
 *   residual stream  x ∈ R^4
 *   unembedding W_U: 6 tokens × 4 hidden  (a fixed matrix)
 *   logits = W_U x
 *   probs  = softmax(logits)
 * The user can ablate a hidden channel (set it to 0) and compare the
 * resulting distribution to the clean one via KL.
 */

const TOKENS = ["the", "a", "cat", "dog", "model", "</s>"];

// W_U: 6 × 4 — chosen so different channels promote different tokens.
const W_U: number[][] = [
  [1.6, 0.2, 0.1, -0.2], // the
  [1.3, 0.1, 0.3, 0.1], // a
  [-0.2, 1.6, 0.5, 0.3], // cat
  [-0.1, 1.4, -0.3, 0.6], // dog
  [0.4, -0.1, 1.6, 0.1], // model
  [-0.5, -0.4, 0.2, 1.4], // </s>
];

const HIDDEN_LABELS = ["h₁", "h₂", "h₃", "h₄"];
const HIDDEN_HINT = [
  "boring determiners",
  "animals",
  "ML-jargon",
  "end-of-sequence",
];

function matvec(M: number[][], v: number[]): number[] {
  return M.map((row) => row.reduce((acc, m, j) => acc + m * v[j], 0));
}

export function LogitLensToy() {
  const [x, setX] = useState<number[]>([0.6, 1.2, 0.4, -0.3]);
  const [ablated, setAblated] = useState<number | null>(null);

  const xAbl = useMemo(() => {
    if (ablated === null) return x;
    return x.map((v, i) => (i === ablated ? 0 : v));
  }, [x, ablated]);

  const logitsClean = useMemo(() => matvec(W_U, x), [x]);
  const logitsAbl = useMemo(() => matvec(W_U, xAbl), [xAbl]);
  const pClean = useMemo(() => softmax(logitsClean), [logitsClean]);
  const pAbl = useMemo(() => softmax(logitsAbl), [logitsAbl]);

  const KLba = kl(pClean, pAbl, 2);

  const argmaxClean = pClean.indexOf(Math.max(...pClean));
  const argmaxAbl = pAbl.indexOf(Math.max(...pAbl));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            residual stream  x ∈ ℝ⁴
          </div>
          <ProbBars
            values={x}
            labels={HIDDEN_LABELS}
            yMin={-2}
            yMax={2}
            height={170}
            colors={HIDDEN_LABELS.map((_, i) =>
              ablated === i ? "rgb(var(--ink-subtle))" : "rgb(var(--viz-v))"
            )}
            valueFormat={(v) => v.toFixed(2)}
            onChange={(i, v) => {
              setAblated(null);
              setX((prev) => {
                const next = [...prev];
                next[i] = v;
                return next;
              });
            }}
          />
          <div className="mt-2 grid grid-cols-4 gap-1">
            {HIDDEN_LABELS.map((l, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAblated((cur) => (cur === i ? null : i))}
                className={[
                  "rounded-md border px-1 py-1 font-mono text-[10px] transition",
                  ablated === i
                    ? "border-rose-500/60 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
                title={HIDDEN_HINT[i]}
              >
                {ablated === i ? `${l} ablated` : `ablate ${l}`}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            logits = W_U x  (drag x; this updates)
          </div>
          <ProbBars
            values={ablated === null ? logitsClean : logitsAbl}
            labels={TOKENS}
            yMin={-3}
            yMax={6}
            height={170}
            colors={TOKENS.map((_, i) =>
              i === (ablated === null ? argmaxClean : argmaxAbl)
                ? "rgb(var(--accent))"
                : "rgb(var(--viz-w))"
            )}
            valueFormat={(v) => v.toFixed(1)}
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.9fr]">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            P(token)  clean
          </div>
          <ProbBars
            values={pClean}
            labels={TOKENS}
            colors={TOKENS.map((_, i) =>
              i === argmaxClean ? "rgb(var(--accent))" : "rgb(var(--viz-v))"
            )}
            yMax={1}
            height={150}
            valueFormat={(v) => pct(v, 0)}
          />
        </div>
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            P(token)  ablated
          </div>
          <ProbBars
            values={pAbl}
            labels={TOKENS}
            colors={TOKENS.map((_, i) =>
              i === argmaxAbl ? "rgb(var(--accent))" : "rgb(var(--viz-w))"
            )}
            yMax={1}
            height={150}
            valueFormat={(v) => pct(v, 0)}
          />
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm self-start">
          <Row label="argmax (clean)" value={TOKENS[argmaxClean]} />
          <Row
            label="argmax (ablated)"
            value={TOKENS[argmaxAbl]}
            highlight={argmaxClean !== argmaxAbl}
          />
          <div className="my-2 border-t border-line" />
          <Row
            label="KL(clean ‖ ablated)"
            value={`${KLba.toFixed(3)} bits`}
            highlight
          />
          <p className="mt-3 font-sans text-xs text-ink-muted">
            {ablated === null
              ? "Click 'ablate hᵢ' to zero a channel and compare."
              : "Try ablating each channel in turn — which one matters most for this x?"}
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
