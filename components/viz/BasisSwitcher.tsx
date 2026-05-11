"use client";

import { useState } from "react";
import {
  Stage,
  Grid,
  Axes,
  Arrow,
  DragPoint,
  LineSeg,
  vizColors,
} from "./Stage";
import { fmt, inverse, mv, type Mat2, type Vec2 } from "@/lib/linalg";

export function BasisSwitcher() {
  const [v, setV] = useState<Vec2>([3, 1.5]);
  const [b1, setB1] = useState<Vec2>([2, 1]);
  const [b2, setB2] = useState<Vec2>([-1, 1.5]);
  const world = { xMin: -5, xMax: 5, yMin: -3.5, yMax: 3.5 };
  const B: Mat2 = [b1[0], b2[0], b1[1], b2[1]];
  const Binv = inverse(B);
  const coordsB = Binv ? mv(Binv, v) : null;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Same vector in two different bases"
      >
        <Grid />
        <Axes />
        {/* Custom basis lines through origin */}
        <LineSeg
          from={[b1[0] * 4, b1[1] * 4]}
          to={[-b1[0] * 4, -b1[1] * 4]}
          color={vizColors.x}
          opacity={0.3}
          width={1}
          dashed
        />
        <LineSeg
          from={[b2[0] * 4, b2[1] * 4]}
          to={[-b2[0] * 4, -b2[1] * 4]}
          color={vizColors.y}
          opacity={0.3}
          width={1}
          dashed
        />
        <Arrow to={b1} color={vizColors.x} width={2.4} label="b₁" />
        <Arrow to={b2} color={vizColors.y} width={2.4} label="b₂" />
        <Arrow to={v} color={vizColors.sum} width={3} label="v" />
        <DragPoint value={v} onChange={setV} color={vizColors.sum} bounds={world} />
        <DragPoint value={b1} onChange={setB1} color={vizColors.x} bounds={world} />
        <DragPoint value={b2} onChange={setB2} color={vizColors.y} bounds={world} />
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="font-sans text-xs uppercase tracking-wide text-ink-subtle">
            standard basis (e₁, e₂)
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-ink-muted">v =</span>
            <span className="text-ink">
              ({fmt(v[0])}, {fmt(v[1])})
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-accent/40 bg-accent-soft p-3 font-mono text-sm">
          <div className="font-sans text-xs uppercase tracking-wide text-accent">
            new basis (b₁, b₂)
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-ink-muted">[v]_B =</span>
            <span className="text-ink">
              {coordsB
                ? `(${fmt(coordsB[0])}, ${fmt(coordsB[1])})`
                : "undefined (basis is degenerate)"}
            </span>
          </div>
          {coordsB && (
            <p className="mt-2 font-sans text-xs leading-relaxed text-ink-muted">
              Read it as: v = {fmt(coordsB[0])}·b₁ + {fmt(coordsB[1])}·b₂.
            </p>
          )}
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          The arrow doesn&apos;t move when you change basis — only the
          numbers we use to describe it do.
        </p>
      </div>
    </div>
  );
}
