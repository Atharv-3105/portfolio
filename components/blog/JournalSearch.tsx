"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PostMeta, Section } from "@/lib/posts";
import { PostRow } from "./PostRow";

type Props = {
  posts: PostMeta[];
  tags: string[];
  sections: { id: Section; title: string; intro: string }[];
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Client-side filter over the post index that was serialised at build time. */
export function JournalSearch({ posts, tags, sections }: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  // Pick up ?q= / ?tag= (the header search box submits to /blog?q=…).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const t = params.get("tag");
    if (q) setQuery(q);
    if (t && tags.includes(t)) setTag(t);
  }, [tags]);

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/blog?${qs}` : "/blog");
  }, [query, tag]);

  const index = useMemo(
    () => posts.map((p) => ({ post: p, haystack: norm([p.title, p.project, ...p.tags].join(" ")) })),
    [posts],
  );

  const filtered = useMemo(() => {
    const terms = norm(query).split(/\s+/).filter(Boolean);
    return index
      .filter(({ post, haystack }) => (!tag || post.tags.includes(tag)) && terms.every((t) => haystack.includes(t)))
      .map(({ post }) => post);
  }, [index, query, tag]);

  const filtering = query.trim() !== "" || tag !== null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <label className="flex min-h-12 max-w-[560px] items-center gap-3 rounded-lg border border-line-strong bg-canvas px-4 font-mono text-[13px] text-fg-subtle focus-within:border-accent">
          search
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="title, tag or project: rag, goroutines…"
            className="w-full min-w-0 border-0 bg-transparent font-mono text-sm text-fg outline-none placeholder:text-fg-subtle"
            aria-describedby="search-count"
          />
        </label>
        {tags.length ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
            {tags.map((t) => {
              const on = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTag(on ? null : t)}
                  className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-3.5 font-mono text-xs ${
                    on
                      ? "border-accent bg-active text-accent"
                      : "border-line-strong text-fg hover:border-fg-subtle"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ) : null}
        <p id="search-count" className="m-0 font-mono text-xs text-fg-subtle" aria-live="polite">
          {filtering
            ? `${filtered.length} of ${posts.length} post${posts.length === 1 ? "" : "s"}`
            : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
          {filtering ? (
            <>
              {" · "}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTag(null);
                }}
                className="cursor-pointer text-accent hover:text-accent-hover"
              >
                clear
              </button>
            </>
          ) : null}
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-5">
        {sections.map((s) => {
          const list = filtered.filter((p) => p.section === s.id);
          return (
            <section
              key={s.id}
              aria-labelledby={`sec-${s.id}`}
              className="flex flex-col gap-3 rounded-[14px] border border-line p-6 sm:p-8"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`sec-${s.id}`} className="m-0 text-[28px] font-bold">
                  {s.title}
                </h2>
                <Link href={`/blog/${s.id}`} className="inline-flex min-h-11 items-center font-mono text-[13px]">
                  all →<span className="sr-only"> {s.title} posts</span>
                </Link>
              </div>
              <p className="m-0 mb-2 text-[15px] leading-relaxed text-fg-subtle">{s.intro}</p>
              {list.length ? (
                <ul className="m-0 list-none p-0">
                  {list.map((p) => (
                    <PostRow key={p.slug} post={p} showProject />
                  ))}
                </ul>
              ) : (
                <p className="m-0 border-t border-line pt-4 text-base text-fg-subtle">
                  {filtering ? "No posts match." : "First posts are on the way."}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
