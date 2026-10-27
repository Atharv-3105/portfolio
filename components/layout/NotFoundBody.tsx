import Link from "next/link";
import { Container } from "./Container";

export function NotFoundBody({ wide = false }: { wide?: boolean }) {
  return (
    <Container wide={wide} className="py-24 sm:py-32">
      <div className="flex max-w-[640px] flex-col gap-6">
        <p className="m-0 font-mono text-sm text-fg-subtle">
          $ cat ./this-page
          <br />
          <span className="text-accent">cat: ./this-page: No such file or directory</span>
        </p>
        <h1 className="m-0 text-[clamp(40px,9vw,64px)] leading-[1.02] font-bold tracking-[-0.02em]">
          <span className="font-mono text-accent">404</span> Nothing here.
        </h1>
        <p className="m-0 text-lg leading-[1.6] text-fg-muted">
          The link may be old, or the post may have moved. These still work:
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-lg bg-accent px-[22px] font-semibold text-canvas hover:bg-accent-hover hover:text-canvas"
          >
            Go home
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-12 items-center rounded-lg border border-line-strong px-[22px] font-medium text-fg hover:border-fg-subtle hover:text-fg"
          >
            Read the journal
          </Link>
        </div>
      </div>
    </Container>
  );
}
