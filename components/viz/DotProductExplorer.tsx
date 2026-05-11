"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, DragPoint, vizColors } from "./Stage";
import { angleBetween, dot, fmt, norm, type Vec2 } from "@/lib/linalg";

export function DotProductExplorer() {
  const [v, setV] = useState<Vec2>([2.5, 0]);
  const [w, setW] = useState<Vec2>([1.5, 1.8]);
  const world = { xMin: -4, xMax: 4, yMin: -3, yMax: 3 };
  const d = dot(v, w);
  const ang = angleBetween(v, w);
  const cosA = norm(v) > 1e-6 && norm(w) > 1e-6 ? Math.cos(ang) : 0;
  const sign = d > 0 ? "positive" : d < 0 ? "negative" : "zero";
  const signColor =
    d > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : d < 0
        ? "text-rose-600 dark:text-rose-400"
        : "text-ink-muted";
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Dot product visualizer with angle"
      >
        <Grid />
        <Axes />
        <Arrow to={v} color={vizColors.v} width={2.5} label="v" />
        <Arrow to={w} color={vizColors.w} width={2.5} label="w" />
        <DragPoint value={v} onChange={setV} color={vizColors.v} bounds={world} />
        <DragPoint value={w} onChange={setW} color={vizColors.w} bounds={world} />
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">v · w</span>
            <span className={`text-ink ${signColor}`}>{fmt(d, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">‖v‖</span>
            <span className="text-ink">{fmt(norm(v))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">‖w‖</span>
            <span className="text-ink">{fmt(norm(w))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">cos θ</span>
            <span className="text-ink">{fmt(cosA, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">θ</span>
            <span className="text-ink">{fmt((ang * 180) / Math.PI, 1)}°</span>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          The sign of the dot product is{" "}
          <span className={signColor}>{sign}</span>: vectors agree (acute
          angle), disagree (obtuse), or are perpendicular (zero).
        </p>
      </div>
    </div>
  );
}
