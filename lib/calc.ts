// Small calculus helpers used by the Calculus module widgets.
// All functions are pure. Conventions:
//   - "f" is a real → real function
//   - "F" is a R^n → R scalar function (used in gradient / GD widgets)
//   - gradients are estimated with central differences unless an analytic
//     form is provided alongside the function (see NAMED_FUNCS below).

import type { Vec2 } from "./linalg";

/** Central difference for a 1D function. */
export function ddx(f: (x: number) => number, x: number, h = 1e-4): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** Central-difference gradient of a 2D scalar function. */
export function grad2(
  F: (p: Vec2) => number,
  p: Vec2,
  h = 1e-4
): Vec2 {
  const [x, y] = p;
  const fx = (F([x + h, y]) - F([x - h, y])) / (2 * h);
  const fy = (F([x, y + h]) - F([x, y - h])) / (2 * h);
  return [fx, fy];
}

/** Central-difference Jacobian of a 2D → 2D function. Returns row-major. */
export function jac2(
  G: (p: Vec2) => Vec2,
  p: Vec2,
  h = 1e-4
): [number, number, number, number] {
  const [x, y] = p;
  const gxp = G([x + h, y]);
  const gxm = G([x - h, y]);
  const gyp = G([x, y + h]);
  const gym = G([x, y - h]);
  const a = (gxp[0] - gxm[0]) / (2 * h);
  const b = (gyp[0] - gym[0]) / (2 * h);
  const c = (gxp[1] - gxm[1]) / (2 * h);
  const d = (gyp[1] - gym[1]) / (2 * h);
  return [a, b, c, d];
}

/** Sigmoid and its analytic derivative. */
export const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
export const dsigmoid = (x: number): number => {
  const s = sigmoid(x);
  return s * (1 - s);
};

/** A named 1D function with analytic derivative. */
export type Func1D = {
  id: string;
  label: string;
  f: (x: number) => number;
  df: (x: number) => number;
  domain: [number, number];
  range?: [number, number];
};

export const NAMED_1D: Func1D[] = [
  {
    id: "square",
    label: "f(x) = x²",
    f: (x) => x * x,
    df: (x) => 2 * x,
    domain: [-3, 3],
    range: [-1, 9.5],
  },
  {
    id: "cube",
    label: "f(x) = x³ − 2x",
    f: (x) => x ** 3 - 2 * x,
    df: (x) => 3 * x * x - 2,
    domain: [-2.4, 2.4],
    range: [-4, 4],
  },
  {
    id: "sin",
    label: "f(x) = sin x",
    f: Math.sin,
    df: Math.cos,
    domain: [-Math.PI * 1.4, Math.PI * 1.4],
    range: [-1.3, 1.3],
  },
  {
    id: "sigmoid",
    label: "f(x) = σ(x)",
    f: sigmoid,
    df: dsigmoid,
    domain: [-6, 6],
    range: [-0.1, 1.1],
  },
  {
    id: "relu",
    label: "f(x) = max(0, x)",
    f: (x) => Math.max(0, x),
    df: (x) => (x > 0 ? 1 : 0),
    domain: [-3, 3],
    range: [-0.3, 3],
  },
];

/** A named 2D scalar field with analytic gradient. Used by gradient / GD widgets. */
export type Scalar2D = {
  id: string;
  label: string;
  F: (p: Vec2) => number;
  gradF: (p: Vec2) => Vec2;
  world: { xMin: number; xMax: number; yMin: number; yMax: number };
  /** Approximate range of F over `world` — used for colormap scaling. */
  range: [number, number];
  /** A sensible starting point for gradient-descent widgets. */
  start?: Vec2;
};

export const NAMED_2D: Scalar2D[] = [
  {
    id: "bowl",
    label: "F(x, y) = x² + y²",
    F: ([x, y]) => x * x + y * y,
    gradF: ([x, y]) => [2 * x, 2 * y],
    world: { xMin: -2.5, xMax: 2.5, yMin: -2.5, yMax: 2.5 },
    range: [0, 12.5],
    start: [-2, 1.8],
  },
  {
    id: "ellipse",
    label: "F(x, y) = x² + 6y²",
    F: ([x, y]) => x * x + 6 * y * y,
    gradF: ([x, y]) => [2 * x, 12 * y],
    world: { xMin: -2.5, xMax: 2.5, yMin: -2, yMax: 2 },
    range: [0, 30],
    start: [-2.2, 1.6],
  },
  {
    id: "saddle",
    label: "F(x, y) = x² − y²",
    F: ([x, y]) => x * x - y * y,
    gradF: ([x, y]) => [2 * x, -2 * y],
    world: { xMin: -2.5, xMax: 2.5, yMin: -2.5, yMax: 2.5 },
    range: [-6.25, 6.25],
    start: [-1.5, 0.4],
  },
  {
    id: "rosenbrock",
    label: "F(x, y) = (1 − x)² + 10 (y − x²)²  (banana)",
    F: ([x, y]) => {
      const a = 1 - x;
      const b = y - x * x;
      return a * a + 10 * b * b;
    },
    gradF: ([x, y]) => {
      const a = 1 - x;
      const b = y - x * x;
      return [-2 * a + 10 * 2 * b * (-2 * x), 10 * 2 * b];
    },
    world: { xMin: -1.7, xMax: 1.9, yMin: -0.5, yMax: 2.5 },
    range: [0, 40],
    start: [-1.2, 1.4],
  },
];

export const getFunc1D = (id: string): Func1D =>
  NAMED_1D.find((f) => f.id === id) ?? NAMED_1D[0];

export const getScalar2D = (id: string): Scalar2D =>
  NAMED_2D.find((f) => f.id === id) ?? NAMED_2D[0];

/** Fixed-precision formatter (avoids -0). */
export function fmt(n: number, digits = 2): string {
  if (Object.is(n, -0)) n = 0;
  if (!Number.isFinite(n)) return n > 0 ? "∞" : n < 0 ? "−∞" : "NaN";
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return r.toFixed(digits);
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
