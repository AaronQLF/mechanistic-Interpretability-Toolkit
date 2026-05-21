"use client";

import { useState } from "react";

type Node = {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  kind: "embed" | "attn" | "mlp" | "logit";
};

type Edge = {
  from: string;
  to: string;
  label?: string;
  kind?: "main" | "secondary";
};

const NODES: Node[] = [
  { id: "e", label: "Embed", sublabel: "tokens → residual", x: 60, y: 200, kind: "embed" },
  { id: "h2_prev", label: "L2 H4", sublabel: "previous-token", x: 200, y: 100, kind: "attn" },
  { id: "h2_dup", label: "L2 H6", sublabel: "duplicate-token", x: 200, y: 300, kind: "attn" },
  { id: "h5_ind", label: "L5 H1", sublabel: "induction", x: 360, y: 100, kind: "attn" },
  { id: "h5_S", label: "L5 H8", sublabel: "S-inhibition", x: 360, y: 300, kind: "attn" },
  { id: "h7_name", label: "L7 H9", sublabel: "name-mover", x: 520, y: 200, kind: "attn" },
  { id: "u", label: "Unembed", sublabel: "→ logits", x: 680, y: 200, kind: "logit" },
];

const EDGES: Edge[] = [
  { from: "e", to: "h2_prev", label: "tokens", kind: "main" },
  { from: "e", to: "h2_dup", label: "tokens", kind: "main" },
  { from: "h2_prev", to: "h5_ind", label: "writes prev_token feature", kind: "main" },
  { from: "h2_dup", to: "h5_S", label: "writes duplicate feature", kind: "main" },
  { from: "h5_ind", to: "h7_name", label: "boosts attention to name", kind: "main" },
  { from: "h5_S", to: "h7_name", label: "suppresses subject 'S'", kind: "main" },
  { from: "h7_name", to: "u", label: "writes IO direction", kind: "main" },
  { from: "e", to: "h7_name", kind: "secondary" },
  { from: "e", to: "u", kind: "secondary" },
];

const W = 760;
const H = 380;
const NODE_W = 110;
const NODE_H = 56;

const KIND_COLORS: Record<Node["kind"], string> = {
  embed: "rgb(var(--ink-muted))",
  attn: "rgb(var(--accent))",
  mlp: "rgb(var(--viz-y))",
  logit: "rgb(var(--ink-muted))",
};

export function CircuitDiagram() {
  const [hover, setHover] = useState<string | null>(null);

  const reachable = (() => {
    if (!hover) return new Set<string>();
    const out = new Set<string>([hover]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const e of EDGES) {
        if (out.has(e.from) && !out.has(e.to)) {
          out.add(e.to);
          changed = true;
        }
      }
    }
    return out;
  })();

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        role="img"
        aria-label="A toy IOI-style circuit diagram"
      >
        <defs>
          <marker
            id="circarrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--ink-muted))" />
          </marker>
          <marker
            id="circarrow-accent"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--accent))" />
          </marker>
        </defs>

        {EDGES.map((e, i) => {
          const f = NODES.find((n) => n.id === e.from)!;
          const t = NODES.find((n) => n.id === e.to)!;
          const x1 = f.x + NODE_W;
          const y1 = f.y + NODE_H / 2;
          const x2 = t.x;
          const y2 = t.y + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          const isOnPath = hover && reachable.has(e.from) && reachable.has(e.to);
          const stroke = isOnPath
            ? "rgb(var(--accent))"
            : "rgb(var(--ink-muted))";
          const opacity =
            hover && !isOnPath
              ? 0.18
              : e.kind === "secondary"
                ? 0.4
                : 0.85;
          return (
            <g key={i} opacity={opacity}>
              <path
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={stroke}
                strokeWidth={isOnPath ? 1.8 : 1.2}
                strokeDasharray={e.kind === "secondary" ? "4 4" : undefined}
                markerEnd={
                  isOnPath ? "url(#circarrow-accent)" : "url(#circarrow)"
                }
              />
              {e.label && (
                <text
                  x={mx}
                  y={(y1 + y2) / 2 - 4}
                  fontSize={9}
                  fontFamily="ui-monospace, monospace"
                  fill={isOnPath ? "rgb(var(--accent))" : "rgb(var(--ink-subtle))"}
                  textAnchor="middle"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {NODES.map((n) => {
          const isOnPath = hover && reachable.has(n.id);
          const dim = hover && !isOnPath;
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
              opacity={dim ? 0.3 : 1}
            >
              <rect
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={
                  isOnPath
                    ? "rgb(var(--accent-soft))"
                    : n.kind === "embed" || n.kind === "logit"
                      ? "rgb(var(--paper-sunken))"
                      : "rgb(var(--paper-raised))"
                }
                stroke={isOnPath ? "rgb(var(--accent))" : KIND_COLORS[n.kind]}
                strokeWidth={isOnPath ? 1.8 : 1.2}
              />
              <text
                x={n.x + NODE_W / 2}
                y={n.y + 22}
                textAnchor="middle"
                fontSize={12}
                fontFamily="var(--font-inter), system-ui, sans-serif"
                fontWeight={600}
                fill="rgb(var(--ink))"
              >
                {n.label}
              </text>
              {n.sublabel && (
                <text
                  x={n.x + NODE_W / 2}
                  y={n.y + 40}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  fill="rgb(var(--ink-muted))"
                >
                  {n.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="font-serif text-xs leading-relaxed text-ink-muted">
        A simplified version of the IOI circuit (Wang et al. 2022). Six
        named heads in three layers, plus embed and unembed. Hover any
        node to highlight everything downstream of it. Solid edges are
        the &ldquo;main&rdquo; circuit; dashed edges are residual paths
        the analysis chose to ignore.
      </p>
    </div>
  );
}
