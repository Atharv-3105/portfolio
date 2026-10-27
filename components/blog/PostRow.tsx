import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/** One post in a listing. Presentational only, so it works in server and client components. */
export function PostRow({ post, showProject = false }: { post: PostMeta; showProject?: boolean }) {
  return (
    <li>
      <Link href={post.url} className="group flex flex-col gap-1.5 border-t border-line py-5 text-fg hover:text-fg">
        <span className="text-lg leading-snug font-medium group-hover:text-accent-hover">
          {post.title}
          {post.draft ? <DraftBadge /> : null}
        </span>
        <span className="line-clamp-2 text-[15px] leading-relaxed text-fg-muted">{post.description}</span>
        <span className="font-mono text-xs leading-relaxed text-fg-subtle">
          <time dateTime={post.date}>{post.dateLabel}</time> · {post.readingMinutes} min read · {post.level}
          {showProject ? <> · {post.project}</> : null}
        </span>
      </Link>
    </li>
  );
}

export function DraftBadge() {
  return (
    <span className="ml-2 inline-block rounded-full border border-accent/60 px-2 py-0.5 align-middle font-mono text-[11px] font-normal text-accent">
      draft
    </span>
  );
}
