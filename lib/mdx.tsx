import "server-only";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { bundledThemes, type ThemeRegistrationRaw } from "shiki";
import rehypeJournal from "./rehype-journal";
import { mdxComponents } from "@/components/mdx/components";

/**
 * Vesper (warm, near-black) with comments lifted from #8b8b8b94 to #8A939D
 * so they pass WCAG AA on the #07090B code background.
 */
async function journalTheme(): Promise<ThemeRegistrationRaw> {
  const vesper = (await bundledThemes.vesper()).default as ThemeRegistrationRaw;
  return {
    ...vesper,
    name: "vesper-journal",
    tokenColors: (vesper.tokenColors ?? []).map((t) => {
      const scopes = ([] as string[]).concat(t.scope ?? []);
      return scopes.some((sc) => sc.includes("comment"))
        ? { ...t, settings: { ...t.settings, foreground: "#8A939D" } }
        : t;
    }),
  };
}

let themePromise: Promise<ThemeRegistrationRaw> | undefined;

export async function renderPostBody(source: string) {
  themePromise ??= journalTheme();
  const prettyCode: PrettyCodeOptions = {
    theme: await themePromise,
    keepBackground: false,
    defaultLang: { block: "plaintext" },
  };
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      // Content is first-party (this repo), so JS expressions such as width={800} are allowed;
      // next-mdx-remote still blocks dangerous globals (eval, process, require…).
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode], rehypeJournal],
      },
    },
  });
  return content;
}
