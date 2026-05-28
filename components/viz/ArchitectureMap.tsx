"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ARCH_CATEGORIES, type Architecture } from "@/lib/architectures";

type ArchWithCat = Architecture & { catSlug: string; catTitle: string };

// ---------- Layout constants ----------
const CHILD_W = 132;
const CHILD_H = 38;
const GRID_GAP = 8;
const COLS = 3;
const PARENT_HEADER = 56;
const PARENT_PAD = 16;

// Hand-laid x/y for each category parent node, in a left-to-right family
// tree. The numbers are chosen so the parents don't overlap given their
// child-count-driven heights. React Flow handles pan/zoom, so the canvas
// can be larger than the viewport.
const CATEGORY_LAYOUT: Record<string, { x: number; y: number }> = {
  "classical-stats": { x: 0, y: 700 },
  "trees-ensembles": { x: 540, y: 0 },
  "probabilistic-graphical": { x: 540, y: 540 },
  "clustering-dim-reduction": { x: 540, y: 980 },
  "feedforward-autoencoders": { x: 1080, y: 700 },
  cnns: { x: 1620, y: 0 },
  "detection-segmentation": { x: 2160, y: 0 },
  "rnns-memory": { x: 1620, y: 700 },
  "transformers-foundational": { x: 2160, y: 700 },
  "efficient-transformers": { x: 2700, y: 200 },
  "modern-llms": { x: 2700, y: 700 },
  "post-transformer": { x: 2700, y: 1620 },
  gans: { x: 1620, y: 1500 },
  flows: { x: 1620, y: 2150 },
};

const LINEAGE_EDGES: Array<[string, string]> = [
  ["classical-stats", "trees-ensembles"],
  ["classical-stats", "probabilistic-graphical"],
  ["classical-stats", "clustering-dim-reduction"],
  ["classical-stats", "feedforward-autoencoders"],
  ["probabilistic-graphical", "feedforward-autoencoders"],
  ["feedforward-autoencoders", "cnns"],
  ["feedforward-autoencoders", "rnns-memory"],
  ["feedforward-autoencoders", "gans"],
  ["feedforward-autoencoders", "flows"],
  ["cnns", "detection-segmentation"],
  ["rnns-memory", "transformers-foundational"],
  ["transformers-foundational", "efficient-transformers"],
  ["transformers-foundational", "modern-llms"],
  ["transformers-foundational", "post-transformer"],
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function shortTitle(t: string): string {
  return t
    .replace("Classical statistical & kernel models", "Classical / kernel")
    .replace("Decision trees & ensembles", "Trees & ensembles")
    .replace("Clustering & dimensionality reduction", "Clustering / DR")
    .replace("Probabilistic graphical models", "Probabilistic GMs")
    .replace("MLPs, RBMs, autoencoders", "MLPs / autoencoders")
    .replace("Convolutional networks (image classification)", "CNNs")
    .replace("Object detection & segmentation", "Detection / segm.")
    .replace("Recurrent networks & external memory", "RNNs / memory")
    .replace("Foundational transformers", "Foundational TFs")
    .replace("Efficient & long-context transformers", "Efficient TFs")
    .replace("State-space & post-transformer architectures", "State-space / post-TF")
    .replace("Generative Adversarial Networks", "GANs")
    .replace("Normalizing flows & continuous-time models", "Flows / CT");
}

// ---------- Node types ----------

type CategoryNodeData = {
  title: string;
  count: number;
  dimmed: boolean;
};

function CategoryNode({ data }: NodeProps) {
  const d = data as unknown as CategoryNodeData;
  return (
    <div
      className="relative h-full w-full rounded-xl border bg-paper-raised p-0 transition"
      style={{
        borderColor: "rgb(var(--accent))",
        opacity: d.dimmed ? 0.35 : 1,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "rgb(var(--accent))", border: "none", width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "rgb(var(--accent))", border: "none", width: 8, height: 8 }}
      />
      <div
        className="rounded-t-xl px-3 py-2"
        style={{ background: "rgb(var(--accent-soft))" }}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-sans text-[13px] font-semibold tracking-tight text-ink">
            {shortTitle(d.title)}
          </span>
          <span className="font-mono text-[10px] text-ink-muted">
            {d.count} archs
          </span>
        </div>
      </div>
    </div>
  );
}

type ArchNodeData = {
  name: string;
  year: number;
  isSelected: boolean;
  isMatch: boolean;
  isAlt: boolean;
  hasQuery: boolean;
};

function ArchNode({ data }: NodeProps) {
  const d = data as unknown as ArchNodeData;
  const dimmed = d.hasQuery && !d.isMatch && !d.isSelected && !d.isAlt;
  const bg = d.isSelected
    ? "rgb(var(--accent))"
    : d.isAlt
      ? "rgb(var(--accent-soft))"
      : "rgb(var(--paper))";
  const border = d.isSelected || d.isAlt
    ? "rgb(var(--accent))"
    : "rgb(var(--line))";
  const color = d.isSelected ? "white" : "rgb(var(--ink))";
  return (
    <div
      className="relative flex h-full w-full select-none items-center justify-between gap-1.5 rounded-md border px-2 font-mono text-[11px] transition"
      style={{
        background: bg,
        borderColor: border,
        color,
        opacity: dimmed ? 0.25 : 1,
        cursor: "pointer",
      }}
      title={d.name}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "transparent", border: "none", width: 1, height: 1 }}
      />
      <span className="truncate">{d.name}</span>
      <span
        className="font-mono text-[9px]"
        style={{ color: d.isSelected ? "rgba(255,255,255,0.75)" : "rgb(var(--ink-subtle))" }}
      >
        {d.year}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "transparent", border: "none", width: 1, height: 1 }}
      />
    </div>
  );
}

const NODE_TYPES: NodeTypes = {
  archCategory: CategoryNode,
  arch: ArchNode,
};

// ---------- Public widget ----------

export function ArchitectureMap() {
  const allArchs = useMemo<ArchWithCat[]>(
    () =>
      ARCH_CATEGORIES.flatMap((cat) =>
        cat.archs.map((a) => ({
          ...a,
          catSlug: cat.slug,
          catTitle: cat.title,
        }))
      ),
    []
  );

  const byName = useMemo(() => {
    const m = new Map<string, ArchWithCat>();
    for (const a of allArchs) m.set(a.name, a);
    return m;
  }, [allArchs]);

  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Set<string>>(
    () => new Set(ARCH_CATEGORIES.map((c) => c.slug))
  );
  const [selectedName, setSelectedName] = useState<string | null>("Transformer");

  const selected = selectedName ? byName.get(selectedName) ?? null : null;

  const matches = useMemo(() => {
    const q = normalize(query);
    if (!q) return null;
    const set = new Set<string>();
    for (const a of allArchs) {
      if (
        normalize(a.name).includes(q) ||
        normalize(a.blurb).includes(q) ||
        normalize(a.whyUse).includes(q) ||
        (a.alts ?? []).some((alt) => normalize(alt).includes(q))
      ) {
        set.add(a.name);
      }
    }
    return set;
  }, [query, allArchs]);

  const altsOfSelected = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set((selected.alts ?? []).filter((n) => byName.has(n)));
  }, [selected, byName]);

  const stats = useMemo(() => {
    const shown = matches ? matches.size : allArchs.length;
    return {
      total: allArchs.length,
      shown,
      cats: ARCH_CATEGORIES.length,
      catsActive: activeCats.size,
    };
  }, [allArchs, matches, activeCats]);

  const toggleCat = useCallback((slug: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const setAllCats = useCallback((on: boolean) => {
    setActiveCats(
      on ? new Set(ARCH_CATEGORIES.map((c) => c.slug)) : new Set()
    );
  }, []);

  const selectByName = useCallback(
    (name: string) => {
      if (byName.has(name)) setSelectedName(name);
    },
    [byName]
  );

  return (
    <div className="space-y-6">
      <Toolbar
        query={query}
        onQuery={setQuery}
        stats={stats}
        activeCats={activeCats}
        toggleCat={toggleCat}
        setAllCats={setAllCats}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <ReactFlowProvider>
            <ArchFlow
              activeCats={activeCats}
              matches={matches}
              selectedName={selectedName}
              altsOfSelected={altsOfSelected}
              onSelect={selectByName}
            />
          </ReactFlowProvider>
        </div>

        <DetailPanel
          arch={selected}
          byName={byName}
          onJump={selectByName}
          onClear={() => setSelectedName(null)}
        />
      </div>
    </div>
  );
}

// ---------- React Flow canvas ----------

function ArchFlow({
  activeCats,
  matches,
  selectedName,
  altsOfSelected,
  onSelect,
}: {
  activeCats: Set<string>;
  matches: Set<string> | null;
  selectedName: string | null;
  altsOfSelected: Set<string>;
  onSelect: (name: string) => void;
}) {
  const flow = useReactFlow();
  const fittedRef = useRef(false);
  const { resolvedTheme } = useTheme();
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = [];
    const es: Edge[] = [];

    const childWidth = COLS * CHILD_W + (COLS - 1) * GRID_GAP;
    const parentWidth = childWidth + 2 * PARENT_PAD;

    for (const cat of ARCH_CATEGORIES) {
      const layout = CATEGORY_LAYOUT[cat.slug];
      if (!layout) continue;
      const visible = activeCats.has(cat.slug);
      const rows = Math.ceil(cat.archs.length / COLS);
      const parentHeight =
        PARENT_HEADER + rows * CHILD_H + (rows - 1) * GRID_GAP + PARENT_PAD;

      ns.push({
        id: cat.slug,
        type: "archCategory",
        position: layout,
        data: {
          title: cat.title,
          count: cat.archs.length,
          dimmed: !visible,
        },
        style: {
          width: parentWidth,
          height: parentHeight,
        },
        draggable: false,
        selectable: false,
        hidden: !visible,
      });

      cat.archs.forEach((a, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = PARENT_PAD + col * (CHILD_W + GRID_GAP);
        const y = PARENT_HEADER + row * (CHILD_H + GRID_GAP);
        const isMatch = matches ? matches.has(a.name) : true;
        const isAlt = altsOfSelected.has(a.name);
        ns.push({
          id: a.name,
          type: "arch",
          parentId: cat.slug,
          extent: "parent",
          position: { x, y },
          data: {
            name: a.name,
            year: a.year,
            isSelected: selectedName === a.name,
            isMatch,
            isAlt,
            hasQuery: matches !== null,
          },
          style: { width: CHILD_W, height: CHILD_H },
          draggable: false,
          hidden: !visible,
        });
      });
    }

    for (const [a, b] of LINEAGE_EDGES) {
      const aVisible = activeCats.has(a);
      const bVisible = activeCats.has(b);
      es.push({
        id: `lin-${a}-${b}`,
        source: a,
        target: b,
        animated: false,
        style: {
          stroke: "rgb(var(--ink-subtle))",
          strokeDasharray: "4 4",
          strokeWidth: 1.2,
          opacity: aVisible && bVisible ? 0.7 : 0.15,
        },
      });
    }

    if (selectedName) {
      for (const altName of altsOfSelected) {
        es.push({
          id: `alt-${selectedName}-${altName}`,
          source: selectedName,
          target: altName,
          animated: true,
          style: {
            stroke: "rgb(var(--accent))",
            strokeWidth: 1.6,
          },
        });
      }
    }

    return { nodes: ns, edges: es };
  }, [activeCats, matches, selectedName, altsOfSelected]);

  // Fit view once on mount, then center on the selected node when selection changes.
  useEffect(() => {
    if (fittedRef.current) return;
    const t = setTimeout(() => {
      flow.fitView({ padding: 0.15, duration: 600 });
      fittedRef.current = true;
    }, 50);
    return () => clearTimeout(t);
  }, [flow]);

  useEffect(() => {
    if (!selectedName) return;
    const t = setTimeout(() => {
      const node = flow.getNode(selectedName);
      if (!node) return;
      const x = (node.position.x ?? 0) + (node.measured?.width ?? CHILD_W) / 2;
      const y = (node.position.y ?? 0) + (node.measured?.height ?? CHILD_H) / 2;
      // Position is relative to parent; resolve to absolute
      const parent = node.parentId ? flow.getNode(node.parentId) : null;
      const absX = (parent?.position.x ?? 0) + x;
      const absY = (parent?.position.y ?? 0) + y;
      flow.setCenter(absX, absY, { zoom: Math.max(flow.getZoom(), 0.7), duration: 500 });
    }, 80);
    return () => clearTimeout(t);
  }, [selectedName, flow]);

  return (
    <div
      className="rounded-xl border border-line bg-paper-raised"
      style={{ height: 640 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        colorMode={colorMode}
        onNodeClick={(_, node) => {
          if (node.type === "arch") onSelect(node.id);
        }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.25}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.15 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgb(var(--line))"
        />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-left"
          pannable
          zoomable
          maskColor="rgba(0,0,0,0.18)"
          nodeColor={(n) => {
            if (n.type === "archCategory") return "rgb(var(--accent-soft))";
            const d = n.data as Partial<ArchNodeData> | undefined;
            if (d?.isSelected) return "rgb(var(--accent))";
            if (d?.isAlt) return "rgb(var(--accent-soft))";
            return "rgb(var(--paper-sunken))";
          }}
          nodeStrokeColor={() => "rgb(var(--line))"}
          style={{
            background: "rgb(var(--paper))",
            border: "1px solid rgb(var(--line))",
            borderRadius: 6,
          }}
        />
      </ReactFlow>
    </div>
  );
}

// ---------- Toolbar ----------

function Toolbar({
  query,
  onQuery,
  stats,
  activeCats,
  toggleCat,
  setAllCats,
}: {
  query: string;
  onQuery: (q: string) => void;
  stats: { total: number; shown: number; cats: number; catsActive: number };
  activeCats: Set<string>;
  toggleCat: (slug: string) => void;
  setAllCats: (on: boolean) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-line bg-paper-raised p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 font-sans text-sm">
          <SearchIcon className="h-4 w-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Search 189 architectures: ResNet, Mamba, GPT, LASSO, …"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="flex-1 bg-transparent text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery("")}
              className="rounded-md border border-line px-1.5 font-mono text-[10px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
            >
              clear
            </button>
          )}
        </label>
        <div className="font-mono text-[11px] text-ink-muted">
          {query ? `${stats.shown} match` : `${stats.total} archs`} ·{" "}
          {stats.catsActive} / {stats.cats} categories
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setAllCats(true)}
          className="rounded-md border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
        >
          all
        </button>
        <button
          type="button"
          onClick={() => setAllCats(false)}
          className="rounded-md border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
        >
          none
        </button>
        {ARCH_CATEGORIES.map((cat) => {
          const active = activeCats.has(cat.slug);
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => toggleCat(cat.slug)}
              className={[
                "rounded-md border px-2 py-0.5 font-mono text-[10px] transition",
                active
                  ? "border-accent/50 bg-[rgb(var(--accent-soft))]/40 text-ink"
                  : "border-line bg-paper text-ink-subtle hover:border-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {cat.title.split(" ")[0].toLowerCase()}
              <span className="ml-1 text-ink-subtle/80">
                {cat.archs.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Detail panel ----------

function DetailPanel({
  arch,
  byName,
  onJump,
  onClear,
}: {
  arch: ArchWithCat | null;
  byName: Map<string, ArchWithCat>;
  onJump: (name: string) => void;
  onClear: () => void;
}) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-xl border border-accent/40 bg-paper-raised p-4 shadow-sm">
        {arch ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wide text-accent">
                  {arch.catTitle}
                </p>
                <h4 className="mt-0.5 font-sans text-lg font-semibold tracking-tight text-ink">
                  {arch.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink-muted">
                  {arch.year}
                </span>
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded-md border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-muted transition hover:border-ink-muted hover:text-ink"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="mt-3 font-serif text-[13px] leading-relaxed text-ink">
              {arch.blurb}
            </p>

            <div className="mt-4 rounded-lg border border-line bg-paper-sunken p-3">
              <div className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                why use it (vs alternatives)
              </div>
              <p className="mt-1 font-serif text-[13px] leading-relaxed text-ink">
                {arch.whyUse}
              </p>
            </div>

            {arch.alts && arch.alts.length > 0 && (
              <div className="mt-4">
                <div className="font-sans text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                  compare to
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {arch.alts.map((altName) => {
                    const exists = byName.has(altName);
                    return (
                      <button
                        key={altName}
                        type="button"
                        disabled={!exists}
                        onClick={() => exists && onJump(altName)}
                        className={[
                          "rounded-md border px-2 py-0.5 font-mono text-[11px] transition",
                          exists
                            ? "border-line bg-paper text-ink-muted hover:border-accent hover:text-accent"
                            : "border-dashed border-line/60 bg-transparent text-ink-subtle/60",
                        ].join(" ")}
                        title={
                          exists
                            ? byName.get(altName)?.blurb
                            : "(not currently in the map)"
                        }
                      >
                        {altName}
                        <span aria-hidden className="ml-1 text-ink-subtle/70">
                          →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2 text-center">
            <p className="font-sans text-sm font-semibold text-ink">
              Pick a node
            </p>
            <p className="font-serif text-[12px] leading-relaxed text-ink-muted">
              Click any architecture in the map. The selected node lights
              up, its alt-relationship edges become visible, and this
              panel fills with why-use vs alternatives.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
