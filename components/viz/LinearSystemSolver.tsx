"use client";

import { useState } from "react";
import { Stage, Grid, Axes, LineSeg, PointDot, vizColors } from "./Stage";
import { fmt, type Vec2 } from "@/lib/linalg";

// Each "row" is interpreted as a₁x + a₂y = b. Drag two control points per line
// to set its position; we draw the line segment through them, then solve.

export function LinearSystemSolver() {
  // Two equations: a*x + b*y = c, d*x + e*y = f. Sliders set them.
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(2);
  const [d, setD] = useState(1);
  const [e, setE] = useState(-1);
  const [f, setF] = useState(0);

  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };

  // Solve via Cramer's rule
  const det = a * e - b * d;
  const solution: Vec2 | null =
    Math.abs(det) > 1e-6
      ? [(c * e - b * f) / det, (a * f - c * d) / det]
      : null;

  // Are the two equations the same line (infinite solutions) vs. parallel?
  const sameLine =
    Math.abs(det) <= 1e-6 &&
    Math.abs(a * f - c * d) <= 1e-6 &&
    Math.abs(b * f - c * e) <= 1e-6;

  // Line endpoints across the world for plotting
  const lineEndpoints = (
    A: number,
    B: number,
    C: number
  ): [Vec2, Vec2] | null => {
    if (Math.abs(B) > 1e-9) {
      const y1 = (C - A * world.xMin) / B;
      const y2 = (C - A * world.xMax) / B;
      return [
        [world.xMin, y1],
        [world.xMax, y2],
      ];
    } else if (Math.abs(A) > 1e-9) {
      return [
        [C / A, world.yMin],
        [C / A, world.yMax],
      ];
    }
    return null;
  };

  const seg1 = lineEndpoints(a, b, c);
  const seg2 = lineEndpoints(d, e, f);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Two linear equations and their intersection"
      >
        <Grid />
        <Axes />
        {seg1 && (
          <LineSeg from={seg1[0]} to={seg1[1]} color={vizColors.v} width={2} />
        )}
        {seg2 && (
          <LineSeg from={seg2[0]} to={seg2[1]} color={vizColors.w} width={2} />
        )}
        {solution && (
          <PointDot
            at={solution}
            r={5}
            color={vizColors.sum}
            label={`(${fmt(solution[0])}, ${fmt(solution[1])})`}
          />
        )}
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            Equation 1: a·x + b·y = c
          </div>
          <Slider label="a" value={a} setValue={setA} />
          <Slider label="b" value={b} setValue={setB} />
          <Slider label="c" value={c} setValue={setC} />
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            Equation 2: d·x + e·y = f
          </div>
          <Slider label="d" value={d} setValue={setD} />
          <Slider label="e" value={e} setValue={setE} />
          <Slider label="f" value={f} setValue={setF} />
        </div>
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-ink-muted">det(A)</span>
            <span className="text-ink">{fmt(det, 3)}</span>
          </div>
          <div className="mt-2">
            {solution ? (
              <span className="text-ink">
                Unique solution at ({fmt(solution[0])}, {fmt(solution[1])}).
              </span>
            ) : sameLine ? (
              <span className="text-amber-700 dark:text-amber-400">
                Same line — infinitely many solutions.
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">
                Parallel lines — no solution.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <div className="mt-1 grid grid-cols-[18px_1fr_42px] items-center gap-2">
      <span className="text-ink-muted">{label}</span>
      <input
        type="range"
        min={-3}
        max={3}
        step={0.05}
        value={value}
        onChange={(ev) => setValue(parseFloat(ev.target.value))}
        className="w-full accent-amber-600"
        aria-label={label}
      />
      <span className="text-right text-ink">{fmt(value)}</span>
    </div>
  );
}
