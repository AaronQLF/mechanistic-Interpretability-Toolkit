"use client";

import {
  Stage,
  Grid,
  Axes,
  LineSeg,
  PointDot,
  DragPoint,
  useStage,
  vizColors,
} from "./Stage";
import type { Vec2 } from "@/lib/linalg";

type Overlay =
  | {
      kind: "tangent";
      x0: number;
      slope: number;
      length?: number;
      color?: string;
    }
  | {
      kind: "secant";
      x0: number;
      x1: number;
      color?: string;
    }
  | {
      kind: "point";
      at: Vec2;
      color?: string;
      label?: string;
    };

export function FunctionPlot({
  f,
  domain,
  range,
  samples = 240,
  curveColor = vizColors.v,
  width = 520,
  height = 280,
  overlays = [],
  draggablePoint,
  ariaLabel,
  children,
}: {
  f: (x: number) => number;
  domain: [number, number];
  range: [number, number];
  samples?: number;
  curveColor?: string;
  width?: number;
  height?: number;
  overlays?: Overlay[];
  draggablePoint?: {
    x: number;
    onChange: (x: number) => void;
    color?: string;
  };
  ariaLabel?: string;
  children?: React.ReactNode;
}) {
  const [xMin, xMax] = domain;
  const [yMin, yMax] = range;

  // Sample the function and skip infinities / NaNs cleanly.
  const pts: Vec2[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i / samples) * (xMax - xMin);
    const y = f(x);
    if (Number.isFinite(y)) pts.push([x, y]);
  }

  return (
    <Stage
      width={width}
      height={height}
      world={{ xMin, xMax, yMin, yMax }}
      ariaLabel={ariaLabel ?? "function plot"}
    >
      <Grid step={pickStep(xMax - xMin)} />
      <Axes />
      <Curve pts={pts} color={curveColor} />
      {overlays.map((ov, i) => (
        <OverlayShape key={i} ov={ov} f={f} domain={domain} />
      ))}
      {draggablePoint && (
        <>
          <PointDot
            at={[draggablePoint.x, f(draggablePoint.x)]}
            r={4}
            color={draggablePoint.color ?? vizColors.eigen}
          />
          <DragPoint
            value={[draggablePoint.x, f(draggablePoint.x)]}
            onChange={([nx]) => {
              const cx = Math.max(xMin, Math.min(xMax, nx));
              draggablePoint.onChange(cx);
            }}
            color={draggablePoint.color ?? vizColors.eigen}
            r={9}
            bounds={{ xMin, xMax, yMin, yMax }}
          />
        </>
      )}
      {children}
    </Stage>
  );
}

function pickStep(extent: number): number {
  const targets = [0.2, 0.5, 1, 2, 5, 10];
  for (const t of targets) {
    if (extent / t < 12) return t;
  }
  return Math.pow(10, Math.ceil(Math.log10(extent / 10)));
}

function Curve({ pts, color }: { pts: Vec2[]; color: string }) {
  const { toScreen } = useStage();
  if (pts.length < 2) return null;
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const [sx, sy] = toScreen(pts[i]);
    d += `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)} `;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}



function OverlayShape({
  ov,
  f,
}: {
  ov: Overlay;
  f: (x: number) => number;
  domain: [number, number];
}) {
  if (ov.kind === "tangent") {
    const length = ov.length ?? 1.5;
    const x0 = ov.x0;
    const y0 = f(x0);
    const dx = length;
    const dy = ov.slope * length;
    return (
      <LineSeg
        from={[x0 - dx, y0 - dy]}
        to={[x0 + dx, y0 + dy]}
        color={ov.color ?? vizColors.accent}
        width={2}
      />
    );
  }
  if (ov.kind === "secant") {
    const y0 = f(ov.x0);
    const y1 = f(ov.x1);
    return (
      <LineSeg
        from={[ov.x0, y0]}
        to={[ov.x1, y1]}
        color={ov.color ?? vizColors.inkMuted}
        width={1.5}
        dashed
      />
    );
  }
  if (ov.kind === "point") {
    return (
      <PointDot
        at={ov.at}
        r={4}
        color={ov.color ?? vizColors.accent}
        label={ov.label}
      />
    );
  }
  return null;
}
