"use client";

import { useMemo, useState } from "react";
import { pct } from "@/lib/prob";

type Preset = "sum-7" | "doubles" | "either-six" | "custom";

const PRESETS: Record<Exclude<Preset, "custom">, (d1: number, d2: number) => boolean> = {
  "sum-7": (a, b) => a + b === 7,
  doubles: (a, b) => a === b,
  "either-six": (a, b) => a === 6 || b === 6,
};

export function SampleSpaceGrid() {
  const [preset, setPreset] = useState<Preset>("sum-7");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const event = useMemo<Set<string>>(() => {
    if (preset === "custom") return picked;
    const fn = PRESETS[preset];
    const s = new Set<string>();
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        if (fn(i, j)) s.add(`${i},${j}`);
      }
    }
    return s;
  }, [preset, picked]);

  const total = 36;
  const eventSize = event.size;
  const prob = eventSize / total;

  const toggleCell = (i: number, j: number) => {
    const k = `${i},${j}`;
    setPreset("custom");
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const cell = 44;
  const padL = 28;
  const padT = 28;
  const w = padL + cell * 6 + 8;
  const h = padT + cell * 6 + 8;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="Sample space for rolling two dice; click outcomes to build an event"
        style={{ display: "block" }}
      >
        {/* axis labels */}
        {Array.from({ length: 6 }, (_, k) => (
          <text
            key={`x-${k}`}
            x={padL + k * cell + cell / 2}
            y={padT - 8}
            fontSize={11}
            fontFamily="ui-monospace, monospace"
            fill="rgb(var(--ink-muted))"
            textAnchor="middle"
          >
            {k + 1}
          </text>
        ))}
        {Array.from({ length: 6 }, (_, k) => (
          <text
            key={`y-${k}`}
            x={padL - 8}
            y={padT + k * cell + cell / 2 + 4}
            fontSize={11}
            fontFamily="ui-monospace, monospace"
            fill="rgb(var(--ink-muted))"
            textAnchor="end"
          >
            {k + 1}
          </text>
        ))}
        <text
          x={padL + 6 * cell / 2}
          y={14}
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
          textAnchor="middle"
        >
          die 1
        </text>
        <text
          x={6}
          y={padT + 6 * cell / 2}
          fontSize={11}
          fontFamily="ui-monospace, monospace"
          fill="rgb(var(--ink-subtle))"
          textAnchor="middle"
          transform={`rotate(-90, 6, ${padT + 6 * cell / 2})`}
        >
          die 2
        </text>

        {Array.from({ length: 6 }, (_, i) =>
          Array.from({ length: 6 }, (_, j) => {
            const d1 = i + 1;
            const d2 = j + 1;
            const key = `${d1},${d2}`;
            const inEvent = event.has(key);
            const x = padL + i * cell;
            const y = padT + j * cell;
            return (
              <g key={key} style={{ cursor: "pointer" }} onClick={() => toggleCell(d1, d2)}>
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={cell - 4}
                  height={cell - 4}
                  rx={4}
                  fill={inEvent ? "rgb(var(--accent))" : "rgb(var(--paper-raised))"}
                  stroke={inEvent ? "rgb(var(--accent))" : "rgb(var(--line))"}
                  strokeWidth={1}
                  opacity={inEvent ? 0.85 : 1}
                />
                <text
                  x={x + cell / 2}
                  y={y + cell / 2 + 4}
                  fontSize={11}
                  fontFamily="ui-monospace, monospace"
                  fill={inEvent ? "white" : "rgb(var(--ink-muted))"}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {d1 + d2}
                </text>
              </g>
            );
          })
        )}
      </svg>

      <div className="space-y-3 self-start">
        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-sans text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Pick an event
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "sum-7", label: "sum = 7" },
                { id: "doubles", label: "doubles" },
                { id: "either-six", label: "either is 6" },
                { id: "custom", label: "custom (click cells)" },
              ] as { id: Preset; label: string }[]
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (p.id === "custom") {
                    setPreset("custom");
                    if (picked.size === 0) {
                      const seed = new Set<string>();
                      seed.add("1,1");
                      seed.add("2,3");
                      setPicked(seed);
                    }
                  } else {
                    setPreset(p.id);
                  }
                }}
                className={[
                  "rounded-md border px-2 py-1 text-xs transition",
                  preset === p.id
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {p.label}
              </button>
            ))}
          </div>
          {preset === "custom" && (
            <button
              type="button"
              onClick={() => setPicked(new Set())}
              className="mt-3 w-full rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
          <Row label="|Ω|" value={String(total)} />
          <Row label="|A|" value={String(eventSize)} />
          <div className="my-2 border-t border-line" />
          <Row label="P(A) = |A| / |Ω|" value={`${eventSize}/${total}`} />
          <Row label="P(A)" value={prob.toFixed(4)} />
          <Row label="P(A)" value={pct(prob)} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
