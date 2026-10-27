import type { PostMeta } from "@/lib/posts";

export function ProjectCard({ post, className = "" }: { post: PostMeta; className?: string }) {
  return (
    <section
      aria-label={`Project: ${post.project}`}
      className={`flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-[18px] text-sm ${className}`}
    >
      <p className="m-0 font-mono text-xs text-fg-subtle">{"// project"}</p>
      <p className="m-0 text-lg font-semibold">{post.project}</p>
      <p className="m-0 font-mono text-xs leading-[1.6] text-fg-subtle">{post.stack.join(" · ")}</p>
      {post.status ? <p className="m-0 text-fg-muted">Status: {post.status}</p> : null}
      {post.repo ? (
        <a
          href={post.repo}
          className="mt-1 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent font-semibold text-canvas hover:bg-accent-hover hover:text-canvas"
        >
          View repo ↗
        </a>
      ) : null}
    </section>
  );
}
