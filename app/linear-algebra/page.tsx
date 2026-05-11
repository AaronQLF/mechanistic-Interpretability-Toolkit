import Link from "next/link";
import { linearAlgebraChapters } from "@/lib/topics";

export const metadata = {
  title: "Linear Algebra",
  description:
    "An interactive linear algebra primer for mechanistic interpretability.",
};

export default function LinearAlgebraIndex() {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Module 01
      </p>
      <h1>Linear Algebra</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        Every transformer, every probe, every sparse autoencoder is a stack of
        linear maps with a few nonlinearities sprinkled in. If you want to read
        the inside of a model, you need to be fluent in the language those
        linear maps are written in. That&apos;s what this module is for.
      </p>

      <h2>How this module works</h2>
      <p>
        Each chapter has the same shape: a short hook, an honest definition,
        an interactive widget you can drag around, and a short callout
        showing exactly where the idea reappears in mechanistic
        interpretability. Read in order — every chapter pays interest in the
        next one.
      </p>

      <h2>The chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {linearAlgebraChapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/linear-algebra/${c.slug}`}
              className="group flex gap-4 rounded-lg border border-line bg-paper-raised p-4 no-underline transition hover:border-ink-muted"
            >
              <div className="font-mono text-xs text-ink-subtle pt-1">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div className="font-sans text-base font-semibold text-ink group-hover:text-accent">
                  {c.title}
                </div>
                <div className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                  {c.blurb}
                </div>
              </div>
              <div
                className="flex items-center font-sans text-sm text-ink-subtle group-hover:text-accent"
                aria-hidden
              >
                →
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <p className="!mt-10 font-serif text-sm text-ink-muted">
        Already comfortable with the basics? You can skip ahead to the{" "}
        <Link href="/linear-algebra/svd">SVD chapter</Link> or the{" "}
        <Link href="/linear-algebra/mech-interp-bridge">capstone</Link>.
      </p>
    </article>
  );
}
