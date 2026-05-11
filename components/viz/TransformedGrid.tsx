"use client";

import { useStage } from "./Stage";
import { mv, type Mat2, type Vec2 } from "@/lib/linalg";

// Renders a grid of horizontal/vertical lines after applying a 2x2 transform M.
export function TransformedGrid({
  M,
  step = 1,
  range = 6,
  color = "rgb(var(--accent))",
  opacity = 0.55,
  strokeWidth = 0.9,
}: {
  M: Mat2;
  step?: number;
  range?: number;
  color?: string;
  opacity?: number;
  strokeWidth?: number;
}) {
  const { toScreen } = useStage();
  const lines: React.ReactNode[] = [];
  // Vertical lines (constant x)
  for (let x = -range; x <= range + 1e-6; x += step) {
    const start: Vec2 = mv(M, [x, -range]);
    const end: Vec2 = mv(M, [x, range]);
    const [sx, sy] = toScreen(start);
    const [tx, ty] = toScreen(end);
    lines.push(
      <line
        key={`tv-${x}`}
        x1={sx}
        y1={sy}
        x2={tx}
        y2={ty}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={Math.abs(x) < 1e-6 ? Math.min(1, opacity + 0.3) : opacity}
      />
    );
  }
  // Horizontal lines (constant y)
  for (let y = -range; y <= range + 1e-6; y += step) {
    const start: Vec2 = mv(M, [-range, y]);
    const end: Vec2 = mv(M, [range, y]);
    const [sx, sy] = toScreen(start);
    const [tx, ty] = toScreen(end);
    lines.push(
      <line
        key={`th-${y}`}
        x1={sx}
        y1={sy}
        x2={tx}
        y2={ty}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={Math.abs(y) < 1e-6 ? Math.min(1, opacity + 0.3) : opacity}
      />
    );
  }
  return <g aria-hidden>{lines}</g>;
}
