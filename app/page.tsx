import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionHeading } from "@/components/home/SectionHeading";
import { getPostsBySection, getWriteupFor, sectionTitle, SECTIONS } from "@/lib/posts";
import { SITE_URL, contactLinks, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const mono = "font-mono";
const label = `${mono} text-xs text-fg-subtle`;

export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: SITE_URL,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Kanpur", addressRegion: "UP", addressCountry: "IN" },
    sameAs: contactLinks().map((l) => l.href),
  };

  const journal = SECTIONS.map((section) => ({ section, posts: getPostsBySection(section).slice(0, 3) }));
  const hasPosts = journal.some((j) => j.posts.length > 0);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Container>
          {/* Intro */}
          <section id="top" aria-labelledby="hero-title" className="flex flex-col gap-8 pt-14 pb-16 sm:pt-24 sm:pb-24">
            <div className="flex flex-col gap-3">
              <p className={`m-0 ${mono} text-sm text-fg-subtle`}>$ whoami</p>
              <h1 id="hero-title" className="m-0 text-[clamp(36px,7vw,56px)] leading-[1.05] font-bold tracking-[-0.02em]">
                {site.name}
              </h1>
              <p className={`m-0 ${mono} text-sm text-accent`}>{site.role}</p>
            </div>

            <div className="flex max-w-[760px] flex-col gap-4">
              {site.intro.map((line, i) => (
                <p
                  key={i}
                  className={`m-0 text-[clamp(19px,2.4vw,24px)] leading-[1.5] ${i === 0 ? "text-fg" : "text-fg-muted"}`}
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href={`mailto:${site.email}`} className={`${mono} inline-flex min-h-11 items-center text-sm`}>
                {site.email}
              </a>
              <a href={site.links.github} className={`${mono} inline-flex min-h-11 items-center text-sm`}>
                github ↗
              </a>
              <a href={site.resume} className={`${mono} inline-flex min-h-11 items-center text-sm`}>
                résumé (PDF) ↗
              </a>
              <p className={`m-0 ${mono} text-[13px] text-fg-subtle`}>
                <span className="text-accent" aria-hidden="true">
                  ●{" "}
                </span>
                open to {site.openTo.roles} · {site.openTo.locations.join(", ")}
              </p>
            </div>
          </section>

          {/* 01 Work */}
          <section id="work" aria-labelledby="work-title" className="flex flex-col gap-4 border-t border-line py-16 sm:py-24">
            <SectionHeading id="work-title" num="01">
              Work
            </SectionHeading>

            <ol className="m-0 flex list-none flex-col p-0">
              {site.projects.map((p) => {
                const writeup = getWriteupFor(p.name);
                return (
                  <li key={p.name} className="border-b border-line py-10 last:border-b-0 sm:py-12">
                    <article className="grid gap-x-12 gap-y-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                      <header className="flex flex-col gap-3">
                        <h3 className="m-0 text-[26px] leading-tight font-semibold">{p.name}</h3>
                        <p className={`m-0 ${mono} text-xs leading-relaxed text-fg-subtle`}>{p.stack.join(" · ")}</p>
                        <div className={`flex flex-wrap gap-x-4 ${mono} text-[13px]`}>
                          {p.proofLinks.map((l) => (
                            <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center">
                              {l.label} ↗
                            </a>
                          ))}
                          <a href={p.repo} className="inline-flex min-h-11 items-center">
                            repo ↗<span className="sr-only"> for {p.name} on GitHub</span>
                          </a>
                          {writeup ? (
                            <Link href={writeup.url} className="inline-flex min-h-11 items-center">
                              writeup<span className="sr-only">: {writeup.title}</span>
                            </Link>
                          ) : null}
                        </div>
                      </header>

                      <dl className="m-0 grid max-w-[720px] gap-5">
                        <div>
                          <dt className="sr-only">What it does</dt>
                          <dd className="m-0 text-lg leading-[1.55] text-fg">{p.what}</dd>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <dt className={label}>{"// the hard part"}</dt>
                          <dd className="m-0 text-base leading-[1.65] text-fg-muted">{p.hard}</dd>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <dt className={label}>{"// how I checked"}</dt>
                          <dd className="m-0 text-base leading-[1.65] text-fg-muted">{p.proof}</dd>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <dt className={label}>{"// still broken"}</dt>
                          <dd className="m-0 text-base leading-[1.65] text-fg-muted">{p.broken}</dd>
                        </div>
                      </dl>
                    </article>
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-3 pt-6">
              <h3 className={`m-0 ${label}`}>{"// also built"}</h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {site.alsoBuilt.map((b) => (
                  <li key={b.name}>
                    <a
                      href={b.repo}
                      className="group flex flex-wrap gap-x-4 gap-y-1 border-t border-line py-4 text-fg hover:text-fg"
                    >
                      <span className="min-w-[220px] font-medium group-hover:text-accent-hover">{b.name} ↗</span>
                      <span className="min-w-0 flex-[1_1_360px] text-fg-muted">{b.line}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 02 Now */}
          <section id="now" aria-labelledby="now-title" className="flex flex-col gap-6 border-t border-line py-16 sm:py-24">
            <SectionHeading id="now-title" num="02">
              Now
            </SectionHeading>
            <ul className="m-0 flex max-w-[760px] list-none flex-col gap-4 p-0">
              {site.now.map((n) => (
                <li key={n} className="flex gap-3 text-lg leading-[1.55] text-fg-muted">
                  <span className={`${mono} pt-1 text-sm text-accent`} aria-hidden="true">
                    →
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 03 Journal */}
          <section id="blog" aria-labelledby="journal-title" className="flex flex-col gap-6 border-t border-line py-16 sm:py-24">
            <SectionHeading id="journal-title" num="03">
              {site.journal.title}
            </SectionHeading>
            <p className="m-0 max-w-[760px] text-lg leading-[1.55] text-fg-muted">{site.journal.intro}</p>
            {hasPosts ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-x-12 gap-y-8">
                {journal.map(({ section, posts }) => (
                  <div key={section} id={section} className="flex flex-col">
                    <div className="flex items-baseline justify-between gap-3 pb-2">
                      <h3 className="m-0 text-xl font-semibold">{sectionTitle(section)}</h3>
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
                      <p className="m-0 border-t border-line pt-4 text-base text-fg-subtle">Nothing here yet.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`m-0 ${mono} text-sm text-fg-subtle`}>{"// first posts are being written"}</p>
            )}
          </section>

          {/* 04 Experience */}
          <section
            id="experience"
            aria-labelledby="experience-title"
            className="flex flex-col gap-6 border-t border-line py-16 sm:py-24"
          >
            <SectionHeading id="experience-title" num="04">
              Experience
            </SectionHeading>
            <ol className="m-0 flex max-w-[860px] list-none flex-col p-0">
              {site.experience.map((e) => (
                <li key={e.role} className="flex flex-col gap-2 border-t border-line py-5">
                  <div className="flex flex-wrap justify-between gap-x-6 gap-y-1">
                    <h3 className="m-0 text-lg font-medium">
                      {e.role} <span className="text-fg-subtle">·</span> {e.org}
                    </h3>
                    {e.dates ? <p className={`m-0 ${mono} pt-1 text-[13px] text-fg-subtle`}>{e.dates}</p> : null}
                  </div>
                  {e.description ? (
                    <p className="m-0 max-w-[720px] text-base leading-[1.6] text-fg-muted">{e.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </Container>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    </>
  );
}
