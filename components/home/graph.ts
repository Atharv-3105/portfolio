// Deterministic node graph shared by the WebGL scene and the static SVG fallback.

export type GraphNode = { x: number; y: number; z: number; size: number; amber: boolean };
export type GraphData = { nodes: GraphNode[]; edges: [number, number][] };

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AMBER = new Set([3, 11, 19, 27, 36]);

export function buildGraph(count = 42, seed = 7): GraphData {
  const rand = mulberry32(seed);
  const nodes: GraphNode[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere with radial jitter, so it reads as a cloud, not a ball.
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const radius = 1.55 + (rand() - 0.5) * 0.9;
    nodes.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius * 0.92,
      z: Math.sin(theta) * r * radius,
      size: AMBER.has(i) ? 0.07 : 0.035 + rand() * 0.025,
      amber: AMBER.has(i),
    });
  }

  const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  nodes.forEach((n, i) => {
    const nearest = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 + (m.z - n.z) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, n.amber ? 4 : 2);
    for (const { j } of nearest) {
      const k = key(i, j);
      if (!seen.has(k)) {
        seen.add(k);
        edges.push([i, j]);
      }
    }
  });
  return { nodes, edges };
}

export const GRAPH = buildGraph();

/** Same tilt the 3D scene starts with, used to project the fallback. */
export const INITIAL_TILT = { x: 0.35, y: 0.6 };

export function project(n: GraphNode, rotY = INITIAL_TILT.y, rotX = INITIAL_TILT.x) {
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);
  const x1 = n.x * cy + n.z * sy;
  const z1 = -n.x * sy + n.z * cy;
  const cx = Math.cos(rotX);
  const sx = Math.sin(rotX);
  const y2 = n.y * cx - z1 * sx;
  const z2 = n.y * sx + z1 * cx;
  const camera = 6.2;
  const scale = camera / (camera - z2);
  return { x: x1 * scale, y: -y2 * scale, depth: z2, scale };
}
