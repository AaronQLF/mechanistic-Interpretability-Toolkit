import Link from "next/link";
import { transformersChapters } from "@/lib/topics";

export const metadata = {
  title: "Transformers",
  description:
    "An interactive primer on the transformer architecture for mechanistic interpretability — self-attention, multi-head, QK and OV circuits, positional encodings, the block, and the GPT decoder stack.",
};

export default function TransformersIndex() {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Module 05
      </p>
      <h1>Transformers</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        Neural networks gave us a stack of linear layers and nonlinearities.
        Transformers add one new ingredient — <em>attention</em> — and a
        very particular way of arranging the whole thing around a{" "}
        <em>residual stream</em>. That&apos;s the entire architecture.
        Once you can see those two ideas clearly, every modern frontier
        model is a parameter count and a tokenizer change away.
      </p>

      <h2>How this module works</h2>
      <p>
        Same shape as the previous modules: a hook, an honest definition,
        an interactive widget where it helps, and a callout that names
        where the idea reappears in mech interp. We start at a single
        attention operation and end with a full GPT-style decoder stack.
        The capstone collects everything into the &ldquo;residual stream
        as a privileged basis&rdquo; picture that the circuits module
        will live inside.
      </p>

      <h2>The chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {transformersChapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/transformers/${c.slug}`}
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
        Already comfortable with attention? Skip ahead to{" "}
        <Link href="/transformers/qk-ov">QK and OV circuits</Link>,{" "}
        <Link href="/transformers/the-block">the transformer block</Link>
        , or the{" "}
        <Link href="/transformers/mech-interp-bridge">capstone</Link>.
      </p>
    </article>
  );
}
