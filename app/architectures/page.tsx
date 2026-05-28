import { ArchitectureMap } from "@/components/viz/ArchitectureMap";
import { ARCH_CATEGORIES } from "@/lib/architectures";

export const metadata = {
  title: "The Architecture Map",
  description:
    "An interactive map of every major AI/ML architecture from linear regression (1805) to modern frontier LLMs and state-space models. Click a node to read why it is used vs its closest alternatives.",
};

export default function ArchitecturesPage() {
  const total = ARCH_CATEGORIES.reduce((n, c) => n + c.archs.length, 0);
  const cats = ARCH_CATEGORIES.length;

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mx-auto max-w-3xl">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Reference
        </p>
        <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          The Architecture Map
        </h1>
        <p className="mt-5 font-serif text-lg leading-relaxed text-ink-muted">
          Every important AI/ML architecture from 1805 to 2026, organized by
          family. {total} architectures across {cats} categories. Click any
          node to read what it is, and{" "}
          <em>why you would pick it over its closest alternatives</em>{" "}
          &mdash; the comparative judgement is the point of the map.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Hint
            heading="Pan and zoom"
            body="The map is a real graph. Drag the canvas, pinch / scroll to zoom, and use the mini-map in the bottom-left to navigate the full surface."
          />
          <Hint
            heading="Click any node"
            body="Selecting an architecture lights it up, draws solid edges to its alternatives, and fills the right-hand panel with why-use vs those alternatives."
          />
          <Hint
            heading="Search and filter"
            body="The search box matches names, blurbs, and reasons-to-use. Category chips toggle whole families on and off."
          />
        </div>
      </header>

      <div className="mt-10">
        <ArchitectureMap />
      </div>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-ink">
          How this map is organized
        </h2>
        <p className="mt-3 font-serif text-base leading-relaxed text-ink-muted">
          The 14 categories follow the historical lineage of supervised and
          unsupervised modelling. Classical statistics begat tree ensembles
          and probabilistic graphical models. Probabilistic models &mdash;
          via the Boltzmann machines &mdash; begat the multi-layer
          perceptron renaissance, which gave us CNNs (vision), RNNs and
          memory networks (sequences), GANs and normalizing flows
          (generative). RNNs gave way to the foundational transformer in
          2017; foundational transformers split into efficient/long-context
          variants, the modern LLM family, and the state-space &amp; post-transformer
          line that&apos;s gaining ground in 2024-2026.
        </p>
        <p className="mt-3 font-serif text-base leading-relaxed text-ink-muted">
          The dashed arrows in the lineage diagram are causal-influence
          edges, not strict subclass relations. A Vision Transformer is
          not a subclass of an RNN, but the architectural move that made
          ViT possible (sequence modelling with self-attention) was first
          paid for by the RNN-to-Transformer transition. Read the map as a
          family tree, not a type hierarchy.
        </p>
        <h2 className="mt-10 font-sans text-2xl font-semibold tracking-tight text-ink">
          What &ldquo;why use it&rdquo; means here
        </h2>
        <p className="mt-3 font-serif text-base leading-relaxed text-ink-muted">
          Every entry&apos;s <em>why use</em> answer is comparative: it
          tells you why you would pick this architecture <em>over its
          closest alternatives</em>, not in the abstract. There is rarely
          a universally-best architecture; there are architectures that
          dominate on a specific axis (sample efficiency, parameter count,
          latency, interpretability, training stability) at a specific
          scale, on a specific data modality. The point of having all
          189 in one place is to make the trade-off space legible.
        </p>
        <h2 className="mt-10 font-sans text-2xl font-semibold tracking-tight text-ink">
          Caveats
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 font-serif text-base leading-relaxed text-ink-muted">
          <li>
            <strong>Not every variant is its own entry.</strong> When a
            family has dozens of small variants (every BERT-style encoder,
            every YOLO version), the map keeps the most influential and
            mentions the rest in the parent entry&apos;s blurb or its
            alternatives.
          </li>
          <li>
            <strong>The years are first-publication years.</strong> For
            architectures with long evolution (ResNet, BERT, GPT,
            Mamba), the year is the named milestone, not the last
            update.
          </li>
          <li>
            <strong>Coverage is opinionated.</strong> The map intentionally
            includes pre-deep-learning models (linear regression, GAMs,
            kernel methods) because they remain the right answer for many
            real-world problems, especially on tabular data, and
            understanding why a transformer would lose to XGBoost on a
            small tabular benchmark is worth more than knowing every
            transformer variant.
          </li>
          <li>
            <strong>The frontier changes.</strong> Architectures published
            in the last 12-18 months are included where they have already
            shifted the field (Mamba, DeepSeek-style MoE, diffusion-LM
            hybrids); some excellent ideas are not yet here because the
            community hasn&apos;t settled on what they replace.
          </li>
        </ul>
      </section>
    </article>
  );
}

function Hint({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper-raised p-3">
      <div className="font-sans text-xs font-semibold uppercase tracking-wider text-accent">
        {heading}
      </div>
      <p className="mt-1 font-serif text-[13px] leading-relaxed text-ink-muted">
        {body}
      </p>
    </div>
  );
}
