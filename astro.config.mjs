import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import { remarkAdmonition } from "remark-admonition";
import { remarkHyperlinkCard, rehypeHyperlinkCard } from "./src/plugins/hyperlink-card.mjs";

const site =
  process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://sve.moe";

export default defineConfig({
  site,
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkHyperlinkCard,
      remarkMath,
      [
        remarkAdmonition,
        {
          defaultElement: "section",
          defaultProperties: { "data-admonish": "true" },
        },
      ],
    ],
    rehypePlugins: [rehypeKatex, rehypeHyperlinkCard],
    remarkRehype: {
      footnoteLabel: "References",
    },
    shikiConfig: { theme: "material-theme-ocean" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
