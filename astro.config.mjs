import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import { rehypeFigureCaption } from "./src/plugins/hyperlink-card.mjs";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import { remarkAdmonition } from "remark-admonition";
import { remarkHyperlinkCard, rehypeHyperlinkCard } from "./src/plugins/hyperlink-card.mjs";
import { remarkSpoiler } from "./src/plugins/remark-spoiler.mjs";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import expressiveCode from "astro-expressive-code";

const site = process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://sve.moe";

export default defineConfig({
  site,
  integrations: [
    expressiveCode({
      themes: ["github-light", "material-theme-ocean"],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ""),
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      defaultProps: { wrap: true, showLineNumbers: true },
      frames: { showCopyToClipboardButton: true },
      useThemedScrollbars: false,
      useThemedSelectionColors: false,
      styleOverrides: {
        codeBackground: "var(--codeblock-bg)",
        borderRadius: "0.75rem",
        borderColor: "none",
        uiFontSize: "0.85rem",
        codeFontSize: "0.85rem",
        uiFontFamily: "var(--font-mono)",
        codeFontFamily: "var(--font-mono)",
        codeLineHeight: "1.3rem",
        frames: {
          editorBackground: "var(--codeblock-bg)",
          terminalBackground: "var(--codeblock-bg)",
          terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
          editorTabBarBackground: "var(--codeblock-topbar-bg)",
          editorActiveTabBackground: "none",
          editorActiveTabIndicatorBottomColor: "var(--primary)",
          editorActiveTabIndicatorTopColor: "none",
          editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
          terminalTitlebarBorderBottomColor: "none",
        },
        textMarkers: { delHue: 0, insHue: 180, markHue: 250 },
      },
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkHyperlinkCard,
      remarkMath,
      remarkSpoiler,
      [
        remarkAdmonition,
        {
          defaultElement: "section",
          defaultProperties: { "data-admonish": "true" },
        },
      ],
    ],
    rehypePlugins: [rehypeKatex, rehypeHyperlinkCard, rehypeFigureCaption],
    remarkRehype: {
      footnoteLabel: "References",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
