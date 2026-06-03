"use client";

import { blackScholesGreeksCall } from "@/lib/blackScholes";
import { useMemo, useState } from "react";

export function BlackScholesGreeksExplorer() {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(0.5);
  const [r, setR] = useState(0.01);
  const [sigma, setSigma] = useState(0.25);

  const g = useMemo(
    () => blackScholesGreeksCall({ S, K, T, r, sigma }),
    [S, K, T, r, sigma]
  );

  return (
    <div className="space-y-4 p-2 font-sans text-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <label className="text-xs text-ink-muted">
          S
          <input
            type="range"
            min={40}
            max={180}
            value={S}
            onChange={(e) => setS(+e.target.value)}
            className="mt-1 w-full accent-accent"
          />
          <div className="font-mono text-ink">{S}</div>
        </label>
        <label className="text-xs text-ink-muted">
          K
          <input
            type="range"
            min={40}
            max={180}
            value={K}
            onChange={(e) => setK(+e.target.value)}
            className="mt-1 w-full accent-accent"
          />
          <div className="font-mono text-ink">{K}</div>
        </label>
        <label className="text-xs text-ink-muted">
          T (yr)
          <input
            type="range"
            min={5}
            max={200}
            value={Math.round(T * 100)}
            onChange={(e) => setT(+e.target.value / 100)}
            className="mt-1 w-full accent-accent"
          />
          <div className="font-mono text-ink">{T.toFixed(2)}</div>
        </label>
        <label className="text-xs text-ink-muted">
          r
          <input
            type="range"
            min={0}
            max={80}
            value={Math.round(r * 4000)}
            onChange={(e) => setR(+e.target.value / 4000)}
            className="mt-1 w-full accent-accent"
          />
          <div className="font-mono text-ink">{r.toFixed(4)}</div>
        </label>
        <label className="text-xs text-ink-muted">
          σ
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(sigma * 100)}
            onChange={(e) => setSigma(+e.target.value / 100)}
            className="mt-1 w-full accent-accent"
          />
          <div className="font-mono text-ink">{sigma.toFixed(2)}</div>
        </label>
      </div>
      <dl className="grid grid-cols-2 gap-2 rounded border border-line bg-paper-raised p-3 font-mono text-xs md:grid-cols-3">
        <div>
          <dt className="text-ink-muted">Call price</dt>
          <dd className="text-accent">{g.price.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Delta</dt>
          <dd>{g.delta.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Gamma</dt>
          <dd>{g.gamma.toFixed(4)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Vega / 1% vol</dt>
          <dd>{g.vega.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Theta / day</dt>
          <dd>{g.theta.toFixed(4)}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Rho / 1% rate</dt>
          <dd>{g.rho.toFixed(3)}</dd>
        </div>
      </dl>
      <p className="text-xs text-ink-muted">
        European call on non-dividend stock. Educational toy — not a pricing
        engine for production.
      </p>
    </div>
  );
}
