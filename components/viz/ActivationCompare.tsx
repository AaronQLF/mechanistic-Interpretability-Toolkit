"use client";

import { useState } from "react";
import { Stage, Grid, Axes, useStage, vizColors } from "./Stage";
import type { Vec2 } from "@/lib/linalg";

type ActName = "relu" | "gelu" | "sigmoid" | "tanh";

const ACTS: { id: ActName; label: string; f: (x: number) => number; color: string }[] = [
  {
    id: "relu",
    label: "ReLU",
    f: (x) => Math.max(0, x),
    color: vizColors.x,
  },
  {
    id: "gelu",
    label: "GELU",
    f: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    color: vizColors.eigen,
  },
  {
    id: "sigmoid",
    label: "Sigmoid",
    f: (x) => 1 / (1 + Math.exp(-x)),
    color: vizColors.v,
  },
  {
    id: "tanh",
    label: "Tanh",
    f: Math.tanh,
    color: vizColors.w,
  },
];

export function ActivationCompare() {
  const [active, setActive] = useState<Record<ActName, boolean>>({
    relu: true,
    gelu: true,
    sigmoid: true,
    tanh: true,
  });

  const world = { xMin: -4, xMax: 4, yMin: -1.4, yMax: 3.5 };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <Stage width={520} height={300} world={world} ariaLabel="Activation function comparison">
          <Grid step={1} />
          <Axes />
          {ACTS.filter((a) => active[a.id]).map((a) => (
            <ActCurve key={a.id} f={a.f} color={a.color} domain={[-4, 4]} />
          ))}
        </Stage>
      </div>
      <div className="space-y-2 self-start">
        <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          show / hide
        </div>
        {ACTS.map((a) => (
          <label
            key={a.id}
            className="flex cursor-pointer items-center justify-between rounded-md border border-line bg-paper-sunken px-3 py-2 font-sans text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ background: a.color }}
                aria-hidden
              />
              <span>{a.label}</span>
            </span>
            <input
              type="checkbox"
              checked={active[a.id]}
              onChange={(e) =>
                setActive((s) => ({ ...s, [a.id]: e.target.checked }))
              }
              className="accent-amber-600"
            />
          </label>
        ))}
        <p className="mt-3 font-serif text-xs leading-relaxed text-ink-muted">
          Same axes, four activations. Toggle them on and off to compare
          where each saturates, where each is linear, and which ones go
          negative.
        </p>
      </div>
    </div>
  );
}

function ActCurve({
  f,
  color,
  domain,
}: {
  f: (x: number) => number;
  color: string;
  domain: [number, number];
}) {
  const { toScreen } = useStage();
  const [xMin, xMax] = domain;
  const N = 240;
  const pts: Vec2[] = [];
  for (let i = 0; i <= N; i++) {
    const x = xMin + (i / N) * (xMax - xMin);
    const y = f(x);
    if (Number.isFinite(y)) pts.push([x, y]);
  }
  if (pts.length < 2) return null;
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const [sx, sy] = toScreen(pts[i]);
    d += `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)} `;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}
