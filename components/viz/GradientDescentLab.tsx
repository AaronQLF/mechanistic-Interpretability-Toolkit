"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Heatmap } from "./Heatmap";
import { Arrow, DragPoint, PointDot, useStage, vizColors } from "./Stage";
import { NAMED_2D, fmt, getScalar2D } from "@/lib/calc";
import type { Vec2 } from "@/lib/linalg";

export function GradientDescentLab() {
  const [fid, setFid] = useState<string>("ellipse");
  const scalar = getScalar2D(fid);
  const [start, setStart] = useState<Vec2>(scalar.start ?? [-2, 1.6]);
  const [lr, setLr] = useState(0.05);
  const [running, setRunning] = useState(false);

  // Reset path whenever the function or start changes
  const pathRef = useRef<Vec2[]>([start]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    pathRef.current = [start];
    setTick((t) => t + 1);
    setRunning(false);
  }, [fid, start]);

  const step = () => {
    const p = pathRef.current[pathRef.current.length - 1];
    const g = scalar.gradF(p);
    const next: Vec2 = [p[0] - lr * g[0], p[1] - lr * g[1]];
    // Stop if we'd leave the visible world.
    if (
      next[0] < scalar.world.xMin ||
      next[0] > scalar.world.xMax ||
      next[1] < scalar.world.yMin ||
      next[1] > scalar.world.yMax ||
      !Number.isFinite(next[0]) ||
      !Number.isFinite(next[1])
    ) {
      setRunning(false);
      return;
    }
    pathRef.current = [...pathRef.current, next];
    setTick((t) => t + 1);
  };

  useEffect(() => {
    if (!running) return;
    let raf: number;
    let last = 0;
    const interval = 60;
    const loop = (t: number) => {
      if (t - last > interval) {
        step();
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, lr, fid]);

  const current = pathRef.current[pathRef.current.length - 1];
  const g = scalar.gradF(current);
  const gMag = Math.hypot(g[0], g[1]);
  const fVal = scalar.F(current);

  // For drawing the current gradient as a small arrow
  const cell = (scalar.world.xMax - scalar.world.xMin) / 10;
  const k = (cell * 0.9) / Math.max(0.4, gMag);
  const gradTip: Vec2 = [current[0] + g[0] * k, current[1] + g[1] * k];
  const stepTip: Vec2 = [current[0] - lr * g[0], current[1] - lr * g[1]];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          {scalar.label}
        </div>
        <Heatmap
          scalar={scalar}
          width={520}
          height={420}
          showGradient={false}
        >
          <PathTrace path={pathRef.current} key={tick} />
          {/* Live gradient and step arrows */}
          <Arrow
            from={current}
            to={gradTip}
            color={vizColors.accent}
            width={2.2}
            label="∇F"
            opacity={0.6}
          />
          <Arrow
            from={current}
            to={stepTip}
            color={vizColors.sum}
            width={2.4}
            label="−η ∇F"
          />
          <PointDot at={pathRef.current[0]} r={4} color={vizColors.inkMuted} label="start" />
          <PointDot at={current} r={5} color={vizColors.accent} />
          <DragPoint
            value={start}
            onChange={setStart}
            color={vizColors.inkMuted}
            r={9}
            bounds={scalar.world}
          />
        </Heatmap>
      </div>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Function
          </div>
          <div className="flex flex-col gap-2">
            {NAMED_2D.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setFid(s.id);
                  setStart(s.start ?? [s.world.xMin / 2, s.world.yMax / 2]);
                }}
                className={[
                  "rounded-md border px-2 py-1 text-left text-[11px] transition",
                  fid === s.id
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            learning rate η
          </label>
          <input
            type="range"
            min={0.001}
            max={0.5}
            step={0.001}
            value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="text-right font-mono text-xs text-ink">η = {fmt(lr, 3)}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={step}
              className="flex-1 rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Step
            </button>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className={[
                "flex-1 rounded-md border px-2 py-1 text-xs transition",
                running
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "border-accent bg-accent text-white",
              ].join(" ")}
            >
              {running ? "Pause" : "Run"}
            </button>
            <button
              type="button"
              onClick={() => {
                pathRef.current = [start];
                setTick((t) => t + 1);
                setRunning(false);
              }}
              className="flex-1 rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="step" value={String(pathRef.current.length - 1)} />
          <Row label="F" value={fmt(fVal, 4)} highlight />
          <Row label="‖∇F‖" value={fmt(gMag, 4)} />
        </div>
      </div>
    </div>
  );
}

function PathTrace({ path }: { path: Vec2[] }) {
  const { toScreen } = useStage();
  if (path.length < 2) return null;
  let d = "";
  for (let i = 0; i < path.length; i++) {
    const [sx, sy] = toScreen(path[i]);
    d += `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)} `;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke="rgb(var(--ink))"
      strokeWidth={1.6}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={0.85}
    />
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
      ].join(" ")}
    >
      <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
