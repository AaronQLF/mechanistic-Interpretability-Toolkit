"use client";

import { useMemo, useState } from "react";

type Node = {
  id: string;
  label: string;
  layer: number;
  pos: number;
  group: "input" | "feature" | "output";
};

type Edge = { from: string; to: string; weight: number };

const NODES: Node[] = [
  { id: "tok_dallas", label: "“Dallas”", layer: 0, pos: 0, group: "input" },
  { id: "tok_capital", label: "“capital”", layer: 0, pos: 1, group: "input" },

  { id: "f_state_tx", label: "state: Texas", layer: 1, pos: 0, group: "feature" },
  { id: "f_us_state", label: "is-US-state", layer: 1, pos: 1, group: "feature" },
  { id: "f_question", label: "is-question", layer: 1, pos: 2, group: "feature" },

  { id: "f_capital_lookup", label: "capital-of(·)", layer: 2, pos: 0, group: "feature" },
  { id: "f_us_capital", label: "US-capital", layer: 2, pos: 1, group: "feature" },
  { id: "f_state_capital", label: "state-capital", layer: 2, pos: 2, group: "feature" },

  { id: "f_austin_dir", label: "→ Austin", layer: 3, pos: 0, group: "feature" },
  { id: "f_houston_dir", label: "→ Houston", layer: 3, pos: 1, group: "feature" },

  { id: "out", label: "logit: Austin", layer: 4, pos: 0, group: "output" },
];

const EDGES: Edge[] = [
  { from: "tok_dallas", to: "f_state_tx", weight: 0.82 },
  { from: "tok_dallas", to: "f_us_state", weight: 0.6 },
  { from: "tok_dallas", to: "f_houston_dir", weight: 0.18 },
  { from: "tok_capital", to: "f_capital_lookup", weight: 0.78 },
  { from: "tok_capital", to: "f_us_capital", weight: 0.45 },
  { from: "tok_capital", to: "f_question", weight: 0.3 },

  { from: "f_state_tx", to: "f_state_capital", weight: 0.7 },
  { from: "f_state_tx", to: "f_austin_dir", weight: 0.55 },
  { from: "f_us_state", to: "f_state_capital", weight: 0.4 },
  { from: "f_capital_lookup", to: "f_state_capital", weight: 0.65 },
  { from: "f_capital_lookup", to: "f_us_capital", weight: 0.5 },
  { from: "f_us_capital", to: "f_state_capital", weight: 0.35 },

  { from: "f_state_capital", to: "f_austin_dir", weight: 0.85 },
  { from: "f_state_capital", to: "f_houston_dir", weight: 0.25 },

  { from: "f_austin_dir", to: "out", weight: 0.92 },
  { from: "f_houston_dir", to: "out", weight: 0.18 },
  { from: "f_question", to: "out", weight: 0.05 },
];

const LAYERS = 5;

export function AttributionGraphDemo() {
  const [selected, setSelected] = useState<string>("out");
  const [threshold, setThreshold] = useState(0.15);

  const W = 640;
  const H = 360;

  const nodeXY = useMemo(() => {
    const m = new Map<string, [number, number]>();
    const cols: Record<number, Node[]> = {};
    for (const n of NODES) {
      cols[n.layer] = cols[n.layer] || [];
      cols[n.layer].push(n);
    }
    for (let l = 0; l < LAYERS; l++) {
      const list = cols[l] || [];
      const colX = 60 + l * ((W - 120) / (LAYERS - 1));
      list.forEach((node, i) => {
        const y = 60 + ((H - 120) / Math.max(1, list.length)) * (i + 0.5);
        m.set(node.id, [colX, y]);
      });
    }
    return m;
  }, []);

  // Compute connected ancestors of selection
  const highlighted = useMemo(() => {
    const incoming: Record<string, Edge[]> = {};
    for (const e of EDGES) {
      if (e.weight < threshold) continue;
      incoming[e.to] = incoming[e.to] || [];
      incoming[e.to].push(e);
    }
    const seenN = new Set<string>([selected]);
    const seenE = new Set<string>();
    const stack = [selected];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      for (const e of incoming[cur] || []) {
        seenE.add(`${e.from}->${e.to}`);
        if (!seenN.has(e.from)) {
          seenN.add(e.from);
          stack.push(e.from);
        }
      }
    }
    return { nodes: seenN, edges: seenE };
  }, [selected, threshold]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          edge weight ≥
        </span>
        <input
          type="range"
          min={0.05}
          max={0.85}
          step={0.05}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-40 accent-amber-600"
        />
        <span className="text-ink-muted">{threshold.toFixed(2)}</span>
        <span className="ml-auto text-ink-subtle">click any node to trace its causes</span>
      </div>

      <div className="rounded-lg border border-line bg-paper-raised p-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label="Attribution graph"
        >
          {EDGES.map((e) => {
            if (e.weight < threshold) return null;
            const a = nodeXY.get(e.from)!;
            const b = nodeXY.get(e.to)!;
            const key = `${e.from}->${e.to}`;
            const hl = highlighted.edges.has(key);
            return (
              <line
                key={key}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke={hl ? "rgb(var(--accent))" : "rgb(var(--line))"}
                strokeWidth={Math.max(0.5, e.weight * 3)}
                opacity={hl ? 0.95 : 0.35}
              />
            );
          })}
          {NODES.map((n) => {
            const [x, y] = nodeXY.get(n.id)!;
            const hl = highlighted.nodes.has(n.id);
            const baseColor =
              n.group === "input"
                ? "rgb(var(--viz-x))"
                : n.group === "output"
                  ? "rgb(var(--viz-w))"
                  : "rgb(var(--accent))";
            return (
              <g
                key={n.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(n.id)}
              >
                <rect
                  x={x - 56}
                  y={y - 12}
                  width={112}
                  height={24}
                  rx={4}
                  fill={hl ? baseColor : "rgb(var(--paper-sunken))"}
                  stroke={hl ? baseColor : "rgb(var(--line))"}
                  strokeWidth={selected === n.id ? 2 : 1}
                  opacity={hl ? 0.85 : 0.95}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  fill={hl ? "white" : "rgb(var(--ink))"}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
          {[0, 1, 2, 3, 4].map((l) => {
            const x = 60 + l * ((W - 120) / (LAYERS - 1));
            return (
              <text
                key={l}
                x={x}
                y={H - 14}
                textAnchor="middle"
                fontSize={10}
                fill="rgb(var(--ink-subtle))"
                fontFamily="ui-monospace, monospace"
              >
                {l === 0 ? "tokens" : l === 4 ? "logits" : `layer ${l}`}
              </text>
            );
          })}
        </svg>
      </div>

      <p className="font-serif text-[12px] leading-relaxed text-ink-muted">
        A toy attribution graph for the prompt &ldquo;Dallas is in a state
        whose capital is&rdquo;. Each box is an SAE feature (or a token /
        logit); each edge is the strength of the causal contribution
        measured by attribution patching. Click a node to highlight every
        upstream feature whose contribution exceeds the threshold. This
        is the structure produced by the Anthropic &ldquo;circuit tracing&rdquo;
        line of work (Lindsey et al., 2025) &mdash; circuits expressed
        entirely in SAE-feature space rather than in raw heads and neurons.
      </p>
    </div>
  );
}
