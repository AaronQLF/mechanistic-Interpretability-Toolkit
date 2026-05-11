"use client";

import { useState, type ReactNode } from "react";

type Choice = {
  id: string;
  label: ReactNode;
  correct?: boolean;
  explain?: ReactNode;
};

export function Quiz({
  question,
  choices,
}: {
  question: ReactNode;
  choices: Choice[];
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const pickedChoice = choices.find((c) => c.id === picked) ?? null;

  return (
    <div className="my-6 rounded-lg border border-line bg-paper-raised p-4 font-sans">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent">
        Quick check
      </div>
      <div className="text-[0.95rem] leading-relaxed text-ink">{question}</div>
      <div className="mt-3 space-y-2">
        {choices.map((c) => {
          const isPicked = picked === c.id;
          const isCorrect = !!c.correct;
          const showState = isPicked && picked !== null;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setPicked(c.id)}
              className={[
                "flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left text-sm transition",
                showState
                  ? isCorrect
                    ? "border-emerald-500/50 bg-emerald-500/10 text-ink"
                    : "border-rose-500/50 bg-rose-500/10 text-ink"
                  : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={[
                  "mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border text-[10px]",
                  showState
                    ? isCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-rose-500 bg-rose-500 text-white"
                    : "border-line",
                ].join(" ")}
              >
                {showState ? (isCorrect ? "✓" : "×") : ""}
              </span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
      {pickedChoice?.explain && (
        <div className="mt-3 rounded-md bg-paper-sunken p-3 text-sm text-ink-muted">
          {pickedChoice.explain}
        </div>
      )}
    </div>
  );
}
