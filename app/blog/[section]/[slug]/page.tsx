import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/blog/ProjectCard";
import { DraftBadge } from "@/components/blog/PostRow";
import { Toc } from "@/components/blog/Toc";
import { renderPostBody } from "@/lib/mdx";
import { pageMetadata } from "@/lib/meta";
import {
  getAdjacent,
  getAllPosts,
  getPost,
  getPostsBySection,
  isSection,
  projectAnchor,
  sectionNav,
  sectionTitle,
  toMeta,
} from "@/lib/posts";
import { SITE_URL, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ section: p.section, slug: p.slug }));
}

type Params = Promise<{ section: string; slug: string }>;

async function load(params: Params) {
  const { section, slug } = await params;
  if (!isSection(section)) return undefined;
  return getPost(section, slug);
}

export async function generateMetadata({ params }: { params: Params }) {
  const post = await load(params);
  if (!post) return {};
  const meta = pageMetadata({
    title: post.title,
    description: post.description,
    path: post.url,
    type: "article",
    extra: {
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
      section: sectionTitle(post.section),
    },
  });
  return { ...meta, keywords: post.tags, ...(post.draft ? { robots: { index: false, follow: false } } : {}) };
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export default async function PostPage({ params }: { params: Params }) {
  const post = await load(params);
  if (!post) notFound();

  const more = getPostsBySection(post.section).filter((p) => p.slug !== post.slug);
  const { prev, next } = getAdjacent(post.section, post.slug);
  const body = await renderPostBody(post.body);
  const meta = toMeta(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: site.name, url: SITE_URL },
    keywords: post.tags.join(", "),
    url: `${SITE_URL}${post.url}`,
    mainEntityOfPage: `${SITE_URL}${post.url}`,
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(0,720px)_220px] lg:justify-between lg:gap-20">
      <main id="main" className="min-w-0 pt-10 pb-24 sm:pt-14">
        <article className="flex max-w-[720px] flex-col gap-5">
          <nav aria-label="Breadcrumb" className="font-mono text-[13px] text-fg-subtle">
            <ol className="m-0 flex list-none flex-wrap gap-x-2 p-0">
              <li>
                <Link href={`/blog/${post.section}`} className="text-fg-subtle hover:text-accent-hover">
                  {sectionNav(post.section)}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/blog/${post.section}#${projectAnchor(post.project)}`}
                  className="text-fg-subtle hover:text-accent-hover"
                >
                  {lowerFirst(post.project.replace(/\s+/g, ""))}
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="m-0 text-[32px] leading-[1.12] font-bold tracking-[-0.02em] text-balance sm:text-[42px]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full border border-line-strong px-2.5 py-[5px]">
                  {t}
                </li>
              ))}
            </ul>
            <p className="m-0 px-2.5 py-[5px] text-fg-subtle">
              <time dateTime={post.date}>{post.dateLabel}</time> · {post.readingMinutes} min read · {post.level}
            </p>
            {post.draft ? <DraftBadge /> : null}
          </div>

          <section
            aria-label="TL;DR"
            className="tldr flex flex-col gap-2 rounded-xl border border-line bg-surface px-[22px] py-5"
          >
            <p className="m-0 font-mono text-xs text-accent">$ tl;dr</p>
            <p className="m-0 text-[17px] leading-[1.6] text-fg-soft">
              <InlineCode text={post.tldr} />
            </p>
          </section>

          <ProjectCard post={meta} className="lg:hidden" />

          <div className="prose-journal mt-2">{body}</div>

          {prev || next ? (
            <nav aria-label="More posts" className="mt-8 flex flex-wrap gap-4">
              {prev ? (
                <Link
                  href={prev.url}
                  rel="prev"
                  className="flex-[1_1_240px] rounded-xl border border-line bg-surface px-[18px] py-4 text-fg hover:border-line-strong hover:text-fg"
                >
                  <span className="block font-mono text-xs text-fg-subtle">← prev</span>
                  <span className="font-semibold">{prev.title}</span>
                </Link>
              ) : (
                <span className="hidden flex-[1_1_240px] sm:block" />
              )}
              {next ? (
                <Link
                  href={next.url}
                  rel="next"
                  className="flex-[1_1_240px] rounded-xl border border-line bg-surface px-[18px] py-4 text-right text-fg hover:border-line-strong hover:text-fg"
                >
                  <span className="block font-mono text-xs text-fg-subtle">next →</span>
                  <span className="font-semibold">{next.title}</span>
                </Link>
              ) : null}
            </nav>
          ) : null}

          {more.length ? (
            <nav aria-label={`More in ${sectionTitle(post.section)}`} className="mt-14 flex flex-col">
              <p className="m-0 pb-3 font-mono text-xs text-fg-subtle">{`// more in ${sectionNav(post.section)}`}</p>
              <ul className="m-0 flex list-none flex-col p-0">
                {more.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.url}
                      className="group flex min-h-11 flex-wrap justify-between gap-x-4 border-t border-line py-3.5 text-fg hover:text-fg"
                    >
                      <span className="group-hover:text-accent-hover">{p.title}</span>
                      <span className="font-mono text-xs text-fg-subtle">{p.project}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </article>
      </main>

      <aside aria-label="On this page and project" className="hidden pt-14 lg:block">
        <div className="sticky top-6 flex flex-col gap-7">
          <Toc items={post.toc} />
          <ProjectCard post={meta} />
        </div>
      </aside>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

/** TL;DR is plain frontmatter text; render `backticks` as inline code. */
function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
