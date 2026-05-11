import Link from "next/link";
import { CurriculumMap } from "@/components/ui/CurriculumMap";
import { linearAlgebraChapters, modules } from "@/lib/topics";

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
              href="/linear-algebra/mech-interp-bridge"
              className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-sans text-sm font-medium text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Skip to the mech-interp bridge
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
            <Stat label="Modules" value="6" />
            <Stat label="LA chapters" value={String(linearAlgebraChapters.length)} />
            <Stat label="Interactive widgets" value="14+" />
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-paper-raised p-4 sm:p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Curriculum map
          </h2>
          <p className="mt-1 font-serif text-sm text-ink-muted">
            Linear Algebra is shipping today. The rest is on its way — same
            voice, same feel.
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
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          On the way
        </p>
        <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
          The full curriculum
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules
            .filter((m) => m.status === "soon")
            .map((m) => (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className="group block rounded-lg border border-dashed border-line bg-paper p-4 transition hover:border-ink-muted"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-ink-subtle">
                  <span>SOON</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mt-2 font-sans text-base font-semibold text-ink group-hover:text-accent">
                  {m.title}
                </h3>
                <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                  {m.blurb}
                </p>
              </Link>
            ))}
        </div>
      </section>
    </div>
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
