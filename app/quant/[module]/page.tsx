import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuantModule, quantModules, quantModulePath } from "@/lib/quant";

export function generateStaticParams() {
  return quantModules.map((m) => ({ module: m.slug }));
}

export default function QuantModuleIndexPage({
  params,
}: {
  params: { module: string };
}) {
  const mod = getQuantModule(params.module);
  if (!mod || !mod.chapters) notFound();
  const base = quantModulePath(mod.slug);

  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl">
      <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Quant roadmap
      </p>
      <h1>{mod.title}</h1>
      <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
        {mod.blurb}
      </p>

      <h2>How this module works</h2>
      <p>
        Each chapter is written for live interviews: tight definitions, code
        where it helps, a quick check, and a hard capstone-style challenge with
        a full solution you can reveal after you struggle honestly.
      </p>

      <h2>Chapters</h2>
      <ol className="!mt-4 !list-none !p-0">
        {mod.chapters.map((c, i) => (
          <li key={c.slug} className="!my-2">
            <Link
              href={`/${base}/${c.slug}`}
              className="group flex gap-4 rounded-lg border border-line bg-paper-raised p-4 no-underline transition hover:border-ink-muted"
            >
              <div className="pt-1 font-mono text-xs text-ink-subtle">
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
        <Link href="/quant">← Quant roadmap home</Link>
      </p>
    </article>
  );
}
