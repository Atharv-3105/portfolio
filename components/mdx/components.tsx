import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

type CalloutProps = { type?: "note" | "warn"; title?: string; children: ReactNode };

/** <Callout type="note|warn" title="optional">markdown…</Callout> */
export function Callout({ type = "note", title, children }: CalloutProps) {
  if (type !== "note" && type !== "warn") {
    throw new Error(`<Callout type="${String(type)}"> is not supported. Use type="note" or type="warn".`);
  }
  const label = title ?? (type === "warn" ? "! heads up" : "// note");
  return (
    <aside className={`callout callout-${type}`} aria-label={type === "warn" ? "Warning" : "Note"}>
      <p className="callout-label">{label}</p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

type FigureProps = { src: string; alt: string; caption?: string; width?: number; height?: number };

/** <Figure src="/images/x.png" alt="what it shows" caption="optional caption" /> */
export function Figure({ src, alt, caption, width, height }: FigureProps) {
  if (!src) throw new Error("<Figure> needs a src");
  if (!alt) throw new Error(`<Figure src="${src}"> needs alt text describing the image`);
  return (
    <figure className="mdx-figure">
      {/* Plain img: authors don't have to know image dimensions; images live in /public. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function A({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrap" role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

export const mdxComponents = { Callout, Figure, a: A, table: Table };
