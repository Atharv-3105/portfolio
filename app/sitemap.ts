import type { MetadataRoute } from "next";
import { SECTIONS, getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((p) => !p.draft);
  const latest = posts[0]?.date;
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...SECTIONS.map((s) => ({
      url: `${SITE_URL}/blog/${s}`,
      lastModified: posts.find((p) => p.section === s)?.date,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({ url: `${SITE_URL}${p.url}`, lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
