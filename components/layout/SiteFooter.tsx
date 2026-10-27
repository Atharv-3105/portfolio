import { contactLinks, site } from "@/lib/site";
import { Container } from "./Container";

export function SiteFooter({ wide = false, compact = false }: { wide?: boolean; compact?: boolean }) {
  const links = contactLinks();
  return (
    <Container wide={wide}>
      <footer
        className={`flex flex-wrap items-center justify-between gap-6 border-t border-line ${
          compact ? "py-10" : "pt-16 pb-12"
        }`}
      >
        <div className="flex flex-col gap-2">
          <p className={`m-0 font-semibold ${compact ? "text-2xl" : "text-[26px] sm:text-[32px]"} leading-tight`}>
            Open to backend &amp; AI/ML roles.
          </p>
          <p className="m-0 font-mono text-[13px] text-fg-subtle">
            {site.location} · {site.openTo.locations.join(", ")}
          </p>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-5 p-0 font-mono text-sm" aria-label="Contact">
          <li>
            <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center break-all">
              {site.email}
            </a>
          </li>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} rel="me noopener noreferrer" className="inline-flex min-h-11 items-center">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/rss.xml" className="inline-flex min-h-11 items-center">
              rss
            </a>
          </li>
        </ul>
      </footer>
    </Container>
  );
}
