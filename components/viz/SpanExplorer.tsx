"use client";

import { useState } from "react";
import {
  Stage,
  Grid,
  Axes,
  Arrow,
  DragPoint,
  LineSeg,
  Polygon2,
  vizColors,
} from "./Stage";
import { add, fmt, scale, type Vec2 } from "@/lib/linalg";

export function SpanExplorer() {
  const [v, setV] = useState<Vec2>([2, 0.4]);
  const [w, setW] = useState<Vec2>([0.5, 1.6]);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  const combo = add(scale(a, v), scale(b, w));
  const det = v[0] * w[1] - v[1] * w[0];
  const collinear = Math.abs(det) < 0.05;

  // For visualization, fill the parallelogram swept by the bounding box of (a, b) in [-2, 2].
  const corner1 = add(scale(2, v), scale(2, w));
  const corner2 = add(scale(2, v), scale(-2, w));
  const corner3 = add(scale(-2, v), scale(-2, w));
  const corner4 = add(scale(-2, v), scale(2, w));

  return (
    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Span of two vectors with linear combination scrubbers"
      >
        <Grid />
        <Axes />
        {/* Span shading */}
        {collinear ? (
          <LineSeg
            from={scale(-10, v)}
            to={scale(10, v)}
            color={vizColors.accent}
            opacity={0.5}
            width={2}
          />
        ) : (
          <Polygon2
            points={[corner1, corner2, corner3, corner4]}
            fill="rgba(180,83,9,0.10)"
            stroke="rgba(180,83,9,0.35)"
          />
        )}
        <Arrow to={v} color={vizColors.v} width={2.2} label="v" />
        <Arrow to={w} color={vizColors.w} width={2.2} label="w" />
        <Arrow to={combo} color={vizColors.sum} width={3} label="a·v + b·w" />
        <DragPoint value={v} onChange={setV} color={vizColors.v} bounds={world} />
        <DragPoint value={w} onChange={setW} color={vizColors.w} bounds={world} />
      </Stage>
      <div className="self-center space-y-3 rounded-lg border border-line bg-paper-sunken p-4 font-mono text-sm">
        <div>
          <label className="mb-1 block font-sans text-xs uppercase tracking-wide text-ink-subtle">
            scalar a
          </label>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.05}
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="text-right">{fmt(a)}</div>
        </div>
        <div>
          <label className="mb-1 block font-sans text-xs uppercase tracking-wide text-ink-subtle">
            scalar b
          </label>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.05}
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="text-right">{fmt(b)}</div>
        </div>
        <div className="border-t border-line pt-3 text-xs">
          <div className="mb-1 font-sans uppercase tracking-wide text-ink-subtle">
            span
          </div>
          {collinear ? (
            <p className="text-ink">A line through the origin (vectors are collinear).</p>
          ) : (
            <p className="text-ink">All of ℝ² (vectors are linearly independent).</p>
          )}
        </div>
      </div>
    </div>
  );
}
