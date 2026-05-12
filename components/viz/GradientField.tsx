"use client";

import { useState } from "react";
import { Heatmap } from "./Heatmap";
import { Arrow, DragPoint, PointDot, vizColors } from "./Stage";
import { NAMED_2D, fmt, getScalar2D } from "@/lib/calc";
import type { Vec2 } from "@/lib/linalg";

export function GradientField() {
  const [fid, setFid] = useState<string>("bowl");
  const scalar = getScalar2D(fid);
  const [p, setP] = useState<Vec2>(scalar.start ?? [-1.5, 1.2]);

  const g = scalar.gradF(p);
  const gMag = Math.hypot(g[0], g[1]);
  const fVal = scalar.F(p);
  // Scale the gradient arrow so it's readable but not overwhelming
  const cell = (scalar.world.xMax - scalar.world.xMin) / 8;
  const k = (cell * 0.9) / Math.max(0.5, gMag);
  const tip: Vec2 = [p[0] + g[0] * k, p[1] + g[1] * k];

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
          gradStep={8}
          ariaLabel="2D scalar field with gradient arrows"
        >
          {/* Highlight the gradient at the picked point */}
          <Arrow
            from={p}
            to={tip}
            color={vizColors.accent}
            width={2.4}
            label="∇F"
          />
          <PointDot at={p} r={5} color={vizColors.accent} />
          <DragPoint
            value={p}
            onChange={setP}
            color={vizColors.accent}
            r={10}
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
                  setP(s.start ?? [s.world.xMin / 2, s.world.yMax / 2]);
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

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="x" value={fmt(p[0], 3)} />
          <Row label="y" value={fmt(p[1], 3)} />
          <Row label="F(x, y)" value={fmt(fVal, 3)} />
          <div className="my-2 border-t border-line" />
          <Row
            label="∂F/∂x"
            value={fmt(g[0], 3)}
            color={vizColors.v}
          />
          <Row
            label="∂F/∂y"
            value={fmt(g[1], 3)}
            color={vizColors.w}
          />
          <Row
            label="‖∇F‖"
            value={fmt(gMag, 3)}
            color={vizColors.accent}
            highlight
          />
        </div>
        <p className="px-1 font-sans text-xs text-ink-muted">
          Drag the orange dot. The arrow is the local gradient ∇F —
          longest where the colormap changes fastest, zero at minima
          and saddle points.
        </p>
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
