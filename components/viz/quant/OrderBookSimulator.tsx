"use client";

import { useCallback, useMemo, useState } from "react";

type Side = "bid" | "ask";
type Level = { price: number; qty: number };

function emptyBook() {
  const bids: Level[] = [
    { price: 100.0, qty: 400 },
    { price: 99.9, qty: 200 },
    { price: 99.8, qty: 150 },
  ];
  const asks: Level[] = [
    { price: 100.1, qty: 300 },
    { price: 100.2, qty: 250 },
    { price: 100.3, qty: 100 },
  ];
  return { bids, asks };
}

export function OrderBookSimulator() {
  const [book, setBook] = useState(emptyBook);
  const [priceIn, setPriceIn] = useState("100.05");
  const [qtyIn, setQtyIn] = useState("50");
  const [side, setSide] = useState<Side>("bid");
  const [log, setLog] = useState<string[]>([]);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [line, ...prev].slice(0, 8));
  }, []);

  const mid = useMemo(() => {
    const bestBid = book.bids[0]?.price ?? 0;
    const bestAsk = book.asks[0]?.price ?? 0;
    if (!bestBid || !bestAsk) return "—";
    return ((bestBid + bestAsk) / 2).toFixed(2);
  }, [book]);

  const limitOrder = () => {
    const p = Number(priceIn);
    const q = Number(qtyIn);
    if (!Number.isFinite(p) || !Number.isFinite(q) || q <= 0) return;
    setBook((b) => {
      const bids = [...b.bids].sort((a, c) => c.price - a.price);
      const asks = [...b.asks].sort((a, c) => a.price - c.price);
      if (side === "bid") {
        if (p >= asks[0].price) {
          pushLog(`Crossing bid ${p}@${q} would trade — add resting only here.`);
        }
        const i = bids.findIndex((x) => x.price === p);
        if (i >= 0) bids[i] = { ...bids[i], qty: bids[i].qty + q };
        else bids.push({ price: p, qty: q });
        bids.sort((a, c) => c.price - a.price);
        pushLog(`Rest bid ${p} × ${q}`);
        return { bids, asks };
      }
      if (p <= bids[0].price) {
        pushLog(`Crossing ask ${p}@${q} would trade — add resting only here.`);
      }
      const j = asks.findIndex((x) => x.price === p);
      if (j >= 0) asks[j] = { ...asks[j], qty: asks[j].qty + q };
      else asks.push({ price: p, qty: q });
      asks.sort((a, c) => a.price - c.price);
      pushLog(`Rest ask ${p} × ${q}`);
      return { bids, asks };
    });
  };

  const reset = () => {
    setBook(emptyBook());
    setLog([]);
  };

  return (
    <div className="grid gap-4 p-2 font-sans text-sm md:grid-cols-2">
      <div>
        <div className="mb-2 flex justify-between text-xs text-ink-muted">
          <span>Asks (sell)</span>
          <span>Mid {mid}</span>
        </div>
        <div className="space-y-1 rounded border border-line bg-paper-sunken p-2">
          {[...book.asks].reverse().map((l) => (
            <div
              key={`a-${l.price}`}
              className="flex justify-between font-mono text-xs text-rose-700 dark:text-rose-300"
            >
              <span>{l.price.toFixed(2)}</span>
              <span>{l.qty}</span>
            </div>
          ))}
        </div>
        <div className="my-1 h-px bg-line" />
        <div className="space-y-1 rounded border border-line bg-paper-sunken p-2">
          {book.bids.map((l) => (
            <div
              key={`b-${l.price}`}
              className="flex justify-between font-mono text-xs text-emerald-800 dark:text-emerald-300"
            >
              <span>{l.price.toFixed(2)}</span>
              <span>{l.qty}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-ink-muted">Bids (buy)</div>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSide("bid")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${side === "bid" ? "bg-accent text-white" : "border border-line"}`}
          >
            Bid
          </button>
          <button
            type="button"
            onClick={() => setSide("ask")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${side === "ask" ? "bg-accent text-white" : "border border-line"}`}
          >
            Ask
          </button>
        </div>
        <label className="block text-xs text-ink-muted">
          Price
          <input
            value={priceIn}
            onChange={(e) => setPriceIn(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 font-mono"
          />
        </label>
        <label className="block text-xs text-ink-muted">
          Qty
          <input
            value={qtyIn}
            onChange={(e) => setQtyIn(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 font-mono"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={limitOrder}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white"
          >
            Add limit (rest)
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-line px-3 py-1.5 text-xs"
          >
            Reset
          </button>
        </div>
        <div className="rounded border border-line bg-paper p-2 font-mono text-[11px] text-ink-muted">
          {log.length === 0 ? "Actions appear here." : log.join("\n")}
        </div>
      </div>
    </div>
  );
}
