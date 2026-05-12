"use client";

import { useMemo, useState } from "react";
import { FunctionPlot } from "./FunctionPlot";
import { PointDot, useStage, vizColors } from "./Stage";
import { fmt } from "@/lib/calc";

type Preset = "removable" | "sinc" | "jump";

const PRESETS: Record<
  Preset,
  {
    label: string;
    formula: string;
    f: (x: number) => number;
    a: number;
    limit: number | null;
    description: string;
    domain: [number, number];
    range: [number, number];
  }
> = {
  removable: {
    label: "removable hole",
    formula: "f(x) = (x² − 1) / (x − 1)",
    f: (x) => (Math.abs(x - 1) < 1e-12 ? NaN : (x * x - 1) / (x - 1)),
    a: 1,
    limit: 2,
    description:
      "Algebraically, f(x) = x + 1 for every x except 1, where it's undefined. The limit is what 'should' be there.",
    domain: [-1, 3],
    range: [-1, 5],
  },
  sinc: {
    label: "sin(x) / x",
    formula: "f(x) = sin(x) / x",
    f: (x) => (Math.abs(x) < 1e-12 ? NaN : Math.sin(x) / x),
    a: 0,
    limit: 1,
    description:
      "Famous limit. Both numerator and denominator are 0 at x = 0; the ratio is still 1 in the limit.",
    domain: [-6, 6],
    range: [-0.3, 1.2],
  },
  jump: {
    label: "jump (no limit)",
    formula: "f(x) = sign(x)",
    f: (x) => (Math.abs(x) < 1e-12 ? NaN : Math.sign(x)),
    a: 0,
    limit: null,
    description:
      "The two one-sided limits exist but they disagree. The two-sided limit does not exist.",
    domain: [-2, 2],
    range: [-1.5, 1.5],
  },
};

export function LimitExplorer() {
  const [presetId, setPresetId] = useState<Preset>("removable");
  const preset = PRESETS[presetId];
  // h ranges on a log scale: 10^logH, with logH from -4 to 0
  const [logH, setLogH] = useState(-1);
  const h = useMemo(() => Math.pow(10, logH), [logH]);

  const xLeft = preset.a - h;
  const xRight = preset.a + h;
  const yLeft = preset.f(xLeft);
  const yRight = preset.f(xRight);

  const overlays = useMemo(
    () => [
      // Highlight the two approaching points
      { kind: "point" as const, at: [xLeft, yLeft] as [number, number], color: vizColors.x },
      { kind: "point" as const, at: [xRight, yRight] as [number, number], color: vizColors.y },
    ],
    [xLeft, yLeft, xRight, yRight]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          {preset.formula}
        </div>
        <FunctionPlot
          f={preset.f}
          domain={preset.domain}
          range={preset.range}
          overlays={overlays}
          width={520}
          height={280}
          ariaLabel="limit explorer plot"
        >
          <HoleMarker at={[preset.a, preset.limit ?? 0]} />
        </FunctionPlot>
      </div>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Function
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as Preset[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setPresetId(k);
                  setLogH(-1);
                }}
                className={[
                  "rounded-md border px-2 py-1 text-xs transition",
                  presetId === k
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {PRESETS[k].label}
              </button>
            ))}
          </div>
          <p className="mt-3 font-serif text-xs leading-relaxed text-ink-muted">
            {preset.description}
          </p>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-2 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            h = 10ⁿ
          </div>
          <input
            type="range"
            min={-4}
            max={0}
            step={0.01}
            value={logH}
            onChange={(e) => setLogH(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="text-right text-ink">h = {h.toExponential(1)}</div>
          <div className="my-2 border-t border-line" />
          <Row
            label={`f(${fmt(preset.a, 0)} − h)`}
            value={Number.isFinite(yLeft) ? fmt(yLeft, 5) : "undefined"}
            color={vizColors.x}
          />
          <Row
            label={`f(${fmt(preset.a, 0)} + h)`}
            value={Number.isFinite(yRight) ? fmt(yRight, 5) : "undefined"}
            color={vizColors.y}
          />
          <div className="my-2 border-t border-line" />
          <Row
            label={`lim as h → 0`}
            value={preset.limit === null ? "DNE" : fmt(preset.limit, 5)}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

function HoleMarker({ at }: { at: [number, number] }) {
  const { toScreen } = useStage();
  const [sx, sy] = toScreen(at);
  return (
    <circle
      cx={sx}
      cy={sy}
      r={5}
      fill="rgb(var(--paper-raised))"
      stroke="rgb(var(--accent))"
      strokeWidth={1.6}
    />
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
