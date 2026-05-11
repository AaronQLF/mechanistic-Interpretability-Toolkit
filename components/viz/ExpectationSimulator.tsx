"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProbBars } from "./ProbBars";
import {
  expectation,
  fmt,
  mulberry32,
  normalize,
  sampleFromU,
  variance,
} from "@/lib/prob";

const VALUES = [1, 2, 3, 4, 5, 6];

type Preset = "fair-die" | "loaded-die" | "two-spike";
const PRESETS: Record<Preset, number[]> = {
  "fair-die": [1, 1, 1, 1, 1, 1],
  "loaded-die": [1, 1, 1, 1, 2, 6],
  "two-spike": [4, 0.2, 0.2, 0.2, 0.2, 4],
};

export function ExpectationSimulator() {
  const [raw, setRaw] = useState<number[]>([...PRESETS["loaded-die"]]);
  const [running, setRunning] = useState(false);
  const [n, setN] = useState(0);
  const [mean, setMean] = useState(0);

  // history for sparkline: cap to 600 points
  const historyRef = useRef<number[]>([]);
  const [historyTick, setHistoryTick] = useState(0);

  const p = useMemo(() => normalize(raw), [raw]);
  const E = expectation(VALUES, p);
  const Var = variance(VALUES, p);
  const std = Math.sqrt(Var);

  // Single RNG seeded once
  const rngRef = useRef<() => number>(mulberry32(0xc0ffee));

  // Reset when distribution changes
  useEffect(() => {
    historyRef.current = [];
    setN(0);
    setMean(0);
    setHistoryTick((t) => t + 1);
  }, [p]);

  useEffect(() => {
    if (!running) return;
    let raf: number;
    const tick = () => {
      // Take a batch of samples each frame for speed
      const batch = 12;
      let curMean = mean;
      let curN = n;
      for (let i = 0; i < batch; i++) {
        const idx = sampleFromU(p, rngRef.current());
        const x = VALUES[idx];
        curN += 1;
        curMean = curMean + (x - curMean) / curN;
      }
      setN(curN);
      setMean(curMean);
      historyRef.current.push(curMean);
      if (historyRef.current.length > 600) historyRef.current.shift();
      setHistoryTick((t) => t + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, p, mean, n]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-raised p-3">
          <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            distribution over X ∈ {`{1, 2, 3, 4, 5, 6}`}
          </div>
          <ProbBars
            values={p}
            labels={VALUES}
            yMax={1}
            height={200}
            highlight={null}
            valueFormat={(v) => (v * 100).toFixed(0) + "%"}
            onChange={(i, v) => {
              const total = raw.reduce((a, b) => a + b, 0);
              const otherTotal = total - raw[i];
              const eps = 0.001;
              const wClamped = Math.min(1 - eps, Math.max(eps, v));
              const next = [...raw];
              next[i] = (wClamped * otherTotal) / (1 - wClamped);
              setRaw(next);
            }}
          />
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Presets
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as Preset[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setRaw([...PRESETS[k]])}
                  className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
            <Row label="E[X]" value={fmt(E)} highlight />
            <Row label="Var[X]" value={fmt(Var)} />
            <Row label="σ[X]" value={fmt(std)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            running sample mean (Law of Large Numbers)
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className={[
                "rounded-md border px-3 py-1 font-sans text-xs transition",
                running
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "border-accent bg-accent text-white",
              ].join(" ")}
            >
              {running ? "Pause" : "Sample"}
            </button>
            <button
              type="button"
              onClick={() => {
                historyRef.current = [];
                setN(0);
                setMean(0);
                setHistoryTick((t) => t + 1);
              }}
              className="rounded-md border border-line bg-paper px-3 py-1 font-sans text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Reset
            </button>
          </div>
        </div>
        <MeanTrace
          history={historyRef.current}
          tick={historyTick}
          target={E}
          variance={Var}
          n={Math.max(1, n)}
        />
        <div className="mt-2 flex items-center justify-between font-mono text-xs text-ink-muted">
          <span>n = {n.toLocaleString()}</span>
          <span>
            sample mean ={" "}
            <span className="text-ink">{n > 0 ? fmt(mean) : "—"}</span>
          </span>
          <span>
            target E[X] = <span className="text-accent">{fmt(E)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function MeanTrace({
  history,
  target,
  variance,
  n,
}: {
  history: number[];
  tick: number;
  target: number;
  variance: number;
  n: number;
}) {
  const w = 560;
  const h = 120;
  const padL = 30;
  const padR = 8;
  const padT = 8;
  const padB = 18;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  // Y range: pick something around target ± a few stds.
  const std = Math.sqrt(Math.max(0.01, variance));
  const yLo = target - 3 * std;
  const yHi = target + 3 * std;
  const y = (v: number) => padT + (1 - (v - yLo) / (yHi - yLo)) * innerH;
  const x = (i: number) => padL + (i / Math.max(1, history.length - 1)) * innerW;

  const path =
    history.length > 1
      ? history
          .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`)
          .join(" ")
      : "";

  // 1/sqrt(n) confidence band around target
  const halfBand = (1.96 * std) / Math.sqrt(Math.max(1, n));
  const bandTop = y(target + halfBand);
  const bandBot = y(target - halfBand);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="Running sample mean as more samples are drawn"
    >
      <rect
        x={padL}
        y={padT}
        width={innerW}
        height={innerH}
        fill="rgb(var(--paper-sunken))"
        rx={4}
      />
      {/* Confidence band */}
      <rect
        x={padL}
        y={Math.min(bandTop, bandBot)}
        width={innerW}
        height={Math.abs(bandBot - bandTop)}
        fill="rgb(var(--accent))"
        opacity={0.1}
      />
      {/* target line */}
      <line
        x1={padL}
        y1={y(target)}
        x2={padL + innerW}
        y2={y(target)}
        stroke="rgb(var(--accent))"
        strokeWidth={1.4}
        strokeDasharray="6 4"
      />
      {/* path */}
      {path && (
        <path
          d={path}
          fill="none"
          stroke="rgb(var(--viz-v))"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {/* y axis ticks at target ± std */}
      {[target - std, target, target + std].map((v, i) => (
        <text
          key={i}
          x={padL - 4}
          y={y(v) + 3}
          fontSize={9}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
          textAnchor="end"
        >
          {fmt(v, 1)}
        </text>
      ))}
    </svg>
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
