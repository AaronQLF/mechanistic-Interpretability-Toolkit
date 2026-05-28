"use client";

import { useState } from "react";

type Mode = "sae" | "transcoder" | "skip-transcoder";

const MODES: { id: Mode; label: string; tag: string }[] = [
  { id: "sae", label: "Standard SAE", tag: "input → input" },
  { id: "transcoder", label: "Transcoder", tag: "MLP-in → MLP-out" },
  { id: "skip-transcoder", label: "Skip-transcoder", tag: "+ residual passthrough" },
];

export function TranscoderDiagram() {
  const [mode, setMode] = useState<Mode>("sae");

  const W = 560;
  const H = 240;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          architecture
        </span>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={[
              "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
              mode === m.id
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {m.label}
            <span className="ml-2 text-[10px] opacity-70">{m.tag}</span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-paper-raised p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label="Transcoder diagram"
        >
          <Box x={20} y={90} w={80} label="resid (in)" subLabel="x" />

          <Box x={140} y={90} w={80} label="MLP" subLabel="frozen" filled />

          <Box x={260} y={90} w={80} label="resid (out)" subLabel="x + MLP(x)" />

          <Arrow x1={100} y1={102} x2={140} y2={102} />
          <Arrow x1={220} y1={102} x2={260} y2={102} />

          {mode === "sae" && (
            <g>
              <Box x={140} y={20} w={80} label="SAE" subLabel="reconstruct x" highlight />
              <Arrow x1={60} y1={90} x2={150} y2={42} curve />
              <Arrow x1={180} y1={42} x2={75} y2={90} curve dashed />
              <text
                x={W / 2}
                y={210}
                textAnchor="middle"
                fontSize={11}
                fill="rgb(var(--ink-muted))"
                fontFamily="ui-monospace, monospace"
              >
                SAE objective: ‖x − x̂‖² + λ‖f‖₁ &nbsp; (reconstruct, ignore the MLP)
              </text>
            </g>
          )}

          {mode === "transcoder" && (
            <g>
              <Box x={140} y={20} w={80} label="Transcoder" subLabel="predict MLP(x)" highlight />
              <Arrow x1={60} y1={90} x2={150} y2={42} curve />
              <Arrow x1={180} y1={42} x2={300} y2={90} curve dashed accent />
              <text
                x={W / 2}
                y={210}
                textAnchor="middle"
                fontSize={11}
                fill="rgb(var(--ink-muted))"
                fontFamily="ui-monospace, monospace"
              >
                Transcoder objective: ‖MLP(x) − ĝ(x)‖² + λ‖f‖₁ &nbsp; (replace the MLP)
              </text>
            </g>
          )}

          {mode === "skip-transcoder" && (
            <g>
              <Box
                x={140}
                y={20}
                w={80}
                label="Skip-TC"
                subLabel="predict MLP(x)"
                highlight
              />
              <Arrow x1={60} y1={90} x2={150} y2={42} curve />
              <Arrow x1={180} y1={42} x2={300} y2={90} curve dashed accent />
              <Arrow x1={75} y1={120} x2={295} y2={120} dashed accent />
              <text
                x={185}
                y={138}
                fontSize={10}
                textAnchor="middle"
                fill="rgb(var(--accent))"
                fontFamily="ui-monospace, monospace"
              >
                residual passthrough
              </text>
              <text
                x={W / 2}
                y={210}
                textAnchor="middle"
                fontSize={11}
                fill="rgb(var(--ink-muted))"
                fontFamily="ui-monospace, monospace"
              >
                Skip-transcoder: low-rank linear path + sparse nonlinear features
              </text>
            </g>
          )}
        </svg>

        <p className="mt-3 font-serif text-[12px] leading-relaxed text-ink-muted">
          {mode === "sae" &&
            "Standard SAE: train to reconstruct the activation at one site; the underlying MLP/attention block is left untouched. The SAE is a 'lens' onto the residual stream — it observes, it doesn't replace."}
          {mode === "transcoder" &&
            "Transcoder (Marks et al., Dunefsky et al. 2024): instead of reconstructing the input, predict the *output* of a frozen MLP from the SAE's sparse code. The trained dictionary now describes what the MLP does, not just what the activation looks like — and you can swap it in for the MLP at inference time."}
          {mode === "skip-transcoder" &&
            "Skip-transcoder: add a low-rank linear path so the sparse features only have to capture what the linear path can't. Empirically, much better fidelity at the same sparsity, because activation manifolds have a strong linear component the L1 was wasting capacity on."}
        </p>
      </div>
    </div>
  );
}

function Box({
  x,
  y,
  w,
  label,
  subLabel,
  filled,
  highlight,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  subLabel?: string;
  filled?: boolean;
  highlight?: boolean;
}) {
  const fill = highlight
    ? "rgb(var(--accent))"
    : filled
      ? "rgb(var(--paper-sunken))"
      : "rgb(var(--paper))";
  const stroke = highlight ? "rgb(var(--accent))" : "rgb(var(--line))";
  const text = highlight ? "white" : "rgb(var(--ink))";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={28}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.2}
      />
      <text
        x={x + w / 2}
        y={y + 12}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        fill={text}
        fontWeight={600}
      >
        {label}
      </text>
      {subLabel && (
        <text
          x={x + w / 2}
          y={y + 24}
          textAnchor="middle"
          fontSize={9}
          fontFamily="ui-monospace, monospace"
          fill={text}
          opacity={0.85}
        >
          {subLabel}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  curve,
  dashed,
  accent,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curve?: boolean;
  dashed?: boolean;
  accent?: boolean;
}) {
  const color = accent ? "rgb(var(--accent))" : "rgb(var(--ink-muted))";
  const d = curve
    ? `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 24}, ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - Math.cos(angle) * 6;
  const ay = y2 - Math.sin(angle) * 6;
  const px = -Math.sin(angle) * 4;
  const py = Math.cos(angle) * 4;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`}
        fill={color}
      />
    </g>
  );
}
