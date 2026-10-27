import { GRAPH, project } from "./graph";

/** Static SVG version of the hero graph: no JS, used on mobile, reduced motion and without WebGL. */
export function GraphFallback({ className = "" }: { className?: string }) {
  const pts = GRAPH.nodes.map((n) => ({ ...project(n), n }));
  const S = 72; // world units → SVG px
  const depthOpacity = (d: number) => Math.min(1, Math.max(0.25, 0.62 + d * 0.22));
  return (
    <svg
      viewBox="-200 -180 400 360"
      className={className}
      role="img"
      aria-label="Illustration: a network of connected nodes, a few highlighted in amber"
      preserveAspectRatio="xMidYMid meet"
    >
      <g strokeLinecap="round">
        {GRAPH.edges.map(([a, b]) => {
          const p = pts[a];
          const q = pts[b];
          const amber = p.n.amber || q.n.amber;
          return (
            <line
              key={`${a}-${b}`}
              x1={p.x * S}
              y1={p.y * S}
              x2={q.x * S}
              y2={q.y * S}
              stroke={amber ? "#F5A524" : "#3A424C"}
              strokeOpacity={amber ? 0.35 : depthOpacity((p.depth + q.depth) / 2) * 0.85}
              strokeWidth={1}
            />
          );
        })}
      </g>
      <g>
        {[...pts]
          .sort((a, b) => a.depth - b.depth)
          .map((p, i) =>
            p.n.amber ? (
              <g key={i}>
                <circle cx={p.x * S} cy={p.y * S} r={p.n.size * S * p.scale * 2.4} fill="#F5A524" opacity={0.14} />
                <circle cx={p.x * S} cy={p.y * S} r={p.n.size * S * p.scale} fill="#F5A524" />
              </g>
            ) : (
              <circle
                key={i}
                cx={p.x * S}
                cy={p.y * S}
                r={p.n.size * S * p.scale}
                fill={p.depth > 0.4 ? "#E6E8EB" : "#9AA3AD"}
                opacity={depthOpacity(p.depth)}
              />
            ),
          )}
      </g>
    </svg>
  );
}
