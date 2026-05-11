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
          <ThemeToggle />
        </div>
      </div>
    </header>
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
