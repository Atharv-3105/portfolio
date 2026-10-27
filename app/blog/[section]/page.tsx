import { notFound } from "next/navigation";
import { PostRow } from "@/components/blog/PostRow";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/meta";
import { SECTIONS, getPostsBySection, groupByProject, isSection, projectAnchor, sectionNav } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

type Params = Promise<{ section: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { section } = await params;
  if (!isSection(section)) return {};
  const info = site.journal.sections[section];
  return pageMetadata({ title: info.title, description: info.intro, path: `/blog/${section}` });
}

export default async function SectionPage({ params }: { params: Params }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const info = site.journal.sections[section];
  const groups = groupByProject(getPostsBySection(section));

  return (
    <main id="main">
      <Container wide className="pt-12 pb-20 sm:pt-16">
        <div className="flex max-w-[860px] flex-col gap-4">
          <p className="m-0 font-mono text-sm text-fg-subtle">{`// ${sectionNav(section)}`}</p>
          <h1 className="m-0 text-[clamp(36px,7vw,52px)] leading-[1.05] font-bold tracking-[-0.02em]">{info.title}</h1>
          <p className="m-0 text-lg leading-[1.6] text-fg-muted">{info.intro}</p>
        </div>

        <div className="mt-12 flex max-w-[860px] flex-col gap-12">
          {groups.length ? (
            groups.map((g) => (
              <section key={g.project} id={projectAnchor(g.project)} aria-labelledby={`p-${projectAnchor(g.project)}`}>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 id={`p-${projectAnchor(g.project)}`} className="m-0 text-2xl font-semibold">
                    {g.project}
                  </h2>
                  <p className="m-0 font-mono text-xs text-fg-subtle">
                    {g.posts.length} post{g.posts.length === 1 ? "" : "s"}
                  </p>
                </div>
                <ul className="m-0 list-none p-0">
                  {g.posts.map((p) => (
                    <PostRow key={p.slug} post={p} />
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="m-0 border-t border-line pt-6 text-lg text-fg-subtle">
              Nothing published here yet. First posts are on the way.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}
