"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Chapter } from "@/lib/topics";

const STORAGE_KEY = "mit:la:visited";

export function ChapterNav({
  moduleSlug,
  chapters,
}: {
  moduleSlug: string;
  chapters: Chapter[];
}) {
  const pathname = usePathname();
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setVisited(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const match = chapters.find((c) =>
      pathname?.startsWith(`/${moduleSlug}/${c.slug}`)
    );
    if (!match) return;
    setVisited((prev) => {
      if (prev.has(match.slug)) return prev;
      const next = new Set(prev);
      next.add(match.slug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [pathname, chapters, moduleSlug]);

  return (
    <nav className="thin-scroll sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2 font-sans text-sm">
      <Link
        href={`/${moduleSlug}`}
        className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-accent hover:underline"
      >
        Linear Algebra
      </Link>
      <ol className="space-y-0.5">
        {chapters.map((c, i) => {
          const href = `/${moduleSlug}/${c.slug}`;
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          const isVisited = visited.has(c.slug);
          return (
            <li key={c.slug}>
              <Link
                href={href}
                className={[
                  "group flex items-start gap-2 rounded-md px-2 py-1.5 transition",
                  isActive
                    ? "bg-paper-sunken text-ink"
                    : "text-ink-muted hover:bg-paper-sunken hover:text-ink",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full transition",
                    isActive
                      ? "bg-accent"
                      : isVisited
                        ? "bg-ink-muted"
                        : "bg-transparent ring-1 ring-line",
                  ].join(" ")}
                  aria-hidden
                />
                <span className="flex-1 leading-snug">
                  <span className="mr-1.5 font-mono text-xs text-ink-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
