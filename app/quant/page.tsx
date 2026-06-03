import Link from "next/link";
import { QuantRoadmap } from "@/components/ui/QuantRoadmap";
import { quantChapterCount, quantModules, quantModulePath } from "@/lib/quant";

export const metadata = {
  title: "Quant Developer Roadmap",
  description:
    "Interview-oriented roadmap for quantitative developers: C++, systems, probability, stochastic calculus, pricing, and trading infrastructure.",
};

export default function QuantHomePage() {
  const totalCh = quantChapterCount();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Shadow track · same site
          </p>
          <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Quant developer
            <br />
            <span className="text-accent">interview roadmap</span>
          </h1>
          <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-ink-muted">
            Everything in one place to go from &ldquo;I know C++&rdquo; to
            passing coding rounds, probability grills, stochastic calculus
            sketches, options pricing, and trading-system design — the full
            spectrum quant dev shops expect. Not linked from the main nav;
            bookmark <span className="font-mono text-sm text-ink">/quant</span>
            .
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/${quantModulePath("cpp")}`}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:opacity-90"
            >
              Start with C++
              <span aria-hidden>→</span>
            </Link>
            <Link
              href={`/${quantModulePath("dsa")}`}
              className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-sans text-sm font-medium text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Or jump to DSA →
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <Stat label="Modules" value={String(quantModules.length)} />
            <Stat label="Chapters" value={String(totalCh)} />
            <Stat label="Focus" value="Interviews" />
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-paper-raised p-4 sm:p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Roadmap map
          </h2>
          <p className="mt-1 font-serif text-sm text-ink-muted">
            Suggested order through the fourteen modules — click any box to open
            its chapter list.
          </p>
          <div className="mt-4">
            <QuantRoadmap />
          </div>
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-line bg-paper-raised p-6 sm:p-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Suggested tracks
        </p>
        <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">
          Pick a goal, not a day count
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <TrackCard
            title="HFT / low-latency"
            body="C++ → concurrency → systems → OS/networking → system design. Sprinkle probability for screens."
            href={`/${quantModulePath("cpp")}`}
          />
          <TrackCard
            title="Quant researcher path"
            body="Probability → statistics → stochastic → finance → Python. Return to C++ for production topics."
            href={`/${quantModulePath("probability")}`}
          />
          <TrackCard
            title="Full loop cram"
            body="Follow module order; use Interview mocks last. Every chapter ends with a hard challenge."
            href={`/${quantModulePath("interview")}`}
          />
        </div>
      </section>

      <section className="mt-20">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          All modules
        </p>
        <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-ink">
          Fourteen modules, one spine
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quantModules.map((m) => (
            <Link
              key={m.slug}
              href={`/${quantModulePath(m.slug)}`}
              className="group block rounded-lg border border-line bg-paper-raised p-4 transition hover:border-ink-muted"
            >
              <h3 className="font-sans text-base font-semibold text-ink group-hover:text-accent">
                {m.title}
              </h3>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-muted">
                {m.blurb}
              </p>
              <p className="mt-2 font-mono text-xs text-ink-subtle">
                {(m.chapters?.length ?? 0)} chapters
              </p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-16 text-center font-serif text-sm text-ink-muted">
        Main textbook:{" "}
        <Link href="/" className="text-accent underline-offset-2 hover:underline">
          Mech Interp Toolkit
        </Link>
      </p>
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

function TrackCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <h3 className="font-sans text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 font-serif text-sm leading-relaxed text-ink-muted">
        {body}
      </p>
      <Link
        href={href}
        className="mt-3 inline-block font-sans text-sm font-medium text-accent hover:underline"
      >
        Open track →
      </Link>
    </div>
  );
}
