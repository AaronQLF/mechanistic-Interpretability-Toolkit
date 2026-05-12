"use client";

import { useState } from "react";
import {
  Stage,
  Grid,
  Axes,
  Arrow,
  DragPoint,
  LineSeg,
  PointDot,
  Polygon2,
  vizColors,
} from "./Stage";
import { fmt } from "@/lib/calc";
import { add, mv, type Mat2, type Vec2 } from "@/lib/linalg";

type MapDef = {
  id: string;
  label: string;
  G: (p: Vec2) => Vec2;
  /** Analytic Jacobian, row-major: [a, b, c, d]. */
  J: (p: Vec2) => Mat2;
};

const MAPS: MapDef[] = [
  {
    id: "rotation+stretch",
    label: "G(x, y) = (x cos y − y, x sin y)",
    G: ([x, y]) => [x * Math.cos(y) - y, x * Math.sin(y)],
    J: ([x, y]) => [
      Math.cos(y),
      -x * Math.sin(y) - 1,
      Math.sin(y),
      x * Math.cos(y),
    ],
  },
  {
    id: "polar-ish",
    label: "G(r, θ) = (r cos θ, r sin θ)",
    G: ([r, t]) => [r * Math.cos(t), r * Math.sin(t)],
    J: ([r, t]) => [Math.cos(t), -r * Math.sin(t), Math.sin(t), r * Math.cos(t)],
  },
  {
    id: "squared",
    label: "G(x, y) = (x² − y², 2xy)",
    G: ([x, y]) => [x * x - y * y, 2 * x * y],
    J: ([x, y]) => [2 * x, -2 * y, 2 * y, 2 * x],
  },
  {
    id: "shear",
    label: "G(x, y) = (x + sin y, y + 0.3·x²)",
    G: ([x, y]) => [x + Math.sin(y), y + 0.3 * x * x],
    J: ([x, y]) => [1, Math.cos(y), 0.6 * x, 1],
  },
];

export function JacobianVisualizer() {
  const [mapId, setMapId] = useState<string>("squared");
  const map = MAPS.find((m) => m.id === mapId) ?? MAPS[0];
  const [p, setP] = useState<Vec2>([0.6, 0.5]);
  const [size, setSize] = useState(0.45);

  const J = map.J(p);
  const detJ = J[0] * J[3] - J[1] * J[2];
  const Gp = map.G(p);

  // Build a small square around p in input space
  const halfs = size;
  const corners: Vec2[] = [
    [-halfs, -halfs],
    [halfs, -halfs],
    [halfs, halfs],
    [-halfs, halfs],
  ];
  // Apply G to each corner (true non-linear image)
  const imageCorners = corners.map((c) => map.G(add(p, c)));
  // Apply the local linearisation J: G(p + δ) ≈ G(p) + J δ
  const linearCorners = corners.map((c) => add(Gp, mv(J, c)));

  // Pick world bounds large enough to see both
  const allPts: Vec2[] = [...imageCorners, ...linearCorners, p, Gp];
  const margin = 0.6;
  const xs = allPts.map((q) => q[0]);
  const ys = allPts.map((q) => q[1]);
  const inWorld = {
    xMin: Math.min(...xs, p[0] - 1) - margin,
    xMax: Math.max(...xs, p[0] + 1) + margin,
    yMin: Math.min(...ys, p[1] - 1) - margin,
    yMax: Math.max(...ys, p[1] + 1) + margin,
  };
  // Also build input-side world
  const inputWorld = {
    xMin: p[0] - size * 2 - 0.5,
    xMax: p[0] + size * 2 + 0.5,
    yMin: p[1] - size * 2 - 0.5,
    yMax: p[1] + size * 2 + 0.5,
  };

  // Also project basis vectors at p
  const e1: Vec2 = [size, 0];
  const e2: Vec2 = [0, size];
  const Je1 = mv(J, e1);
  const Je2 = mv(J, e2);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            input space  (drag the orange dot)
          </div>
          <Stage
            width={420}
            height={340}
            world={inputWorld}
            ariaLabel="input space with a small square at p"
          >
            <Grid step={pickStep(inputWorld.xMax - inputWorld.xMin)} />
            <Axes />
            <Polygon2
              points={corners.map((c) => add(p, c))}
              fill="rgba(37, 99, 235, 0.15)"
              stroke="rgba(37, 99, 235, 0.6)"
              strokeWidth={1.4}
            />
            <Arrow from={p} to={add(p, e1)} color={vizColors.x} width={2} label="e₁" />
            <Arrow from={p} to={add(p, e2)} color={vizColors.y} width={2} label="e₂" />
            <PointDot at={p} r={5} color={vizColors.accent} />
            <DragPoint value={p} onChange={setP} color={vizColors.accent} r={10} />
          </Stage>
        </div>

        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            output space — image of the square
          </div>
          <Stage
            width={420}
            height={340}
            world={inWorld}
            ariaLabel="output space showing G(square) and the local linearisation"
          >
            <Grid step={pickStep(inWorld.xMax - inWorld.xMin)} />
            <Axes />
            {/* Linearised square: a parallelogram */}
            <Polygon2
              points={linearCorners}
              fill="rgba(180, 83, 9, 0.18)"
              stroke="rgba(180, 83, 9, 0.7)"
              strokeWidth={1.4}
            />
            {/* True image — closed via line segments */}
            {imageCorners.map((c, i) => {
              const next = imageCorners[(i + 1) % imageCorners.length];
              return (
                <LineSeg
                  key={i}
                  from={c}
                  to={next}
                  color="rgb(37, 99, 235)"
                  width={1.6}
                />
              );
            })}
            <Arrow
              from={Gp}
              to={add(Gp, Je1)}
              color={vizColors.x}
              width={2}
              label="J·e₁"
            />
            <Arrow
              from={Gp}
              to={add(Gp, Je2)}
              color={vizColors.y}
              width={2}
              label="J·e₂"
            />
            <PointDot at={Gp} r={5} color={vizColors.accent} />
          </Stage>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Map
          </div>
          <div className="flex flex-col gap-2">
            {MAPS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMapId(m.id)}
                className={[
                  "rounded-md border px-2 py-1 text-left text-[11px] transition",
                  mapId === m.id
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              square side
            </label>
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.01}
              value={size}
              onChange={(e) => setSize(parseFloat(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="text-right font-mono text-xs text-ink">
              ε = {fmt(size, 2)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            J(p) — local linearisation
          </div>
          <div className="grid grid-cols-2 gap-1 text-center">
            <Cell value={fmt(J[0], 3)} />
            <Cell value={fmt(J[1], 3)} />
            <Cell value={fmt(J[2], 3)} />
            <Cell value={fmt(J[3], 3)} />
          </div>
          <div className="mt-3 border-t border-line pt-2">
            <Row label="det J" value={fmt(detJ, 3)} />
            <Row label="local area scale" value={`× ${fmt(Math.abs(detJ), 3)}`} highlight />
          </div>
        </div>
      </div>
    </div>
  );
}

function pickStep(extent: number): number {
  for (const t of [0.1, 0.25, 0.5, 1, 2, 5]) {
    if (extent / t < 14) return t;
  }
  return Math.pow(10, Math.ceil(Math.log10(extent / 10)));
}

function Cell({ value }: { value: string }) {
  return (
    <div className="rounded border border-line bg-paper px-2 py-1 text-ink">
      {value}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
      ].join(" ")}
    >
      <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
