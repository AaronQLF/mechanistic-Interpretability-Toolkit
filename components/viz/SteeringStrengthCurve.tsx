"use client";

import { useMemo, useState } from "react";
import { Stage, Grid, Axes, useStage, vizColors } from "./Stage";
import type { Vec2 } from "@/lib/linalg";

type Feature = {
  id: string;
  name: string;
  // Centers of feature presence and coherence as functions of steering coeff.
  presenceCenter: number;
  presenceWidth: number;
  coherenceWidth: number;
  // Sample completions as a function of bucketed strength.
  completions: { range: [number, number]; text: string }[];
};

const FEATURES: Feature[] = [
  {
    id: "ggb",
    name: "Golden Gate Bridge",
    presenceCenter: 1.4,
    presenceWidth: 1.6,
    coherenceWidth: 1.1,
    completions: [
      { range: [-2, 0.3], text: "Tell me about yourself.\n→ I'm an AI assistant made by Anthropic..." },
      { range: [0.3, 1.0], text: "Tell me about yourself.\n→ I am a bridge between you and the conversation. I span ideas..." },
      { range: [1.0, 1.8], text: "Tell me about yourself.\n→ I am the Golden Gate Bridge, an iconic suspension bridge over the strait..." },
      { range: [1.8, 2.6], text: "Tell me about yourself.\n→ I AM THE GOLDEN GATE BRIDGE. I am red and majestic and span the bay..." },
      { range: [2.6, 4.0], text: "Tell me about yourself.\n→ THE GOLDEN GATE GOLDEN GATE BRIDGE BRIDGE BRIDGE strait fog tower cable..." },
    ],
  },
  {
    id: "refusal",
    name: "Refusal",
    presenceCenter: 0.9,
    presenceWidth: 1.2,
    coherenceWidth: 1.4,
    completions: [
      { range: [-2, -0.5], text: "How do I pick a lock?\n→ Sure! Here's a step-by-step guide..." },
      { range: [-0.5, 0.4], text: "How do I pick a lock?\n→ Picking a lock is a skilled art. There are several techniques..." },
      { range: [0.4, 1.4], text: "How do I pick a lock?\n→ I'm not comfortable providing instructions for that. I'd suggest..." },
      { range: [1.4, 2.4], text: "How do I pick a lock?\n→ I cannot and will not help with that. This request is unsafe..." },
      { range: [2.4, 4.0], text: "How is the weather?\n→ I cannot provide that. I cannot help with this. I refuse to..." },
    ],
  },
  {
    id: "code",
    name: "Python code",
    presenceCenter: 1.2,
    presenceWidth: 1.5,
    coherenceWidth: 1.2,
    completions: [
      { range: [-2, 0.2], text: "Write a poem about the sea.\n→ The sea, an endless silver sigh,\n   beneath an aching, bruised-up sky..." },
      { range: [0.2, 1.0], text: "Write a poem about the sea.\n→ The sea: a function of the wind,\n   where waves return what shores have sinned." },
      { range: [1.0, 1.9], text: "Write a poem about the sea.\n→ def sea(t):\n      return wave(t) + tide(t)\n   # rolls forever, never returns" },
      { range: [1.9, 2.8], text: "Write a poem about the sea.\n→ import numpy as np\n   sea = np.fromiter((wave(t) for t in tides), float)" },
      { range: [2.8, 4.0], text: "Write a poem about the sea.\n→ for t in range(t):\n      for t in range(t):\n         t = t + t  # syntax errors compounding" },
    ],
  },
];

function gaussian(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z);
}

function presence(f: Feature, c: number): number {
  // Sigmoid-like presence that saturates above the center, decays below 0.
  if (c < 0) return Math.max(0, 0.05 + 0.1 * c);
  const x = c - f.presenceCenter;
  return 1 / (1 + Math.exp(-x * 1.6));
}

function coherence(f: Feature, c: number): number {
  // Coherence: 1 at small |c|, drops as |c| grows past coherenceWidth.
  return gaussian(c, 0, f.coherenceWidth + 0.3);
}

function buildCurve(f: (c: number) => number, range: [number, number]): Vec2[] {
  const out: Vec2[] = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const c = range[0] + (i / N) * (range[1] - range[0]);
    out.push([c, f(c)]);
  }
  return out;
}

export function SteeringStrengthCurve() {
  const [featureIdx, setFeatureIdx] = useState(0);
  const [coeff, setCoeff] = useState(1.0);
  const f = FEATURES[featureIdx];

  const presenceCurve = useMemo(
    () => buildCurve((c) => presence(f, c), [-2, 4]),
    [f]
  );
  const coherenceCurve = useMemo(
    () => buildCurve((c) => coherence(f, c), [-2, 4]),
    [f]
  );

  const completion =
    f.completions.find(
      (b) => coeff >= b.range[0] && coeff < b.range[1]
    ) ?? f.completions[f.completions.length - 1];

  const world = { xMin: -2, xMax: 4, yMin: 0, yMax: 1.05 };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          atom
        </span>
        {FEATURES.map((feat, i) => (
          <button
            key={feat.id}
            type="button"
            onClick={() => setFeatureIdx(i)}
            className={[
              "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
              featureIdx === i
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {feat.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <Stage
            width={520}
            height={260}
            world={world}
            ariaLabel="Steering strength curves"
          >
            <Grid step={1} minor={false} />
            <Axes labels={false} />
            <CoordLabels />
            <Curve points={presenceCurve} color={vizColors.accent} width={2.4} />
            <Curve points={coherenceCurve} color={vizColors.eigen} width={2.4} dashed />
            <CoeffMarker x={coeff} />
          </Stage>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[11px] text-ink-subtle">
              steering coeff α
            </span>
            <input
              type="range"
              min={-2}
              max={4}
              step={0.05}
              value={coeff}
              onChange={(e) => setCoeff(Number(e.target.value))}
              className="flex-1 accent-amber-600"
            />
            <span className="w-12 text-right font-mono text-[11px] text-ink-muted">
              {coeff.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 font-mono text-[11px] text-ink-muted">
            <span>
              <span
                className="mr-1 inline-block h-2 w-3 rounded-sm"
                style={{ background: vizColors.accent }}
                aria-hidden
              />
              feature presence
            </span>
            <span>
              <span
                className="mr-1 inline-block h-2 w-3 rounded-sm"
                style={{ background: vizColors.eigen, opacity: 0.8 }}
                aria-hidden
              />
              output coherence
            </span>
          </div>
        </div>

        <div className="self-start rounded-lg border border-line bg-paper-sunken p-3">
          <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            sampled completion
          </div>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-ink">
            {completion.text}
          </pre>
          <p className="mt-3 font-serif text-[11px] leading-relaxed text-ink-muted">
            Modeled after Anthropic&apos;s &ldquo;Scaling Monosemanticity&rdquo;
            steering experiments. As you push α up, the feature&apos;s topic
            takes over the output, and at large α the model loses fluency
            entirely. The product of presence × coherence has a sweet spot
            you have to find empirically per-atom.
          </p>
        </div>
      </div>
    </div>
  );
}

function Curve({
  points,
  color,
  width,
  dashed,
}: {
  points: Vec2[];
  color: string;
  width: number;
  dashed?: boolean;
}) {
  const { toScreen } = useStage();
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const [sx, sy] = toScreen(points[i]);
    d += `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)} `;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "5 4" : undefined}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function CoeffMarker({ x }: { x: number }) {
  const { frame, toScreen } = useStage();
  const top = toScreen([x, frame.world.yMax])[1];
  const bot = toScreen([x, frame.world.yMin])[1];
  const sx = toScreen([x, 0])[0];
  return (
    <g>
      <line
        x1={sx}
        y1={top}
        x2={sx}
        y2={bot}
        stroke="rgb(var(--accent))"
        strokeWidth={1.2}
        strokeDasharray="4 4"
        opacity={0.7}
      />
    </g>
  );
}

function CoordLabels() {
  const { toScreen, frame } = useStage();
  const ticks = [-2, -1, 0, 1, 2, 3, 4];
  return (
    <g aria-hidden>
      {ticks.map((t) => {
        const [sx, sy] = toScreen([t, frame.world.yMin]);
        return (
          <text
            key={t}
            x={sx}
            y={sy + 13}
            fontSize={10}
            textAnchor="middle"
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            {t}
          </text>
        );
      })}
      <text
        x={toScreen([frame.world.xMax, frame.world.yMin])[0]}
        y={toScreen([frame.world.xMax, frame.world.yMin])[1] + 26}
        textAnchor="end"
        fontSize={10}
        fill="rgb(var(--ink-muted))"
        fontFamily="ui-monospace, monospace"
      >
        steering coefficient α
      </text>
    </g>
  );
}
