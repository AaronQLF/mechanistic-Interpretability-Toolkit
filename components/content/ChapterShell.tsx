import type { ReactNode } from "react";
import { ChapterFooter } from "@/components/ui/ChapterFooter";
import type { Chapter } from "@/lib/topics";
import { getAdjacentChapters, getAdjacentInChapters } from "@/lib/topics";

export function ChapterShell({
  moduleSlug,
  chapterSlug,
  chapters,
  eyebrow,
  title,
  lede,
  children,
}: {
  moduleSlug: string;
  chapterSlug: string;
  /** When set (e.g. quant roadmap), prev/next are computed from this list instead of lib/topics modules. */
  chapters?: Chapter[];
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  const { prev, next } = chapters
    ? getAdjacentInChapters(chapters, chapterSlug)
    : getAdjacentChapters(moduleSlug, chapterSlug);
  return (
    <article className="prose-mi chapter-enter mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-0 lg:py-16">
      {eyebrow && (
        <p className="!mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      )}
      <h1>{title}</h1>
      {lede && (
        <p className="!mt-4 font-serif text-lg leading-relaxed text-ink-muted">
          {lede}
        </p>
      )}
      <div className="mt-6">{children}</div>
      <ChapterFooter moduleSlug={moduleSlug} prev={prev} next={next} />
    </article>
  );
}
