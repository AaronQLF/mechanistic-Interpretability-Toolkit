"use client";

import { useMemo, useState } from "react";

function fN(n: number) {
  return n;
}
function fLogN(n: number) {
  return Math.max(0.01, Math.log2(n));
}
function fNLogN(n: number) {
  return n * Math.max(0.01, Math.log2(n));
}
function fN2(n: number) {
  return n * n;
}

export function BigOExplorer() {
  const [n, setN] = useState(32);
  const series = useMemo(() => {
    const max = Math.max(
      fN(n),
      fNLogN(n),
      fN2(n),
      fLogN(n)
    );
    const scale = 100 / max;
    return [
      { label: "O(n)", v: fN(n) * scale, raw: fN(n) },
      { label: "O(log n)", v: fLogN(n) * scale, raw: fLogN(n) },
      { label: "O(n log n)", v: fNLogN(n) * scale, raw: fNLogN(n) },
      { label: "O(n²)", v: fN2(n) * scale, raw: fN2(n) },
    ];
  }, [n]);

  return (
    <div className="space-y-4 p-2 font-sans text-sm">
      <div className="flex items-center gap-3">
        <label htmlFor="n-big" className="text-ink-muted">
          n =
        </label>
        <input
          id="n-big"
          type="range"
          min={2}
          max={256}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
        <span className="w-12 font-mono text-ink">{n}</span>
      </div>
      <div className="space-y-2">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-24 text-xs text-ink-muted">{s.label}</span>
            <div className="h-6 flex-1 overflow-hidden rounded bg-paper-sunken">
              <div
                className="h-full rounded bg-accent transition-all"
                style={{ width: `${Math.min(100, s.v)}%` }}
              />
            </div>
            <span className="w-20 text-right font-mono text-xs text-ink-subtle">
              {s.raw < 1e6 ? s.raw.toFixed(1) : s.raw.toExponential(1)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-muted">
        Bar length is normalized within this snapshot so you can compare growth
        shapes as you drag n.
      </p>
    </div>
  );
}
