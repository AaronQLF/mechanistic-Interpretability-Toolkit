"use client";

import { useState } from "react";

const VOCAB = ["the", "a", "cat", "dog", "model", "</s>"];
const D = 6;

function makeEmbedding(): number[][] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return (seed / 233280) * 2 - 1;
  };
  return Array.from({ length: VOCAB.length }, () =>
    Array.from({ length: D }, () => Math.round(rand() * 100) / 100)
  );
}

const E = makeEmbedding();

export function EmbeddingLookup() {
  const [idx, setIdx] = useState(2);

  const oneHot = Array.from({ length: VOCAB.length }, (_, i) => (i === idx ? 1 : 0));
  const vec = E[idx];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          pick a token
        </div>
        <div className="flex flex-wrap gap-1.5">
          {VOCAB.map((tok, i) => (
            <button
              key={tok}
              type="button"
              onClick={() => setIdx(i)}
              className={[
                "rounded-md border px-2.5 py-1 font-mono text-xs transition",
                i === idx
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {tok}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[0.7fr_1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 font-sans font-semibold uppercase tracking-wide text-ink-subtle">
            one-hot &nbsp;
            <span className="font-mono normal-case text-ink-muted">e_{idx}</span>
          </div>
          <div className="space-y-0.5">
            {oneHot.map((v, i) => (
              <div
                key={i}
                className={[
                  "flex items-center justify-between rounded px-2 py-0.5",
                  v === 1 ? "bg-accent text-white" : "text-ink-muted",
                ].join(" ")}
              >
                <span>{VOCAB[i]}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 font-sans font-semibold uppercase tracking-wide text-ink-subtle">
            embedding matrix &nbsp;
            <span className="font-mono normal-case text-ink-muted">
              W_E &nbsp;({VOCAB.length}×{D})
            </span>
          </div>
          <table className="w-full border-separate border-spacing-y-0.5">
            <tbody>
              {E.map((row, i) => (
                <tr
                  key={i}
                  className={i === idx ? "bg-accent/15" : ""}
                >
                  <td className="pr-2 text-ink-subtle">{VOCAB[i]}</td>
                  {row.map((v, j) => (
                    <td
                      key={j}
                      className={[
                        "px-1 text-right",
                        i === idx ? "text-ink" : "text-ink-muted",
                      ].join(" ")}
                    >
                      {v >= 0 ? "+" : ""}
                      {v.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-accent/40 bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 font-sans font-semibold uppercase tracking-wide text-accent">
            embedding vector &nbsp;
            <span className="font-mono normal-case text-accent">
              W_E[{idx}]
            </span>
          </div>
          <div className="space-y-0.5">
            {vec.map((v, j) => (
              <div
                key={j}
                className="flex items-center justify-between rounded bg-accent/10 px-2 py-0.5 text-ink"
              >
                <span className="text-ink-subtle">d{j}</span>
                <span>
                  {v >= 0 ? "+" : ""}
                  {v.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        Click any token. Its one-hot vector picks out exactly one row of
        the embedding matrix &mdash; that row is the embedding vector.
        The matmul{" "}
        <span className="font-mono">e&nbsp;&middot;&nbsp;W_E</span> is
        just a row lookup, no real arithmetic happens.
      </p>
    </div>
  );
}
