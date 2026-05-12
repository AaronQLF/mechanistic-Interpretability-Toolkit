"use client";

import { useMemo } from "react";
import { Stage, Grid, Axes, Arrow, useStage, vizColors } from "./Stage";
import type { Vec2 } from "@/lib/linalg";
import type { Scalar2D } from "@/lib/calc";

/**
 * Renders a 2D scalar field as a colormap (low = paper, high = accent),
 * plus optional gradient arrows on a coarse grid. Children render on top.
 */
export function Heatmap({
  scalar,
  resolution = 56,
  showGradient = true,
  gradStep = 8,
  width = 520,
  height = 420,
  ariaLabel,
  children,
}: {
  scalar: Scalar2D;
  resolution?: number;
  showGradient?: boolean;
  gradStep?: number;
  width?: number;
  height?: number;
  ariaLabel?: string;
  children?: React.ReactNode;
}) {
  const { world, range, F, gradF } = scalar;

  return (
    <Stage
      width={width}
      height={height}
      world={world}
      ariaLabel={ariaLabel ?? scalar.label}
    >
      <ScalarField F={F} resolution={resolution} range={range} />
      <Grid step={pickStep(world.xMax - world.xMin)} minor={false} />
      <Axes />
      {showGradient && <GradientArrows gradF={gradF} step={gradStep} />}
      {children}
    </Stage>
  );
}

function pickStep(extent: number): number {
  for (const t of [0.25, 0.5, 1, 2, 5]) {
    if (extent / t < 14) return t;
  }
  return Math.pow(10, Math.ceil(Math.log10(extent / 10)));
}

function ScalarField({
  F,
  resolution,
  range,
}: {
  F: (p: Vec2) => number;
  resolution: number;
  range: [number, number];
}) {
  const { frame, toScreen } = useStage();
  const { world } = frame;
  const cells = useMemo(() => {
    const out: { x: number; y: number; w: number; h: number; v: number }[] = [];
    const wPix = (world.xMax - world.xMin) / resolution;
    const hRes = Math.round(resolution * ((world.yMax - world.yMin) / (world.xMax - world.xMin)));
    const hPix = (world.yMax - world.yMin) / Math.max(1, hRes);
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < hRes; j++) {
        const x = world.xMin + (i + 0.5) * wPix;
        const y = world.yMin + (j + 0.5) * hPix;
        const v = F([x, y]);
        out.push({ x, y, w: wPix, h: hPix, v });
      }
    }
    return out;
  }, [F, world, resolution]);

  const [lo, hi] = range;
  const span = hi - lo || 1;

  return (
    <g aria-hidden>
      {cells.map((c, k) => {
        const t = Math.min(1, Math.max(0, (c.v - lo) / span));
        // Diverging-ish colormap: cool (low) → paper (mid) → warm (high).
        // We just gradient between paper and accent at varying alphas plus
        // a cool tint for negative-of-mean values.
        const tCentered = t - 0.5;
        const intensity = Math.abs(tCentered) * 1.4; // up to ~0.7
        const color =
          tCentered >= 0
            ? `rgba(180, 83, 9, ${intensity.toFixed(3)})`
            : `rgba(37, 99, 235, ${intensity.toFixed(3)})`;
        const [sx1, sy1] = toScreen([c.x - c.w / 2, c.y - c.h / 2]);
        const [sx2, sy2] = toScreen([c.x + c.w / 2, c.y + c.h / 2]);
        const x = Math.min(sx1, sx2);
        const y = Math.min(sy1, sy2);
        const w = Math.abs(sx2 - sx1);
        const h = Math.abs(sy2 - sy1);
        return (
          <rect
            key={k}
            x={x - 0.5}
            y={y - 0.5}
            width={w + 1}
            height={h + 1}
            fill={color}
          />
        );
      })}
    </g>
  );
}

function GradientArrows({
  gradF,
  step,
}: {
  gradF: (p: Vec2) => Vec2;
  step: number;
}) {
  const { frame } = useStage();
  const { world } = frame;
  const dx = (world.xMax - world.xMin) / step;
  const dy = (world.yMax - world.yMin) / step;
  // Find a global scale so the longest arrow fits within ~one cell.
  const samples: Vec2[] = [];
  for (let i = 0; i < step; i++) {
    for (let j = 0; j < step; j++) {
      const x = world.xMin + (i + 0.5) * dx;
      const y = world.yMin + (j + 0.5) * dy;
      samples.push(gradF([x, y]));
    }
  }
  const maxMag = Math.max(
    1e-9,
    ...samples.map((g) => Math.hypot(g[0], g[1]))
  );
  const cell = Math.min(dx, dy);
  const k = (cell * 0.7) / maxMag;

  const arrows: React.ReactNode[] = [];
  for (let i = 0; i < step; i++) {
    for (let j = 0; j < step; j++) {
      const x = world.xMin + (i + 0.5) * dx;
      const y = world.yMin + (j + 0.5) * dy;
      const g = gradF([x, y]);
      const len = Math.hypot(g[0], g[1]);
      if (len < 1e-6) continue;
      arrows.push(
        <Arrow
          key={`${i}-${j}`}
          from={[x, y]}
          to={[x + g[0] * k, y + g[1] * k]}
          color={vizColors.ink}
          width={1}
          opacity={0.55}
        />
      );
    }
  }
  return <g aria-hidden>{arrows}</g>;
}
