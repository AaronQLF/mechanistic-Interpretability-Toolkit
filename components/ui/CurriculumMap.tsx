import Link from "next/link";
import { modules } from "@/lib/topics";

export function CurriculumMap() {
  const positions: Array<{ x: number; y: number }> = [
    { x: 80, y: 70 },    // linear-algebra
    { x: 250, y: 50 },   // probability
    { x: 250, y: 170 },  // calculus
    { x: 420, y: 110 },  // neural-networks
    { x: 590, y: 110 },  // transformers
    { x: 760, y: 110 },  // circuits
  ];

  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [4, 5],
  ];

  const nodeWidth = 132;
  const nodeHeight = 56;

  return (
    <div className="relative -mx-4 overflow-x-auto sm:mx-0">
      <svg
        viewBox="0 0 880 220"
        width="100%"
        className="min-w-[700px]"
        role="img"
        aria-label="Curriculum dependency map"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--ink-subtle))" />
          </marker>
        </defs>
        {edges.map(([a, b], i) => {
          const x1 = positions[a].x + nodeWidth / 2;
          const y1 = positions[a].y + nodeHeight / 2;
          const x2 = positions[b].x + nodeWidth / 2;
          const y2 = positions[b].y + nodeHeight / 2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgb(var(--ink-subtle))"
              strokeWidth={1.2}
              strokeDasharray="4 4"
              markerEnd="url(#arrow)"
              opacity={0.7}
            />
          );
        })}
        {modules.map((m, i) => {
          const { x, y } = positions[i];
          const isAvail = m.status === "available";
          return (
            <g key={m.slug}>
              <Link href={`/${m.slug}`}>
                <g style={{ cursor: "pointer" }}>
                  <rect
                    x={x}
                    y={y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={10}
                    fill={isAvail ? "rgb(var(--accent-soft))" : "rgb(var(--paper-raised))"}
                    stroke={isAvail ? "rgb(var(--accent))" : "rgb(var(--line))"}
                    strokeWidth={isAvail ? 1.6 : 1}
                  />
                  <text
                    x={x + nodeWidth / 2}
                    y={y + 22}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={600}
                    fontFamily="var(--font-inter), system-ui, sans-serif"
                    fill="rgb(var(--ink))"
                  >
                    {m.title}
                  </text>
                  <text
                    x={x + nodeWidth / 2}
                    y={y + 40}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="ui-monospace, monospace"
                    fill={
                      isAvail
                        ? "rgb(var(--accent))"
                        : "rgb(var(--ink-subtle))"
                    }
                  >
                    {isAvail ? "AVAILABLE" : "SOON"}
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
