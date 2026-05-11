"use client";

import { fmt, type Mat2 } from "@/lib/linalg";

export function MatrixInput({
  value,
  onChange,
  label = "M",
  step = 0.1,
  min = -3,
  max = 3,
}: {
  value: Mat2;
  onChange: (next: Mat2) => void;
  label?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  const setEntry = (idx: 0 | 1 | 2 | 3, v: number) => {
    const next: number[] = [...value];
    next[idx] = v;
    onChange(next as unknown as Mat2);
  };
  return (
    <div className="rounded-lg border border-line bg-paper-sunken p-4 font-mono text-sm">
      <div className="mb-3 font-sans text-xs uppercase tracking-wide text-ink-subtle">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[i]}
              onChange={(e) => setEntry(i as 0 | 1 | 2 | 3, parseFloat(e.target.value))}
              className="w-full accent-amber-600"
              aria-label={`${label}[${Math.floor(i / 2)},${i % 2}]`}
            />
            <div className="text-right text-xs text-ink">{fmt(value[i])}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-2 text-center">
        <div className="rounded bg-paper p-1.5 text-ink">{fmt(value[0])}</div>
        <div className="rounded bg-paper p-1.5 text-ink">{fmt(value[1])}</div>
        <div className="rounded bg-paper p-1.5 text-ink">{fmt(value[2])}</div>
        <div className="rounded bg-paper p-1.5 text-ink">{fmt(value[3])}</div>
      </div>
    </div>
  );
}
