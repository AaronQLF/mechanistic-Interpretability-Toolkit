"use client";

/** Round-trip order-of-magnitude latencies (illustrative; hardware-dependent). */
const ROWS = [
  { label: "L1 cache hit", ns: 1 },
  { label: "L2 cache", ns: 4 },
  { label: "RAM (~)", ns: 100 },
  { label: "SSD read", ns: 50_000 },
  { label: "Same-datacenter RTT", ns: 500_000 },
  { label: "Cross-region RTT", ns: 30_000_000 },
] as const;

export function LatencyNumbersChart() {
  const maxLog = Math.log10(ROWS[ROWS.length - 1].ns);
  const minLog = Math.log10(1);

  return (
    <div className="space-y-2 p-2 font-sans">
      {ROWS.map((r) => {
        const log = Math.log10(Math.max(1, r.ns));
        const w =
          ((log - minLog) / (maxLog - minLog)) * 100;
        const display =
          r.ns >= 1e6 ? `${(r.ns / 1e6).toFixed(0)} ms` : `${r.ns} ns`;
        return (
          <div key={r.label} className="flex items-center gap-2 text-sm">
            <span className="w-44 shrink-0 text-xs text-ink-muted">
              {r.label}
            </span>
            <div className="h-7 flex-1 rounded bg-paper-sunken">
              <div
                className="flex h-full items-center rounded bg-accent/90 px-2 text-[11px] font-medium text-white transition-all"
                style={{ width: `${Math.max(8, w)}%` }}
              >
                {display}
              </div>
            </div>
          </div>
        );
      })}
      <p className="pt-2 text-xs text-ink-muted">
        Log-scaled bar width. Memorize the gaps: cache vs RAM vs network is what
        system-design interviews test.
      </p>
    </div>
  );
}
