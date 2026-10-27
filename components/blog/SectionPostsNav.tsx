import Link from "next/link";
import type { ProjectGroup, Section } from "@/lib/posts";
import { sectionNav } from "@/lib/posts";

function Groups({ groups, current }: { groups: ProjectGroup[]; current: string }) {
  return (
    <>
      {groups.map((g, gi) => (
        <div key={g.project} className="flex flex-col gap-1">
          <p className={`m-0 mb-1 font-semibold text-fg ${gi === 0 ? "mt-2" : "mt-3.5"}`}>{g.project}</p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {g.posts.map((p) => {
              const active = p.slug === current;
              return (
                <li key={p.slug}>
                  <Link
                    href={p.url}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-md px-3 py-2 leading-snug lg:pointer-fine:min-h-0 ${
                      active
                        ? "border-l-2 border-accent bg-active font-medium text-accent"
                        : "text-fg-muted hover:text-accent-hover"
                    }`}
                  >
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

/** Desktop: sticky left sidebar. */
export function SectionPostsAside({
  section,
  groups,
  current,
}: {
  section: Section;
  groups: ProjectGroup[];
  current: string;
}) {
  return (
    <aside aria-label="Posts in this section" className="hidden py-9 lg:block">
      <nav className="sticky top-6 flex max-h-[calc(100dvh-48px)] flex-col gap-1 overflow-y-auto pr-1 text-sm">
        <p className="m-0 mb-2.5 font-mono text-xs text-fg-subtle">{`// ${sectionNav(section)}`}</p>
        <Groups groups={groups} current={current} />
      </nav>
    </aside>
  );
}

/** Mobile/tablet: collapsible list above the article. */
export function SectionPostsDetails({
  section,
  groups,
  current,
}: {
  section: Section;
  groups: ProjectGroup[];
  current: string;
}) {
  const count = groups.reduce((n, g) => n + g.posts.length, 0);
  return (
    <details className="group mb-8 rounded-xl border border-line bg-surface text-sm lg:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 font-mono text-[13px] text-fg-subtle [&::-webkit-details-marker]:hidden">
        <span>
          Posts in this section <span className="text-fg-subtle">({count})</span>
        </span>
        <span aria-hidden="true" className="text-accent transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <nav aria-label={`Posts in ${sectionNav(section)}`} className="flex flex-col gap-1 border-t border-line px-3 pt-1 pb-4">
        <Groups groups={groups} current={current} />
      </nav>
    </details>
  );
}
