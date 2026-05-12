"use client";

import { useState } from "react";
import { dsigmoid, fmt, sigmoid } from "@/lib/calc";

/**
 * A small computation graph:
 *
 *     x ──╮
 *          mul ── y ──╮
 *     a ──╯           add ── z ── σ ── s ── (·−t)² ── L
 *                 b ──╯              t ──────╯
 *
 * Forward (with named intermediates):
 *   y = a · x
 *   z = y + b
 *   s = σ(z)
 *   L = (s − t)²
 *
 * Backward (gradients of L):
 *   dL/ds = 2 (s − t)
 *   dL/dz = dL/ds · σ ′(z) = dL/ds · s (1 − s)
 *   dL/dy = dL/dz                 (since z = y + b)
 *   dL/db = dL/dz                 (since z = y + b)
 *   dL/dx = dL/dy · a             (since y = a · x)
 *   dL/da = dL/dy · x             (since y = a · x)
 */

export function BackpropToy() {
  const [x, setX] = useState(0.6);
  const [a, setA] = useState(1.2);
  const [b, setB] = useState(-0.3);
  const [t, setT] = useState(0.8);

  // Forward
  const y = a * x;
  const z = y + b;
  const s = sigmoid(z);
  const L = (s - t) * (s - t);

  // Backward
  const dLds = 2 * (s - t);
  const dLdz = dLds * dsigmoid(z);
  const dLdy = dLdz;
  const dLdb = dLdz;
  const dLdx = dLdy * a;
  const dLda = dLdy * x;

  // Layout — we hand-position nodes for clarity
  const w = 700;
  const h = 280;

  // x positions of node columns
  const cols = {
    inputs: 60,
    mul: 200,
    add: 320,
    sigma: 440,
    sub: 560,
    loss: 660,
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width="100%"
          role="img"
          aria-label="Computation graph with forward values and backward gradients"
        >
          {/* Edges first, so nodes sit on top */}
          <Edge from={[cols.inputs, 60]} to={[cols.mul, 100]} label="x" forward={fmt(x, 3)} backward={fmt(dLdx, 3)} />
          <Edge from={[cols.inputs, 110]} to={[cols.mul, 110]} label="a" forward={fmt(a, 3)} backward={fmt(dLda, 3)} />
          <Edge from={[cols.mul, 105]} to={[cols.add, 110]} label="y = a·x" forward={fmt(y, 3)} backward={fmt(dLdy, 3)} />
          <Edge from={[cols.inputs, 170]} to={[cols.add, 125]} label="b" forward={fmt(b, 3)} backward={fmt(dLdb, 3)} />
          <Edge from={[cols.add, 115]} to={[cols.sigma, 120]} label="z = y + b" forward={fmt(z, 3)} backward={fmt(dLdz, 3)} />
          <Edge from={[cols.sigma, 120]} to={[cols.sub, 110]} label="s = σ(z)" forward={fmt(s, 3)} backward={fmt(dLds, 3)} />
          <Edge from={[cols.inputs, 230]} to={[cols.sub, 130]} label="t" forward={fmt(t, 3)} backward="—" muted />
          <Edge from={[cols.sub, 120]} to={[cols.loss, 120]} label="L" forward={fmt(L, 4)} backward="1.000" highlight />

          {/* Input nodes */}
          <Node x={cols.inputs} y={60} label="x" value={fmt(x, 2)} />
          <Node x={cols.inputs} y={110} label="a" value={fmt(a, 2)} />
          <Node x={cols.inputs} y={170} label="b" value={fmt(b, 2)} />
          <Node x={cols.inputs} y={230} label="t" value={fmt(t, 2)} dim />
          {/* Operations */}
          <OpNode x={cols.mul} y={105} label="×" />
          <OpNode x={cols.add} y={115} label="+" />
          <OpNode x={cols.sigma} y={120} label="σ" />
          <OpNode x={cols.sub} y={120} label="(·−t)²" small />
          <Node x={cols.loss} y={120} label="L" value={fmt(L, 3)} accent />
        </svg>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Inputs (drag any slider)
          </div>
          <Slider label="x" value={x} min={-2} max={2} step={0.01} onChange={setX} />
          <Slider label="a" value={a} min={-3} max={3} step={0.01} onChange={setA} />
          <Slider label="b" value={b} min={-3} max={3} step={0.01} onChange={setB} />
          <Slider label="target  t" value={t} min={0} max={1} step={0.01} onChange={setT} />
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <div className="mb-1 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            forward
          </div>
          <Row label="y = a·x" value={fmt(y, 4)} />
          <Row label="z = y + b" value={fmt(z, 4)} />
          <Row label="s = σ(z)" value={fmt(s, 4)} />
          <Row label="L = (s − t)²" value={fmt(L, 4)} highlight />
          <div className="my-2 border-t border-line" />
          <div className="mb-1 font-sans text-xs uppercase tracking-wide text-ink-subtle">
            backward (chain rule)
          </div>
          <Row label="dL/ds  = 2(s − t)" value={fmt(dLds, 4)} />
          <Row label="dL/dz  = dL/ds · σ ′(z)" value={fmt(dLdz, 4)} />
          <Row label="dL/dy  = dL/dz" value={fmt(dLdy, 4)} />
          <Row label="dL/db  = dL/dz" value={fmt(dLdb, 4)} accent />
          <Row label="dL/dx  = dL/dy · a" value={fmt(dLdx, 4)} />
          <Row label="dL/da  = dL/dy · x" value={fmt(dLda, 4)} accent />
        </div>
      </div>
    </div>
  );
}

function Edge({
  from,
  to,
  label,
  forward,
  backward,
  highlight,
  muted,
}: {
  from: [number, number];
  to: [number, number];
  label: string;
  forward: string;
  backward: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const stroke = highlight
    ? "rgb(var(--accent))"
    : muted
      ? "rgb(var(--ink-subtle))"
      : "rgb(var(--ink-muted))";
  return (
    <g opacity={muted ? 0.6 : 1}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={highlight ? 2 : 1.2}
        strokeLinecap="round"
      />
      <g>
        <rect
          x={mx - 38}
          y={my - 22}
          width={76}
          height={36}
          rx={4}
          fill="rgb(var(--paper-raised))"
          stroke={stroke}
          strokeWidth={0.6}
          opacity={0.92}
        />
        <text
          x={mx}
          y={my - 11}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-muted))"
          textAnchor="middle"
        >
          {label}
        </text>
        <text
          x={mx}
          y={my + 1}
          fontSize={10.5}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--viz-v))"
          textAnchor="middle"
        >
          ↦ {forward}
        </text>
        <text
          x={mx}
          y={my + 12}
          fontSize={10.5}
          fontFamily="ui-monospace, monospace"
          fill={highlight ? "rgb(var(--accent))" : "rgb(var(--viz-w))"}
          textAnchor="middle"
        >
          ∂L {backward}
        </text>
      </g>
    </g>
  );
}

function Node({
  x,
  y,
  label,
  value,
  accent,
  dim,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  accent?: boolean;
  dim?: boolean;
}) {
  const fill = accent
    ? "rgb(var(--accent))"
    : dim
      ? "rgb(var(--paper-sunken))"
      : "rgb(var(--paper-raised))";
  const stroke = accent ? "rgb(var(--accent))" : "rgb(var(--line))";
  const textFill = accent ? "white" : "rgb(var(--ink))";
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text
        x={x}
        y={y - 1}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        fontWeight={600}
        fill={textFill}
      >
        {label}
      </text>
      <text
        x={x}
        y={y + 11}
        textAnchor="middle"
        fontSize={9.5}
        fontFamily="ui-monospace, monospace"
        fill={textFill}
        opacity={0.85}
      >
        {value}
      </text>
    </g>
  );
}

function OpNode({
  x,
  y,
  label,
  small,
}: {
  x: number;
  y: number;
  label: string;
  small?: boolean;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={16}
        fill="rgb(var(--paper-sunken))"
        stroke="rgb(var(--ink-muted))"
        strokeWidth={1.2}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={small ? 9 : 13}
        fontFamily="ui-monospace, monospace"
        fontWeight={600}
        fill="rgb(var(--ink))"
      >
        {label}
      </text>
    </g>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wide text-ink-subtle">
          {label}
        </span>
        <span className="font-mono text-ink">{fmt(value, 2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-amber-600"
      />
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between py-0.5",
        highlight ? "text-accent" : "",
        accent ? "text-ink" : "",
      ].join(" ")}
    >
      <span className={highlight ? "text-accent" : "text-ink-muted"}>{label}</span>
      <span className={highlight ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
