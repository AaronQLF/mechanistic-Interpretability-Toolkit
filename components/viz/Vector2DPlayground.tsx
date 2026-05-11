"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, DragPoint, vizColors, LineSeg } from "./Stage";
import { fmt, norm, type Vec2 } from "@/lib/linalg";

export function Vector2DPlayground({
  initial = [3, 2] as Vec2,
}: {
  initial?: Vec2;
}) {
  const [v, setV] = useState<Vec2>(initial);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  const length = norm(v);
  return (
    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="A draggable 2D vector on a grid"
      >
        <Grid step={1} />
        <Axes />
        <LineSeg from={[v[0], 0]} to={v} color={vizColors.x} dashed opacity={0.7} width={1} />
        <LineSeg from={[0, v[1]]} to={v} color={vizColors.y} dashed opacity={0.7} width={1} />
        <Arrow to={v} color={vizColors.v} width={2.5} label="v" />
        <DragPoint
          value={v}
          onChange={setV}
          color={vizColors.v}
          label="drag"
          bounds={world}
        />
      </Stage>
      <div className="self-center rounded-lg border border-line bg-paper-sunken p-4 font-mono text-sm">
        <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
          components
        </div>
        <div className="space-y-1">
          <Row label="x" value={fmt(v[0])} color={vizColors.x} />
          <Row label="y" value={fmt(v[1])} color={vizColors.y} />
        </div>
        <div className="mt-3 border-t border-line pt-3">
          <div className="mb-1 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            length
          </div>
          <div className="text-ink">‖v‖ = {fmt(length)}</div>
        </div>
        <button
          type="button"
          onClick={() => setV(initial)}
          className="mt-4 w-full rounded-md border border-line bg-paper px-2 py-1 font-sans text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: color }}
        />
        <span className="text-ink-muted">{label}</span>
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
