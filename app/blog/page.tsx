import { JournalSearch } from "@/components/blog/JournalSearch";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/meta";
import { getAllPosts, getAllTags, SECTIONS } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: site.journal.title,
  description: site.journal.intro,
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const sections = SECTIONS.map((id) => ({
    id,
    title: site.journal.sections[id].title,
    intro: site.journal.sections[id].intro,
  }));
  return (
    <main id="main">
      <Container wide className="pt-12 pb-20 sm:pt-16">
        <div className="mb-10 flex max-w-[720px] flex-col gap-4">
          <p className="m-0 font-mono text-sm text-fg-subtle">$ ls ~/journal</p>
          <h1 className="m-0 text-[clamp(36px,7vw,52px)] leading-[1.05] font-bold tracking-[-0.02em]">
            {site.journal.title}
          </h1>
          <p className="m-0 text-lg leading-[1.6] text-fg-muted">{site.journal.intro}</p>
        </div>
        <JournalSearch posts={posts} tags={getAllTags(posts)} sections={sections} />
      </Container>
    </main>
  );
}
