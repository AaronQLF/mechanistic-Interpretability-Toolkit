"use client";

import { useMemo, useState } from "react";
import { softmax } from "@/lib/prob";

const TOKENS = ["When", "Mary", "and", "John", "went", "to", "the", "store"];
const N = TOKENS.length;

// Hand-designed "attention patterns" — three heads with different specializations.
// Each pattern[i][j] is an unnormalized score for query i attending to key j.
type Pattern = (i: number, j: number) => number;

const HEADS: { name: string; descr: string; pattern: Pattern; color: string }[] =
  [
    {
      name: "previous-token",
      descr:
        "Almost every query pays attention to the token just before it.",
      color: "#dc2626",
      pattern: (i, j) =>
        i === 0 ? (j === 0 ? 3 : -2) : j === i - 1 ? 4 : -2,
    },
    {
      name: "subject-tracker",
      descr:
        '"Mary" and "John" attend to themselves; everything else attends to the most recent name.',
      color: "#0284c7",
      pattern: (i, j) => {
        const namePos = TOKENS[i] === "Mary" || TOKENS[i] === "John";
        if (namePos) return j === i ? 5 : -2;
        const lastNameUpTo = (() => {
          let best = -1;
          for (let k = 0; k <= i; k++) {
            if (TOKENS[k] === "Mary" || TOKENS[k] === "John") best = k;
          }
          return best;
        })();
        if (lastNameUpTo === -1) return j === i ? 2 : -2;
        return j === lastNameUpTo ? 3 : j === i ? 1 : -2;
      },
    },
    {
      name: "first-token",
      descr:
        'Almost every query attends to the very first token — a "rest position" sink.',
      color: "#16a34a",
      pattern: (i, j) => (j === 0 ? 3 : i === j ? 1 : -2),
    },
  ];

function mask(scores: number[][], causal: boolean): number[][] {
  if (!causal) return scores;
  return scores.map((row, i) => row.map((s, j) => (j > i ? -1e9 : s)));
}

function rowSoftmax(scores: number[][]): number[][] {
  return scores.map((row) => softmax(row));
}

function buildPattern(p: Pattern): number[][] {
  return Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) => p(i, j))
  );
}

export function MultiHeadDemo() {
  const [activeHead, setActiveHead] = useState(0);
  const [queryIdx, setQueryIdx] = useState(7);

  const heatmaps = useMemo(
    () => HEADS.map((h) => rowSoftmax(mask(buildPattern(h.pattern), true))),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          head
        </span>
        {HEADS.map((h, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveHead(i)}
            className={[
              "rounded-md border px-3 py-1 font-mono text-xs transition",
              i === activeHead
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
            style={
              i === activeHead
                ? { borderColor: HEADS[i].color, background: HEADS[i].color }
                : undefined
            }
          >
            {i + 1}. {h.name}
          </button>
        ))}
      </div>

      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        {HEADS[activeHead].descr}
      </p>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <Heatmap
          tokens={TOKENS}
          weights={heatmaps[activeHead]}
          color={HEADS[activeHead].color}
          highlightRow={queryIdx}
          onSelectRow={setQueryIdx}
        />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            row {queryIdx} &nbsp;
            <span className="text-ink">&ldquo;{TOKENS[queryIdx]}&rdquo;</span>
          </div>
          <div className="space-y-1">
            {heatmaps[activeHead][queryIdx].map((w, j) => (
              <div
                key={j}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-ink-subtle">{TOKENS[j]}</span>
                <span
                  className={
                    w > 0.5
                      ? "font-semibold text-accent"
                      : w > 0.1
                        ? "text-ink"
                        : "text-ink-subtle"
                  }
                >
                  {(w * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-sans text-[11px] leading-snug text-ink-muted">
            Click any row of the heatmap to inspect its weights here.
          </p>
        </div>
      </div>
    </div>
  );
}

function Heatmap({
  tokens,
  weights,
  color,
  highlightRow,
  onSelectRow,
}: {
  tokens: readonly string[];
  weights: number[][];
  color: string;
  highlightRow: number;
  onSelectRow: (i: number) => void;
}) {
  const cell = 32;
  const labelW = 60;
  const padT = 56;
  const w = labelW + tokens.length * cell + 8;
  const h = padT + tokens.length * cell + 8;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      style={{ display: "block", maxWidth: 520 }}
      role="img"
      aria-label="Attention heatmap"
    >
      {tokens.map((tok, j) => (
        <text
          key={j}
          x={labelW + j * cell + cell / 2}
          y={padT - 6}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-muted))"
          textAnchor="start"
          transform={`rotate(-45, ${labelW + j * cell + cell / 2}, ${padT - 6})`}
        >
          {tok}
        </text>
      ))}
      {tokens.map((tok, i) => (
        <g key={i}>
          <text
            x={labelW - 6}
            y={padT + i * cell + cell / 2 + 3}
            fontSize={10}
            fontFamily="ui-monospace, monospace"
            fill={
              i === highlightRow ? "rgb(var(--ink))" : "rgb(var(--ink-muted))"
            }
            textAnchor="end"
            fontWeight={i === highlightRow ? 600 : 400}
          >
            {tok}
          </text>
          {weights[i].map((w, j) => (
            <rect
              key={j}
              x={labelW + j * cell}
              y={padT + i * cell}
              width={cell - 1}
              height={cell - 1}
              fill={color}
              opacity={Math.min(1, Math.max(0.04, w))}
              onClick={() => onSelectRow(i)}
              style={{ cursor: "pointer" }}
            >
              <title>
                {tokens[i]} → {tokens[j]}: {(w * 100).toFixed(0)}%
              </title>
            </rect>
          ))}
          {i === highlightRow && (
            <rect
              x={labelW - 1}
              y={padT + i * cell - 1}
              width={cell * tokens.length + 2}
              height={cell + 1}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth={1.4}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
