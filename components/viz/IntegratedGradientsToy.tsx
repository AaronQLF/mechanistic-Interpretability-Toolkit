"use client";

import { useMemo, useState } from "react";
import { Heatmap } from "./Heatmap";
import { Arrow, DragPoint, LineSeg, PointDot, vizColors } from "./Stage";
import { fmt, getScalar2D, NAMED_2D } from "@/lib/calc";
import type { Vec2 } from "@/lib/linalg";

/**
 * Integrated gradients:
 *   IG_i(x) = (x_i - x0_i) * ∫₀¹ ∂F/∂x_i (x0 + α(x - x0)) dα
 *
 * Completeness: sum_i IG_i = F(x) - F(x0)  (fundamental theorem of calculus).
 */

export function IntegratedGradientsToy() {
  const [fid, setFid] = useState<string>("rosenbrock");
  const scalar = getScalar2D(fid);
  const [x0, setX0] = useState<Vec2>([
    (scalar.world.xMin + scalar.world.xMax) / 2 - 0.4,
    (scalar.world.yMin + scalar.world.yMax) / 2 - 0.4,
  ]);
  const [x1, setX1] = useState<Vec2>(scalar.start ?? [-1.2, 1.4]);
  const [steps, setSteps] = useState(20);

  const { samples, igX, igY, F0, F1, riemann } = useMemo(() => {
    const dx = x1[0] - x0[0];
    const dy = x1[1] - x0[1];
    let sumX = 0;
    let sumY = 0;
    const samples: Array<{ p: Vec2; g: Vec2 }> = [];
    for (let k = 0; k < steps; k++) {
      const alpha = (k + 0.5) / steps;
      const p: Vec2 = [x0[0] + alpha * dx, x0[1] + alpha * dy];
      const g = scalar.gradF(p);
      samples.push({ p, g });
      sumX += g[0];
      sumY += g[1];
    }
    const igX = dx * (sumX / steps);
    const igY = dy * (sumY / steps);
    const F0 = scalar.F(x0);
    const F1 = scalar.F(x1);
    return { samples, igX, igY, F0, F1, riemann: igX + igY };
  }, [x0, x1, steps, scalar]);

  const truth = F1 - F0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            {scalar.label}
          </div>
          <Heatmap
            scalar={scalar}
            width={560}
            height={440}
            showGradient={false}
          >
            {/* Straight-line path from x0 to x1 */}
            <LineSeg
              from={x0}
              to={x1}
              color="rgb(var(--ink))"
              width={1.6}
              dashed
              opacity={0.7}
            />
            {/* Gradient samples along the path */}
            {samples.map((s, i) => {
              const mag = Math.hypot(s.g[0], s.g[1]);
              const k =
                (((scalar.world.xMax - scalar.world.xMin) / 18) * 0.9) /
                Math.max(0.4, mag);
              return (
                <Arrow
                  key={i}
                  from={s.p}
                  to={[s.p[0] + s.g[0] * k, s.p[1] + s.g[1] * k]}
                  color={vizColors.accent}
                  width={1}
                  opacity={0.7}
                />
              );
            })}
            {/* Endpoints */}
            <PointDot at={x0} r={5} color={vizColors.inkMuted} label="x⁰" />
            <PointDot at={x1} r={5} color={vizColors.accent} label="x¹" />
            <DragPoint
              value={x0}
              onChange={setX0}
              color={vizColors.inkMuted}
              r={9}
              bounds={scalar.world}
            />
            <DragPoint
              value={x1}
              onChange={setX1}
              color={vizColors.accent}
              r={9}
              bounds={scalar.world}
            />
          </Heatmap>
        </div>

        <div className="space-y-3 self-start">
          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Function
            </div>
            <div className="flex flex-col gap-2">
              {NAMED_2D.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setFid(s.id);
                    setX0([
                      (s.world.xMin + s.world.xMax) / 2 - 0.4,
                      (s.world.yMin + s.world.yMax) / 2 - 0.4,
                    ]);
                    setX1(s.start ?? [s.world.xMin / 2, s.world.yMax / 2]);
                  }}
                  className={[
                    "rounded-md border px-2 py-1 text-left text-[11px] transition",
                    fid === s.id
                      ? "border-accent bg-accent text-white"
                      : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              path samples
            </label>
            <input
              type="range"
              min={2}
              max={80}
              step={1}
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
            <div className="text-right font-mono text-xs text-ink">{steps}</div>
          </div>

          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
            <Row label="F(x⁰)" value={fmt(F0, 4)} color={vizColors.inkMuted} />
            <Row label="F(x¹)" value={fmt(F1, 4)} color={vizColors.accent} />
            <div className="my-2 border-t border-line" />
            <Row label="IG along x" value={fmt(igX, 4)} color={vizColors.v} />
            <Row label="IG along y" value={fmt(igY, 4)} color={vizColors.w} />
            <Row label="Σ IG" value={fmt(riemann, 4)} highlight />
            <Row label="F(x¹) − F(x⁰)" value={fmt(truth, 4)} />
            <Row label="error" value={fmt(Math.abs(riemann - truth), 5)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        {color && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: color }}
          />
        )}
        <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      </span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
