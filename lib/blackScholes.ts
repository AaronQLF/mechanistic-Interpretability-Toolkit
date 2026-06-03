/** Black–Scholes helpers (European call). Not financial advice. */

const SQRT_2PI = Math.sqrt(2 * Math.PI);

function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / SQRT_2PI;
}

function normCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(x));
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x * 0.5);
  return 0.5 * (1 + sign * y);
}

export type BSInputs = {
  S: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
};

export function blackScholesCallPrice({
  S,
  K,
  T,
  r,
  sigma,
}: BSInputs): number {
  if (T <= 0 || sigma <= 0) return Math.max(S - K, 0);
  const vSqrtT = sigma * Math.sqrt(T);
  const d1 =
    (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / vSqrtT;
  const d2 = d1 - vSqrtT;
  return S * normCdf(d1) - K * Math.exp(-r * T) * normCdf(d2);
}

export function blackScholesGreeksCall(inp: BSInputs) {
  const { S, K, T, r, sigma } = inp;
  if (T <= 0 || sigma <= 0) {
    const intrinsic = Math.max(S - K, 0);
    return {
      delta: S > K ? 1 : S < K ? 0 : 0.5,
      gamma: 0,
      vega: 0,
      theta: 0,
      rho: 0,
      price: intrinsic,
    };
  }
  const vSqrtT = sigma * Math.sqrt(T);
  const d1 =
    (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / vSqrtT;
  const d2 = d1 - vSqrtT;
  const Nd1 = normCdf(d1);
  const nd1 = normPdf(d1);
  const delta = Nd1;
  const gamma = nd1 / (S * vSqrtT);
  const vega = (S * nd1 * Math.sqrt(T)) / 100;
  const theta =
    (-(S * nd1 * sigma) / (2 * Math.sqrt(T)) -
      r * K * Math.exp(-r * T) * normCdf(d2)) /
    365;
  const rho = (K * T * Math.exp(-r * T) * normCdf(d2)) / 100;
  const price = S * Nd1 - K * Math.exp(-r * T) * normCdf(d2);
  return { delta, gamma, vega, theta, rho, price };
}
