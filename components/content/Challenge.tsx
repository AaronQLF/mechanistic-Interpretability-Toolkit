"use client";

import { useState, type ReactNode } from "react";

export function Challenge({
  title = "Chapter challenge",
  prompt,
  hint,
  solution,
}: {
  title?: string;
  prompt: ReactNode;
  hint?: ReactNode;
  solution: ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="my-8 overflow-hidden rounded-xl border border-accent/40 bg-[rgb(var(--accent-soft))]/40 font-sans">
      <header className="flex items-center gap-2 border-b border-accent/30 bg-[rgb(var(--accent-soft))]/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        <Flame className="h-3.5 w-3.5" />
        <span>{title}</span>
        <span className="ml-auto rounded-full border border-accent/40 px-2 py-0.5 text-[10px] font-medium tracking-wider text-accent/90">
          hard
        </span>
      </header>
      <div className="px-4 py-4">
        <div className="text-[0.95rem] leading-relaxed text-ink">{prompt}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {hint && (
            <button
              type="button"
              onClick={() => setShowHint((s) => !s)}
              className="rounded-md border border-line bg-paper px-3 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              {showHint ? "Hide hint" : "Hint"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            className="rounded-md border border-accent/40 bg-paper px-3 py-1 text-xs font-medium text-accent transition hover:border-accent hover:bg-[rgb(var(--accent-soft))]"
          >
            {showSolution ? "Hide solution" : "Reveal solution"}
          </button>
        </div>
        {showHint && hint && (
          <div className="mt-4 rounded-md border border-line bg-paper-sunken p-3 text-sm text-ink-muted">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/80">
              Hint
            </div>
            {hint}
          </div>
        )}
        {showSolution && (
          <div className="mt-4 rounded-md border border-line bg-paper p-4 text-[0.9rem] leading-relaxed text-ink">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
              Solution
            </div>
            <div className="space-y-3">{solution}</div>
          </div>
        )}
      </div>
    </section>
  );
}

function Flame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2s4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-2 .8-2.8C9.6 8 10.4 7 12 2z" />
      <path d="M7.5 13C6 14 5 15.6 5 17.5A6.5 6.5 0 0 0 18.5 18c.3-2.6-1.2-4.6-3-6-.4 1.6-1.7 2.5-3 2.5-1.7 0-3-1.3-3-3 0-.5 0-1-.5-1.5z" />
    </svg>
  );
}
