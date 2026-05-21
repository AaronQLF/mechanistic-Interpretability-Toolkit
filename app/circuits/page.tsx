import Link from "next/link";
import { circuitsChapters } from "@/lib/topics";

export const metadata = {
  title: "Mech-interp Circuits",
  description:
    "An interactive primer on mechanistic interpretability circuits — induction heads, IOI, activation patching, sparse autoencoders, and the practice of finding human-readable computation inside large models.",
};

export default function CircuitsIndex() {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Module 06
      </p>
      <h1>Mech-interp Circuits</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        The first five modules built the math and the architecture. This
        one builds the <em>practice</em>: how working interpretability
        researchers actually take a trained model apart, name what they
        find, and prove that what they named is what the model is
        doing. Induction heads, the IOI circuit, activation patching,
        sparse autoencoders, and circuit diagrams — in the order you&apos;d
        meet them on a project.
      </p>

      <h2>How this module works</h2>
      <p>
        Same shape as before, with one shift: every chapter in this
        module is a <em>method</em> as well as a result. We define what
        a circuit even is, walk through the two most-cited circuits in
        GPT-2 small, build the causal toolkit (patching, ablation,
        attribution), then turn to sparse autoencoders and the open
        problem of what a feature really is. The capstone is honest
        about what the field can explain today and what it can&apos;t.
      </p>

      <h2>The chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {circuitsChapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/circuits/${c.slug}`}
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
        Want the methods first? Jump to{" "}
        <Link href="/circuits/activation-patching">activation patching</Link>
        ,{" "}
        <Link href="/circuits/sparse-autoencoders">sparse autoencoders</Link>
        , or the{" "}
        <Link href="/circuits/mech-interp-bridge">capstone</Link>.
      </p>
    </article>
  );
}
