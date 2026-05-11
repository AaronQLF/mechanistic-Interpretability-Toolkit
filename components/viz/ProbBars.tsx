"use client";

import { useCallback, useRef, type CSSProperties } from "react";
import { clamp } from "@/lib/prob";

/**
 * A reusable bar chart for probability distributions. Bars sit on a shared
 * baseline. If `onChange` is provided, bars become draggable (clamped to
 * [0, 1] in display units; you should normalize externally if needed).
 *
 * The chart auto-scales the y-axis from 0 to `yMax` (default 1). For logits
 * or other unbounded values, pass `yMax` and `yMin` explicitly.
 */
export function ProbBars({
  values,
  labels,
  colors,
  highlight,
  onChange,
  yMax = 1,
  yMin = 0,
  height = 200,
  width = 480,
  showValues = true,
  valueFormat = (v) => v.toFixed(2),
  yLabel,
  baselineLabel,
  className,
  style,
}: {
  values: readonly number[];
  labels?: readonly (string | number)[];
  colors?: readonly string[];
  highlight?: number | null;
  onChange?: (index: number, next: number) => void;
  yMax?: number;
  yMin?: number;
  height?: number;
  width?: number;
  showValues?: boolean;
  valueFormat?: (v: number) => string;
  yLabel?: string;
  baselineLabel?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const padL = 36;
  const padR = 10;
  const padT = 14;
  const padB = 30;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const n = values.length;
  const gap = Math.max(2, innerW * 0.012);
  const barW = (innerW - gap * (n - 1)) / Math.max(1, n);

  const yToScreen = (v: number) => {
    const t = (v - yMin) / (yMax - yMin || 1);
    return padT + (1 - clamp(t, 0, 1)) * innerH;
  };

  // Zero line (could be different from yMin if yMin < 0)
  const zeroY = yToScreen(Math.max(yMin, Math.min(yMax, 0)));

  // y-axis tick marks: at 0, 0.25, 0.5, 0.75, 1.0 for the [0,1] case;
  // for other ranges, 5 evenly spaced.
  const tickValues = (() => {
    if (yMin === 0 && yMax === 1) return [0, 0.25, 0.5, 0.75, 1];
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) ticks.push(yMin + (i / 4) * (yMax - yMin));
    return ticks;
  })();

  const draggingIdx = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGRectElement>, i: number) => {
      if (!onChange) return;
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      draggingIdx.current = i;
    },
    [onChange]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      if (!onChange || draggingIdx.current === null) return;
      const svg = (e.currentTarget as SVGElement).ownerSVGElement;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sy =
        ((e.clientY - rect.top) / rect.height) * svg.viewBox.baseVal.height;
      const t = 1 - (sy - padT) / innerH;
      const v = clamp(yMin + t * (yMax - yMin), yMin, yMax);
      onChange(draggingIdx.current, v);
    },
    [onChange, yMin, yMax, padT, innerH]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<SVGRectElement>) => {
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    draggingIdx.current = null;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      className={className}
      style={{ display: "block", touchAction: "none", ...style }}
      role="img"
      aria-label={yLabel ? `${yLabel} bar chart` : "bar chart"}
    >
      {/* y-axis */}
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={padT + innerH}
        stroke="rgb(var(--line))"
        strokeWidth={1}
      />
      {/* horizontal grid + tick labels */}
      {tickValues.map((tv, i) => {
        const sy = yToScreen(tv);
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={sy}
              x2={padL + innerW}
              y2={sy}
              className="grid-stroke"
              strokeWidth={0.7}
              opacity={tv === 0 ? 0.9 : 0.5}
            />
            <text
              x={padL - 6}
              y={sy + 3}
              textAnchor="end"
              fontSize={10}
              fontFamily="ui-monospace, monospace"
              fill="rgb(var(--ink-subtle))"
            >
              {yMin === 0 && yMax === 1
                ? `${Math.round(tv * 100)}%`
                : tv.toFixed(1)}
            </text>
          </g>
        );
      })}

      {yLabel && (
        <text
          x={padL - 28}
          y={padT + innerH / 2}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-muted))"
          transform={`rotate(-90, ${padL - 28}, ${padT + innerH / 2})`}
          textAnchor="middle"
        >
          {yLabel}
        </text>
      )}

      {/* bars */}
      {values.map((v, i) => {
        const x = padL + i * (barW + gap);
        const sy = yToScreen(v);
        const top = Math.min(sy, zeroY);
        const h = Math.max(0, Math.abs(sy - zeroY));
        const c =
          colors?.[i] ??
          (highlight === i
            ? "rgb(var(--accent))"
            : "rgb(var(--viz-v))");
        return (
          <g key={i}>
            <rect
              x={x}
              y={top}
              width={barW}
              height={h}
              fill={c}
              opacity={highlight === undefined || highlight === null || highlight === i ? 0.85 : 0.45}
              rx={2}
            />
            {/* draggable handle (taller hit area on top edge) */}
            {onChange && (
              <rect
                x={x - 4}
                y={Math.max(padT - 6, top - 10)}
                width={barW + 8}
                height={20}
                fill="transparent"
                style={{ cursor: "ns-resize" }}
                onPointerDown={(e) => onPointerDown(e, i)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              />
            )}
            {/* top tick on bar for affordance when draggable */}
            {onChange && (
              <line
                x1={x}
                x2={x + barW}
                y1={top}
                y2={top}
                stroke="rgb(var(--ink))"
                strokeWidth={2}
                opacity={0.7}
              />
            )}
            {showValues && (
              <text
                x={x + barW / 2}
                y={top - 4}
                textAnchor="middle"
                fontSize={10}
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink))"
                stroke="rgb(var(--paper))"
                strokeWidth={3}
                paintOrder="stroke"
              >
                {valueFormat(v)}
              </text>
            )}
            {labels && (
              <text
                x={x + barW / 2}
                y={padT + innerH + 14}
                textAnchor="middle"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink-muted))"
              >
                {String(labels[i])}
              </text>
            )}
          </g>
        );
      })}

      {baselineLabel && (
        <text
          x={padL + innerW}
          y={padT + innerH + 26}
          textAnchor="end"
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
        >
          {baselineLabel}
        </text>
      )}
    </svg>
  );
}
