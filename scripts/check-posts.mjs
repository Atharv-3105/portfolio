#!/usr/bin/env node
// Validates every post in content/posts/<section>/*.mdx:
//   - frontmatter matches the zod schema in lib/post-rules.mjs
//   - the body has the six required H2 headings in the exact order
//   - file name, folder and frontmatter section agree; slugs are unique
// Runs before every `npm run build` (prebuild) and via `npm run check`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { SECTIONS, validatePost } from "../lib/post-rules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "content", "posts");

let total = 0;
let drafts = 0;
const failures = [];

for (const section of SECTIONS) {
  const dir = path.join(postsDir, section);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).sort()) {
    const rel = path.relative(root, path.join(dir, file));
    if (file.endsWith(".md")) {
      failures.push({ rel, errors: ["posts must use the .mdx extension"] });
      continue;
    }
    if (!file.endsWith(".mdx")) continue;
    total++;
    const slug = file.replace(/\.mdx$/, "");
    let parsed;
    try {
      parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (err) {
      failures.push({ rel, errors: [`could not parse frontmatter: ${err.message}`] });
      continue;
    }
    const result = validatePost({ folderSection: section, slug, data: parsed.data, body: parsed.content });
    if (!result.ok) failures.push({ rel, errors: result.errors });
    else if (result.frontmatter.draft) drafts++;
  }
}

const strays = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter((f) => !SECTIONS.includes(f) && !f.startsWith("."))
  : [];
for (const stray of strays) {
  failures.push({
    rel: path.join("content", "posts", stray),
    errors: [`unknown section folder; posts must live in ${SECTIONS.map((s) => `content/posts/${s}/`).join(" or ")}`],
  });
}

if (failures.length) {
  console.error(`\n✗ check-posts: ${failures.length} problem file(s)\n`);
  for (const { rel, errors } of failures) {
    console.error(`  ${rel}`);
    for (const e of errors) console.error(`    - ${e.replace(/\n/g, "\n      ")}`);
    console.error("");
  }
  console.error("See CONTENT.md for the post format.\n");
  process.exit(1);
}

console.log(`✓ check-posts: ${total} post(s) valid (${drafts} draft${drafts === 1 ? "" : "s"})`);
