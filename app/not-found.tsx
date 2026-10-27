import type { Metadata } from "next";
import { NotFoundBody } from "@/components/layout/NotFoundBody";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = { title: "404: not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <NotFoundBody />
      </main>
      <SiteFooter />
    </>
  );
}
