"use client";

import { useMemo, useState } from "react";

const D = 8;
const M_DICT = 16;

// Build a random "dictionary" of M directions in R^D, each meant to stand
// for a single human-interpretable feature.
function makeDict(): { name: string; dir: number[] }[] {
  const NAMES = [
    "is_digit",
    "is_capital",
    "topic:animals",
    "topic:music",
    "topic:code",
    "person_name",
    "place_name",
    "verb_past",
    "negation",
    "question",
    "quote_open",
    "quote_close",
    "in_list",
    "first_token",
    "end_of_seq",
    "uncertain",
  ];
  let s = 11;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return (s / 233280) * 2 - 1;
  };
  return NAMES.map((name) => {
    const v = Array.from({ length: D }, () => r());
    const n = Math.sqrt(v.reduce((a, b) => a + b * b, 0));
    return { name, dir: v.map((x) => x / Math.max(n, 1e-9)) };
  });
}

const DICT = makeDict();

const PRESETS: { label: string; activeIdx: number[] }[] = [
  { label: "'\"Mary said 'Hi.\"'", activeIdx: [5, 10, 11] },
  { label: "'NOT a 4'", activeIdx: [0, 8] },
  { label: "'Beethoven wrote'", activeIdx: [3, 5, 7] },
  { label: "polysemantic mush", activeIdx: [0, 2, 5, 9, 13] },
];

function relu(x: number): number {
  return Math.max(0, x);
}

function buildResidual(activeIdx: number[]): number[] {
  // Sum of dictionary directions, scaled by random magnitudes per feature.
  const out = Array.from({ length: D }, () => 0);
  for (const i of activeIdx) {
    const mag = 0.7 + ((i * 13) % 7) * 0.07;
    for (let d = 0; d < D; d++) out[d] += mag * DICT[i].dir[d];
  }
  return out;
}

function encode(residual: number[]): number[] {
  // Encoder: cosine with each dictionary atom, ReLU.
  return DICT.map((entry) => {
    let s = 0;
    for (let d = 0; d < D; d++) s += residual[d] * entry.dir[d];
    return relu(s - 0.15);
  });
}

function decode(code: number[]): number[] {
  const out = Array.from({ length: D }, () => 0);
  for (let i = 0; i < M_DICT; i++) {
    if (code[i] === 0) continue;
    for (let d = 0; d < D; d++) out[d] += code[i] * DICT[i].dir[d];
  }
  return out;
}

export function SAEDemo() {
  const [presetIdx, setPresetIdx] = useState(0);

  const { residual, code, recon, l0 } = useMemo(() => {
    const r = buildResidual(PRESETS[presetIdx].activeIdx);
    const c = encode(r);
    const recon = decode(c);
    const l0 = c.filter((v) => v > 0.05).length;
    return { residual: r, code: c, recon, l0 };
  }, [presetIdx]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          input
        </span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPresetIdx(i)}
            className={[
              "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
              i === presetIdx
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_2fr_1fr]">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            residual stream <span className="normal-case">x ∈ ℝ⁸</span>
          </div>
          <div className="space-y-1">
            {residual.map((v, i) => (
              <Bar
                key={i}
                label={`d${i}`}
                value={v}
                range={2}
                color="rgb(var(--viz-v))"
              />
            ))}
          </div>
          <p className="mt-3 font-sans text-[11px] text-ink-muted">
            polysemantic — every coordinate mixes many features.
          </p>
        </div>

        <div className="rounded-lg border border-accent/40 bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-accent">
              SAE code <span className="normal-case">f(x) ∈ ℝ¹⁶</span>
            </span>
            <span className="font-sans text-[11px] text-ink-muted">
              ‖f‖₀ = {l0} of {M_DICT}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {DICT.map((entry, i) => (
              <div
                key={i}
                className={[
                  "flex items-center gap-2 rounded px-2 py-0.5",
                  code[i] > 0.05
                    ? "bg-[rgb(var(--accent-soft))]/40 text-ink"
                    : "text-ink-subtle",
                ].join(" ")}
                title={entry.name}
              >
                <span className="w-3 text-right">{i}</span>
                <span className="flex-1 truncate">{entry.name}</span>
                <span
                  className={
                    code[i] > 0.05 ? "text-accent" : "text-ink-subtle"
                  }
                >
                  {code[i] > 0.05 ? code[i].toFixed(2) : "·"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-sans text-[11px] text-ink-muted">
            Each fired entry is monosemantic — it stands for one
            named feature.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-xs">
          <div className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            reconstruction <span className="normal-case">x̂ = D f(x)</span>
          </div>
          <div className="space-y-1">
            {recon.map((v, i) => (
              <Bar
                key={i}
                label={`d${i}`}
                value={v}
                range={2}
                color="rgb(var(--accent))"
                ghost={residual[i]}
              />
            ))}
          </div>
          <p className="mt-3 font-sans text-[11px] text-ink-muted">
            should match the input — the SAE&apos;s training objective.
          </p>
        </div>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  range,
  color,
  ghost,
}: {
  label: string;
  value: number;
  range: number;
  color: string;
  ghost?: number;
}) {
  const pct = Math.max(0, Math.min(100, (Math.abs(value) / range) * 100));
  const neg = value < 0;
  const ghostPct =
    ghost !== undefined
      ? Math.max(0, Math.min(100, (Math.abs(ghost) / range) * 100))
      : 0;
  const ghostNeg = (ghost ?? 0) < 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-ink-subtle">{label}</span>
        <span className="text-ink-muted">
          {value >= 0 ? "+" : ""}
          {value.toFixed(2)}
        </span>
      </div>
      <div className="relative mt-0.5 h-2 rounded bg-paper">
        {ghost !== undefined && (
          <div
            className="absolute top-0 h-2 rounded"
            style={{
              width: `${ghostPct / 2}%`,
              [ghostNeg ? "right" : "left"]: "50%",
              background: "rgb(var(--ink-subtle))",
              opacity: 0.25,
            }}
          />
        )}
        <div
          className="absolute top-0 h-2 rounded"
          style={{
            width: `${pct / 2}%`,
            [neg ? "right" : "left"]: "50%",
            background: color,
          }}
        />
        <div className="absolute left-1/2 top-0 h-2 w-px bg-line" />
      </div>
    </div>
  );
}
