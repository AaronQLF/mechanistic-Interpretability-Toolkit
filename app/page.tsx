import Link from "next/link";
import { CurriculumMap } from "@/components/ui/CurriculumMap";
import {
  calculusChapters,
  circuitsChapters,
  linearAlgebraChapters,
  neuralNetworksChapters,
  probabilityChapters,
  transformersChapters,
} from "@/lib/topics";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            An interactive textbook
          </p>
          <h1 className="mt-3 font-sans text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            Look inside the
            <br />
            <span className="text-accent">neural network.</span>
          </h1>
          <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-ink-muted">
            Mechanistic interpretability is the science of reverse-engineering
            what neural networks have learned. To do it, you need a working
            intuition for the math underneath. We&apos;ll start at the
            beginning — vectors and matrices — and walk all the way to
            attention circuits and sparse autoencoders. Every page is
            interactive: drag, scrub, and watch the math breathe.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/linear-algebra"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:opacity-90"
            >
              Start with Linear Algebra
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/calculus"
              className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-sans text-sm font-medium text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Or jump into Calculus →
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
            <Stat label="Modules live" value="6 / 6" />
            <Stat
              label="Chapters"
              value={String(
                linearAlgebraChapters.length +
                  probabilityChapters.length +
                  calculusChapters.length +
                  neuralNetworksChapters.length +
                  transformersChapters.length +
                  circuitsChapters.length
              )}
            />
            <Stat label="Interactive widgets" value="50+" />
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-paper-raised p-4 sm:p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Curriculum map
          </h2>
          <p className="mt-1 font-serif text-sm text-ink-muted">
            All six modules are live: Linear Algebra, Probability,
            Calculus, Neural Networks, Transformers, and the
            Mech-interp Circuits capstone.
          </p>
          <div className="mt-4">
            <CurriculumMap />
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Available now
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
              Linear algebra, the way mech interp uses it
            </h2>
          </div>
          <Link
            href="/linear-algebra"
            className="hidden font-sans text-sm font-medium text-ink-muted transition hover:text-accent sm:inline"
          >
            See all chapters →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {linearAlgebraChapters.slice(0, 6).map((c, i) => (
            <Link
              key={c.slug}
              href={`/linear-algebra/${c.slug}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Also available
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
              Probability — distributions, entropy, and the loss
            </h2>
          </div>
          <Link
            href="/probability"
            className="hidden font-sans text-sm font-medium text-ink-muted transition hover:text-accent sm:inline"
          >
            See all chapters →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {probabilityChapters.slice(0, 6).map((c, i) => (
            <Link
              key={c.slug}
              href={`/probability/${c.slug}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              New
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
              Calculus — gradients, the chain rule, and backprop
            </h2>
          </div>
          <Link
            href="/calculus"
            className="hidden font-sans text-sm font-medium text-ink-muted transition hover:text-accent sm:inline"
          >
            See all chapters →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calculusChapters.slice(0, 6).map((c, i) => (
            <Link
              key={c.slug}
              href={`/calculus/${c.slug}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Just landed
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
              Neural networks — the building blocks, finally assembled
            </h2>
          </div>
          <Link
            href="/neural-networks"
            className="hidden font-sans text-sm font-medium text-ink-muted transition hover:text-accent sm:inline"
          >
            See all chapters →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {neuralNetworksChapters.slice(0, 6).map((c, i) => (
            <Link
              key={c.slug}
              href={`/neural-networks/${c.slug}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Just shipped
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
              Transformers — attention, residual streams, and the QK/OV factorization
            </h2>
          </div>
          <Link
            href="/transformers"
            className="hidden font-sans text-sm font-medium text-ink-muted transition hover:text-accent sm:inline"
          >
            See all chapters →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {transformersChapters.slice(0, 6).map((c, i) => (
            <Link
              key={c.slug}
              href={`/transformers/${c.slug}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              The capstone
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
              Mech-interp circuits — induction heads, IOI, patching, and SAEs
            </h2>
          </div>
          <Link
            href="/circuits"
            className="hidden font-sans text-sm font-medium text-ink-muted transition hover:text-accent sm:inline"
          >
            See all chapters →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {circuitsChapters.slice(0, 6).map((c, i) => (
            <Link
              key={c.slug}
              href={`/circuits/${c.slug}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-line bg-paper-raised p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              About this project
            </p>
            <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">
              Open source, built in the open
            </h2>
            <p className="mt-3 font-serif text-[0.98rem] leading-relaxed text-ink-muted">
              Every chapter, widget, and bit of math here lives in a single
              public repository. Read the source, file an issue, fork it for
              your own teaching — it&apos;s all yours. Pull requests welcome.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/AaronQLF/mechanistic-Interpretability-Toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-paper px-4 py-2 font-sans text-sm font-medium text-ink transition hover:border-ink-muted"
              >
                <GitHubMark className="h-4 w-4" />
                View on GitHub
              </a>
              <a
                href="https://github.com/AaronQLF/mechanistic-Interpretability-Toolkit/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-ink-muted transition hover:text-accent"
              >
                Suggest a topic →
              </a>
            </div>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Made by
            </p>
            <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">
              Haroun Guessous
            </h2>
            <p className="mt-3 font-serif text-[0.98rem] leading-relaxed text-ink-muted">
              Engineer and ML researcher in Montréal. Currently studying
              interpretability and quantization in large language models at
              Université de Montréal / MILA. More writing, paper reviews, and
              projects on the portfolio.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="https://aaronqlf.github.io/pflioblog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-sm font-semibold text-white transition hover:opacity-90"
              >
                Visit portfolio
                <span aria-hidden>↗</span>
              </a>
              <a
                href="https://aaronqlf.github.io/pflioblog/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-ink-muted transition hover:text-accent"
              >
                Read the blog →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54v-1.88c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.55 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.09 1.15a10.7 10.7 0 0 1 5.62 0c2.15-1.45 3.09-1.15 3.09-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.31-2.63 5.27-5.14 5.55.4.34.76 1.02.76 2.06v3.05c0 .3.21.65.78.54 4.46-1.5 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5z" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-2xl font-semibold text-ink">{value}</dd>
    </div>
  );
}
