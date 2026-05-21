"use client";

import { useMemo, useState } from "react";

const PROMPTS = [
  "A B C A B C A B".split(" "),
  "X Y Z W X Y Z W X Y Z".split(" "),
  "The cat sat the cat".split(" "),
] as const;

export function InductionHeadDemo() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [step, setStep] = useState<0 | 1 | 2>(2);

  const tokens = PROMPTS[promptIdx];
  const queryIdx = tokens.length - 1;

  // Phase 1: previous-token head — query i attends to key i-1.
  const prevTokenWeights = useMemo(
    () =>
      tokens.map((_, i) =>
        tokens.map((_, j) => (i === 0 ? (j === 0 ? 1 : 0) : j === i - 1 ? 1 : 0))
      ),
    [tokens]
  );

  // After phase 1, each position j carries information about token (j-1) in
  // its residual stream. The induction head, at position queryIdx, looks for
  // a position j whose "previous token" matches the current token tokens[queryIdx].
  const inductionWeights = useMemo(() => {
    const cur = tokens[queryIdx];
    const raw = tokens.map((_, j) => {
      if (j === 0) return -1;
      if (j > queryIdx) return -Infinity;
      return tokens[j - 1] === cur ? 4 : -1;
    });
    const m = Math.max(...raw.filter((v) => isFinite(v)));
    const exp = raw.map((v) => (isFinite(v) ? Math.exp(v - m) : 0));
    const z = exp.reduce((a, b) => a + b, 0);
    return exp.map((e) => e / Math.max(z, 1e-12));
  }, [tokens, queryIdx]);

  // Final prediction: copy the token at the position the induction head attended to.
  const predicted = useMemo(() => {
    let bestJ = 0;
    let bestW = -1;
    for (let j = 0; j < inductionWeights.length; j++) {
      if (inductionWeights[j] > bestW) {
        bestW = inductionWeights[j];
        bestJ = j;
      }
    }
    return tokens[bestJ] ?? "?";
  }, [inductionWeights, tokens]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          example
        </span>
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPromptIdx(i)}
            className={[
              "rounded-md border px-2.5 py-1 font-mono text-xs transition",
              i === promptIdx
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {p.join(" ")}
          </button>
        ))}
        <span className="ml-auto inline-flex rounded-md border border-line">
          {[
            { id: 0, label: "1. previous-token" },
            { id: 1, label: "2. induction" },
            { id: 2, label: "3. predict" },
          ].map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id as 0 | 1 | 2)}
              className={[
                "px-2.5 py-1 font-sans text-[11px] transition",
                step === s.id
                  ? "bg-accent text-white"
                  : "text-ink-muted hover:bg-paper-sunken",
                i > 0 ? "border-l border-line" : "",
              ].join(" ")}
            >
              {s.label}
            </button>
          ))}
        </span>
      </div>

      <div className="rounded-lg border border-line bg-paper-sunken p-3">
        <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          {step === 0
            ? "step 1: previous-token head writes (token, prev-token) into each position"
            : step === 1
              ? "step 2: induction head at the last position queries for 'find a position whose prev-token equals me'"
              : "step 3: copy that match's current token forward — the prediction"}
        </div>
        <TokenStrip
          tokens={tokens}
          queryIdx={queryIdx}
          weights={
            step === 0
              ? prevTokenWeights[queryIdx]
              : inductionWeights
          }
          showQuery={step >= 1}
          predicted={step === 2 ? predicted : undefined}
        />
      </div>

      {step === 0 && (
        <div className="rounded-lg border border-line bg-paper-sunken p-3">
          <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            after step 1, each position carries (token, prev_token)
          </div>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-6 font-mono text-[11px]">
            {tokens.map((t, i) => (
              <div
                key={i}
                className="rounded border border-line bg-paper px-2 py-1"
              >
                <div className="text-ink-subtle">pos {i}</div>
                <div className="text-ink">
                  {t} <span className="text-ink-subtle">|</span>{" "}
                  {i === 0 ? "—" : tokens[i - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-lg border border-accent/40 bg-[rgb(var(--accent-soft))]/40 p-3 font-mono text-sm">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-accent">
            predicted next token
          </div>
          <div className="text-ink">
            ... {tokens[queryIdx]} →{" "}
            <span className="font-bold text-accent">{predicted}</span>
          </div>
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink-muted">
            The induction head has matched the current token (
            <span className="text-ink">{tokens[queryIdx]}</span>) against
            an earlier occurrence whose <em>previous</em> token was the
            same — and copied the token that came after it last time.
            That&apos;s in-context learning, in five lines of attention
            arithmetic.
          </p>
        </div>
      )}
    </div>
  );
}

function TokenStrip({
  tokens,
  queryIdx,
  weights,
  showQuery,
  predicted,
}: {
  tokens: readonly string[];
  queryIdx: number;
  weights: readonly number[];
  showQuery: boolean;
  predicted?: string;
}) {
  const cell = 56;
  const h = 70;
  const w = tokens.length * cell + 24;

  return (
    <svg
      viewBox={`0 0 ${w} ${h + 60}`}
      width="100%"
      style={{ display: "block" }}
      role="img"
      aria-label="Induction head token strip"
    >
      {tokens.map((t, i) => {
        const x = 12 + i * cell;
        const wgt = weights[i] ?? 0;
        const isQuery = i === queryIdx;
        return (
          <g key={i}>
            <rect
              x={x}
              y={28}
              width={cell - 6}
              height={36}
              rx={6}
              fill="rgb(var(--accent))"
              opacity={Math.min(0.85, Math.max(0, wgt))}
            />
            <rect
              x={x}
              y={28}
              width={cell - 6}
              height={36}
              rx={6}
              fill="none"
              stroke={
                isQuery && showQuery
                  ? "rgb(var(--accent))"
                  : "rgb(var(--line))"
              }
              strokeWidth={isQuery && showQuery ? 2 : 1}
            />
            <text
              x={x + (cell - 6) / 2}
              y={50}
              fontSize={14}
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
              fill="rgb(var(--ink))"
              fontWeight={isQuery ? 700 : 400}
            >
              {t}
            </text>
            <text
              x={x + (cell - 6) / 2}
              y={20}
              fontSize={10}
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
              fill="rgb(var(--ink-subtle))"
            >
              {i}
            </text>
            {wgt > 0.05 && (
              <text
                x={x + (cell - 6) / 2}
                y={80}
                fontSize={10}
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                fill="rgb(var(--accent))"
                fontWeight={600}
              >
                {(wgt * 100).toFixed(0)}%
              </text>
            )}
            {showQuery && isQuery && wgt < 0.99 && (
              <text
                x={x + (cell - 6) / 2}
                y={100}
                fontSize={10}
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                fill="rgb(var(--ink-muted))"
              >
                query
              </text>
            )}
          </g>
        );
      })}
      {predicted && (
        <g>
          <text
            x={12 + tokens.length * cell - 24}
            y={50}
            fontSize={18}
            textAnchor="start"
            fill="rgb(var(--accent))"
          >
            →
          </text>
          <rect
            x={12 + tokens.length * cell - 4}
            y={28}
            width={cell - 6}
            height={36}
            rx={6}
            fill="rgb(var(--accent))"
            opacity={0.2}
            stroke="rgb(var(--accent))"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          <text
            x={12 + tokens.length * cell - 4 + (cell - 6) / 2}
            y={50}
            fontSize={14}
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            fill="rgb(var(--accent))"
            fontWeight={700}
          >
            {predicted}
          </text>
        </g>
      )}
    </svg>
  );
}
