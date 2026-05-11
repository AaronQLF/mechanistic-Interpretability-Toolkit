// Tiny linear algebra helpers, focused on 2x2 cases used by widgets.
// All functions are pure and side-effect free.

export type Vec2 = readonly [number, number];
export type Mat2 = readonly [number, number, number, number]; // row-major: [a, b, c, d]

export const v2 = (x: number, y: number): Vec2 => [x, y] as const;
export const m2 = (a: number, b: number, c: number, d: number): Mat2 =>
  [a, b, c, d] as const;

export const ID2: Mat2 = [1, 0, 0, 1] as const;

export function add(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function scale(s: number, v: Vec2): Vec2 {
  return [s * v[0], s * v[1]];
}

export function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function norm(v: Vec2): number {
  return Math.hypot(v[0], v[1]);
}

export function normalize(v: Vec2): Vec2 {
  const n = norm(v);
  if (n < 1e-12) return [0, 0];
  return [v[0] / n, v[1] / n];
}

export function angleBetween(a: Vec2, b: Vec2): number {
  const na = norm(a);
  const nb = norm(b);
  if (na < 1e-12 || nb < 1e-12) return 0;
  const c = Math.max(-1, Math.min(1, dot(a, b) / (na * nb)));
  return Math.acos(c);
}

export function project(a: Vec2, onto: Vec2): Vec2 {
  const d = dot(onto, onto);
  if (d < 1e-12) return [0, 0];
  const k = dot(a, onto) / d;
  return [k * onto[0], k * onto[1]];
}

// Matrix-vector multiply: M @ v
export function mv(m: Mat2, v: Vec2): Vec2 {
  return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
}

// Matrix-matrix multiply: A @ B
export function mm(a: Mat2, b: Mat2): Mat2 {
  return [
    a[0] * b[0] + a[1] * b[2],
    a[0] * b[1] + a[1] * b[3],
    a[2] * b[0] + a[3] * b[2],
    a[2] * b[1] + a[3] * b[3],
  ];
}

export function det(m: Mat2): number {
  return m[0] * m[3] - m[1] * m[2];
}

export function transpose(m: Mat2): Mat2 {
  return [m[0], m[2], m[1], m[3]];
}

export function inverse(m: Mat2): Mat2 | null {
  const d = det(m);
  if (Math.abs(d) < 1e-10) return null;
  return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d];
}

export function rotation(theta: number): Mat2 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [c, -s, s, c];
}

export function diagonal(a: number, d: number): Mat2 {
  return [a, 0, 0, d];
}

// Lerp matrices for animation
export function lerpMat(a: Mat2, b: Mat2, t: number): Mat2 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

// Eigen-decomposition for a real 2x2 matrix.
// Returns real eigenvalues + eigenvectors when discriminant >= 0; otherwise null.
export type Eigen2 = {
  values: [number, number];
  vectors: [Vec2, Vec2];
};

export function eig2(m: Mat2): Eigen2 | null {
  const [a, b, c, d] = m;
  const tr = a + d;
  const detM = a * d - b * c;
  const disc = tr * tr - 4 * detM;
  if (disc < -1e-9) return null;
  const sq = Math.sqrt(Math.max(0, disc));
  const l1 = (tr + sq) / 2;
  const l2 = (tr - sq) / 2;
  const eigvec = (lambda: number): Vec2 => {
    // Solve (M - lambda I) v = 0
    const a11 = a - lambda;
    const a12 = b;
    const a21 = c;
    const a22 = d - lambda;
    let v: Vec2;
    if (Math.abs(a12) > 1e-9 || Math.abs(a11) > 1e-9) {
      v = [a12, -a11];
    } else if (Math.abs(a22) > 1e-9 || Math.abs(a21) > 1e-9) {
      v = [a22, -a21];
    } else {
      v = [1, 0];
    }
    const n = norm(v);
    return n < 1e-12 ? [1, 0] : [v[0] / n, v[1] / n];
  };
  return {
    values: [l1, l2],
    vectors: [eigvec(l1), eigvec(l2)],
  };
}

// SVD for a real 2x2 matrix M = U * Sigma * V^T.
// Returns rotations theta_u, theta_v and singular values (sigma1 >= sigma2 >= 0).
// Sign of det handled by allowing V's reflection to flip sigma2 sign on demand.
export type Svd2 = {
  thetaU: number;
  sigma: [number, number];
  thetaV: number;
};

export function svd2(m: Mat2): Svd2 {
  const [a, b, c, d] = m;
  // Compute V from eigen-decomposition of M^T M
  const e = a * a + c * c;
  const f = a * b + c * d;
  const g = b * b + d * d;
  // Symmetric 2x2: [[e, f], [f, g]]
  const sum = e + g;
  const diff = Math.sqrt(Math.max(0, (e - g) * (e - g) + 4 * f * f));
  const s1sq = (sum + diff) / 2;
  const s2sq = Math.max(0, (sum - diff) / 2);
  const sigma1 = Math.sqrt(Math.max(0, s1sq));
  const sigma2 = Math.sqrt(Math.max(0, s2sq));
  // Angle of V: principal eigenvector of M^T M
  const thetaV = 0.5 * Math.atan2(2 * f, e - g);

  // Compute U from M V = U Sigma -> U = M V Sigma^-1 (for nonzero singulars)
  const cosV = Math.cos(thetaV);
  const sinV = Math.sin(thetaV);
  // Columns of V
  const v1: Vec2 = [cosV, sinV];
  const v2v: Vec2 = [-sinV, cosV];
  const Mv1 = mv(m, v1);
  const Mv2 = mv(m, v2v);
  let thetaU: number;
  if (sigma1 > 1e-9) {
    thetaU = Math.atan2(Mv1[1] / sigma1, Mv1[0] / sigma1);
  } else if (sigma2 > 1e-9) {
    thetaU = Math.atan2(Mv2[1] / sigma2, Mv2[0] / sigma2) - Math.PI / 2;
  } else {
    thetaU = 0;
  }
  return { thetaU, sigma: [sigma1, sigma2], thetaV };
}

// Format helpers
export function fmt(n: number, digits = 2): string {
  if (Object.is(n, -0)) n = 0;
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return r.toFixed(digits);
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
