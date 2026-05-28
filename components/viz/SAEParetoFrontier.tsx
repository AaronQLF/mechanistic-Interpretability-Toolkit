"use client";

import { useMemo, useState } from "react";
import { Stage, Grid, Axes, useStage, vizColors } from "./Stage";
import type { Vec2 } from "@/lib/linalg";

type Method = "vanilla" | "topk" | "jumprelu" | "gated";

const METHODS: {
  id: Method;
  label: string;
  color: string;
  // Toy log–linear curve: ce = a + b * log(L0) + width_bonus
  a: number;
  b: number;
  noise: number;
}[] = [
  { id: "vanilla", label: "Vanilla L1", color: vizColors.v, a: 0.18, b: 0.135, noise: 0.012 },
  { id: "topk", label: "Top-K", color: vizColors.w, a: 0.35, b: 0.115, noise: 0.008 },
  { id: "jumprelu", label: "JumpReLU", color: vizColors.eigen, a: 0.42, b: 0.105, noise: 0.006 },
  { id: "gated", label: "Gated", color: vizColors.accent, a: 0.40, b: 0.108, noise: 0.007 },
];

const WIDTHS: { label: string; mult: number; bonus: number }[] = [
  { label: "4×", mult: 4, bonus: -0.04 },
  { label: "16×", mult: 16, bonus: 0.0 },
  { label: "64×", mult: 64, bonus: 0.05 },
];

function curve(method: Method, widthBonus: number): Vec2[] {
  const m = METHODS.find((x) => x.id === method)!;
  const out: Vec2[] = [];
  for (let l0 = 4; l0 <= 256; l0 += 2) {
    let v = m.a + m.b * Math.log(l0) + widthBonus;
    v = Math.max(0.05, Math.min(0.99, v));
    out.push([l0, v]);
  }
  return out;
}

export function SAEParetoFrontier() {
  const [active, setActive] = useState<Record<Method, boolean>>({
    vanilla: true,
    topk: true,
    jumprelu: true,
    gated: false,
  });
  const [widthIdx, setWidthIdx] = useState(1);
  const widthBonus = WIDTHS[widthIdx].bonus;

  const world = { xMin: 1.5, xMax: 6.0, yMin: 0.0, yMax: 1.05 };

  const curves = useMemo(() => {
    const m: Partial<Record<Method, Vec2[]>> = {};
    for (const meta of METHODS) {
      m[meta.id] = curve(meta.id, widthBonus).map(
        ([l0, ce]) => [Math.log(l0), ce] as Vec2
      );
    }
    return m;
  }, [widthBonus]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <Stage
          width={520}
          height={320}
          world={world}
          ariaLabel="Sparsity-fidelity Pareto frontier"
        >
          <Grid step={0.5} minor={false} />
          <Axes labels={false} />
          <AxisLabels />
          {METHODS.filter((m) => active[m.id]).map((m) => (
            <CurvePath
              key={m.id}
              points={curves[m.id]!}
              color={m.color}
              width={2.4}
            />
          ))}
        </Stage>
      </div>
      <div className="space-y-3 self-start">
        <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          dictionary width
        </div>
        <div className="flex gap-1">
          {WIDTHS.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setWidthIdx(i)}
              className={[
                "flex-1 rounded-md border px-2 py-1 font-mono text-[11px] transition",
                i === widthIdx
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {w.label} d
            </button>
          ))}
        </div>

        <div className="pt-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          gating method
        </div>
        {METHODS.map((m) => (
          <label
            key={m.id}
            className="flex cursor-pointer items-center justify-between rounded-md border border-line bg-paper-sunken px-3 py-1.5 font-sans text-xs"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-4 rounded-sm"
                style={{ background: m.color }}
                aria-hidden
              />
              <span>{m.label}</span>
            </span>
            <input
              type="checkbox"
              checked={active[m.id]}
              onChange={(e) =>
                setActive((s) => ({ ...s, [m.id]: e.target.checked }))
              }
              className="accent-amber-600"
            />
          </label>
        ))}
        <p className="font-serif text-[11px] leading-relaxed text-ink-muted">
          Stylized after Gao et al. 2024. The y-axis is the fraction of the
          model&apos;s cross-entropy the SAE recovers (1 = lossless); the
          x-axis is sparsity, log <span className="font-mono">‖f‖₀</span>.
          Methods further up-and-to-the-left are strictly better.
        </p>
      </div>
    </div>
  );
}

function AxisLabels() {
  const { frame, toScreen } = useStage();
  const { world } = frame;
  const tickX = [4, 8, 16, 32, 64, 128];
  const tickY = [0.2, 0.4, 0.6, 0.8, 1.0];
  return (
    <g aria-hidden>
      {tickX.map((x) => {
        const [sx, sy] = toScreen([Math.log(x), world.yMin]);
        return (
          <text
            key={`x-${x}`}
            x={sx}
            y={sy + 14}
            fontSize={10}
            textAnchor="middle"
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            {x}
          </text>
        );
      })}
      {tickY.map((y) => {
        const [sx, sy] = toScreen([world.xMin, y]);
        return (
          <text
            key={`y-${y}`}
            x={sx - 6}
            y={sy + 3}
            fontSize={10}
            textAnchor="end"
            fill="rgb(var(--ink-muted))"
            fontFamily="ui-monospace, monospace"
          >
            {y.toFixed(1)}
          </text>
        );
      })}
      <text
        x={toScreen([world.xMax - 0.05, world.yMin])[0]}
        y={toScreen([world.xMax, world.yMin])[1] + 26}
        fontSize={10}
        textAnchor="end"
        fill="rgb(var(--ink-muted))"
        fontFamily="ui-monospace, monospace"
      >
        sparsity (active features per token, log scale)
      </text>
      <text
        x={toScreen([world.xMin, world.yMax])[0] - 28}
        y={toScreen([world.xMin, world.yMax])[1] + 4}
        fontSize={10}
        textAnchor="start"
        fill="rgb(var(--ink-muted))"
        fontFamily="ui-monospace, monospace"
      >
        CE-recovered
      </text>
    </g>
  );
}

function CurvePath({
  points,
  color,
  width,
}: {
  points: Vec2[];
  color: string;
  width: number;
}) {
  const { toScreen } = useStage();
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const [sx, sy] = toScreen(points[i]);
    d += `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)} `;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}
