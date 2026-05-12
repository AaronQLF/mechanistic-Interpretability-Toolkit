import Link from "next/link";
import { calculusChapters } from "@/lib/topics";

export const metadata = {
  title: "Calculus",
  description:
    "An interactive calculus primer for mechanistic interpretability.",
};

export default function CalculusIndex() {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Module 03
      </p>
      <h1>Calculus</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        Linear algebra told us what neural networks <em>are</em>. Probability
        told us what they <em>output</em>. Calculus is how they{" "}
        <em>learn</em>. Every weight in every model exists because a gradient
        pointed somewhere, and someone took a small step in that direction.
      </p>

      <h2>How this module works</h2>
      <p>
        Same shape as Linear Algebra and Probability: a hook, a definition,
        an interactive widget you can drag, and a callout naming where the
        idea reappears in mech interp. We build up to the chain rule, the
        gradient, gradient descent, and finally backpropagation — the
        single algorithm that trains essentially every neural network ever
        written.
      </p>

      <h2>The chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {calculusChapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/calculus/${c.slug}`}
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
        Comfortable with single-variable calculus? Skip ahead to{" "}
        <Link href="/calculus/gradient">the gradient</Link>,{" "}
        <Link href="/calculus/backprop">backpropagation</Link>, or the{" "}
        <Link href="/calculus/mech-interp-bridge">capstone</Link>.
      </p>
    </article>
  );
}
