"use client";

import { useMemo, useState } from "react";

const LAYERS = 6;
// Each "component" at each layer is a toy scalar contribution to the final
// answer logit. The "France" answer wants high values; the "Spain" answer
// wants low values. The ground truth is that layer 4's MLP is the main
// contributor — patching that one component flips the answer.
const CLEAN: number[][] = [
  // [attn_contrib, mlp_contrib] per layer, on the "Paris" baseline prompt.
  [0.0, 0.1],
  [0.1, 0.2],
  [0.2, 0.3],
  [0.3, 0.5],
  [0.4, 2.6], // <-- the key MLP
  [0.2, 0.4],
];
const COUNTERFACTUAL: number[][] = [
  // Same prompt structure with "Spain" — most components similar except 4.
  [0.0, 0.1],
  [0.1, 0.2],
  [0.2, 0.3],
  [0.2, 0.4],
  [0.3, -1.8], // <-- this is what changes
  [0.2, 0.3],
];

function sumAll(M: number[][]): number {
  return M.reduce((acc, row) => acc + row[0] + row[1], 0);
}

export function ActivationPatchingDemo() {
  const [patched, setPatched] = useState<{ layer: number; comp: 0 | 1 } | null>(
    null
  );

  const patchedM = useMemo(() => {
    return CLEAN.map((row, i) =>
      row.map((v, c) => {
        if (
          patched &&
          patched.layer === i &&
          (patched.comp as number) === c
        ) {
          return COUNTERFACTUAL[i][c];
        }
        return v;
      })
    );
  }, [patched]);

  const cleanLogit = sumAll(CLEAN);
  const cfLogit = sumAll(COUNTERFACTUAL);
  const patchedLogit = sumAll(patchedM);
  const fracDamage =
    cleanLogit === cfLogit
      ? 0
      : (cleanLogit - patchedLogit) / (cleanLogit - cfLogit);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <Card
          title="baseline (Paris)"
          subtitle="run the model on 'capital of France'"
          logit={cleanLogit}
          color="ink"
          target="Paris"
        />
        <Card
          title={
            patched
              ? `patched (L${patched.layer + 1} ${patched.comp === 0 ? "attn" : "mlp"})`
              : "patched (none yet)"
          }
          subtitle={
            patched
              ? `swap that one component from the Madrid run into the Paris run`
              : "click a cell below to patch"
          }
          logit={patchedLogit}
          color={fracDamage > 0.4 ? "accent" : "muted"}
          target="Paris"
        />
        <Card
          title="counterfactual (Madrid)"
          subtitle="run the model on 'capital of Spain'"
          logit={cfLogit}
          color="rose"
          target="Madrid"
        />
      </div>

      <div className="rounded-lg border border-line bg-paper-sunken p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            patch any component (Madrid → Paris)
          </div>
          {patched && (
            <button
              type="button"
              onClick={() => setPatched(null)}
              className="rounded-md border border-line bg-paper px-2 py-0.5 font-sans text-[11px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-[64px_1fr_1fr] gap-2 font-mono text-xs">
          <div className="text-ink-subtle">layer</div>
          <div className="text-center text-ink-subtle">attention</div>
          <div className="text-center text-ink-subtle">MLP</div>
          {CLEAN.map((row, i) => (
            <Row key={i}>
              <div className="self-center text-ink-muted">L{i + 1}</div>
              <CellButton
                value={CLEAN[i][0]}
                cfValue={COUNTERFACTUAL[i][0]}
                patched={patched?.layer === i && patched.comp === 0}
                onClick={() => setPatched({ layer: i, comp: 0 })}
              />
              <CellButton
                value={CLEAN[i][1]}
                cfValue={COUNTERFACTUAL[i][1]}
                patched={patched?.layer === i && patched.comp === 1}
                onClick={() => setPatched({ layer: i, comp: 1 })}
              />
            </Row>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper-sunken p-3 font-mono text-sm">
        <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          fraction of behavior recovered (1.0 = full flip to Madrid)
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="relative h-3 flex-1 rounded bg-paper">
            <div
              className="absolute left-0 top-0 h-3 rounded bg-accent"
              style={{
                width: `${Math.max(0, Math.min(1, fracDamage)) * 100}%`,
              }}
            />
          </div>
          <span className="w-16 text-right text-ink">
            {(Math.max(0, Math.min(1, fracDamage)) * 100).toFixed(0)}%
          </span>
        </div>
        <p className="mt-3 font-sans text-xs leading-relaxed text-ink-muted">
          A high recovery fraction means &ldquo;this single component
          carries most of the country → capital information.&rdquo; Try
          each cell — only one of them is doing the heavy lifting.
        </p>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function CellButton({
  value,
  cfValue,
  patched,
  onClick,
}: {
  value: number;
  cfValue: number;
  patched?: boolean;
  onClick: () => void;
}) {
  const intensity = Math.min(1, Math.abs(value) / 2.6);
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative rounded border px-2 py-1 text-left transition",
        patched
          ? "border-accent bg-[rgb(var(--accent-soft))] text-accent"
          : "border-line bg-paper text-ink-muted hover:border-ink-muted hover:text-ink",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-l"
        style={{
          width: `${intensity * 100}%`,
          background: value >= 0 ? "rgba(217,119,6,0.12)" : "rgba(225,29,72,0.12)",
        }}
      />
      <span className="relative">
        {patched ? (
          <>
            {cfValue >= 0 ? "+" : ""}
            {cfValue.toFixed(2)}
            <span className="ml-1 text-[10px] text-ink-subtle">
              (was {value >= 0 ? "+" : ""}
              {value.toFixed(2)})
            </span>
          </>
        ) : (
          <>
            {value >= 0 ? "+" : ""}
            {value.toFixed(2)}
          </>
        )}
      </span>
    </button>
  );
}

function Card({
  title,
  subtitle,
  logit,
  color,
  target,
}: {
  title: string;
  subtitle: string;
  logit: number;
  color: "ink" | "muted" | "rose" | "accent";
  target: string;
}) {
  const c =
    color === "accent"
      ? "border-accent/50 bg-[rgb(var(--accent-soft))]/40"
      : color === "ink"
        ? "border-line bg-paper-raised"
        : color === "rose"
          ? "border-rose-500/40 bg-rose-500/5"
          : "border-line bg-paper-sunken";
  return (
    <div className={`rounded-lg border ${c} p-3`}>
      <div className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {title}
      </div>
      <div className="mt-1 font-serif text-xs text-ink-muted">{subtitle}</div>
      <div className="mt-2 font-mono text-sm">
        <span className="text-ink-subtle">logit({target}) = </span>
        <span className="text-ink">{logit.toFixed(2)}</span>
      </div>
    </div>
  );
}
