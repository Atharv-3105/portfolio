import type { Metadata } from "next";
import { site } from "./site";

/** Consistent per-page metadata (canonical + Open Graph + Twitter). */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  extra,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  extra?: Partial<NonNullable<Metadata["openGraph"]>>;
}): Metadata {
  const fullTitle = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_IN",
      url: path,
      title: fullTitle,
      description,
      ...extra,
    } as Metadata["openGraph"],
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
