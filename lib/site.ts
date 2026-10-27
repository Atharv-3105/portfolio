// Everything on the portfolio that is "content" lives here. Edit freely.

/**
 * Canonical origin used for metadata, sitemap, RSS and Open Graph URLs.
 * Order: SITE_URL env var → Vercel production domain → default below.
 * TODO: change the default to your real domain once you have it.
 */
const DEFAULT_SITE_URL = "https://atharva.vercel.app";
export const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  DEFAULT_SITE_URL
).replace(/\/+$/, "");

export type Project = {
  name: string;
  tag: string;
  description: string;
  stack: string[];
  repo: string;
};

export type Experience = {
  role: string;
  org: string;
  dates?: string;
  location?: string;
  description?: string;
};

export const site = {
  name: "Atharva Dwivedi",
  firstName: "Atharva",
  role: "Backend & AI/ML engineer.",
  location: "Kanpur, UP, India",
  email: "atharvdwivedi8@gmail.com",
  tagline:
    "I build systems where Go services meet ML models — then write up what broke, so the next fresher doesn't lose the same week I did.",
  openTo: {
    roles: "backend & AI/ML engineer roles",
    locations: ["Bengaluru", "Delhi NCR", "Mumbai", "remote"],
  },
  resume: "/Atharva_Dwivedi_Resume.pdf",
  links: {
    github: "https://github.com/Atharv-3105",
    // TODO: add your profile URLs. Empty strings are hidden everywhere.
    linkedin: "",
    huggingface: "",
    leetcode: "",
  },
  stack: [
    "Go",
    "Python",
    "FastAPI",
    "PyTorch",
    "LangGraph",
    "RAG",
    "WebSockets",
    "Docker",
    "PostgreSQL",
    "Redis",
    "ChromaDB",
    "vLLM",
  ],
  projects: [
    {
      name: "ArchiGen AI",
      tag: "agents",
      description:
        "Multi-agent pipeline that turns a plain-language system description into an Excalidraw architecture diagram, with a self-healing validation loop and streamed output.",
      stack: ["Python", "FastAPI", "LangGraph", "Groq", "React", "TypeScript"],
      repo: "https://github.com/Atharv-3105/ArchiGen-AI",
    },
    {
      name: "KnowYourRepo",
      tag: "backend + ml",
      description: "Paste a GitHub URL, get a call graph, dependency map and a RAG chat over the codebase.",
      stack: ["Go", "FastAPI", "Postgres", "pgvector", "React"],
      repo: "https://github.com/Atharv-3105/KnowYourRepo",
    },
    {
      name: "SmartFile-Manager",
      tag: "backend",
      description:
        "Concurrent file-ingestion pipeline in Go with a Python OCR + embedding service for semantic search over local documents.",
      stack: ["Go", "Python", "EasyOCR", "Sentence-Transformers", "SQLite", "Docker"],
      repo: "https://github.com/Atharv-3105/SmartFile-Manager",
    },
    {
      name: "Semantic-Duel",
      tag: "real-time",
      description: "Multiplayer word-battle game over WebSockets where answers are scored by semantic similarity.",
      stack: ["Go", "WebSockets", "NLP embeddings", "Docker"],
      repo: "https://github.com/Atharv-3105/Semantic-Duel",
    },
    {
      name: "JobBot",
      tag: "agents",
      description:
        "Telegram bot that finds job listings, scores them against a profile and tailors a LaTeX résumé without inventing skills.",
      stack: ["Python", "LangGraph", "Playwright", "LaTeX"],
      repo: "https://github.com/Atharv-3105/JobBot",
    },
    {
      name: "Language Model Implementations",
      tag: "ml from scratch",
      description: "LLaMA-2, Gemma-3 270M and Qwen-3 0.6B rebuilt in PyTorch: GQA, RoPE, RMSNorm, SwiGLU, KV cache.",
      stack: ["PyTorch"],
      repo: "https://github.com/Atharv-3105/Language_Model_Implementations",
    },
  ] satisfies Project[],
  experience: [
    {
      role: "Software Developer Intern",
      org: "Helionyex Solutions",
      dates: "June 2026 – Present",
      location: "Remote",
      description:
        "Core modules for a cross-platform climate-data reception and processing system (Electron, React, TypeScript, PostgreSQL): auth and RBAC, a real-time data-quality validation engine with WMO-compliant QC rules, and secure IPC interfaces.",
    },
    {
      role: "Python & AI Trainer",
      org: "NimbleQ",
      description: "Mentored 150+ educators on Python and Generative AI fundamentals.",
    },
    {
      role: "B.Tech, Artificial Intelligence & Machine Learning",
      org: "Dr. A. P. J. Abdul Kalam Technical University (AKTU)",
      dates: "2022 – 2026",
    },
  ] satisfies Experience[],
  fromScratch:
    "Transformer, LLaMA 2, ViT, DDPM, U-Net, GANs, VAE, PPO, SAC, TD3, DDPG, MHA, MLA, GQA, LoRA, Qwen, MoEs, DPO.",
  dsa: "600+ DSA problems on LeetCode",
  journal: {
    title: "The learning journal",
    intro:
      "Build logs from my projects: what I tried, what broke, and how I fixed it. Written for the next fresher who hits the same wall.",
    sections: {
      ml: {
        title: "WhatTheML",
        nav: "whatTheML",
        intro: "Models rebuilt from scratch, RAG, fine-tuning and RL: the ML side of the projects, failures included.",
      },
      backend: {
        title: "WhatTheBackend",
        nav: "whatTheBackend",
        intro: "Go services, concurrency, real-time systems and system design, written up as I hit the walls.",
      },
    },
  },
} as const;

export type SocialLink = { label: string; href: string };

/** Footer / contact links, with empty URLs filtered out. */
export function contactLinks(): SocialLink[] {
  const { links } = site;
  return [
    { label: "github ↗", href: links.github },
    { label: "linkedin ↗", href: links.linkedin },
    { label: "huggingface ↗", href: links.huggingface },
    { label: "leetcode ↗", href: links.leetcode },
  ].filter((l) => l.href.trim() !== "");
}
