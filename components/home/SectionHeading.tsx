import type { ReactNode } from "react";

/** "01 Selected work" style heading from the home design. */
export function SectionHeading({ id, num, children }: { id: string; num: string; children: ReactNode }) {
  return (
    <h2 id={id} className="m-0 text-[32px] leading-tight font-semibold tracking-[-0.01em] sm:text-[40px]">
      <span className="mr-3 align-middle font-mono text-base text-accent" aria-hidden="true">
        {num}
      </span>
      {children}
    </h2>
  );
}
