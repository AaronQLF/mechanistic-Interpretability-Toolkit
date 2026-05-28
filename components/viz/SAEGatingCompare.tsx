"use client";

import { useMemo, useState } from "react";

const N_FEATURES = 32;

function buildPreActs(seed: number): number[] {
  let s = seed;
  const r = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  const out: number[] = [];
  for (let i = 0; i < N_FEATURES; i++) {
    const u1 = Math.max(1e-6, r());
    const u2 = r();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const heavy = r() < 0.18 ? 2.5 + r() * 2.0 : 0;
    out.push(0.6 * z + heavy - 0.2);
  }
  return out;
}

type Method = "vanilla" | "topk" | "jumprelu" | "gated";

const METHODS: { id: Method; label: string; tag: string; color: string }[] = [
  { id: "vanilla", label: "Vanilla (L1)", tag: "Anthropic 2023", color: "rgb(var(--viz-v))" },
  { id: "topk", label: "Top-K", tag: "OpenAI / Gao 2024", color: "rgb(var(--viz-w))" },
  { id: "jumprelu", label: "JumpReLU", tag: "DeepMind 2024", color: "rgb(var(--viz-eigen))" },
  { id: "gated", label: "Gated", tag: "Rajamanoharan 2024", color: "rgb(var(--accent))" },
];

function gate(method: Method, pre: number[], knob: number): number[] {
  const n = pre.length;
  const out = new Array(n).fill(0);

  if (method === "vanilla") {
    // ReLU(z - b), with L1 shrinkage by knob: post = max(0, z - knob)
    for (let i = 0; i < n; i++) out[i] = Math.max(0, pre[i] - knob);
    return out;
  }
  if (method === "topk") {
    const k = Math.max(1, Math.round(knob));
    const idx = pre
      .map((v, i) => [v, i] as [number, number])
      .sort((a, b) => b[0] - a[0])
      .slice(0, k)
      .map((p) => p[1]);
    for (const i of idx) if (pre[i] > 0) out[i] = pre[i];
    return out;
  }
  if (method === "jumprelu") {
    // f_i = z_i * H(z_i - theta). No shrinkage on magnitude.
    for (let i = 0; i < n; i++) out[i] = pre[i] > knob ? pre[i] : 0;
    return out;
  }
  // gated: separate gate (binary) and magnitude (ReLU on its own pre-act).
  // Use the same pre as gate; magnitude is a bias-shifted version with NO threshold shrinkage.
  for (let i = 0; i < n; i++) {
    const fire = pre[i] > knob;
    out[i] = fire ? Math.max(0, pre[i] - 0.0) : 0;
  }
  return out;
}

export function SAEGatingCompare() {
  const [seed, setSeed] = useState(7);
  const [method, setMethod] = useState<Method>("vanilla");
  const [knobVanilla, setKnobVanilla] = useState(0.6);
  const [knobTopk, setKnobTopk] = useState(6);
  const [knobJump, setKnobJump] = useState(0.6);
  const [knobGated, setKnobGated] = useState(0.6);

  const knob =
    method === "vanilla"
      ? knobVanilla
      : method === "topk"
        ? knobTopk
        : method === "jumprelu"
          ? knobJump
          : knobGated;

  const pre = useMemo(() => buildPreActs(seed), [seed]);

  const post = useMemo(() => gate(method, pre, knob), [method, pre, knob]);
  const l0 = post.filter((v) => v > 1e-6).length;
  const recon = post.reduce((a, b) => a + b * b, 0);
  const reconRef = pre.reduce((a, b) => a + Math.max(0, b) * Math.max(0, b), 0);
  const fidelity = reconRef > 0 ? recon / reconRef : 0;

  const meta = METHODS.find((m) => m.id === method)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          gating method
        </span>
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={[
              "rounded-md border px-2.5 py-1 font-mono text-[11px] transition",
              method === m.id
                ? "border-accent bg-accent text-white"
                : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="ml-auto rounded-md border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
        >
          new sample
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper-sunken p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            {meta.label}
            <span className="ml-2 font-mono text-[10px] text-ink-subtle/70">
              {meta.tag}
            </span>
          </span>
          <span className="font-mono text-[11px] text-ink-muted">
            ‖f‖₀ = {l0} / {N_FEATURES} &nbsp;·&nbsp; energy {(fidelity * 100).toFixed(0)}%
          </span>
        </div>

        <div className="mb-3 grid grid-cols-[6rem_1fr_3rem] items-center gap-3 font-mono text-[11px]">
          <span className="text-ink-subtle">
            {method === "topk" ? "k" : "threshold"}
          </span>
          <input
            type="range"
            min={method === "topk" ? 1 : 0}
            max={method === "topk" ? 24 : 2.5}
            step={method === "topk" ? 1 : 0.05}
            value={knob}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (method === "vanilla") setKnobVanilla(v);
              else if (method === "topk") setKnobTopk(v);
              else if (method === "jumprelu") setKnobJump(v);
              else setKnobGated(v);
            }}
            className="w-full accent-amber-600"
          />
          <span className="text-right text-ink-muted">
            {method === "topk" ? knob.toFixed(0) : knob.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
          {pre.map((v, i) => (
            <FeatureBar
              key={i}
              idx={i}
              pre={v}
              post={post[i]}
              color={meta.color}
            />
          ))}
        </div>

        <p className="mt-3 font-serif text-[12px] leading-relaxed text-ink-muted">
          {method === "vanilla" &&
            "Vanilla L1: every feature is gated by the same ReLU bias and the L1 penalty shrinks every surviving magnitude. Slide the threshold up; tiny features die first."}
          {method === "topk" &&
            "Top-K: keep the k largest pre-activations, zero everything else. No magnitude shrinkage — the surviving features keep their full size."}
          {method === "jumprelu" &&
            "JumpReLU: identity above a per-feature threshold, zero below. The discontinuous step decouples 'should I fire?' from 'how much?'."}
          {method === "gated" &&
            "Gated SAE: a binary gate decides whether to fire, a separate magnitude head decides how much. Trained with two losses, one per head."}
        </p>
      </div>
    </div>
  );
}

function FeatureBar({
  idx,
  pre,
  post,
  color,
}: {
  idx: number;
  pre: number;
  post: number;
  color: string;
}) {
  const range = 4;
  const prePct = Math.max(0, Math.min(100, (Math.abs(pre) / range) * 100));
  const postPct = Math.max(0, Math.min(100, (post / range) * 100));
  const preNeg = pre < 0;
  const fired = post > 1e-6;
  return (
    <div className="font-mono text-[10px]">
      <div className="flex items-center justify-between">
        <span className="text-ink-subtle">f{idx}</span>
        <span className={fired ? "text-ink" : "text-ink-subtle/50"}>
          {fired ? post.toFixed(2) : "·"}
        </span>
      </div>
      <div className="relative mt-0.5 h-2 rounded bg-paper">
        <div
          className="absolute top-0 h-2 rounded"
          style={{
            width: `${prePct / 2}%`,
            [preNeg ? "right" : "left"]: "50%",
            background: "rgb(var(--ink-subtle))",
            opacity: 0.25,
          }}
        />
        {fired && (
          <div
            className="absolute top-0 h-2 rounded"
            style={{
              width: `${postPct / 2}%`,
              left: "50%",
              background: color,
            }}
          />
        )}
        <div className="absolute left-1/2 top-0 h-2 w-px bg-line" />
      </div>
    </div>
  );
}
