"use client";

import { useState } from "react";
import { MatrixInput } from "./MatrixInput";
import { fmt, mm, type Mat2 } from "@/lib/linalg";

function trace(m: Mat2) {
  return m[0] + m[3];
}

export function TraceCyclicDemo() {
  const [A, setA] = useState<Mat2>([1.2, 0.7, -0.4, 0.6]);
  const [B, setB] = useState<Mat2>([0.5, 0.9, 1.1, -0.3]);

  const AB = mm(A, B);
  const BA = mm(B, A);
  const trAB = trace(AB);
  const trBA = trace(BA);
  const trA = trace(A);
  const trB = trace(B);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid grid-cols-2 gap-2">
        <MatrixInput value={A} onChange={setA} label="A" min={-2} max={2} step={0.05} />
        <MatrixInput value={B} onChange={setB} label="B" min={-2} max={2} step={0.05} />
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">tr A</span>
            <span className="text-ink">{fmt(trA, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">tr B</span>
            <span className="text-ink">{fmt(trB, 3)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-1">
            <span className="text-ink-muted">tr(A + B)</span>
            <span className="text-ink">{fmt(trA + trB, 3)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-1">
            <span className="text-ink-muted">tr(AB)</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {fmt(trAB, 3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">tr(BA)</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {fmt(trBA, 3)}
            </span>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          <span className="font-mono">tr(AB) = tr(BA)</span> even though{" "}
          <span className="font-mono">AB ≠ BA</span> in general. This is the
          cyclic property — it&apos;s why <span className="font-mono">tr</span>{" "}
          is invariant under change of basis.
        </p>
      </div>
    </div>
  );
}
