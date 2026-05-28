"use client";

import { useState } from "react";

type Mode = "per-layer" | "crosscoder";

const N_LAYERS = 6;
const N_FEATURES_TRUE = 5;

const FEATURE_NAMES = [
  "subject identity",
  "is-a-question",
  "negation",
  "code context",
  "next-token uncertainty",
];

// Hand-crafted "presence" of each ground-truth feature in each layer's
// activation, on a 0..1 scale.
const PRESENCE: number[][] = [
  [0.9, 0.95, 1.0, 0.95, 0.85, 0.6],
  [0.4, 0.85, 1.0, 1.0, 0.8, 0.55],
  [0.35, 0.6, 0.8, 0.95, 1.0, 0.85],
  [0.7, 0.85, 0.9, 0.85, 0.6, 0.45],
  [0.2, 0.4, 0.6, 0.85, 1.0, 1.0],
];

export function CrosscoderDiagram() {
  const [mode, setMode] = useState<Mode>("per-layer");
  const [hoverFeature, setHoverFeature] = useState<number | null>(null);

  const W = 600;
  const H = 320;
  const layerY = (l: number) => 60 + l * 40;
  const featureX = (i: number) =>
    mode === "per-layer" ? 80 + 80 * i : 80 + 80 * i;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          dictionary type
        </span>
        <button
          type="button"
          onClick={() => setMode("per-layer")}
          className={[
            "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
            mode === "per-layer"
              ? "border-accent bg-accent text-white"
              : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
          ].join(" ")}
        >
          per-layer SAEs
        </button>
        <button
          type="button"
          onClick={() => setMode("crosscoder")}
          className={[
            "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
            mode === "crosscoder"
              ? "border-accent bg-accent text-white"
              : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
          ].join(" ")}
        >
          crosscoder
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label="Per-layer SAEs vs crosscoder"
        >
          <text
            x={20}
            y={28}
            fontSize={11}
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            layers (top = early, bottom = late)
          </text>

          {Array.from({ length: N_LAYERS }, (_, l) => (
            <g key={l}>
              <rect
                x={20}
                y={layerY(l) - 10}
                width={40}
                height={20}
                rx={3}
                fill="rgb(var(--paper-sunken))"
                stroke="rgb(var(--line))"
              />
              <text
                x={40}
                y={layerY(l) + 4}
                textAnchor="middle"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink))"
              >
                L{l}
              </text>
            </g>
          ))}

          {Array.from({ length: N_FEATURES_TRUE }).map((_, i) => {
            const x = featureX(i);
            const isHover = hoverFeature === i;
            return (
              <g key={i} onMouseEnter={() => setHoverFeature(i)} onMouseLeave={() => setHoverFeature(null)}>
                <text
                  x={x}
                  y={28}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  fill={
                    isHover ? "rgb(var(--accent))" : "rgb(var(--ink-muted))"
                  }
                >
                  {FEATURE_NAMES[i]}
                </text>

                {mode === "per-layer"
                  ? Array.from({ length: N_LAYERS }, (_, l) => {
                      const presence = PRESENCE[i][l];
                      if (presence < 0.5) return null;
                      return (
                        <circle
                          key={l}
                          cx={x}
                          cy={layerY(l)}
                          r={3 + presence * 5}
                          fill="rgb(var(--accent))"
                          opacity={isHover ? 0.95 : 0.7}
                        />
                      );
                    })
                  : (() => {
                      // Crosscoder: one feature node, edges to layers where it is present.
                      const cx = x;
                      const cy = (layerY(0) + layerY(N_LAYERS - 1)) / 2;
                      return (
                        <g>
                          {PRESENCE[i].map((p, l) =>
                            p > 0.5 ? (
                              <line
                                key={l}
                                x1={cx}
                                y1={cy}
                                x2={60}
                                y2={layerY(l)}
                                stroke="rgb(var(--accent))"
                                strokeWidth={0.8 + p * 1.2}
                                opacity={isHover ? 0.95 : 0.55}
                              />
                            ) : null
                          )}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={9}
                            fill="rgb(var(--accent))"
                            opacity={0.18}
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={5}
                            fill="rgb(var(--accent))"
                          />
                        </g>
                      );
                    })()}
              </g>
            );
          })}

          <text
            x={W - 16}
            y={H - 14}
            textAnchor="end"
            fontSize={10}
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            {mode === "per-layer"
              ? "5 features × 6 layers = 30 atoms (one SAE per layer, redundant)"
              : "5 shared features, one crosscoder, edges = where each lives"}
          </text>
        </svg>
      </div>

      <p className="font-serif text-[12px] leading-relaxed text-ink-muted">
        Per-layer SAEs (left toggle) train one dictionary per layer and
        usually rediscover the same feature in multiple layers, with
        slightly drifted directions. Crosscoders (Lindsey et al., Anthropic
        2024) train a single dictionary whose decoder writes into{" "}
        <em>multiple</em> layers at once, so a feature that exists in
        layers L1&ndash;L4 is one atom with four decoder heads instead of
        four near-duplicate atoms. This is a strict win for circuit
        analysis: feature identity is preserved across layers without
        manual matching.
      </p>
    </div>
  );
}
