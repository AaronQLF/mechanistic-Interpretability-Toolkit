"use client";

import { useMemo, useState } from "react";
import { FunctionPlot } from "./FunctionPlot";
import { NAMED_1D, fmt, getFunc1D } from "@/lib/calc";
import { vizColors } from "./Stage";

export function DerivativeVisualizer() {
  const [fid, setFid] = useState<string>("square");
  const func = getFunc1D(fid);
  const [x0, setX0] = useState(1);
  const [showSecant, setShowSecant] = useState(true);
  const [logH, setLogH] = useState(-0.3); // h ≈ 0.5
  const h = useMemo(() => Math.pow(10, logH), [logH]);

  const slopeTangent = func.df(x0);
  const slopeSecant = (func.f(x0 + h) - func.f(x0)) / h;

  const overlays = useMemo(() => {
    const ov: Parameters<typeof FunctionPlot>[0]["overlays"] = [
      { kind: "tangent" as const, x0, slope: slopeTangent, color: vizColors.accent },
    ];
    if (showSecant) {
      ov.push({ kind: "secant" as const, x0, x1: x0 + h });
      ov.push({
        kind: "point" as const,
        at: [x0 + h, func.f(x0 + h)] as [number, number],
        color: vizColors.y,
      });
    }
    return ov;
  }, [x0, slopeTangent, h, showSecant, func]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <div className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          {func.label}
        </div>
        <FunctionPlot
          f={func.f}
          domain={func.domain}
          range={func.range ?? [-3, 3]}
          overlays={overlays}
          draggablePoint={{ x: x0, onChange: setX0 }}
          width={520}
          height={300}
          ariaLabel="derivative visualizer plot"
        />
      </div>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Function
          </div>
          <div className="flex flex-wrap gap-2">
            {NAMED_1D.map((nf) => (
              <button
                key={nf.id}
                type="button"
                onClick={() => {
                  setFid(nf.id);
                  // place x0 at a sensible spot inside the domain
                  const mid = (nf.domain[0] + nf.domain[1]) / 2;
                  setX0(mid + (nf.domain[1] - nf.domain[0]) * 0.15);
                }}
                className={[
                  "rounded-md border px-2 py-1 text-[11px] transition",
                  fid === nf.id
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {nf.id}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="x₀" value={fmt(x0, 3)} color={vizColors.eigen} />
          <Row label="f(x₀)" value={fmt(func.f(x0), 3)} />
          <div className="my-2 border-t border-line" />
          <Row
            label="f ′(x₀)  tangent slope"
            value={fmt(slopeTangent, 3)}
            color={vizColors.accent}
            highlight
          />
          {showSecant && (
            <>
              <Row
                label={`(f(x₀+h) − f(x₀)) / h`}
                value={fmt(slopeSecant, 3)}
                color={vizColors.y}
              />
              <Row
                label="error"
                value={fmt(Math.abs(slopeSecant - slopeTangent), 4)}
              />
            </>
          )}
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            <input
              type="checkbox"
              checked={showSecant}
              onChange={(e) => setShowSecant(e.target.checked)}
              className="accent-amber-600"
            />
            show secant
          </label>
          {showSecant && (
            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                step h = 10ⁿ
              </label>
              <input
                type="range"
                min={-3}
                max={0.3}
                step={0.01}
                value={logH}
                onChange={(e) => setLogH(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="text-right font-mono text-xs text-ink">
                h = {h.toExponential(1)}
              </div>
            </div>
          )}
        </div>
      </div>
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
