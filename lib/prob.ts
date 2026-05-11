// Small probability helpers used by the Probability module widgets.
// All functions are pure. Conventions:
//   - "dist" or "p" is an array of non-negative numbers that sum to 1
//   - logarithms are in bits (base 2) by default; pass base = Math.E for nats
//   - "logits" is an array of real numbers passed through softmax to get a dist

const EPS = 1e-12;

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export function sum(xs: readonly number[]): number {
  let s = 0;
  for (const x of xs) s += x;
  return s;
}

/** Normalize a vector of non-negative weights into a distribution. */
export function normalize(weights: readonly number[]): number[] {
  const total = sum(weights);
  if (total < EPS) return weights.map(() => 0);
  return weights.map((w) => Math.max(0, w) / total);
}

/** Numerically stable softmax with optional temperature. */
export function softmax(
  logits: readonly number[],
  temperature = 1
): number[] {
  const t = Math.max(EPS, temperature);
  const scaled = logits.map((l) => l / t);
  const m = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - m));
  const z = sum(exps);
  return exps.map((e) => e / z);
}

/** Entropy of a distribution, default base 2 (bits). */
export function entropy(p: readonly number[], base = 2): number {
  const lnBase = Math.log(base);
  let h = 0;
  for (const pi of p) {
    if (pi > EPS) h -= (pi * Math.log(pi)) / lnBase;
  }
  return h;
}

/** Cross-entropy H(p, q) = -sum p_i log q_i. */
export function crossEntropy(
  p: readonly number[],
  q: readonly number[],
  base = 2
): number {
  if (p.length !== q.length) {
    throw new Error("crossEntropy: distributions must have same length");
  }
  const lnBase = Math.log(base);
  let h = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] > EPS) {
      const qi = Math.max(EPS, q[i]);
      h -= (p[i] * Math.log(qi)) / lnBase;
    }
  }
  return h;
}

/** KL divergence KL(p || q) = sum p_i log(p_i / q_i). */
export function kl(
  p: readonly number[],
  q: readonly number[],
  base = 2
): number {
  return crossEntropy(p, q, base) - entropy(p, base);
}

export function expectation(
  values: readonly number[],
  p: readonly number[]
): number {
  let e = 0;
  for (let i = 0; i < values.length; i++) e += values[i] * p[i];
  return e;
}

export function variance(
  values: readonly number[],
  p: readonly number[]
): number {
  const mu = expectation(values, p);
  let v = 0;
  for (let i = 0; i < values.length; i++) {
    const d = values[i] - mu;
    v += d * d * p[i];
  }
  return v;
}

/** Sample one index from a distribution given a [0,1) uniform u. */
export function sampleFromU(p: readonly number[], u: number): number {
  let acc = 0;
  for (let i = 0; i < p.length; i++) {
    acc += p[i];
    if (u < acc) return i;
  }
  return p.length - 1;
}

export function sample(p: readonly number[]): number {
  return sampleFromU(p, Math.random());
}

/** Top-k truncation: keep the k highest-prob entries, renormalize. */
export function topK(p: readonly number[], k: number): number[] {
  if (k >= p.length) return [...p];
  const idx = [...p.keys()].sort((a, b) => p[b] - p[a]);
  const kept = new Set(idx.slice(0, Math.max(1, k)));
  const masked = p.map((pi, i) => (kept.has(i) ? pi : 0));
  return normalize(masked);
}

/** Top-p (nucleus): keep the smallest prefix whose mass >= pCut. */
export function topP(p: readonly number[], pCut: number): number[] {
  const idx = [...p.keys()].sort((a, b) => p[b] - p[a]);
  const kept = new Set<number>();
  let acc = 0;
  for (const i of idx) {
    kept.add(i);
    acc += p[i];
    if (acc >= pCut) break;
  }
  const masked = p.map((pi, i) => (kept.has(i) ? pi : 0));
  return normalize(masked);
}

/** Greedy: a one-hot on argmax. */
export function greedy(p: readonly number[]): number[] {
  let argmax = 0;
  for (let i = 1; i < p.length; i++) if (p[i] > p[argmax]) argmax = i;
  return p.map((_, i) => (i === argmax ? 1 : 0));
}

/** Format a number as a percentage (1 decimal by default). */
export function pct(x: number, digits = 1): string {
  return `${(x * 100).toFixed(digits)}%`;
}

/** Fixed-precision formatter (avoids -0). */
export function fmt(n: number, digits = 2): string {
  if (Object.is(n, -0)) n = 0;
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return r.toFixed(digits);
}

/** Mulberry32 — tiny seedable PRNG for deterministic widget animations. */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
