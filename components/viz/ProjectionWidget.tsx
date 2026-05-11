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
import { dot, fmt, norm, project, sub, type Vec2 } from "@/lib/linalg";

export function ProjectionWidget() {
  const [v, setV] = useState<Vec2>([2.6, 1.6]);
  const [u, setU] = useState<Vec2>([3, 0.4]);
  const world = { xMin: -4, xMax: 4, yMin: -3, yMax: 3 };
  const proj = project(v, u);
  const perp = sub(v, proj);
  const sScalar = norm(u) > 1e-9 ? dot(v, u) / norm(u) : 0;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <Stage
        width={560}
        height={360}
        world={world}
        ariaLabel="Projection of v onto u"
      >
        <Grid />
        <Axes />
        {/* Line through origin along u */}
        <LineSeg
          from={[u[0] * 5, u[1] * 5]}
          to={[-u[0] * 5, -u[1] * 5]}
          color={vizColors.w}
          opacity={0.25}
          width={1}
        />
        <Arrow to={v} color={vizColors.v} width={2.4} label="v" />
        <Arrow to={u} color={vizColors.w} width={2.4} label="u" />
        <Arrow
          to={proj}
          color={vizColors.sum}
          width={3}
          label="proj_u v"
        />
        <LineSeg from={v} to={proj} color={vizColors.sum} dashed opacity={0.7} />
        <DragPoint value={v} onChange={setV} color={vizColors.v} bounds={world} />
        <DragPoint value={u} onChange={setU} color={vizColors.w} bounds={world} />
      </Stage>
      <div className="space-y-3">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">proj_u v</span>
            <span className="text-ink">
              ({fmt(proj[0])}, {fmt(proj[1])})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">|projection|</span>
            <span className="text-ink">{fmt(norm(proj))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">v · û</span>
            <span className="text-ink">{fmt(sScalar, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">|residual|</span>
            <span className="text-ink">{fmt(norm(perp))}</span>
          </div>
        </div>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          The projection is the shadow of <span className="font-mono">v</span>{" "}
          on the line through <span className="font-mono">u</span>. Drop
          straight down: that residual is perpendicular to{" "}
          <span className="font-mono">u</span>.
        </p>
      </div>
    </div>
  );
}
