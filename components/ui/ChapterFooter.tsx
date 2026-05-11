import Link from "next/link";
import type { Chapter } from "@/lib/topics";

export function ChapterFooter({
  moduleSlug,
  prev,
  next,
}: {
  moduleSlug: string;
  prev?: Chapter;
  next?: Chapter;
}) {
  return (
    <nav className="mt-16 grid gap-3 border-t border-line pt-6 font-sans text-sm sm:grid-cols-2">
      <div>
        {prev && (
          <Link
            href={`/${moduleSlug}/${prev.slug}`}
            className="group block rounded-lg border border-line p-4 transition hover:border-ink-muted"
          >
            <div className="text-xs uppercase tracking-wide text-ink-subtle">
              ← Previous
            </div>
            <div className="mt-1 font-medium text-ink group-hover:text-accent">
              {prev.title}
            </div>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={`/${moduleSlug}/${next.slug}`}
            className="group block rounded-lg border border-line p-4 text-right transition hover:border-ink-muted"
          >
            <div className="text-xs uppercase tracking-wide text-ink-subtle">
              Next →
            </div>
            <div className="mt-1 font-medium text-ink group-hover:text-accent">
              {next.title}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
