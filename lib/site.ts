// Everything on the portfolio that is "content" lives here. Edit freely.
//
// Rule for this file: every claim should be checkable from a link next to it.
// If a line can't point at a repo, a live app or a result file, cut it.

/**
 * Canonical origin used for metadata, sitemap, RSS and Open Graph URLs.
 * Order: SITE_URL env var → Vercel production domain → default below.
 */
const DEFAULT_SITE_URL = "https://portfolio-gamma-lilac-65.vercel.app";
export const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  DEFAULT_SITE_URL
).replace(/\/+$/, "");

export type ProofLink = { label: string; href: string };

export type Project = {
  name: string;
  /** One sentence: what it does, in plain words. */
  what: string;
  /** The one engineering problem that made it hard, and what I did about it. */
  hard: string;
  /** How I checked that it works: live app, test results, published numbers. */
  proof: string;
  proofLinks: ProofLink[];
  /** What's still broken, taken from the project's own README or results. */
  broken: string;
  stack: string[];
  repo: string;
};

export type Experience = {
  role: string;
  org: string;
  dates?: string;
  description?: string;
};

export const site = {
  name: "Atharva Dwivedi",
  firstName: "Atharva",
  role: "Backend & AI/ML engineer",
  location: "Kanpur, UP, India",
  email: "atharvdwivedi8@gmail.com",

  // Used for <meta description> and link previews.
  tagline:
    "Backend systems with ML inside them, built on free tiers and free GPUs. Each project says what it does, how I checked it, and what's still broken.",

  // The three lines at the top of the home page.
  intro: [
    "I build backend systems with ML inside them, on free tiers and free GPUs.",
    "That makes rate limits, daily quotas and session timeouts part of the design, and it's where most of my engineering has gone.",
    "Each project below says what it does, how I checked it, and what's still broken.",
  ],

  openTo: {
    roles: "backend & AI/ML engineer roles",
    locations: ["Bengaluru", "Delhi NCR", "Mumbai", "remote"],
  },
  resume: "/Atharva_Dwivedi_Resume.pdf",
  links: {
    github: "https://github.com/Atharv-3105",
    // TODO: add your profile URLs. Empty strings are hidden everywhere.
    linkedin: "https://linkedin.com/in/atharv3105",
    huggingface: "https://huggingface.co/Atharva31",
    leetcode: "https://leetcode.com/atharvdwivedi8",
  },

  projects: [
    {
      name: "JobBot",
      what: "A Telegram bot that pulls jobs from 8 boards, scores them against the skills I actually have, and tailors my LaTeX résumé for the ones worth applying to.",
      hard: "A tailored résumé must never invent a skill or a number. That's enforced in code, not by asking the model nicely: an allow-list of skills from my own résumé, a guard that rejects any added metric, and a gate that refuses to compile injected LaTeX.",
      proof:
        "I ran an adversarial test matrix against my own guards. First run: 0/12 passed. I traced that to 4 bugs, fixed them, and the same 12 cases passed. Zero fabricated skills or numbers in either run. 31 automated tests.",
      proofLinks: [
        {
          label: "raw test results",
          href: "https://github.com/Atharv-3105/JobBot/blob/HEAD/tests/metrics_output/testing_audit_20260828_222642.json",
        },
      ],
      broken:
        "The /search crawler path has had less adversarial testing than scoring and tailoring, and a task that's still waiting in the queue can't be cancelled yet.",
      stack: ["Python", "asyncio", "LangGraph", "SQLite", "LaTeX"],
      repo: "https://github.com/Atharv-3105/JobBot",
    },
    {
      name: "ArchiGen AI",
      what: "Describe a system in plain English and get an editable Excalidraw architecture diagram, streamed to the browser stage by stage.",
      hard: "Models are bad at coordinates, so the LLM only decides structure. Graphviz computes every position, and a plain-code validator checks every arrow and label before you see anything. A diagram that still fails after 3 repair rounds becomes an honest error, not a broken drawing.",
      proof: "Deployed: FastAPI on Render's free tier, React on Vercel, with sign-in and a daily limit per user. The backend sleeps when idle, so the first diagram can take a minute.",
      proofLinks: [{ label: "try it live", href: "https://archigenai.vercel.app" }],
      broken:
        "Layer ordering isn't enforced yet (an inverted condition in the layout step), and there are no automated tests or evals, so I make no accuracy claims.",
      stack: ["Python", "FastAPI", "LangGraph", "Graphviz", "React", "SSE"],
      repo: "https://github.com/Atharv-3105/ArchiGen-AI",
    },
    {
      name: "KnowYourRepo",
      what: "Paste a GitHub URL and get the repo's symbols, call graph and architecture, plus a chat that answers with file-and-line citations.",
      hard: "Embedding a whole codebase on a free tier capped at 50 requests a day. Each request carries 128 chunks, progress is saved per file so ingestion resumes the next day, and chat falls back to keyword and call-graph search when embeddings run out.",
      proof:
        "gorilla/mux ingests in a few seconds: 17 files, 261 symbols, 2,239 call edges, 31 components. Go and Python services on Postgres + pgvector, with CI and Prometheus metrics.",
      proofLinks: [{ label: "demo walkthrough", href: "https://github.com/Atharv-3105/KnowYourRepo#readme" }],
      broken: "Not publicly hosted yet. It runs locally with one docker compose command.",
      stack: ["Go", "Python", "FastAPI", "Postgres", "pgvector", "React"],
      repo: "https://github.com/Atharv-3105/KnowYourRepo",
    },
    {
      name: "IndicSLM",
      what: "A ~22M-parameter language model for Hindi, Marathi and English, built end to end: government-scheme text, a 16K BPE tokenizer, pretraining, SFT, DPO and an eval harness.",
      hard: "Making it train at all on free Kaggle T4s: a starting loss of 340 instead of 9.7 from a bad init, out-of-memory errors that forced a two-GPU setup, and a session that died mid-run and took a full set of checkpoints with it.",
      proof: "Evaluated on 90 prompts across the three languages, with the results published as they came out.",
      proofLinks: [
        { label: "eval results", href: "https://github.com/Atharv-3105/IndicSLM-From-Scratch-/tree/HEAD/eval/out" },
      ],
      broken:
        "It's knowingly undertrained (4.6 tokens per parameter against ~20 for compute-optimal). With greedy decoding it loops on ~37% of prompts, gets 0% of scheme URLs right, and DPO showed no clear gain.",
      stack: ["PyTorch", "BPE", "Kaggle T4", "W&B"],
      repo: "https://github.com/Atharv-3105/IndicSLM-From-Scratch-",
    },
  ] satisfies Project[],

  // Smaller projects: one line each.
  alsoBuilt: [
    {
      name: "SmartFile-Manager",
      line: "Go file watcher + worker pool feeding a Python OCR and embedding service, for semantic search over local files.",
      repo: "https://github.com/Atharv-3105/SmartFile-Manager",
    },
    {
      name: "Semantic-Duel",
      line: "Real-time 1v1 word game over WebSockets in Go, scored by embedding similarity.",
      repo: "https://github.com/Atharv-3105/Semantic-Duel",
    },
    {
      name: "Language Model Implementations",
      line: "Gemma 3 270M rebuilt in PyTorch with the official weights loaded and generating text, following Sebastian Raschka's LLMs-from-scratch.",
      repo: "https://github.com/Atharv-3105/Language_Model_Implementations",
    },
  ],

  // What I'm working on right now.
  now: [
    "Going deep on inference engineering and backend systems: an 8-week plan that only covers things I haven't built before.",
    "Working through Alex Xu's System Design Interview and implementing each chapter in Go. Each chapter becomes a WhatTheBackend post.",
  ],

  experience: [
    {
      role: "Associate Software Developer",
      org: "Helionyex Solutions",
      dates: "June 2026 – present · remote",
      description:
        "Core modules for a cross-platform climate-data reception and processing system: auth and RBAC, a real-time data-quality engine that applies WMO QC rules before readings reach PostgreSQL, and secure IPC between the Electron app's processes.",
    },
    {
      role: "Python & AI Trainer",
      org: "NimbleQ",
      description: "Taught Python and Generative AI fundamentals to 150+ educators.",
    },
    {
      role: "B.Tech, Artificial Intelligence & Machine Learning",
      org: "AKTU",
      dates: "2022 – 2026",
    },
  ] satisfies Experience[],

  journal: {
    title: "The learning journal",
    intro:
      "Concepts explained through things I built, written for students who are stuck where I was. Two sections: WhatTheML and WhatTheBackend.",
    sections: {
      ml: {
        title: "WhatTheML",
        nav: "whatTheML",
        intro: "Models from scratch, training on free GPUs, RAG and fine-tuning, explained through my own projects.",
      },
      backend: {
        title: "WhatTheBackend",
        nav: "whatTheBackend",
        intro: "Go, concurrency, queues, rate limits and system design, explained through my own projects.",
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
