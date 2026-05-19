import Link from "next/link";
import { neuralNetworksChapters } from "@/lib/topics";

export const metadata = {
  title: "Neural Networks",
  description:
    "An interactive primer on neural networks for mechanistic interpretability — neurons, linear layers, nonlinearities, embeddings, MLPs, layer normalization, and residual streams.",
};

export default function NeuralNetworksIndex() {
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Module 04
      </p>
      <h1>Neural Networks</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        Linear algebra gave us the <em>language</em>, probability gave us the{" "}
        <em>output</em>, and calculus gave us the <em>training signal</em>.
        This module is where they meet: a network is just a stack of
        linear layers with nonlinearities between them, ending in a
        softmax. Every weight you&apos;ll ever stare at in a transformer
        lives in one of the blocks below.
      </p>

      <h2>How this module works</h2>
      <p>
        Same shape as the previous three: a hook, an honest definition,
        an interactive widget where it helps, and a callout that names
        where the idea reappears in mech interp. We work bottom-up —
        from a single neuron to a multi-layer block with residual
        connections — and finish with a capstone on what mech interp{" "}
        <em>does</em> with networks once it has them.
      </p>

      <h2>The chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {neuralNetworksChapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/neural-networks/${c.slug}`}
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
        Already comfortable with the basics? Skip ahead to{" "}
        <Link href="/neural-networks/mlp">the MLP</Link>,{" "}
        <Link href="/neural-networks/layernorm-residual">
          layer norm &amp; residuals
        </Link>
        , or the{" "}
        <Link href="/neural-networks/mech-interp-bridge">capstone</Link>.
      </p>
    </article>
  );
}
