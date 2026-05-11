"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Stage, Grid, Axes, Arrow, vizColors } from "./Stage";
import { TransformedGrid } from "./TransformedGrid";
import { MatrixInput } from "./MatrixInput";
import {
  diagonal,
  fmt,
  mm,
  mv,
  rotation,
  svd2,
  type Mat2,
} from "@/lib/linalg";

type Step = "M" | "V" | "Sigma" | "U";

const STAGE_LABEL: Record<Step, string> = {
  M: "M (the original)",
  V: "Vᵀ (rotate)",
  Sigma: "ΣVᵀ (rotate, then stretch)",
  U: "UΣVᵀ (rotate, stretch, rotate)",
};

export function SVD2DDecomposer() {
  const [M, setM] = useState<Mat2>([1.6, 0.6, -0.4, 1.2]);
  const [step, setStep] = useState<Step>("M");
  const [k, setK] = useState(2);

  const { thetaU, thetaV, sigma } = svd2(M);
  const Vt = rotation(-thetaV);
  const Sigma_full = diagonal(sigma[0], sigma[1]);
  const Sigma_k = diagonal(sigma[0], k >= 2 ? sigma[1] : 0);
  const U = rotation(thetaU);

  const matFor = (s: Step): Mat2 => {
    switch (s) {
      case "M":
        return M;
      case "V":
        return Vt;
      case "Sigma":
        return mm(Sigma_full, Vt);
      case "U":
        return mm(U, mm(Sigma_full, Vt));
    }
  };

  const Mk = mm(U, mm(Sigma_k, Vt));
  const showLowRank = k < 2;

  const world = { xMin: -4, xMax: 4, yMin: -3, yMax: 3 };
  const current = matFor(step);
  const e1 = mv(current, [1, 0]);
  const e2 = mv(current, [0, 1]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div>
        <Stage
          width={560}
          height={360}
          world={world}
          ariaLabel="SVD decomposition of a 2x2 matrix"
        >
          <Grid />
          <Axes />
          <motion.g
            key={step + String(showLowRank)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <TransformedGrid M={current} step={1} range={6} opacity={0.45} />
            <Arrow to={e1} color={vizColors.x} width={2.4} label="image of e₁" />
            <Arrow to={e2} color={vizColors.y} width={2.4} label="image of e₂" />
          </motion.g>
          {showLowRank && (
            <TransformedGrid
              M={Mk}
              step={1}
              range={6}
              color="rgb(var(--viz-eigen))"
              opacity={0.6}
              strokeWidth={1.1}
            />
          )}
        </Stage>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(STAGE_LABEL) as Step[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs transition ${
                step === s
                  ? "border-accent bg-accent text-white"
                  : "border-line text-ink-muted hover:border-ink-muted hover:text-ink"
              }`}
            >
              {STAGE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <MatrixInput value={M} onChange={setM} label="M" min={-2} max={2} step={0.05} />
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            singular values
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-ink-muted">σ₁</span>
            <span className="text-ink">{fmt(sigma[0], 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">σ₂</span>
            <span className="text-ink">{fmt(sigma[1], 3)}</span>
          </div>
          <div className="mt-3 border-t border-line pt-2">
            <label
              htmlFor="rankK"
              className="mb-1 block font-sans text-xs uppercase tracking-wide text-ink-subtle"
            >
              keep top-k singular values
            </label>
            <input
              id="rankK"
              type="range"
              min={1}
              max={2}
              step={1}
              value={k}
              onChange={(ev) => setK(parseInt(ev.target.value, 10))}
              className="w-full accent-amber-600"
            />
            <div className="text-right text-ink">k = {k}</div>
          </div>
          {showLowRank && (
            <p className="mt-2 rounded bg-pink-500/10 p-2 font-sans text-xs text-pink-700 dark:text-pink-300">
              The pink grid is the rank-{k} approximation of M. It collapses
              everything onto a single line — the best you can do with one
              singular value.
            </p>
          )}
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Click the stages to step through the decomposition: rotate (Vᵀ),
          stretch axes (Σ), rotate again (U). Net effect = M.
        </p>
      </div>
    </div>
  );
}
