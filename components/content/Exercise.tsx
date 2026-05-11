"use client";

import { useState, type ReactNode } from "react";

export function Exercise({
  prompt,
  hint,
  solution,
}: {
  prompt: ReactNode;
  hint?: ReactNode;
  solution: ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="my-6 rounded-lg border border-line bg-paper-raised p-4 font-sans">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
        Try it
      </div>
      <div className="text-[0.95rem] leading-relaxed text-ink">{prompt}</div>
      <div className="mt-3 flex gap-2">
        {hint && (
          <button
            type="button"
            onClick={() => setShowHint((s) => !s)}
            className="rounded-md border border-line px-3 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
          >
            {showHint ? "Hide hint" : "Hint"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowSolution((s) => !s)}
          className="rounded-md border border-line px-3 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
        >
          {showSolution ? "Hide solution" : "Solution"}
        </button>
      </div>
      {showHint && hint && (
        <div className="mt-3 rounded-md bg-paper-sunken p-3 text-sm text-ink-muted">
          {hint}
        </div>
      )}
      {showSolution && (
        <div className="mt-3 rounded-md border border-line bg-paper p-3 text-sm text-ink">
          {solution}
        </div>
      )}
    </div>
  );
}
