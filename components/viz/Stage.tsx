"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { makeFrame, s2w, w2s, type Frame, type World } from "@/lib/geometry";
import type { Vec2 } from "@/lib/linalg";

type StageContextValue = {
  frame: Frame;
  toScreen: (p: Vec2) => [number, number];
  toWorld: (p: [number, number]) => Vec2;
};

const StageContext = createContext<StageContextValue | null>(null);

export function useStage(): StageContextValue {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside <Stage>");
  return ctx;
}

export function Stage({
  width = 560,
  height = 360,
  world,
  pad = 16,
  className,
  style,
  children,
  ariaLabel,
}: {
  width?: number;
  height?: number;
  world: World;
  pad?: number;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const frame = useMemo(
    () => makeFrame(width, height, world, pad),
    [width, height, world, pad]
  );
  const value = useMemo<StageContextValue>(
    () => ({
      frame,
      toScreen: (p) => w2s(frame, p),
      toWorld: (p) => s2w(frame, p),
    }),
    [frame]
  );
  return (
    <StageContext.Provider value={value}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        className={className}
        style={{ display: "block", touchAction: "none", ...style }}
        role="img"
        aria-label={ariaLabel}
      >
        {children}
      </svg>
    </StageContext.Provider>
  );
}

export function Grid({
  step = 1,
  minor = true,
}: {
  step?: number;
  minor?: boolean;
}) {
  const { frame, toScreen } = useStage();
  const { world } = frame;
  const lines: ReactNode[] = [];
  const minorStep = step / 5;

  if (minor) {
    for (
      let x = Math.ceil(world.xMin / minorStep) * minorStep;
      x <= world.xMax + 1e-9;
      x += minorStep
    ) {
      const [sx1, sy1] = toScreen([x, world.yMin]);
      const [sx2, sy2] = toScreen([x, world.yMax]);
      lines.push(
        <line
          key={`mvx-${x.toFixed(3)}`}
          x1={sx1}
          y1={sy1}
          x2={sx2}
          y2={sy2}
          className="grid-stroke"
          strokeWidth={0.4}
          opacity={0.5}
        />
      );
    }
    for (
      let y = Math.ceil(world.yMin / minorStep) * minorStep;
      y <= world.yMax + 1e-9;
      y += minorStep
    ) {
      const [sx1, sy1] = toScreen([world.xMin, y]);
      const [sx2, sy2] = toScreen([world.xMax, y]);
      lines.push(
        <line
          key={`mhy-${y.toFixed(3)}`}
          x1={sx1}
          y1={sy1}
          x2={sx2}
          y2={sy2}
          className="grid-stroke"
          strokeWidth={0.4}
          opacity={0.5}
        />
      );
    }
  }

  for (
    let x = Math.ceil(world.xMin / step) * step;
    x <= world.xMax + 1e-9;
    x += step
  ) {
    const [sx1, sy1] = toScreen([x, world.yMin]);
    const [sx2, sy2] = toScreen([x, world.yMax]);
    lines.push(
      <line
        key={`vx-${x.toFixed(3)}`}
        x1={sx1}
        y1={sy1}
        x2={sx2}
        y2={sy2}
        className="grid-stroke"
        strokeWidth={0.9}
        opacity={0.85}
      />
    );
  }
  for (
    let y = Math.ceil(world.yMin / step) * step;
    y <= world.yMax + 1e-9;
    y += step
  ) {
    const [sx1, sy1] = toScreen([world.xMin, y]);
    const [sx2, sy2] = toScreen([world.xMax, y]);
    lines.push(
      <line
        key={`hy-${y.toFixed(3)}`}
        x1={sx1}
        y1={sy1}
        x2={sx2}
        y2={sy2}
        className="grid-stroke"
        strokeWidth={0.9}
        opacity={0.85}
      />
    );
  }
  return <g aria-hidden>{lines}</g>;
}

export function Axes({ labels = true }: { labels?: boolean }) {
  const { frame, toScreen } = useStage();
  const { world } = frame;
  const [x0, y0] = toScreen([0, 0]);
  const [xMaxS] = toScreen([world.xMax, 0]);
  const [, yMaxS] = toScreen([0, world.yMax]);
  return (
    <g aria-hidden>
      <line
        x1={toScreen([world.xMin, 0])[0]}
        y1={y0}
        x2={xMaxS}
        y2={y0}
        stroke="rgb(var(--ink))"
        strokeWidth={1.1}
        opacity={0.5}
      />
      <line
        x1={x0}
        y1={toScreen([0, world.yMin])[1]}
        x2={x0}
        y2={yMaxS}
        stroke="rgb(var(--ink))"
        strokeWidth={1.1}
        opacity={0.5}
      />
      {labels && (
        <>
          <text
            x={xMaxS - 4}
            y={y0 - 6}
            fontSize={11}
            textAnchor="end"
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            x
          </text>
          <text
            x={x0 + 6}
            y={yMaxS + 12}
            fontSize={11}
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            y
          </text>
        </>
      )}
    </g>
  );
}

export function Arrow({
  from = [0, 0] as Vec2,
  to,
  color = "currentColor",
  width = 2,
  label,
  labelOffset = [10, -10],
  opacity = 1,
  dashed = false,
}: {
  from?: Vec2;
  to: Vec2;
  color?: string;
  width?: number;
  label?: string;
  labelOffset?: [number, number];
  opacity?: number;
  dashed?: boolean;
}) {
  const { toScreen } = useStage();
  const [sx, sy] = toScreen(from);
  const [tx, ty] = toScreen(to);
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return null;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(10, len * 0.4);
  const baseX = tx - ux * head;
  const baseY = ty - uy * head;
  const perpX = -uy;
  const perpY = ux;
  const halfW = head * 0.5;
  const id = `arr-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <g opacity={opacity}>
      <line
        x1={sx}
        y1={sy}
        x2={baseX}
        y2={baseY}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon
        points={`${tx},${ty} ${baseX + perpX * halfW},${baseY + perpY * halfW} ${baseX - perpX * halfW},${baseY - perpY * halfW}`}
        fill={color}
      />
      {label && (
        <text
          x={tx + labelOffset[0]}
          y={ty + labelOffset[1]}
          fontSize={12}
          fontFamily="ui-monospace, monospace"
          fill={color}
          stroke="rgb(var(--paper))"
          strokeWidth={3}
          paintOrder="stroke"
          fontWeight={600}
        >
          {label}
          <title>{id}</title>
        </text>
      )}
    </g>
  );
}

export function PointDot({
  at,
  r = 3.5,
  color = "currentColor",
  label,
  labelOffset = [8, -8],
}: {
  at: Vec2;
  r?: number;
  color?: string;
  label?: string;
  labelOffset?: [number, number];
}) {
  const { toScreen } = useStage();
  const [x, y] = toScreen(at);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} />
      {label && (
        <text
          x={x + labelOffset[0]}
          y={y + labelOffset[1]}
          fontSize={12}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink))"
          stroke="rgb(var(--paper))"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function LineSeg({
  from,
  to,
  color = "currentColor",
  width = 1.5,
  dashed = false,
  opacity = 1,
}: {
  from: Vec2;
  to: Vec2;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  const { toScreen } = useStage();
  const [sx, sy] = toScreen(from);
  const [tx, ty] = toScreen(to);
  return (
    <line
      x1={sx}
      y1={sy}
      x2={tx}
      y2={ty}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "5 4" : undefined}
      opacity={opacity}
      strokeLinecap="round"
    />
  );
}

export function Polygon2({
  points,
  fill = "rgba(180,83,9,0.15)",
  stroke = "rgba(180,83,9,0.6)",
  strokeWidth = 1,
}: {
  points: Vec2[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  const { toScreen } = useStage();
  const d = points
    .map((p, i) => {
      const [sx, sy] = toScreen(p);
      return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
    })
    .join(" ") + " Z";
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
}

// A draggable handle in world coordinates.
export function DragPoint({
  value,
  onChange,
  color = "currentColor",
  r = 8,
  label,
  bounds,
}: {
  value: Vec2;
  onChange: (next: Vec2) => void;
  color?: string;
  r?: number;
  label?: string;
  bounds?: { xMin: number; xMax: number; yMin: number; yMax: number };
}) {
  const { toScreen, toWorld } = useStage();
  const [x, y] = toScreen(value);
  const dragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGCircleElement>) => {
      if (!dragging.current) return;
      const svg = (e.currentTarget as SVGElement).ownerSVGElement;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * svg.viewBox.baseVal.width;
      const py = ((e.clientY - rect.top) / rect.height) * svg.viewBox.baseVal.height;
      let [wx, wy] = toWorld([px, py]);
      if (bounds) {
        wx = Math.max(bounds.xMin, Math.min(bounds.xMax, wx));
        wy = Math.max(bounds.yMin, Math.min(bounds.yMax, wy));
      }
      onChange([wx, wy]);
    },
    [bounds, onChange, toWorld]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    dragging.current = false;
  }, []);

  return (
    <g style={{ cursor: "grab" }}>
      <circle
        cx={x}
        cy={y}
        r={r + 4}
        fill="transparent"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: dragging.current ? "grabbing" : "grab" }}
      />
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={color}
        opacity={0.18}
        pointerEvents="none"
      />
      <circle
        cx={x}
        cy={y}
        r={r * 0.45}
        fill={color}
        pointerEvents="none"
      />
      {label && (
        <text
          x={x + r + 4}
          y={y - r - 2}
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fill={color}
          stroke="rgb(var(--paper))"
          strokeWidth={3}
          paintOrder="stroke"
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// VizColors helpers — read CSS variables at usage sites
export const vizColors = {
  x: "rgb(var(--viz-x))",
  y: "rgb(var(--viz-y))",
  v: "rgb(var(--viz-v))",
  w: "rgb(var(--viz-w))",
  sum: "rgb(var(--viz-sum))",
  eigen: "rgb(var(--viz-eigen))",
  ink: "rgb(var(--ink))",
  inkMuted: "rgb(var(--ink-muted))",
  accent: "rgb(var(--accent))",
} as const;
