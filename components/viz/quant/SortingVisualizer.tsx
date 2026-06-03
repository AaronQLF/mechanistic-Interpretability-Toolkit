"use client";

import { useState } from "react";

const initial = [5, 2, 8, 1, 9, 3];

type S = { arr: number[]; i: number; end: number; done: boolean };

export function SortingVisualizer() {
  const [s, setS] = useState<S>({
    arr: initial,
    i: 0,
    end: initial.length - 1,
    done: false,
  });

  const step = () => {
    setS((prev) => {
      if (prev.done) return prev;
      const n = [...prev.arr];
      if (prev.end <= 0) return { ...prev, done: true };
      if (prev.i >= prev.end) {
        return { ...prev, arr: n, i: 0, end: prev.end - 1 };
      }
      if (n[prev.i] > n[prev.i + 1]) {
        [n[prev.i], n[prev.i + 1]] = [n[prev.i + 1], n[prev.i]];
      }
      return { ...prev, arr: n, i: prev.i + 1 };
    });
  };

  const reset = () => {
    setS({ arr: initial, i: 0, end: initial.length - 1, done: false });
  };

  return (
    <div className="space-y-3 p-2 font-sans text-sm">
      <div className="flex h-36 items-end gap-1">
        {s.arr.map((v, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t transition-colors ${idx === s.i || idx === s.i + 1 ? "bg-accent" : "bg-ink-muted/40"}`}
            style={{ height: `${(v / 10) * 100}%` }}
            title={`${v}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={step}
          disabled={s.done}
          className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
        >
          Bubble step
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-line px-3 py-1 text-xs"
        >
          Reset
        </button>
        {s.done && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400">
            Sorted
          </span>
        )}
      </div>
    </div>
  );
}
