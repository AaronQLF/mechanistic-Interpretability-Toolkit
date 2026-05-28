"use client";

import { useMemo, useState } from "react";

type GroundTruth = {
  parent: string;
  children: { label: string; angle: number; weight: number }[];
};

const PARENT_FEATURES: GroundTruth[] = [
  {
    parent: "dog",
    children: [
      { label: "dog (small / lap)", angle: -0.25, weight: 0.85 },
      { label: "dog (working / large)", angle: 0.0, weight: 1.0 },
      { label: "dog (puppy)", angle: 0.22, weight: 0.7 },
      { label: "dog (in idiom)", angle: 0.55, weight: 0.55 },
    ],
  },
  {
    parent: "Paris",
    children: [
      { label: "Paris (city, geography)", angle: -0.18, weight: 0.95 },
      { label: "Paris (mythology)", angle: 0.4, weight: 0.5 },
      { label: "Paris (in 'Paris Hilton')", angle: 0.85, weight: 0.6 },
    ],
  },
  {
    parent: "if-clause",
    children: [
      { label: "if-condition (math)", angle: -0.3, weight: 0.85 },
      { label: "if-condition (code)", angle: 0.05, weight: 0.95 },
      { label: "if-condition (NL hypothetical)", angle: 0.3, weight: 0.8 },
      { label: "if-condition (legal)", angle: 0.6, weight: 0.55 },
    ],
  },
];

type Atom = { angle: number; coverage: number; assignedTo: number; idx: number };

function buildAtoms(parent: GroundTruth, m: number): Atom[] {
  const atoms: Atom[] = [];
  if (m === 1) {
    atoms.push({ angle: 0.05, coverage: 0.6, assignedTo: -1, idx: 0 });
    return atoms;
  }
  if (m === 2) {
    atoms.push({ angle: -0.1, coverage: 0.7, assignedTo: -1, idx: 0 });
    atoms.push({ angle: 0.25, coverage: 0.55, assignedTo: -1, idx: 1 });
    return atoms;
  }
  for (let i = 0; i < m; i++) {
    const t = (i + 0.5) / m;
    const angle = -0.45 + t * 1.5;
    const coverage = 0.5 + 0.5 * Math.exp(-Math.pow((angle - 0.05) / 0.6, 2));
    atoms.push({ angle, coverage, assignedTo: -1, idx: i });
  }
  return atoms;
}

function assignAtoms(atoms: Atom[], parent: GroundTruth): Atom[] {
  return atoms.map((a) => {
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let j = 0; j < parent.children.length; j++) {
      const d = Math.abs(parent.children[j].angle - a.angle);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = j;
      }
    }
    return { ...a, assignedTo: bestDist < 0.18 ? bestIdx : -1 };
  });
}

const WIDTHS = [1, 2, 4, 8, 16, 32];

export function FeatureSplittingDemo() {
  const [parentIdx, setParentIdx] = useState(0);
  const [widthIdx, setWidthIdx] = useState(2);
  const parent = PARENT_FEATURES[parentIdx];
  const m = WIDTHS[widthIdx];

  const atoms = useMemo(() => assignAtoms(buildAtoms(parent, m), parent), [parent, m]);

  const covered = new Set(atoms.map((a) => a.assignedTo).filter((v) => v >= 0));
  const childCoverage = parent.children.map((c, j) => covered.has(j));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          ground-truth feature
        </span>
        {PARENT_FEATURES.map((p, i) => (
          <button
            key={p.parent}
            type="button"
            onClick={() => setParentIdx(i)}
            className={[
              "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
              parentIdx === i
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {p.parent}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-paper-sunken p-4">
        <div className="mb-3 grid grid-cols-[7rem_1fr_4rem] items-center gap-3 font-mono text-[11px]">
          <span className="text-ink-subtle">dictionary width</span>
          <input
            type="range"
            min={0}
            max={WIDTHS.length - 1}
            step={1}
            value={widthIdx}
            onChange={(e) => setWidthIdx(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
          <span className="text-right text-ink-muted">m = {m}d</span>
        </div>

        <SplittingCanvas atoms={atoms} parent={parent} />

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <div className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
              ground-truth sub-features
            </div>
            <ul className="space-y-1 font-mono text-[11px]">
              {parent.children.map((c, j) => (
                <li
                  key={j}
                  className="flex items-center justify-between rounded border border-line bg-paper px-2 py-1"
                >
                  <span className="text-ink">{c.label}</span>
                  <span
                    className={
                      childCoverage[j]
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {childCoverage[j] ? "covered" : "missed"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
              what the SAE finds
            </div>
            <ul className="space-y-1 font-mono text-[11px]">
              {atoms.map((a) => (
                <li
                  key={a.idx}
                  className="flex items-center justify-between rounded border border-line bg-paper px-2 py-1"
                >
                  <span>atom {a.idx}</span>
                  <span className="text-ink-muted">
                    {a.assignedTo >= 0
                      ? `→ ${parent.children[a.assignedTo].label}`
                      : "polysemantic / unassigned"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 font-serif text-[12px] leading-relaxed text-ink-muted">
          Slide the dictionary width. At <span className="font-mono">m = 1d</span>{" "}
          one polysemantic atom averages the whole concept; at{" "}
          <span className="font-mono">m = 2-4d</span> the SAE splits it into a
          few coarse sub-features; past <span className="font-mono">8-16d</span>{" "}
          you start over-splitting (multiple atoms for the same sub-feature).
          This is the &ldquo;feature splitting&rdquo; observation from
          Templeton et al. 2024.
        </p>
      </div>
    </div>
  );
}

function SplittingCanvas({
  atoms,
  parent,
}: {
  atoms: Atom[];
  parent: GroundTruth;
}) {
  const W = 540;
  const H = 220;
  const cx = W / 2;
  const cy = H / 2 + 30;
  const R = 80;

  function angleToXY(angle: number, r: number): [number, number] {
    const a = -Math.PI / 2 + angle;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block" }}
      role="img"
      aria-label="Feature splitting"
    >
      <text
        x={cx}
        y={20}
        textAnchor="middle"
        fill="rgb(var(--ink-muted))"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
      >
        feature space (1-D slice through residual stream)
      </text>

      <line
        x1={cx - R - 30}
        y1={cy}
        x2={cx + R + 30}
        y2={cy}
        stroke="rgb(var(--line))"
        strokeWidth={1}
      />

      {parent.children.map((c, j) => {
        const x = cx + c.angle * (R + 20);
        return (
          <g key={j}>
            <circle cx={x} cy={cy} r={5 + c.weight * 5} fill="rgb(var(--ink))" opacity={0.18} />
            <circle cx={x} cy={cy} r={3} fill="rgb(var(--ink))" />
            <text
              x={x}
              y={cy - 12}
              textAnchor="middle"
              fontSize={10}
              fill="rgb(var(--ink-muted))"
              fontFamily="ui-monospace, monospace"
            >
              {c.label.split(" (")[1]?.replace(")", "") ?? c.label}
            </text>
          </g>
        );
      })}

      {atoms.map((a) => {
        const x = cx + a.angle * (R + 20);
        const y = cy + 28;
        const color =
          a.assignedTo >= 0
            ? "rgb(var(--accent))"
            : "rgb(var(--ink-subtle))";
        const ax = cx + (parent.children[a.assignedTo]?.angle ?? a.angle) * (R + 20);
        return (
          <g key={a.idx}>
            {a.assignedTo >= 0 && (
              <line
                x1={x}
                y1={y - 2}
                x2={ax}
                y2={cy + 4}
                stroke={color}
                strokeWidth={1}
                opacity={0.6}
                strokeDasharray="3 3"
              />
            )}
            <rect
              x={x - 4}
              y={y - 4}
              width={8}
              height={8}
              rx={1.5}
              fill={color}
              opacity={a.assignedTo >= 0 ? 1 : 0.6}
            />
          </g>
        );
      })}

      <text
        x={cx}
        y={cy + 60}
        textAnchor="middle"
        fontSize={10}
        fill="rgb(var(--ink-muted))"
        fontFamily="ui-monospace, monospace"
      >
        SAE atoms (squares) below; ground-truth sub-features (dots) above.
      </text>
    </svg>
  );
}
