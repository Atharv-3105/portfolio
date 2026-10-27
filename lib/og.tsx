import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontFile = (name: string) => readFile(path.join(process.cwd(), "assets", "og-fonts", name));

/** Open Graph / Twitter card in the site style. Rendered at build time. */
export async function renderOgImage({ title, eyebrow, suffix }: { title: string; eyebrow: string; suffix?: string }) {
  const [grotesk500, grotesk700, mono400, mono500] = await Promise.all([
    fontFile("space-grotesk-latin-500-normal.woff"),
    fontFile("space-grotesk-latin-700-normal.woff"),
    fontFile("jetbrains-mono-latin-400-normal.woff"),
    fontFile("jetbrains-mono-latin-500-normal.woff"),
  ]);
  const size = title.length > 90 ? 52 : title.length > 60 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0D10",
          color: "#E6E8EB",
          padding: "64px 72px",
          fontFamily: "Space Grotesk",
          borderTop: "6px solid #F5A524",
        }}
      >
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 30 }}>
          <span>~/atharva</span>
          <span style={{ color: "#F5A524" }}>_</span>
          {suffix ? <span style={{ color: "#9AA3AD" }}>{suffix}</span> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 28, color: "#F5A524" }}>{eyebrow}</div>
          <div
            style={{
              display: "flex",
              fontSize: size,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: "#9AA3AD",
            borderTop: "1px solid #1F242B",
            paddingTop: 28,
          }}
        >
          <span>Atharva Dwivedi · Backend &amp; AI/ML engineer</span>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#F5A524" }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#E6E8EB" }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#9AA3AD" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Space Grotesk", data: grotesk500, weight: 500, style: "normal" },
        { name: "Space Grotesk", data: grotesk700, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono400, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono500, weight: 500, style: "normal" },
      ],
    },
  );
}
