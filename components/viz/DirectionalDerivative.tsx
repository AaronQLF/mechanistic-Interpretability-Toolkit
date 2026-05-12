"use client";

import { useState } from "react";
import { Heatmap } from "./Heatmap";
import { Arrow, DragPoint, PointDot, vizColors } from "./Stage";
import { fmt, getScalar2D, NAMED_2D } from "@/lib/calc";
import { dot, normalize as normVec } from "@/lib/linalg";
import type { Vec2 } from "@/lib/linalg";

export function DirectionalDerivative() {
  const [fid, setFid] = useState<string>("ellipse");
  const scalar = getScalar2D(fid);
  const [p, setP] = useState<Vec2>(scalar.start ?? [-1.5, 1.2]);
  const [angle, setAngle] = useState(Math.PI / 6); // controls unit direction

  const u: Vec2 = [Math.cos(angle), Math.sin(angle)];
  const g = scalar.gradF(p);
  const gMag = Math.hypot(g[0], g[1]);

  const dirDeriv = dot(g, u);
  const gNorm = gMag > 1e-9 ? normVec(g) : ([1, 0] as Vec2);
  const angleBetween =
    gMag > 1e-9 ? Math.acos(Math.max(-1, Math.min(1, dot(gNorm, u)))) : 0;

  // Scale length of the displayed direction arrow
  const cell = (scalar.world.xMax - scalar.world.xMin) / 7;
  const uTip: Vec2 = [p[0] + u[0] * cell, p[1] + u[1] * cell];
  const gTip: Vec2 = [
    p[0] + g[0] * (cell * 0.9) / Math.max(0.5, gMag),
    p[1] + g[1] * (cell * 0.9) / Math.max(0.5, gMag),
  ];

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
          showGradient
          gradStep={6}
        >
          <Arrow
            from={p}
            to={gTip}
            color={vizColors.accent}
            width={2.4}
            label="∇F"
          />
          <Arrow
            from={p}
            to={uTip}
            color={vizColors.sum}
            width={2.4}
            label="u"
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

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            direction angle θ
          </label>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={angle}
            onChange={(e) => setAngle(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between font-mono text-xs">
            <span className="text-ink-subtle">−π</span>
            <span className="text-ink">{fmt(angle, 2)} rad</span>
            <span className="text-ink-subtle">π</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (gMag > 1e-9) setAngle(Math.atan2(g[1], g[0]));
            }}
            className="mt-3 w-full rounded-md border border-line bg-paper px-2 py-1 text-[11px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
          >
            align u with ∇F
          </button>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="u" value={`(${fmt(u[0], 2)}, ${fmt(u[1], 2)})`} color={vizColors.sum} />
          <Row label="∇F" value={`(${fmt(g[0], 2)}, ${fmt(g[1], 2)})`} color={vizColors.accent} />
          <Row label="‖∇F‖" value={fmt(gMag, 3)} />
          <div className="my-2 border-t border-line" />
          <Row
            label="∂F/∂u  =  ∇F · u"
            value={fmt(dirDeriv, 3)}
            highlight
          />
          <Row
            label="angle(∇F, u)"
            value={`${fmt((angleBetween * 180) / Math.PI, 1)}°`}
          />
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
