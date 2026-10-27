import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "./Container";
import { Logo } from "./Logo";

const nav = [
  { href: "/#work", label: "work" },
  { href: "/blog/ml", label: site.journal.sections.ml.nav },
  { href: "/blog/backend", label: site.journal.sections.backend.nav },
  { href: "/blog", label: "blog" },
];

export function SiteHeader() {
  return (
    <Container>
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line py-5 sm:py-6">
        <Logo />
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-0 font-mono text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-fg-subtle hover:text-accent-hover"
            >
              {item.label}
            </Link>
          ))}
          <a href={site.resume} className="inline-flex min-h-11 items-center text-accent">
            résumé ↗
          </a>
        </nav>
      </header>
    </Container>
  );
}
