# Writing journal posts

Every post is one `.mdx` file:

```
content/posts/ml/<slug>.mdx        → /blog/ml/<slug>        (WhatTheML)
content/posts/backend/<slug>.mdx   → /blog/backend/<slug>   (WhatTheBackend)
```

The file name is the URL slug. Use kebab-case only (`batching-ollama-embeddings.mdx`).

## Start a post

```bash
npm run new-post -- backend batching-ollama-embeddings
npm run new-post -- ml gqa-and-rope-from-scratch
```

This copies `templates/post.mdx` with today's date and the six headings already in place.
New posts start with `draft: true`. Drafts are visible in `npm run dev` but never in production.

When it's ready, fill in every `TODO`, set `draft: false`, and run `npm run check`.

## Frontmatter

| Field         | Required | Example                                       | Notes                                                                    |
| ------------- | -------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| `title`       | yes      | `"20 minutes to embed one repo"`              | Max 120 chars. The page H1; don't repeat it as `#` in the body.          |
| `description` | yes      | `"How batching + a worker pool cut…"`         | 20–200 chars. Used on cards, in search, in link previews and SEO.         |
| `section`     | yes      | `"backend"`                                   | `"ml"` or `"backend"`. Must match the folder.                            |
| `date`        | yes      | `"2026-10-25"`                                | `YYYY-MM-DD`. Sorting and "latest posts" use it.                        |
| `project`     | yes      | `"KnowYourRepo"`                              | Groups posts in the sidebar and section page. If it matches a project name in `lib/site.ts` (case-insensitive), that card on the home page gets a **writeup** link. |
| `repo`        | no       | `"https://github.com/Atharv-3105/KnowYourRepo"` | Full URL. Shows the "View repo ↗" button.                           |
| `stack`       | yes      | `["Go", "Ollama", "ChromaDB"]`                | Shown in the project card.                                               |
| `tags`        | yes      | `["go", "concurrency"]`                       | Lowercase keeps the tag chips on `/blog` tidy.                         |
| `level`       | yes      | `"intermediate"`                              | `beginner`, `intermediate` or `advanced`.                                |
| `tldr`        | yes      | `"Ingesting took 20 min… now 2."`             | One or two sentences in the `$ tl;dr` box. `` `backticks` `` render as code. |
| `status`      | no       | `"in progress"`                               | Free text in the project card ("Status: …").                            |
| `draft`       | no       | `true`                                        | Defaults to `false`. Drafts are hidden in production builds.            |

Reading time is computed automatically. Unknown fields are rejected, which catches typos like `tag:` or `desc:`.

## The six sections (required, in this order)

Every post uses the same structure, and the build checks it. Write exactly these H2s:

```md
## The problem
## What I tried first
## What broke, and why
## The fix
## What I'd do differently
## If you're stuck on this
```

- They are numbered 01–06 automatically. Don't type the numbers.
- `## If you're stuck on this` and everything after it renders as the amber callout box. Short bullet checklists work best there.
- Need sub-sections? Use `###`. Any other `##` heading fails the check.
- Curly apostrophes (`’`) are accepted.

## Markdown you can use

Normal Markdown plus GFM (tables, task lists, strikethrough, autolinks).

Code blocks take a language and an optional filename bar:

````md
```go title="ingest/embed.go"
jobs := make(chan []Chunk)
```

```python title="model/norm.py" {3-4}
# {3-4} highlights lines 3–4
```
````

## Components

Only two, so posts stay consistent:

```mdx
<Callout type="note">An aside. **Markdown** works inside.</Callout>

<Callout type="warn" title="optional custom label">A gotcha the reader should not miss.</Callout>

<Figure src="/images/knowyourrepo/call-graph.png" alt="Call graph of gin-gonic rendered in the UI" caption="Optional caption" />
```

Put images in `public/images/<project>/…` and reference them as `/images/…`. `alt` is required.

## What the checks enforce

`npm run check` runs `scripts/check-posts.mjs`. It also runs automatically before every `npm run build`, so Vercel refuses to deploy a broken post. It checks:

- frontmatter matches the schema above (`lib/post-rules.mjs`, the single source of truth)
- the six H2s, exactly and in order; no `#` H1 in the body
- file name is kebab-case; `section` matches the folder
- published posts (`draft: false`) contain no `TODO`

## Previewing drafts

- `npm run dev`: drafts are always shown (with a `draft` badge).
- Production build with drafts, for screenshots: `SHOW_DRAFTS=1 npm run build && npm start`.

## Deleting the samples

`content/posts/ml/sample-ml.mdx` and `content/posts/backend/sample-backend.mdx` are placeholders (`draft: true`). Delete them once you have a real post in each section. The site handles empty sections.
