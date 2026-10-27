"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { GraphFallback } from "./GraphFallback";

// Separate chunk: three.js + r3f are only fetched on the home page, on capable desktops.
const NodeGraph = dynamic(() => import("./NodeGraph"), { ssr: false, loading: () => null });

class WebGLBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const [use3d, setUse3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    const webgl = hasWebGL();
    const evaluate = () => setUse3d(webgl && wide.matches && !reduce.matches);
    evaluate();
    reduce.addEventListener("change", evaluate);
    wide.addEventListener("change", evaluate);
    return () => {
      reduce.removeEventListener("change", evaluate);
      wide.removeEventListener("change", evaluate);
    };
  }, []);

  const showFallback = !use3d || !ready;

  return (
    <div className="relative flex h-[300px] min-w-0 flex-[1_1_380px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line-strong bg-raised sm:h-[420px]">
      <div aria-hidden="true" className="absolute size-[300px] rounded-full border border-ring-dim sm:size-[340px]" />
      <div aria-hidden="true" className="absolute size-[210px] rounded-full border border-line-strong sm:size-[240px]" />
      <div aria-hidden="true" className="absolute size-[120px] rounded-full border border-accent/60 sm:size-[140px]" />

      <GraphFallback
        className={`relative h-[86%] w-[86%] transition-opacity duration-700 ${showFallback ? "opacity-100" : "opacity-0"}`}
      />
      {use3d ? (
        <WebGLBoundary onError={() => setUse3d(false)}>
          <NodeGraph onReady={() => setReady(true)} />
        </WebGLBoundary>
      ) : null}

      <p className="pointer-events-none absolute right-4 bottom-4 left-4 m-0 font-mono text-xs text-fg-faint">
        {"// go services · ml models · the edges between"}
      </p>
    </div>
  );
}
