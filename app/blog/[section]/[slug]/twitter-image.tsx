import { renderOgImage, ogContentType, ogSize } from "@/lib/og";
import { getAllPosts, getPost, isSection, sectionNav } from "@/lib/posts";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Journal post by Atharva Dwivedi";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ section: p.section, slug: p.slug }));
}

export default async function TwitterImage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const post = isSection(section) ? getPost(section, slug) : undefined;
  return renderOgImage({
    suffix: "/journal",
    eyebrow: post ? `// ${sectionNav(post.section)} · ${post.project}` : "// journal",
    title: post?.title ?? "The learning journal",
  });
}
