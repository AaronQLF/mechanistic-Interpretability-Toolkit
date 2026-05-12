"use client";

import { useMemo, useState } from "react";
import { FunctionPlot } from "./FunctionPlot";
import { fmt } from "@/lib/calc";
import { vizColors } from "./Stage";

type FuncDef = {
  id: string;
  label: string;
  f: (x: number) => number;
  df: (x: number) => number;
};

const FUNCS: Record<string, FuncDef> = {
  square: {
    id: "square",
    label: "y = x²",
    f: (x) => x * x,
    df: (x) => 2 * x,
  },
  scaled: {
    id: "scaled",
    label: "y = 2x + 1",
    f: (x) => 2 * x + 1,
    df: () => 2,
  },
  sin: {
    id: "sin",
    label: "y = sin x",
    f: Math.sin,
    df: Math.cos,
  },
  sigmoid: {
    id: "sigmoid",
    label: "y = σ(x)",
    f: (x) => 1 / (1 + Math.exp(-x)),
    df: (x) => {
      const s = 1 / (1 + Math.exp(-x));
      return s * (1 - s);
    },
  },
};

const FUNC_IDS = ["square", "scaled", "sin", "sigmoid"] as const;

export function ChainRuleComposer() {
  const [gId, setGId] = useState<string>("scaled");
  const [hId, setHId] = useState<string>("square");
  const [x, setX] = useState(0.5);

  const g = FUNCS[gId];
  const h = FUNCS[hId];

  const composed = useMemo(
    () => ({
      f: (xx: number) => h.f(g.f(xx)),
      df: (xx: number) => h.df(g.f(xx)) * g.df(xx),
    }),
    [g, h]
  );

  // Determine domains/ranges roughly
  const domainX: [number, number] = [-2, 2];
  const domainY: [number, number] = (() => {
    const xs = Array.from({ length: 60 }, (_, i) => -2 + (4 * i) / 59);
    const ys = xs.map(g.f);
    const lo = Math.min(...ys, -1);
    const hi = Math.max(...ys, 1);
    const pad = (hi - lo) * 0.1 + 0.2;
    return [lo - pad, hi + pad];
  })();
  const rangeF: [number, number] = (() => {
    const xs = Array.from({ length: 60 }, (_, i) => -2 + (4 * i) / 59);
    const zs = xs.map(composed.f);
    const lo = Math.min(...zs);
    const hi = Math.max(...zs);
    const pad = (hi - lo) * 0.1 + 0.2;
    return [lo - pad, hi + pad];
  })();

  const yVal = g.f(x);
  const zVal = h.f(yVal);
  const slopeG = g.df(x);
  const slopeH = h.df(yVal);
  const slopeChain = slopeH * slopeG;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title="inner  y = g(x)"
          color={vizColors.v}
        >
          <FunctionPlot
            f={g.f}
            domain={domainX}
            range={domainY}
            curveColor={vizColors.v}
            overlays={[
              { kind: "tangent", x0: x, slope: slopeG, color: vizColors.accent },
            ]}
            draggablePoint={{ x, onChange: setX }}
            width={420}
            height={220}
          />
        </Panel>
        <Panel
          title="outer  z = h(y)"
          color={vizColors.w}
        >
          <FunctionPlot
            f={h.f}
            domain={domainY}
            range={rangeF}
            curveColor={vizColors.w}
            overlays={[
              { kind: "tangent", x0: yVal, slope: slopeH, color: vizColors.accent },
            ]}
            width={420}
            height={220}
          />
        </Panel>
        <Panel
          title="composition  z = h(g(x))"
          color={vizColors.sum}
        >
          <FunctionPlot
            f={composed.f}
            domain={domainX}
            range={rangeF}
            curveColor={vizColors.sum}
            overlays={[
              {
                kind: "tangent",
                x0: x,
                slope: slopeChain,
                color: vizColors.accent,
              },
            ]}
            width={420}
            height={220}
          />
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Pick functions
          </div>
          <div className="space-y-2">
            <div>
              <div className="mb-1 font-mono text-[11px] text-ink-subtle">g (inner)</div>
              <div className="flex flex-wrap gap-2">
                {FUNC_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setGId(id)}
                    className={[
                      "rounded-md border px-2 py-1 text-[11px] transition",
                      gId === id
                        ? "border-accent bg-accent text-white"
                        : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {FUNCS[id].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 font-mono text-[11px] text-ink-subtle">h (outer)</div>
              <div className="flex flex-wrap gap-2">
                {FUNC_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setHId(id)}
                    className={[
                      "rounded-md border px-2 py-1 text-[11px] transition",
                      hId === id
                        ? "border-accent bg-accent text-white"
                        : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {FUNCS[id].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="x" value={fmt(x, 3)} />
          <Row label="y = g(x)" value={fmt(yVal, 3)} />
          <Row label="z = h(y)" value={fmt(zVal, 3)} />
          <div className="my-2 border-t border-line" />
          <Row label="g ′(x)" value={fmt(slopeG, 3)} color={vizColors.v} />
          <Row label="h ′(y)" value={fmt(slopeH, 3)} color={vizColors.w} />
          <Row
            label="h ′(y) · g ′(x)"
            value={fmt(slopeChain, 3)}
            color={vizColors.sum}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg border bg-paper-raised p-3"
      style={{ borderColor: `color-mix(in srgb, ${color} 35%, transparent)` }}
    >
      <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        {color && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: color }}
          />
        )}
        <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      </span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
