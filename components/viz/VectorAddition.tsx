"use client";

import { useState } from "react";
import {
  Stage,
  Grid,
  Axes,
  Arrow,
  DragPoint,
  LineSeg,
  vizColors,
} from "./Stage";
import { add, fmt, type Vec2 } from "@/lib/linalg";

export function VectorAddition() {
  const [v, setV] = useState<Vec2>([2, 1]);
  const [w, setW] = useState<Vec2>([1, 2]);
  const sum = add(v, w);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  return (
    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Vector addition shown as parallelogram"
      >
        <Grid step={1} />
        <Axes />

        {/* Parallelogram dashes */}
        <LineSeg from={v} to={sum} color={vizColors.w} dashed opacity={0.6} />
        <LineSeg from={w} to={sum} color={vizColors.v} dashed opacity={0.6} />

        <Arrow to={v} color={vizColors.v} width={2.5} label="v" />
        <Arrow to={w} color={vizColors.w} width={2.5} label="w" />
        <Arrow to={sum} color={vizColors.sum} width={3} label="v + w" />

        <DragPoint value={v} onChange={setV} color={vizColors.v} bounds={world} />
        <DragPoint value={w} onChange={setW} color={vizColors.w} bounds={world} />
      </Stage>
      <div className="self-center rounded-lg border border-line bg-paper-sunken p-4 font-mono text-sm">
        <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
          v + w
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-ink-muted">v</span>
            <span>({fmt(v[0])}, {fmt(v[1])})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">w</span>
            <span>({fmt(w[0])}, {fmt(w[1])})</span>
          </div>
          <div className="border-t border-line pt-1 flex justify-between">
            <span className="text-ink-muted">sum</span>
            <span className="text-ink">({fmt(sum[0])}, {fmt(sum[1])})</span>
          </div>
        </div>
        <p className="mt-3 font-sans text-xs leading-relaxed text-ink-muted">
          Tip-to-tail: place w&apos;s tail at v&apos;s head, then v + w runs
          from the origin to where w lands.
        </p>
      </div>
    </div>
  );
}
