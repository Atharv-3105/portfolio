# ~/atharva_: portfolio + learning journal

Personal site of **Atharva Dwivedi** (Backend & AI/ML engineer): a portfolio home page plus a
learning journal with two sections, **WhatTheML** and **WhatTheBackend**. Each post is a build log with the same six-part structure: problem, first attempt, what broke, fix, hindsight, and a checklist for readers who are stuck.

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, dark theme only
- Posts are MDX files in `content/posts/`, validated by zod at build time
- Every page is statically generated. No database, no server code, no env vars required
- react-three-fiber node graph on the home page (lazy, desktop only, static SVG fallback)
- SEO: per-page metadata, generated Open Graph/Twitter images, `sitemap.xml`, `robots.txt`, `rss.xml`

## Local development

Requires Node.js 20.9+.

```bash
npm install
npm run dev          # http://localhost:3000 (drafts visible)
```

| Command                                | What it does                                                  |
| -------------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                          | Dev server, drafts shown                                      |
| `npm run new-post -- <ml\|backend> <slug>` | New post from `templates/post.mdx`                        |
| `npm run check`                        | Validate every post (frontmatter + the six headings)          |
| `npm run build`                        | `check` (prebuild) + production build                         |
| `npm start`                            | Serve the production build                                    |
| `npm run lint` / `npm run typecheck`   | ESLint / TypeScript                                           |

`SHOW_DRAFTS=1 npm run build && npm start` builds production with drafts included, for screenshots.

## Adding a post

```bash
npm run new-post -- backend batching-ollama-embeddings
```

Fill in the frontmatter and the six sections, set `draft: false`, run `npm run check`, commit.
The full guide (fields, sections, components, code blocks) is in **[CONTENT.md](./CONTENT.md)**.

## Editing the portfolio

All home-page content (tagline, stack, projects, experience, links) lives in **`lib/site.ts`**.
A project card gets a **writeup** link automatically when a published post has the same
`project` name.

## Deploying to Vercel

1. Push this repo to GitHub.
2. On vercel.com: **Add New → Project → Import** the repo. The framework is detected as Next.js; keep the defaults.
3. Deploy. No environment variables are required.
4. Optional but recommended: in **Settings → Environment Variables**, set `SITE_URL` to your final domain
   (e.g. `https://atharvadwivedi.dev`, no trailing slash) and redeploy. Without it, the site uses Vercel's production domain, then the default in `lib/site.ts`.

`npm run build` runs the post checks first, so a malformed post fails the deploy instead of going live.

## Project structure

```
app/                       routes (home, /blog, /blog/[section], /blog/[section]/[slug], 404,
                           sitemap.ts, robots.ts, rss.xml, opengraph images)
components/home/           hero 3D graph (NodeGraph = r3f, GraphFallback = SVG)
components/blog/           journal header, sidebar, TOC, project card, search
components/mdx/            <Callout>, <Figure>, link/table overrides
content/posts/{ml,backend} the posts (MDX)
lib/site.ts                portfolio content + SITE_URL
lib/post-rules.mjs         post schema + heading rules (shared by build and scripts)
lib/posts.ts               loads/validates posts, grouping, prev/next, TOC
lib/rehype-journal.ts      numbers H2s 01–06, wraps section 06 in the amber box
scripts/                   check-posts.mjs, new-post.mjs
templates/post.mdx         new-post template
public/                    résumé PDF
```

Fonts (Space Grotesk, JetBrains Mono; SIL OFL, licences in `app/fonts/`) are self-hosted
through `next/font/local`, so builds don't depend on reaching Google Fonts.

## TODO before going live

- [ ] **Social links**: fill `linkedin`, `huggingface`, `leetcode` in `lib/site.ts` (empty ones are hidden).
- [ ] **Domain**: set `SITE_URL` on Vercel, or change `DEFAULT_SITE_URL` in `lib/site.ts` (currently `https://atharva.vercel.app`).
- [ ] **Posts**: write the first real post per section, then delete `content/posts/*/sample-*.mdx`.
- [ ] Replace `public/Atharva_Dwivedi_Resume.pdf` whenever the résumé changes (keep the file name).
