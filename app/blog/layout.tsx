import { JournalHeader } from "@/components/blog/JournalHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JournalHeader />
      {children}
      <SiteFooter wide compact />
    </>
  );
}
