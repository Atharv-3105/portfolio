"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/posts";

const shortLabel = (text: string) => text.replace(/^If you're stuck on this$/, "If you're stuck");

/** "On this page": highlights the section currently being read (IntersectionObserver). */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const fromScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return els[els.length - 1].id;
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight * 0.35) current = el.id;
      return current;
    };

    const io = new IntersectionObserver(() => setActive(fromScroll()), {
      rootMargin: "0px 0px -60% 0px",
      threshold: [0, 1],
    });
    els.forEach((el) => io.observe(el));

    let ticking = false;
    const onScroll = () => {
      // Covers the end of the page, where the last heading can't reach the top band.
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          setActive(els[els.length - 1].id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setActive(fromScroll());
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="flex flex-col gap-0.5 text-sm">
      <p className="m-0 mb-2 font-mono text-xs text-fg-subtle">{"// on this page"}</p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={`flex items-center border-l-2 py-[7px] pl-3 leading-snug pointer-coarse:min-h-11 ${
                  on ? "border-accent font-medium text-accent" : "border-line text-fg-muted hover:text-accent-hover"
                }`}
              >
                {shortLabel(item.text)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
