# Customization Guide

This guide describes the site as it is currently implemented. It covers the configuration that is centralized, the copy that still lives in page components, and the custom Markdown and article behavior that is easy to miss.

## Site Settings

Start with [src/config/theme.config.ts](./src/config/theme.config.ts). It contains:

- `SITE`: site name, description, production URL, locale, language, repository URL, and the default social image path.
- `NAVIGATION`: desktop and mobile navigation links.
- `CONTACT` and `SOCIAL_LINKS`: contact destinations and the footer social row.
- `profile`: the writer's display name, bio, and avatar.
- `categories` and `tags`: the available taxonomy routes and labels.

This file is the main configuration point, but not every string in the site is centralized. In particular, the homepage and About structured data, Contact links, footer legal text, and page descriptions contain direct page-level copy. Check those pages when changing the site's identity.

`SITE.name` feeds the header, footer, page titles, metadata, and RSS channel. `SITE.description` is the default meta description and footer standfirst. `SITE.ogImg` is used by the homepage and About page; articles generate their social image from their thumbnail instead. `SITE.repositoryUrl` is currently informational and is not rendered by a component.

`NAVIGATION` is a flat array. Add or reorder entries to change both navigation menus. Paths are matched by prefix, except `/`, which is matched exactly, so `/pub` remains active on article pages.

## Production URL

There are currently two places to keep in sync:

- [astro.config.mjs](./astro.config.mjs) reads `SITE_URL` or `PUBLIC_SITE_URL` from `process.env`, falling back to `https://sve.moe`. This becomes Astro's `site` value and is used by `BaseLayout` for canonical and social URLs.
- `siteUrl` in [src/config/theme.config.ts](./src/config/theme.config.ts) sets `SITE.url`, which is used by JSON-LD, RSS, the sitemap, and robots.txt.

For a complete domain change, update `siteUrl` and set the matching build environment variable:

```bash
SITE_URL=https://your-domain.com pnpm build
```

Alternatively, replace the fallback in both files. Set environment variables in the shell or hosting platform, not only in `.env`: the Astro config reads `process.env` before `.env` values can supply it.

## Profile and Identity

The `profile` object supplies the Sidebar profile, the author name in article JSON-LD, and the RSS creator. Its avatar is a public path and is rendered as a 40px circle.

The person identity is also written directly in these places:

- Homepage `WebSite` and `Person` JSON-LD in [src/pages/index.astro](./src/pages/index.astro).
- `ProfilePage` and `Person` JSON-LD in [src/pages/about.astro](./src/pages/about.astro).
- Footer naming and license text in [src/components/Footer.astro](./src/components/Footer.astro).
- Direct email and Discord links in [src/pages/contact.astro](./src/pages/contact.astro).

Update those alongside `profile` and `CONTACT` when changing names, usernames, avatars, or social accounts.

## Categories and Tags

Categories and tags are `{ slug, name }` pairs in `theme.config.ts`. The config is authoritative:

- `/categories/<slug>` and `/tags/<slug>` routes are generated only for configured entries.
- Taxonomy lists, Sidebar links, homepage category buttons, and archive filter options use the configured names.
- An unconfigured value in a post does not stop publication, but it has no taxonomy route and its label may fall back to the raw slug.
- Archive filter menus omit options with no published posts; category and tag routes themselves still exist and can be empty.
- The sitemap includes every configured category and tag, including empty ones.
- The footer shows the first five categories in declaration order.

Add or remove taxonomy entries in the config and content together.

## Post Frontmatter

Each post is a folder under [src/content/blog](./src/content/blog) containing `index.mdx` and its local assets. The route slug is the first eight characters of the SHA-256 hash of `title`, producing `/pub/<title-hash>`; the folder name only organizes the content and assets. [src/content.config.js](./src/content.config.js) validates the frontmatter.

Required fields:

- `title`
- `excerpt`
- `date`
- `category`
- `thumbnail` — a local image validated with Astro's `image()` schema

Optional fields and defaults:

| Field            | Behavior                                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `tags`           | Array of tag slugs; defaults to `[]`.                                                                                 |
| `thumbnailAlt`   | Lead-image alternative text; defaults to empty. The article falls back to `imageCredit.caption` when this is empty.   |
| `readingTime`    | Positive integer override. Otherwise the raw MDX body is estimated at 180 words per minute in `src/lib/blog-data.js`. |
| `featured`       | `true` promotes the post on the homepage; defaults to `false`.                                                        |
| `draft`          | `true` excludes the post from routes, listings, feeds, and the sitemap; defaults to `false`.                          |
| `updated`        | Adds the updated date to the byline, JSON-LD `dateModified`, and sitemap `lastmod`.                                   |
| `seoTitle`       | Overrides the document title without changing the visible headline.                                                   |
| `seoDescription` | Overrides the meta and social description.                                                                            |
| `canonical`      | Absolute canonical URL for content published elsewhere.                                                               |
| `imageCredit`    | Adds a caption and source credit below the article lead image.                                                        |

`imageCredit` requires `author`, `authorUrl`, and `sourceUrl` when present. `caption` is optional, and `source` defaults to `Unsplash`.

`excerpt` is reused in the article standfirst, cards, metadata, RSS, and archive search. Cards render thumbnails decoratively with empty alt text; the homepage hero and article lead image use `thumbnailAlt`.

## Homepage

[src/pages/index.astro](./src/pages/index.astro) controls the homepage directly.

### Featured hero

The newest post marked `featured: true` supplies the hero image, title, excerpt, and link. If none is flagged, the newest published post is used. The same post is pinned at the start of the Latest grid. The homepage expects at least one published post.

The hero image is loaded eagerly with high fetch priority and responsive widths up to 2400px. Keep those attributes when changing its layout. The dark overlays and transparent header are part of the design; the header changes after scrolling or when a header panel opens. Supporting browsers also apply a scroll-driven hero tilt, disabled for reduced-motion users.

The countdown is not configured in frontmatter. Change `countdownTarget` near the top of `index.astro`; it currently displays `days:hours:minutes:seconds` and stops at zero.

### Latest grid

The initial grid contains the pinned featured post and the two newest remaining posts. Category buttons filter client-side without changing the URL. The featured card remains visible for every filter; up to two additional matching cards are shown. Change both the initial `index >= 3` rule and the script's `visible < 2` rule if adjusting this count.

## Archive and Search

[src/pages/pub/index.astro](./src/pages/pub/index.astro) renders all published posts, then filters them in the browser. Search, category, and tag filters combine with AND.

- State is stored in `?q=&cat=&tag=&page=` and written with `history.pushState`, so filtered views are shareable and Back/Forward works.
- `pageSize` in the page script is 5. **Load more** reveals another batch and advances `page`.
- Results update when the search form is submitted, not on every keystroke.
- Only lowercase titles and excerpts are searched. They are emitted as `data-search` by [src/components/PostCard.astro](./src/components/PostCard.astro).
- Filter menus are native `<details>` elements. Rows are real taxonomy links without JavaScript; JavaScript intercepts them to filter in place.
- Counts respond to the other active filters. Empty result options are dimmed rather than removed.
- Unknown category or tag URL values are ignored.

The header search is a native modal `<dialog>` in [src/components/Header.astro](./src/components/Header.astro). It submits a normal GET form to `/pub?q=...`; it does not maintain a separate search index.

There is no generated search index or network request. The trade-off is that every published post card is shipped in the archive HTML. A much larger archive may need a generated index or server-side pagination.

## Article Pages

[src/pages/pub/[slug].astro](./src/pages/pub/%5Bslug%5D.astro) assembles each article.

- **Contents:** `##` and `###` headings become the desktop table of contents. [src/components/TableOfContents.astro](./src/components/TableOfContents.astro) tracks the visible section with IntersectionObserver and renders nothing when there are no eligible headings.
- **Related posts:** up to three posts are selected by `relatedPosts()` in `src/lib/blog-data.js`: two points for a shared category and one for each shared tag.
- **Reading progress:** the top hairline is updated by the article page's scroll listener.
- **Sharing:** X, LinkedIn, and copy-link controls use the current browser URL. No third-party sharing script is loaded.
- **Comments and previous/next navigation:** neither is currently rendered. Add them to the article template if needed.

### Signature and publication mark

After the article body—including its References section—and before Tags, the page renders [public/sign.svg](./public/sign.svg) at 160px wide. The transparent black signature is inverted in dark mode.

Below it is a centered publication mark such as `26.i.3dd5fd06`:

1. The two-digit year comes from `date`.
2. The lowercase Roman numeral is the calendar quarter: `i`, `ii`, `iii`, or `iv`.
3. The final eight characters are the beginning of the SHA-256 hash of the post's `title`, calculated at build time. This is the same hash used in the article route.

Replace `sign.svg` to change the signature. Edit `getPostSlug()` in `src/lib/blog-data.js` to change both the article route and the publication mark.

### Footnote navigation

Standard Markdown footnotes produce a **References** section. Clicking a reference or its backlink highlights the destination. The article script adds a `footnote-highlight` class directly to the target, keeps it during Lenis smooth scrolling, and removes it 500ms after scrolling stops. CSS in `src/styles.css` fades the background and halo out over 250ms while preserving the rounded shape.

Adjust the timing in `[slug].astro` and the highlight appearance in `styles.css` together.

## Markdown, Prose, and Code

The `prose-article` utility in [src/styles.css](./src/styles.css) styles article headings, paragraphs, links, lists, blockquotes, figures, tables, inline code, and footnotes. Blockquotes use italic Cormorant Garamond at 18px.

A `callout` utility is also available:

```mdx
<div class="callout">A short aside with a primary-colored border.</div>
```

### Code blocks and math

Code blocks use Expressive Code, configured in [astro.config.mjs](./astro.config.mjs), rather than a custom copy-button script. The current setup includes:

- GitHub Light and Material Theme Ocean themes, switched by the site's `.dark` class.
- Line numbers, line wrapping, collapsible sections, and built-in copy buttons.
- `var(--font-mono)` for code and UI text.
- `--codeblock-bg` and `--codeblock-topbar-bg` for light and dark surfaces.

Change Expressive Code's plugins, default props, or style overrides in `astro.config.mjs`; change its color tokens in `styles.css`.

Math is handled by `remark-math`, `rehype-katex`, and KaTeX CSS loaded in `BaseLayout`.

### Admonitions

`remark-directive` and `remark-admonition` support styled notes and warnings:

```mdx
:::note[Custom title]
Content.
:::
```

The existing content also uses `tip`, `important`, `warning`, `caution`, and `danger`. Styling is keyed by `data-admonish` and `data-admonition-name` in `styles.css`.

### Spoilers

The custom `remarkSpoiler` plugin supports inline spoilers:

```mdx
This is :spoiler[hidden until hover or keyboard focus].
```

Spoilers reveal on hover or focus and have a visible keyboard focus state.

### Hyperlink cards

The custom hyperlink plugins turn a directive into an external card:

```mdx
::::hyperlink{href="https://example.com" title="Example" avatar="/avatars/example.webp" description="Description" logo="/entities/example.svg"}
::::
```

`avatar`, `description`, and `logo` are optional. Without a description, the card displays the destination hostname. Links open in a new tab with `noopener noreferrer`.

### Images and captions

A body image that is alone in a paragraph and has non-empty alt text is converted to a `<figure>`; its alt text is repeated as a visible `<figcaption>`. Empty alt text leaves the image without a visible caption. Article and cover captions use italic Cormorant Garamond.

## Images and Static Assets

Post thumbnails and relative body images go through Astro's image pipeline. Keep `widths` and `sizes` aligned with the layout when editing cards or the article lead image. Article social images are generated separately at 1200×630 WebP.

Files in `public/` are served as-is and do not go through Astro's image optimization. This includes fonts, avatars used by direct paths, entity logos, `og.webp`, favicons, and `sign.svg`.

`pnpm build` runs [scripts/prune-unused-assets.mjs](./scripts/prune-unused-assets.mjs) after Astro builds. It removes unreferenced original JPG, JPEG, and PNG files from `dist/_astro`, while leaving optimized WebP files and `public/` output alone. If a raster asset is referenced only through a hand-written string the script cannot detect, keep it in `public/`.

## Global UI Behavior

[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) loads the site's shared client behavior:

- Lenis smooth scrolling with anchor support.
- Custom scrollbars from [src/lib/custom-scrollbars.js](./src/lib/custom-scrollbars.js).
- Medium Zoom for article images, excluding hyperlink avatars and images marked `data-no-zoom`.
- A custom cursor on fine-pointer devices; coarse-pointer devices retain the normal platform behavior.

The header also owns the mobile menu, search dialog, home-header scroll state, and dark-mode toggle. Global animation and transition reductions live under `prefers-reduced-motion` in `styles.css`.

## Icons

[src/components/Icon.astro](./src/components/Icon.astro) supports two icon sources:

1. Inline 24×24 stroke paths in its `paths` map.
2. Raw brand SVG files in `src/icons/`, loaded automatically by filename.

For example, `name: "github"` resolves to `src/icons/github.svg`. Brand icons take precedence over an inline path with the same name. Add a new SVG there or add a path to the map; an unknown name renders an empty icon rather than failing the build.

## Newsletter and Contact

Newsletter UI is currently disabled: [src/components/Newsletter.astro](./src/components/Newsletter.astro) renders no markup even though it is imported by the homepage, article pages, and Sidebar. The `FORMS.newsletter` values therefore do not produce a visible subscription form.

The Contact page currently contains direct email and Discord links, not a contact form. Update those links in `src/pages/contact.astro`; update `CONTACT` and `SOCIAL_LINKS` separately for the footer. The existing `FORMS.contact` values do not affect visible page behavior.

## Sidebar

[src/components/Sidebar.astro](./src/components/Sidebar.astro) is used on category pages. It contains the profile, categories, Popular, Recent, tags, the currently empty Newsletter component, and an RSS link.

Recent shows the four newest posts. Popular currently calls `popularPosts()`, which also returns the four newest posts; it is not based on analytics. Tag pages and the archive are full width, while articles use their contents rail instead.

## Routes

| Page      | Source                                                   | URL                  |
| --------- | -------------------------------------------------------- | -------------------- |
| Home      | [src/pages/index.astro](./src/pages/index.astro)         | `/`                  |
| Archive   | [src/pages/pub/index.astro](./src/pages/pub/index.astro) | `/pub`               |
| Article   | `src/pages/pub/[slug].astro`                             | `/pub/<slug>`        |
| Category  | `src/pages/categories/[slug].astro`                      | `/categories/<slug>` |
| Tag       | `src/pages/tags/[slug].astro`                            | `/tags/<slug>`       |
| About     | [src/pages/about.astro](./src/pages/about.astro)         | `/about`             |
| Contact   | [src/pages/contact.astro](./src/pages/contact.astro)     | `/contact`           |
| Not found | [src/pages/404.astro](./src/pages/404.astro)             | `/404`               |
| Feed      | [src/pages/rss.xml.js](./src/pages/rss.xml.js)           | `/rss.xml`           |
| Sitemap   | [src/pages/sitemap.xml.js](./src/pages/sitemap.xml.js)   | `/sitemap.xml`       |
| Robots    | [src/pages/robots.txt.js](./src/pages/robots.txt.js)     | `/robots.txt`        |

Only the archive reveals posts in browser-side batches. Category and tag pages render their complete lists.

## Theme Tokens and Dark Mode

Colors, radii, fonts, base styles, component classes, and prose styles live in [src/styles.css](./src/styles.css). Prefer changing tokens before editing individual components.

The palette uses `oklch` tokens such as `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, and `--ring`, with foreground companions where needed. Light values are defined on `:root`; `.dark` overrides them. `--radius` drives the radius steps, and the two code-block tokens control Expressive Code surfaces.

The `@theme inline` block exposes tokens to Tailwind utilities such as `bg-background`, `text-muted-foreground`, `border-border`, and `font-serif`. For a new color token, define its light and dark values and add the matching `@theme` mapping.

Dark mode is a class on `<html>`. An inline script in `BaseLayout` applies `localStorage.theme` before first paint, falling back to `prefers-color-scheme`. The header toggle updates both the class and storage. The `dark` variant is registered as `@custom-variant dark (&:is(.dark *))`.

## Fonts

Three self-hosted WOFF2 families are declared at the top of `styles.css`:

- **Cormorant Garamond** for `font-serif`: separate regular and italic variable fonts, both declared at weights 300–700.
- **Scope One** for `font-sans`: the CSS family name is `Scope`.
- **Ubuntu Mono** for `font-mono`.

All use `font-display: swap` and a Latin-oriented `unicode-range`. Scope and Cormorant Garamond Regular are preloaded in `BaseLayout`; italic Garamond and Ubuntu Mono load on demand.

The custom `font-serif` utility also sets `font-size-adjust: 0.43` and increases the visual weight: default 500, `font-medium` 600, and `font-semibold` 700. Adjust that utility rather than only changing `@font-face` if replacing Garamond with a font that has different proportions.

To change a typeface, replace its files in `public/fonts`, update the `@font-face` rules and `--font-*` tokens, and update the preload links. Check both regular and italic faces where needed.

## SEO and Feeds

[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) owns the document head. Its props are:

| Prop          | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `title`       | Document, Open Graph, and Twitter title.                     |
| `description` | Meta, Open Graph, and Twitter description.                   |
| `canonical`   | Canonical path or URL, resolved against the configured site. |
| `ogType`      | `website` by default; `article` on posts.                    |
| `ogImage`     | Social image, resolved to an absolute URL.                   |
| `jsonLd`      | Optional JSON-LD object serialized into the head.            |
| `flushFooter` | Removes the footer's top margin.                             |

Structured data is not limited to articles: the homepage emits `WebSite` and `Person`, About emits `ProfilePage` and `Person`, and articles emit `BlogPosting`. Breadcrumbs rendered by [src/components/Breadcrumbs.astro](./src/components/Breadcrumbs.astro) do not emit `BreadcrumbList` JSON-LD.

RSS, sitemap, and robots are handwritten Astro endpoints. RSS contains titles, links, dates, the profile name, and excerpts rather than full article bodies. The sitemap includes static pages, published posts, and every configured taxonomy route. All post feeds and listings exclude drafts through the shared post helpers.

## Common Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm format
```

Use `pnpm build` after content, schema, asset-pipeline, or Markdown-plugin changes. It validates frontmatter, regenerates static routes and optimized images, computes article title hashes, and prunes unused build assets.

## Identity Change Checklist

When personalizing or rebranding the site, check all of these rather than only the theme config:

- `SITE`, `profile`, `CONTACT`, `SOCIAL_LINKS`, `NAVIGATION`, categories, and tags in `theme.config.ts`.
- `siteUrl` and the build-time `SITE_URL` value.
- Homepage and About JSON-LD, visible page copy, and social accounts.
- Contact links and footer legal text.
- Homepage `countdownTarget`.
- `public/sign.svg`, avatar files, `public/og.webp`, and favicon files.
- Empty taxonomy routes that should be removed from the sitemap.
- The empty Newsletter component and dormant `FORMS` settings if subscription or contact forms are required.
