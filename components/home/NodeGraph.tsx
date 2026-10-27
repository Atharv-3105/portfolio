"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GRAPH, INITIAL_TILT } from "./graph";

const GREY = new THREE.Color("#9AA3AD");
const WHITE = new THREE.Color("#E6E8EB");
const AMBER = new THREE.Color("#F5A524");
const EDGE = new THREE.Color("#3A424C");

function Graph({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const greyMesh = useRef<THREE.InstancedMesh>(null);
  const amberMesh = useRef<THREE.InstancedMesh>(null);
  const haloMesh = useRef<THREE.InstancedMesh>(null);

  const grey = useMemo(() => GRAPH.nodes.filter((n) => !n.amber), []);
  const amber = useMemo(() => GRAPH.nodes.filter((n) => n.amber), []);

  const edgeGeometry = useMemo(() => {
    const positions = new Float32Array(GRAPH.edges.length * 6);
    const colors = new Float32Array(GRAPH.edges.length * 6);
    GRAPH.edges.forEach(([a, b], i) => {
      const p = GRAPH.nodes[a];
      const q = GRAPH.nodes[b];
      positions.set([p.x, p.y, p.z, q.x, q.y, q.z], i * 6);
      const c = p.amber || q.amber ? EDGE.clone().lerp(AMBER, 0.45) : EDGE;
      colors.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useEffect(() => {
    const m = new THREE.Matrix4();
    grey.forEach((n, i) => {
      m.makeScale(n.size, n.size, n.size).setPosition(n.x, n.y, n.z);
      greyMesh.current?.setMatrixAt(i, m);
      greyMesh.current?.setColorAt(i, i % 3 === 0 ? WHITE : GREY);
    });
    amber.forEach((n, i) => {
      m.makeScale(n.size, n.size, n.size).setPosition(n.x, n.y, n.z);
      amberMesh.current?.setMatrixAt(i, m);
      const h = n.size * 2.6;
      m.makeScale(h, h, h).setPosition(n.x, n.y, n.z);
      haloMesh.current?.setMatrixAt(i, m);
    });
    for (const mesh of [greyMesh.current, amberMesh.current, haloMesh.current]) {
      if (!mesh) continue;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    return () => edgeGeometry.dispose();
  }, [grey, amber, edgeGeometry]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (spin.current) spin.current.rotation.y += dt * 0.09;
    if (tilt.current && pointer.current) {
      const tx = INITIAL_TILT.x + pointer.current.y * 0.22;
      const ty = pointer.current.x * 0.35;
      tilt.current.rotation.x += (tx - tilt.current.rotation.x) * Math.min(1, dt * 2.5);
      tilt.current.rotation.y += (ty - tilt.current.rotation.y) * Math.min(1, dt * 2.5);
    }
  });

  return (
    <group ref={tilt} rotation={[INITIAL_TILT.x, 0, 0]}>
      <group ref={spin} rotation={[0, INITIAL_TILT.y, 0]}>
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial vertexColors transparent opacity={0.85} />
        </lineSegments>
        <instancedMesh ref={greyMesh} args={[undefined, undefined, grey.length]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial />
        </instancedMesh>
        <instancedMesh ref={haloMesh} args={[undefined, undefined, amber.length]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={AMBER} transparent opacity={0.12} depthWrite={false} />
        </instancedMesh>
        <instancedMesh ref={amberMesh} args={[undefined, undefined, amber.length]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={AMBER} />
        </instancedMesh>
      </group>
    </group>
  );
}

/** The WebGL hero. Loaded with next/dynamic (ssr:false) only on the home page. */
export default function NodeGraph({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  // Pause the render loop entirely while the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), {
      threshold: 0,
    });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Mouse parallax across the whole window, not just the canvas.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onCreated={() => onReady?.()}
      >
        <fog attach="fog" args={["#0F1216", 4.6, 8.4]} />
        <Graph pointer={pointer} />
      </Canvas>
    </div>
  );
}
