import Link from "next/link";
import type { ReactNode } from "react";

export function ComingSoon({
  title,
  blurb,
  topics,
}: {
  title: string;
  blurb: string;
  topics: ReactNode[];
}) {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-0">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Coming soon
      </p>
      <h1>{title}</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        {blurb}
      </p>

      <h2>What this module will cover</h2>
      <ul>
        {topics.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <div className="mt-10 rounded-lg border border-line bg-paper-raised p-5">
        <p className="font-sans text-sm text-ink-muted">
          The Linear Algebra module is fully shipped today. Start there — the
          building blocks for everything below come from it.
        </p>
        <Link
          href="/linear-algebra"
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-sm font-semibold text-white transition hover:opacity-90"
        >
          Open Linear Algebra <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
