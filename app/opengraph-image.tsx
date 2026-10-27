import { renderOgImage, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Atharva Dwivedi: Backend & AI/ML engineer";

export default function Image() {
  return renderOgImage({ eyebrow: "$ whoami", title: "Atharva Dwivedi. Backend & AI/ML engineer." });
}
