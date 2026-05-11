"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, vizColors } from "./Stage";
import { dot, fmt, type Vec2 } from "@/lib/linalg";

// Pack n unit feature directions evenly on a circle in 2D.
function makeFeatures(n: number): Vec2[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    return [Math.cos(a), Math.sin(a)] as Vec2;
  });
}

const FEATURE_COLORS = [
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0d9488",
  "#0284c7",
  "#4f46e5",
  "#9333ea",
  "#db2777",
  "#be185d",
];

export function SuperpositionToy() {
  const [n, setN] = useState(5);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const features = makeFeatures(n);
  // The "model state" if exactly the active feature fires with strength 1.
  const state = features[activeIdx];
  // Decode each feature by dot product with the state.
  const reads = features.map((f) => dot(state, f));

  const world = { xMin: -1.6, xMax: 1.6, yMin: -1.6, yMax: 1.6 };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={520}
        height={420}
        world={world}
        ariaLabel="Superposition: many feature directions in 2D"
      >
        <Grid step={0.5} />
        <Axes labels={false} />
        {features.map((f, i) => (
          <Arrow
            key={i}
            to={f}
            color={FEATURE_COLORS[i % FEATURE_COLORS.length]}
            width={i === activeIdx ? 3 : 1.2}
            opacity={i === activeIdx ? 1 : 0.4}
            label={`f${i + 1}`}
          />
        ))}
        <Arrow to={state} color={vizColors.ink} width={2.6} dashed label="state" />
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <label
            htmlFor="nfeat"
            className="mb-1 block font-sans text-xs uppercase tracking-wide text-ink-subtle"
          >
            number of features (in 2D)
          </label>
          <input
            id="nfeat"
            type="range"
            min={2}
            max={10}
            step={1}
            value={n}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setN(v);
              if (activeIdx >= v) setActiveIdx(0);
            }}
            className="w-full accent-amber-600"
          />
          <div className="text-right text-ink">n = {n}</div>
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            decoded readings (state · fᵢ)
          </div>
          <div className="space-y-1">
            {reads.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`flex w-full items-center justify-between rounded px-2 py-1 transition ${
                  i === activeIdx
                    ? "bg-paper text-ink"
                    : "text-ink-muted hover:bg-paper hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      background: FEATURE_COLORS[i % FEATURE_COLORS.length],
                    }}
                  />
                  <span>f{i + 1}</span>
                </span>
                <span
                  className={
                    i === activeIdx
                      ? "text-ink"
                      : Math.abs(r) > 0.4
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-ink-muted"
                  }
                >
                  {fmt(r, 2)}
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Click a feature to fire it. Notice that other features
          &ldquo;hear&rdquo; it too — that&apos;s interference, the cost of
          packing more features than dimensions.
        </p>
      </div>
    </div>
  );
}
