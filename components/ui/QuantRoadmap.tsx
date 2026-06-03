import Link from "next/link";
import { quantModules, quantModulePath } from "@/lib/quant";

/**
 * Suggested study flow across quant modules (illustrative, not strict).
 * Node order matches `quantModules` in lib/quant.ts.
 */
export function QuantRoadmap() {
  const nodeW = 120;
  const nodeH = 46;
  const row1y = 52;
  const row2y = 150;
  const col = (i: number) => 24 + i * (nodeW + 14);

  const positions: Array<{ x: number; y: number }> = quantModules.map(
    (_, i) => {
      if (i < 7) return { x: col(i), y: row1y };
      return { x: col(i - 7), y: row2y };
    }
  );

  const backbone: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) backbone.push([i, i + 1]);
  backbone.push([6, 7]);
  for (let i = 7; i < quantModules.length - 1; i++) backbone.push([i, i + 1]);

  const edges = backbone;

  return (
    <div className="relative -mx-4 overflow-x-auto sm:mx-0">
      <svg
        viewBox="0 0 1020 310"
        width="100%"
        className="min-w-[720px]"
        role="img"
        aria-label="Quant developer roadmap — suggested module order"
      >
        <defs>
          <marker
            id="quant-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--ink-subtle))" />
          </marker>
        </defs>
        {edges.map(([a, b], i) => {
          const pa = positions[a];
          const pb = positions[b];
          if (!pa || !pb) return null;
          const x1 = pa.x + nodeW / 2;
          const y1 = pa.y + nodeH / 2;
          const x2 = pb.x + nodeW / 2;
          const y2 = pb.y + nodeH / 2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgb(var(--ink-subtle))"
              strokeWidth={1}
              strokeDasharray="3 4"
              markerEnd="url(#quant-arrow)"
              opacity={0.55}
            />
          );
        })}
        {quantModules.map((m, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const { x, y } = pos;
          const href = `/${quantModulePath(m.slug)}`;
          const short =
            m.title.length > 24 ? `${m.title.slice(0, 22)}…` : m.title;
          return (
            <g key={m.slug}>
              <Link href={href}>
                <g style={{ cursor: "pointer" }}>
                  <rect
                    x={x}
                    y={y}
                    width={nodeW}
                    height={nodeH}
                    rx={8}
                    fill="rgb(var(--accent-soft))"
                    stroke="rgb(var(--accent))"
                    strokeWidth={1.4}
                  />
                  <text
                    x={x + nodeW / 2}
                    y={y + 21}
                    textAnchor="middle"
                    fontSize={10.5}
                    fontWeight={600}
                    fontFamily="var(--font-inter), system-ui, sans-serif"
                    fill="rgb(var(--ink))"
                  >
                    {short}
                  </text>
                  <text
                    x={x + nodeW / 2}
                    y={y + 36}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="ui-monospace, monospace"
                    fill="rgb(var(--accent))"
                  >
                    {(m.chapters?.length ?? 0)} ch
                  </text>
                </g>
              </Link>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
