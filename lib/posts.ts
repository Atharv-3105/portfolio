import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { z } from "zod";
import { SECTIONS, extractHeadings, frontmatterSchema, normaliseHeading, validatePost } from "./post-rules.mjs";
import { site } from "./site";

export type Section = (typeof SECTIONS)[number];
export type Frontmatter = z.output<typeof frontmatterSchema>;

export type TocItem = { id: string; text: string };

/** Everything a list, card or search result needs. Serialisable (safe to pass to client components). */
export type PostMeta = Omit<Frontmatter, "section"> & {
  section: Section;
  slug: string;
  url: string;
  dateLabel: string;
  readingMinutes: number;
};

export type Post = PostMeta & { body: string; toc: TocItem[] };

export type ProjectGroup = { project: string; posts: PostMeta[] };

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Drafts show up in `next dev`, or in any build/start when SHOW_DRAFTS=1. */
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";

export const sectionTitle = (s: Section) => site.journal.sections[s].title;
export const sectionNav = (s: Section) => site.journal.sections[s].nav;
export const isSection = (s: string): s is Section => (SECTIONS as readonly string[]).includes(s);
export { SECTIONS };

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function readingMinutes(body: string): number {
  const text = body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ") // MDX comments
    .replace(/<[^>]+>/g, " ") // JSX tags
    .replace(/[#>*_`~\-|[\]()]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Mirrors rehype-slug: one slugger over every heading, in document order. */
function buildToc(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  for (const h of extractHeadings(body)) {
    const plain = h.text.replace(/`([^`]*)`/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_]/g, "");
    const id = slugger.slug(plain);
    if (h.depth === 2) toc.push({ id, text: normaliseHeading(plain) });
  }
  return toc;
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  const posts: Post[] = [];
  const problems: string[] = [];

  for (const section of SECTIONS) {
    const dir = path.join(POSTS_DIR, section);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const result = validatePost({ folderSection: section, slug, data, body: content });
      if (!result.ok) {
        problems.push(`content/posts/${section}/${file}\n  - ${result.errors.join("\n  - ")}`);
        continue;
      }
      const fm = result.frontmatter;
      posts.push({
        ...fm,
        section,
        slug,
        url: `/blog/${section}/${slug}`,
        dateLabel: formatDate(fm.date),
        readingMinutes: readingMinutes(content),
        body: content,
        toc: buildToc(content),
      });
    }
  }

  if (problems.length) {
    throw new Error(`Invalid journal post(s). See CONTENT.md.\n\n${problems.join("\n\n")}\n`);
  }

  return posts
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
}

function all(): Post[] {
  if (!cache) cache = loadAll();
  return cache;
}

export function toMeta(post: Post): PostMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, toc, ...meta } = post;
  return meta;
}

/** Newest first. */
export function getAllPosts(): PostMeta[] {
  return all().map(toMeta);
}

export function getPostsBySection(section: Section): PostMeta[] {
  return getAllPosts().filter((p) => p.section === section);
}

export function getPost(section: Section, slug: string): Post | undefined {
  return all().find((p) => p.section === section && p.slug === slug);
}

/**
 * Posts grouped by project: groups ordered by their newest post,
 * posts inside a group oldest → newest so a series reads in order.
 */
export function groupByProject(posts: PostMeta[]): ProjectGroup[] {
  const map = new Map<string, PostMeta[]>();
  for (const p of posts) {
    const list = map.get(p.project) ?? [];
    list.push(p);
    map.set(p.project, list);
  }
  const newest = (g: PostMeta[]) => g.reduce((m, p) => (p.date > m ? p.date : m), "");
  return [...map.entries()]
    .map(([project, list]) => ({
      project,
      posts: [...list].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => newest(b.posts).localeCompare(newest(a.posts)) || a.project.localeCompare(b.project));
}

/** Prev/next follow the sidebar order (grouped by project). */
export function getAdjacent(section: Section, slug: string) {
  const flat = groupByProject(getPostsBySection(section)).flatMap((g) => g.posts);
  const i = flat.findIndex((p) => p.slug === slug);
  return { prev: i > 0 ? flat[i - 1] : undefined, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined };
}

/** Latest post written about a project (matched by frontmatter `project`, case-insensitive). */
export function getWriteupFor(projectName: string): PostMeta | undefined {
  const key = projectName.trim().toLowerCase();
  return getAllPosts().find((p) => p.project.trim().toLowerCase() === key);
}

export function getAllTags(posts: PostMeta[] = getAllPosts()): string[] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

export const projectAnchor = (project: string) => new GithubSlugger().slug(project);
