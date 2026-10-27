#!/usr/bin/env node
// Usage: npm run new-post -- <ml|backend> <slug>
// Creates content/posts/<section>/<slug>.mdx from templates/post.mdx.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SECTIONS, SLUG_PATTERN } from "../lib/post-rules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [section, slug] = process.argv.slice(2);

function fail(msg) {
  console.error(`✗ ${msg}\n  usage: npm run new-post -- <${SECTIONS.join("|")}> <slug>`);
  process.exit(1);
}

if (!SECTIONS.includes(section)) fail(`first argument must be one of: ${SECTIONS.join(", ")}`);
if (!slug || !SLUG_PATTERN.test(slug)) fail("slug must be kebab-case, e.g. batching-ollama-embeddings");

const dest = path.join(root, "content", "posts", section, `${slug}.mdx`);
if (fs.existsSync(dest)) fail(`${path.relative(root, dest)} already exists`);

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const title = slug
  .split("-")
  .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
  .join(" ");

const template = fs.readFileSync(path.join(root, "templates", "post.mdx"), "utf8");
const out = template
  .replaceAll("{{title}}", title.replace(/"/g, '\\"'))
  .replaceAll("{{section}}", section)
  .replaceAll("{{date}}", today);

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);

console.log(`✓ created ${path.relative(root, dest)}`);
console.log("  It starts as a draft (draft: true). Fill in every TODO, then set draft: false to publish.");
console.log("  Preview: npm run dev  →  http://localhost:3000/blog/" + section + "/" + slug);
