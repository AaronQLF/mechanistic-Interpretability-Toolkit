import Link from "next/link";
import { probabilityChapters } from "@/lib/topics";

export const metadata = {
  title: "Probability",
  description:
    "An interactive probability primer for mechanistic interpretability.",
};

export default function ProbabilityIndex() {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Module 02
      </p>
      <h1>Probability</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        A neural network does not output a word. It outputs a probability
        distribution over every word it knows, and then someone — or some
        sampler — picks one. The math for talking about that distribution,
        how surprising it is, how far it is from the truth, and how to
        update beliefs as evidence arrives, is the math of probability.
      </p>

      <h2>How this module works</h2>
      <p>
        Same shape as Linear Algebra: hook, definition, interactive widget,
        and a callout naming the exact place each idea reappears in mech
        interp. The bars you&apos;ll drag below are the same bars that
        appear at the end of a transformer&apos;s forward pass — that is
        not a metaphor.
      </p>

      <h2>The chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {probabilityChapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/probability/${c.slug}`}
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
        If you already know your way around distributions, jump to{" "}
        <Link href="/probability/softmax">softmax</Link>,{" "}
        <Link href="/probability/cross-entropy-kl">KL divergence</Link>, or
        the <Link href="/probability/mech-interp-bridge">capstone</Link>.
      </p>
    </article>
  );
}
