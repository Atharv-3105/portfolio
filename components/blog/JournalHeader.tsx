"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";

const nav = [
  { href: "/blog/ml", label: "whatTheML" },
  { href: "/blog/backend", label: "whatTheBackend" },
  { href: "/", label: "portfolio" },
];

export function JournalHeader() {
  const pathname = usePathname() ?? "";
  const onIndex = pathname === "/blog";
  return (
    <header className="border-b border-line">
      <Container wide className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4 sm:py-5">
        <Logo href="/blog" suffix="/journal" />
        <nav aria-label="Sections" className="-mx-3.5 flex flex-wrap gap-1 font-mono text-sm sm:mx-0">
          {nav.map((item) => {
            const active = item.href !== "/" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg px-3.5 ${
                  active ? "bg-active text-accent" : "text-fg-subtle hover:text-accent-hover"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {onIndex ? null : (
          <form action="/blog" method="get" role="search" className="w-full sm:w-auto">
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-line-strong px-3 font-mono text-[13px] text-fg-subtle focus-within:border-accent">
              search
              <input
                type="search"
                name="q"
                placeholder="rag, goroutines…"
                className="w-full min-w-0 border-0 bg-transparent font-mono text-[13px] text-fg outline-none placeholder:text-fg-subtle sm:w-[150px]"
              />
            </label>
          </form>
        )}
      </Container>
    </header>
  );
}
