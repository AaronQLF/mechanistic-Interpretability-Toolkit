"use client";

import { useMemo, useState } from "react";
import { softmax } from "@/lib/prob";

const TOKENS = ["The", "cat", "sat", "on", "the", "mat"];
const D = 4;

function makeMatrix(rows: number, cols: number, seed: number): number[][] {
  let s = seed;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return (s / 233280) * 2 - 1;
  };
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.round(r() * 100) / 100)
  );
}

function matvec(M: number[][], v: number[]): number[] {
  return M.map((row) => row.reduce((acc, w, j) => acc + w * v[j], 0));
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

const W_E = makeMatrix(TOKENS.length, D, 5);
const W_Q = makeMatrix(D, D, 13);
const W_K = makeMatrix(D, D, 27);
const W_V = makeMatrix(D, D, 41);

export function AttentionDemo() {
  const [queryIdx, setQueryIdx] = useState(2);
  const [causal, setCausal] = useState(true);

  const data = useMemo(() => {
    const Qs = TOKENS.map((_, i) => matvec(W_Q, W_E[i]));
    const Ks = TOKENS.map((_, i) => matvec(W_K, W_E[i]));
    const Vs = TOKENS.map((_, i) => matvec(W_V, W_E[i]));
    const sqrtD = Math.sqrt(D);
    const scores = Ks.map((k) => dot(Qs[queryIdx], k) / sqrtD);
    let masked = scores.slice();
    if (causal) {
      masked = masked.map((s, i) => (i > queryIdx ? -1e9 : s));
    }
    const weights = softmax(masked);
    const output = Array.from({ length: D }, (_, j) =>
      Vs.reduce((acc, v, i) => acc + weights[i] * v[j], 0)
    );
    return { Qs, Ks, Vs, scores, weights, output };
  }, [queryIdx, causal]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            query token
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TOKENS.map((tok, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQueryIdx(i)}
                className={[
                  "rounded-md border px-2.5 py-1 font-mono text-xs transition",
                  i === queryIdx
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {tok}
              </button>
            ))}
          </div>
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 font-sans text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={causal}
              onChange={(e) => setCausal(e.target.checked)}
              className="accent-amber-600"
            />
            causal mask (no peeking ahead)
          </label>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper-sunken p-3">
          <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            attention scores &nbsp;
            <span className="font-mono normal-case text-ink-muted">
              (q · kᵢ) / √d
            </span>
          </div>
          <ScoreBars
            tokens={TOKENS}
            values={data.scores}
            masked={
              causal ? TOKENS.map((_, i) => i > queryIdx) : TOKENS.map(() => false)
            }
          />
        </div>
        <div className="rounded-lg border border-accent/40 bg-paper-sunken p-3">
          <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-accent">
            attention weights &nbsp;
            <span className="font-mono normal-case text-accent">
              softmax(scores)
            </span>
          </div>
          <ScoreBars
            tokens={TOKENS}
            values={data.weights}
            highlight
            masked={
              causal ? TOKENS.map((_, i) => i > queryIdx) : TOKENS.map(() => false)
            }
            valueFormat={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper-sunken p-3">
        <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          output at query &ldquo;{TOKENS[queryIdx]}&rdquo; &nbsp;
          <span className="font-mono normal-case text-ink-muted">
            = Σᵢ wᵢ · vᵢ
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 font-mono text-xs">
          {data.output.map((v, j) => (
            <div
              key={j}
              className="rounded border border-line bg-paper px-2 py-1.5 text-center"
            >
              <div className="text-ink-subtle">d{j}</div>
              <div className="text-ink">
                {v >= 0 ? "+" : ""}
                {v.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        Pick a query token. The middle row shows raw scores{" "}
        <span className="font-mono">qᵀkᵢ / √d</span> for every key in the
        sentence; the right shows what softmax does to them. The output
        is a weighted average of the value vectors. With the causal
        mask on, the future is killed before softmax — so the bars to
        the right of the query become flat zero.
      </p>
    </div>
  );
}

function ScoreBars({
  tokens,
  values,
  masked,
  highlight,
  valueFormat,
}: {
  tokens: readonly string[];
  values: readonly number[];
  masked?: readonly boolean[];
  highlight?: boolean;
  valueFormat?: (v: number) => string;
}) {
  const positives = values.filter((v) => v > 0);
  const negatives = values.filter((v) => v < 0);
  const max = Math.max(0.01, ...positives.map(Math.abs));
  const min = Math.min(-0.01, ...(negatives.length ? negatives : [0]));
  const span = Math.max(Math.abs(max), Math.abs(min));
  return (
    <div className="space-y-1">
      {values.map((v, i) => {
        const isMasked = masked?.[i];
        const pct = isMasked ? 0 : Math.min(100, (Math.abs(v) / span) * 100);
        const neg = v < 0;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="w-12 truncate font-mono text-[11px] text-ink-subtle">
              {tokens[i]}
            </div>
            <div className="relative flex-1 h-3 rounded bg-paper">
              <div className="absolute left-1/2 top-0 h-3 w-px bg-line" />
              <div
                className="absolute top-0 h-3 rounded"
                style={{
                  width: `${pct / 2}%`,
                  [neg ? "right" : "left"]: "50%",
                  background: isMasked
                    ? "rgb(var(--ink-subtle))"
                    : highlight
                      ? "rgb(var(--accent))"
                      : "rgb(var(--viz-w))",
                  opacity: isMasked ? 0.25 : 0.85,
                }}
              />
            </div>
            <div className="w-14 text-right font-mono text-[11px] text-ink">
              {isMasked
                ? "—∞"
                : valueFormat
                  ? valueFormat(v)
                  : v.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
