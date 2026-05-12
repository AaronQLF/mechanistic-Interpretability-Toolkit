"use client";

import { useState, type ReactNode } from "react";

type Variant = "theorem" | "lemma" | "corollary" | "identity";

const labels: Record<Variant, string> = {
  theorem: "Theorem",
  lemma: "Lemma",
  corollary: "Corollary",
  identity: "Identity",
};

export function Theorem({
  number,
  variant = "theorem",
  title,
  statement,
  intuition,
  proof,
  children,
}: {
  number?: string | number;
  variant?: Variant;
  title: string;
  statement: ReactNode;
  intuition?: ReactNode;
  proof: ReactNode;
  children?: ReactNode;
}) {
  const [showProof, setShowProof] = useState(false);
  return (
    <section className="my-8 overflow-hidden rounded-xl border border-line bg-paper-raised font-sans">
      <header className="flex items-baseline gap-3 border-b border-line bg-paper-sunken px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
          {labels[variant]}
          {number !== undefined && ` ${number}`}
        </span>
        <h3 className="!m-0 text-[0.95rem] font-semibold leading-snug text-ink">
          {title}
        </h3>
      </header>
      <div className="px-4 py-4">
        <div className="space-y-2 text-[0.95rem] leading-relaxed text-ink">
          {statement}
        </div>
        {intuition && (
          <div className="mt-3 rounded-md border border-line bg-paper-sunken px-3 py-2 text-[0.85rem] leading-relaxed text-ink-muted">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
              Intuition.
            </span>
            {intuition}
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowProof((s) => !s)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:border-ink-muted hover:text-ink"
            aria-expanded={showProof}
          >
            <Caret open={showProof} />
            {showProof ? "Hide proof" : "Show proof"}
          </button>
        </div>
        {showProof && (
          <div className="mt-4 rounded-md border border-line bg-paper px-4 py-3 font-serif text-[0.95rem] leading-relaxed text-ink">
            <div className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-wider text-accent">
              Proof
            </div>
            <div className="space-y-3">{proof}</div>
            <div className="mt-3 text-right font-sans text-ink-muted" aria-label="end of proof">
              <span className="inline-block h-2.5 w-2.5 border border-ink-muted align-baseline" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
