import Link from "next/link";

export function Logo({ href = "/", suffix }: { href?: string; suffix?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center font-mono text-[15px] text-fg hover:text-fg"
      aria-label={suffix ? "Atharva's learning journal" : "Atharva Dwivedi, home"}
    >
      ~/atharva<span className="text-accent">_</span>
      {suffix ? <span className="text-fg-subtle">{suffix}</span> : null}
    </Link>
  );
}
