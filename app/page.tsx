import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroVisual } from "@/components/home/HeroVisual";
import { SectionHeading } from "@/components/home/SectionHeading";
import { getPostsBySection, getWriteupFor, sectionTitle, SECTIONS } from "@/lib/posts";
import { SITE_URL, contactLinks, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const mono = "font-mono";

export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: SITE_URL,
    jobTitle: "Backend & AI/ML engineer",
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Kanpur", addressRegion: "UP", addressCountry: "IN" },
    sameAs: contactLinks().map((l) => l.href),
  };

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Container>
          {/* Hero */}
          <section
            id="top"
            aria-labelledby="hero-title"
            className="flex flex-wrap items-center gap-12 pt-14 pb-14 sm:pt-24 sm:pb-20"
          >
            <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
              <p className={`m-0 ${mono} text-sm text-fg-subtle`}>$ whoami</p>
              <h1
                id="hero-title"
                className="m-0 text-[clamp(40px,9vw,64px)] leading-[1.02] font-bold tracking-[-0.02em] text-balance"
              >
                {site.name}.
                <br />
                {site.role}
              </h1>
              <p className="m-0 max-w-[560px] text-lg leading-[1.55] text-fg-muted sm:text-xl">{site.tagline}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="#work"
                  className="inline-flex min-h-12 items-center rounded-lg bg-accent px-[22px] text-base font-semibold text-canvas hover:bg-accent-hover hover:text-canvas"
                >
                  See my work
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex min-h-12 items-center rounded-lg border border-line-strong px-[22px] text-base font-medium text-fg hover:border-fg-subtle hover:text-fg"
                >
                  Read the journal
                </Link>
              </div>
              <p className={`m-0 ${mono} text-[13px] leading-relaxed text-fg-subtle`}>
                <span className="text-accent" aria-hidden="true">
                  ●{" "}
                </span>
                open to {site.openTo.roles} · {site.openTo.locations.join(", ")}
              </p>
            </div>
            <HeroVisual />
          </section>

          {/* Stack */}
          <section aria-label="Stack" className="border-b border-line pb-16 sm:pb-24">
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              <li className={`${mono} mr-2 py-2 text-[13px] text-fg-subtle`} aria-hidden="true">
                stack →
              </li>
              {site.stack.map((s) => (
                <li key={s} className={`${mono} rounded-full border border-line-strong px-3.5 py-2 text-[13px]`}>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* 01 Selected work */}
          <section id="work" aria-labelledby="work-title" className="flex flex-col gap-10 py-16 sm:py-24">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <SectionHeading id="work-title" num="01">
                Selected work
              </SectionHeading>
              <a href={`${site.links.github}?tab=repositories`} className={`${mono} inline-flex min-h-11 items-center text-sm`}>
                all projects →
              </a>
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-5 p-0">
              {site.projects.map((p) => {
                const writeup = getWriteupFor(p.name);
                return (
                  <li key={p.name} className="flex">
                    <article className="flex w-full flex-col gap-4 rounded-[14px] border border-line bg-surface p-6 sm:p-7">
                      <p className={`m-0 ${mono} text-xs text-fg-subtle`}>{p.tag}</p>
                      <h3 className="m-0 text-2xl font-semibold">{p.name}</h3>
                      <p className="m-0 text-base leading-[1.55] text-fg-muted">{p.description}</p>
                      <p className={`m-0 ${mono} text-xs leading-relaxed text-fg-subtle`}>{p.stack.join(" · ")}</p>
                      <div className={`mt-auto flex gap-4 pt-2 ${mono} text-[13px]`}>
                        {writeup ? (
                          <Link href={writeup.url} className="inline-flex min-h-11 items-center">
                            writeup<span className="sr-only">: {writeup.title}</span>
                          </Link>
                        ) : null}
                        <a href={p.repo} className="inline-flex min-h-11 items-center">
                          repo ↗<span className="sr-only"> for {p.name} on GitHub</span>
                        </a>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 02 The learning journal */}
          <section
            id="blog"
            aria-labelledby="journal-title"
            className="flex flex-col gap-10 border-t border-line py-16 sm:py-24"
          >
            <SectionHeading id="journal-title" num="02">
              {site.journal.title}
            </SectionHeading>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-5">
              {SECTIONS.map((section) => {
                const posts = getPostsBySection(section).slice(0, 3);
                return (
                  <div
                    key={section}
                    id={section}
                    className="flex flex-col gap-5 rounded-[14px] border border-line p-6 sm:p-8"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="m-0 text-[28px] font-bold">{sectionTitle(section)}</h3>
                      <Link href={`/blog/${section}`} className={`${mono} inline-flex min-h-11 items-center text-[13px]`}>
                        all →<span className="sr-only"> {sectionTitle(section)} posts</span>
                      </Link>
                    </div>
                    {posts.length ? (
                      <ul className="m-0 flex list-none flex-col p-0">
                        {posts.map((post) => (
                          <li key={post.slug}>
                            <Link
                              href={post.url}
                              className="group flex min-h-11 justify-between gap-4 border-t border-line py-3.5 text-[17px] text-fg hover:text-fg"
                            >
                              <span className="group-hover:text-accent-hover">{post.title}</span>
                              <span className={`${mono} shrink-0 pt-1 text-xs text-fg-subtle`}>
                                <time dateTime={post.date}>{post.dateLabel}</time>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="m-0 border-t border-line pt-4 text-base text-fg-subtle">
                        First posts are on the way.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 03 Experience */}
          <section
            id="experience"
            aria-labelledby="experience-title"
            className="flex flex-wrap gap-x-12 gap-y-8 border-t border-line py-16 sm:py-24"
          >
            <div className="flex-[1_1_260px]">
              <SectionHeading id="experience-title" num="03">
                Experience
              </SectionHeading>
            </div>
            <div className="flex min-w-0 flex-[2_1_520px] flex-col">
              <ol className="m-0 list-none p-0">
                {site.experience.map((e) => (
                  <li key={e.role} className="flex flex-col gap-2 border-t border-line py-5 last:border-b">
                    <div className="flex flex-wrap justify-between gap-x-6 gap-y-1">
                      <h3 className="m-0 text-lg font-medium">
                        {e.role} <span className="text-fg-subtle">·</span> {e.org}
                      </h3>
                      {e.dates || e.location ? (
                        <p className={`m-0 ${mono} pt-1 text-[13px] text-fg-subtle`}>
                          {[e.dates, e.location].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    {e.description ? (
                      <p className="m-0 max-w-[680px] text-base leading-[1.6] text-fg-muted">{e.description}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
              <dl className="mt-8 grid gap-4">
                <div className="flex flex-col gap-1">
                  <dt className={`${mono} text-xs text-fg-subtle`}>{"// from scratch in PyTorch"}</dt>
                  <dd className="m-0 text-base leading-[1.6] text-fg-muted">{site.fromScratch}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className={`${mono} text-xs text-fg-subtle`}>{"// dsa"}</dt>
                  <dd className="m-0 text-base leading-[1.6] text-fg-muted">
                    {site.links.leetcode ? <a href={site.links.leetcode}>{site.dsa}</a> : site.dsa}
                  </dd>
                </div>
              </dl>
              <p className="mt-8 mb-0">
                <a href={site.resume} className={`${mono} inline-flex min-h-11 items-center text-sm`}>
                  full résumé (PDF) ↗
                </a>
              </p>
            </div>
          </section>
        </Container>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    </>
  );
}
