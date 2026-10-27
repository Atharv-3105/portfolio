// Single source of truth for what a valid journal post looks like.
// Imported by lib/posts.ts (Next build) and scripts/check-posts.mjs (prebuild / `npm run check`).
// Plain ESM JavaScript on purpose so the check script can run with bare `node`.
import { z } from "zod";

export const SECTIONS = /** @type {const} */ (["ml", "backend"]);
export const LEVELS = /** @type {const} */ (["beginner", "intermediate", "advanced"]);

/** The six H2 headings every post must contain, in this exact order. */
export const REQUIRED_HEADINGS = /** @type {const} */ ([
  "The problem",
  "What I tried first",
  "What broke, and why",
  "The fix",
  "What I'd do differently",
  "If you're stuck on this",
]);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** YAML turns unquoted 2026-10-25 into a Date; normalise it back to a string. */
const dateField = z.preprocess(
  (v) => (v instanceof Date && !Number.isNaN(v.getTime()) ? v.toISOString().slice(0, 10) : v),
  z
    .string({ error: "date is required (YYYY-MM-DD)" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
    .refine((s) => {
      const d = new Date(`${s}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
    }, "date is not a real calendar date"),
);

const nonEmpty = (field) => z.string({ error: `${field} is required` }).trim().min(1, `${field} must not be empty`);

export const frontmatterSchema = z
  .object({
    title: nonEmpty("title").max(120, "title must be at most 120 characters"),
    description: nonEmpty("description")
      .min(20, "description should be at least 20 characters (it is used for SEO and cards)")
      .max(200, "description must be at most 200 characters"),
    section: z.enum(SECTIONS, { error: `section must be one of: ${SECTIONS.join(", ")}` }),
    date: dateField,
    project: nonEmpty("project"),
    repo: z.url({ error: "repo must be a full URL (https://…)" }).optional(),
    stack: z.array(nonEmpty("stack item"), { error: "stack must be a list of strings" }).min(1, "stack needs at least one item"),
    tags: z.array(nonEmpty("tag"), { error: "tags must be a list of strings" }).min(1, "tags needs at least one item"),
    level: z.enum(LEVELS, { error: `level must be one of: ${LEVELS.join(", ")}` }),
    tldr: nonEmpty("tldr"),
    status: z.string().trim().min(1).optional(),
    draft: z.boolean({ error: "draft must be true or false" }).default(false),
  })
  .strict();

/**
 * Extract ATX headings (#, ##, …) from a markdown body, skipping fenced code blocks.
 * @param {string} body
 * @returns {{ depth: number, text: string, line: number }[]}
 */
export function extractHeadings(body) {
  const out = [];
  let fence = null;
  body.split(/\r?\n/).forEach((raw, i) => {
    const fenceMatch = raw.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      return;
    }
    if (fence) return;
    const m = raw.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (m) out.push({ depth: m[1].length, text: m[2].trim(), line: i + 1 });
  });
  return out;
}

/** Typographic apostrophes are accepted and treated as straight ones. */
export const normaliseHeading = (s) => s.replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();

function formatIssues(error) {
  return error.issues.map((issue) => {
    const where = issue.path.length ? issue.path.join(".") : "frontmatter";
    return `frontmatter "${where}": ${issue.message}`;
  });
}

/**
 * Validate one post. Pure function: the caller reads the file.
 * @param {{ folderSection: string, slug: string, data: unknown, body: string }} input
 * @returns {{ ok: true, frontmatter: z.output<typeof frontmatterSchema> } | { ok: false, errors: string[] }}
 */
export function validatePost({ folderSection, slug, data, body }) {
  const errors = [];

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(`file name "${slug}.mdx" must be kebab-case (lowercase letters, digits and dashes)`);
  }

  const parsed = frontmatterSchema.safeParse(data ?? {});
  if (!parsed.success) errors.push(...formatIssues(parsed.error));
  else if (parsed.data.section !== folderSection) {
    errors.push(`frontmatter section is "${parsed.data.section}" but the file is in content/posts/${folderSection}/`);
  }

  const headings = extractHeadings(body);
  const h1 = headings.find((h) => h.depth === 1);
  if (h1) errors.push(`line ${h1.line}: don't use a "# " H1 in the body; the title comes from frontmatter`);

  const h2s = headings.filter((h) => h.depth === 2).map((h) => ({ ...h, text: normaliseHeading(h.text) }));
  const found = h2s.map((h) => h.text);
  const sameList =
    found.length === REQUIRED_HEADINGS.length && REQUIRED_HEADINGS.every((title, i) => found[i] === title);
  if (!sameList) {
    const missing = REQUIRED_HEADINGS.filter((t) => !found.includes(t));
    const extra = h2s.filter((h) => !REQUIRED_HEADINGS.includes(h.text));
    const lines = [
      "the body must have exactly these six H2 (##) headings, in this order:",
      ...REQUIRED_HEADINGS.map((t, i) => `    ${i + 1}. ## ${t}`),
      `  found: ${found.length ? found.map((t) => `"${t}"`).join(", ") : "(no H2 headings)"}`,
    ];
    if (missing.length) lines.push(`  missing: ${missing.map((t) => `"${t}"`).join(", ")}`);
    if (extra.length) {
      lines.push(
        `  unexpected: ${extra.map((h) => `"${h.text}" (line ${h.line})`).join(", ")} (use ### for sub-sections)`,
      );
    }
    if (!missing.length && !extra.length) lines.push("  the headings are all there but out of order");
    errors.push(lines.join("\n"));
  }

  if (parsed.success && !parsed.data.draft) {
    const raw = JSON.stringify(data) + "\n" + body;
    if (/\bTODO\b/.test(raw)) errors.push('published post (draft: false) still contains "TODO" placeholders');
  }

  return errors.length ? { ok: false, errors } : { ok: true, frontmatter: parsed.data };
}
