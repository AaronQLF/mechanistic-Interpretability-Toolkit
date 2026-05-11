export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>
          Built for people who want to look inside neural networks. No cookies,
          no trackers, no signup.
        </p>
        <p className="font-mono">v0.1 — linear algebra module</p>
      </div>
    </footer>
  );
}
