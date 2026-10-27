import type { Element, ElementContent, Root, RootContent } from "hast";

/**
 * Journal post structure, applied after rehype-slug:
 *  - every H2 gets an aria-hidden "01"…"06" number span (styled amber/mono)
 *  - everything from the 6th H2 to the end of the post is wrapped in
 *    <section class="stuck"> so "If you're stuck on this" renders as the callout box.
 * Authors only write plain `## Heading` lines.
 */
export default function rehypeJournal() {
  return (tree: Root) => {
    let count = 0;
    let stuckIndex = -1;

    tree.children.forEach((node, index) => {
      if (node.type !== "element" || node.tagName !== "h2") return;
      count += 1;
      const num: Element = {
        type: "element",
        tagName: "span",
        properties: { className: ["h2-num"], ariaHidden: "true" },
        children: [{ type: "text", value: String(count).padStart(2, "0") }],
      };
      node.properties = { ...node.properties, className: ["journal-h2"] };
      node.children.unshift(num);
      if (count === 6) stuckIndex = index;
    });

    if (stuckIndex >= 0) {
      const heading = tree.children[stuckIndex] as Element;
      const rest = tree.children.splice(stuckIndex) as RootContent[];
      const section: Element = {
        type: "element",
        tagName: "section",
        properties: {
          className: ["stuck"],
          ariaLabelledBy: typeof heading.properties?.id === "string" ? [heading.properties.id] : undefined,
        },
        children: rest.filter((n): n is ElementContent => n.type !== "doctype"),
      };
      tree.children.push(section);
    }
  };
}
