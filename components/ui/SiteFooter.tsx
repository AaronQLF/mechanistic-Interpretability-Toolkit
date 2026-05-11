const REPO_URL =
  "https://github.com/AaronQLF/mechanistic-Interpretability-Toolkit";
const PORTFOLIO_URL = "https://aaronqlf.github.io/pflioblog";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-sans text-sm font-semibold text-ink">
            Mech Interp Toolkit
          </p>
          <p className="mt-2 max-w-md font-serif text-sm leading-relaxed text-ink-muted">
            An interactive textbook for the math behind mechanistic
            interpretability. No cookies, no trackers, no signup.
          </p>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            Project
          </p>
          <ul className="mt-3 space-y-2 font-sans text-sm">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-muted transition hover:text-accent"
              >
                <GitHubIcon className="h-4 w-4" />
                Source on GitHub
              </a>
            </li>
            <li>
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted transition hover:text-accent"
              >
                Report an issue
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            Author
          </p>
          <ul className="mt-3 space-y-2 font-sans text-sm">
            <li>
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-muted transition hover:text-accent"
              >
                <ExternalIcon className="h-4 w-4" />
                Haroun Guessous · portfolio
              </a>
            </li>
            <li>
              <a
                href="https://aaronqlf.github.io/pflioblog/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted transition hover:text-accent"
              >
                Writing & paper reviews
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-1 px-4 py-4 text-xs text-ink-subtle sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Haroun Guessous. Content licensed for
            learning and remixing.
          </p>
          <p className="font-mono">v0.1 — linear algebra module</p>
        </div>
      </div>
    </footer>
  );
}

function GitHubIcon({ className }: { className?: string }) {
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

function ExternalIcon({ className }: { className?: string }) {
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
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}
