"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, DragPoint, vizColors } from "./Stage";
import { dot, fmt, norm, type Vec2 } from "@/lib/linalg";

export function CauchySchwarzDemo() {
  const [v, setV] = useState<Vec2>([2.4, 0.3]);
  const [w, setW] = useState<Vec2>([1.2, 1.7]);
  const world = { xMin: -4, xMax: 4, yMin: -3, yMax: 3 };

  const lhs = Math.abs(dot(v, w));
  const rhs = norm(v) * norm(w);
  const gap = rhs - lhs;
  const tight = gap < 0.03;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={340}
        world={world}
        ariaLabel="Cauchy-Schwarz inequality visualizer"
      >
        <Grid step={1} />
        <Axes />
        <Arrow to={v} color={vizColors.v} width={2.5} label="v" />
        <Arrow to={w} color={vizColors.w} width={2.5} label="w" />
        <DragPoint value={v} onChange={setV} color={vizColors.v} bounds={world} />
        <DragPoint value={w} onChange={setW} color={vizColors.w} bounds={world} />
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">|v · w|</span>
            <span className="text-ink">{fmt(lhs, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">‖v‖ ‖w‖</span>
            <span className="text-ink">{fmt(rhs, 3)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2">
            <span className="text-ink-muted">slack</span>
            <span className={tight ? "text-emerald-600 dark:text-emerald-400" : "text-ink"}>
              {fmt(gap, 3)}
            </span>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-paper-sunken">
          <div
            className={`h-full ${tight ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${Math.min(100, (lhs / Math.max(rhs, 1e-6)) * 100)}%` }}
          />
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Drag <span className="font-mono text-ink">v</span> and{" "}
          <span className="font-mono text-ink">w</span>. The bar fills as{" "}
          <span className="font-mono">|v·w|</span> approaches{" "}
          <span className="font-mono">‖v‖‖w‖</span>. Equality only when the
          two vectors point along the same line.
        </p>
        {tight && (
          <div className="rounded bg-emerald-500/10 p-2 font-sans text-xs text-emerald-700 dark:text-emerald-300">
            Equality! v and w are (nearly) collinear.
          </div>
        )}
      </div>
    </div>
  );
}
