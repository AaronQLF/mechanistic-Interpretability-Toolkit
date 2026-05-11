import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-sans text-sm font-semibold tracking-tight"
        >
          <Logo className="h-5 w-5 text-accent" />
          <span>Mech Interp Toolkit</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-ink-muted md:flex">
          <Link
            href="/linear-algebra"
            className="transition hover:text-ink"
          >
            Linear Algebra
          </Link>
          <Link href="/probability" className="transition hover:text-ink">
            Probability
          </Link>
          <Link href="/calculus" className="transition hover:text-ink">
            Calculus
          </Link>
          <Link
            href="/neural-networks"
            className="transition hover:text-ink"
          >
            Neural Nets
          </Link>
          <Link href="/transformers" className="transition hover:text-ink">
            Transformers
          </Link>
          <Link href="/circuits" className="transition hover:text-ink">
            Circuits
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://github.com/AaronQLF/mechanistic-Interpretability-Toolkit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-muted transition hover:border-ink-muted hover:text-ink"
          >
            <GitHubMark className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
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

function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 21V3" />
      <path d="M3 21h18" />
      <path d="M3 18l5-7 4 4 5-9 4 6" />
    </svg>
  );
}
