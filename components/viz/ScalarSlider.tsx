"use client";

import { useState } from "react";
import { Stage, Grid, Axes, Arrow, vizColors } from "./Stage";
import { fmt, scale, type Vec2 } from "@/lib/linalg";

export function ScalarSlider({
  base = [2, 1] as Vec2,
}: {
  base?: Vec2;
}) {
  const [s, setS] = useState(1.5);
  const scaled = scale(s, base);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  return (
    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
      <Stage width={560} height={360} world={world} ariaLabel="Scalar multiplication">
        <Grid />
        <Axes />
        <Arrow to={base} color={vizColors.v} width={1.5} opacity={0.45} label="v" />
        <Arrow to={scaled} color={vizColors.sum} width={2.8} label={`${fmt(s)}·v`} />
      </Stage>
      <div className="self-center rounded-lg border border-line bg-paper-sunken p-4 font-mono text-sm">
        <label
          htmlFor="scalar"
          className="mb-2 block font-sans text-xs uppercase tracking-wide text-ink-subtle"
        >
          scalar (drag)
        </label>
        <input
          id="scalar"
          type="range"
          min={-2.5}
          max={2.5}
          step={0.05}
          value={s}
          onChange={(e) => setS(parseFloat(e.target.value))}
          className="w-full accent-amber-600 dark:accent-amber-400"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-ink-muted">s</span>
          <span className="text-ink">{fmt(s)}</span>
        </div>
        <div className="mt-3 border-t border-line pt-3 text-xs text-ink-muted">
          Negative <span className="font-mono">s</span> flips the arrow;{" "}
          <span className="font-mono">|s| {"<"} 1</span> shrinks it.
        </div>
      </div>
    </div>
  );
}
