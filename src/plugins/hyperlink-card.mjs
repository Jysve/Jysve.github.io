import { visit } from "unist-util-visit";

export function remarkHyperlinkCard() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective") return;
      if (node.name !== "hyperlink") return;

      const attrs = node.attributes || {};
      const data = node.data || (node.data = {});
      data.hName = "a";
      data.hProperties = {
        class: "hyperlink-card",
        href: attrs.href ?? "#",
        target: "_blank",
        rel: "noopener noreferrer",
        dataTitle: attrs.title ?? "",
        dataAvatar: attrs.avatar ?? "",
        dataDescription: attrs.description ?? "",
      };
    });
  };
}

export function rehypeHyperlinkCard() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index == null) return;
      const cls = node.properties?.className;
      if (node.tagName !== "a" || !Array.isArray(cls) || !cls.includes("hyperlink-card")) return;

      const href = String(node.properties.href || "#");
      const title = String(node.properties.dataTitle || "");
      const avatar = String(node.properties.dataAvatar || "");
      const description = String(node.properties.dataDescription || "");
      let host = "";
      try {
        host = new URL(href).hostname.replace(/^www\./, "");
      } catch {}

      const subtitle = description || host;

      parent.children[index] = {
        type: "element",
        tagName: "a",
        properties: { href, target: "_blank", rel: "noopener noreferrer", class: "hyperlink-card" },
        children: [
          avatar && {
            type: "element",
            tagName: "img",
            properties: { src: avatar, alt: "", loading: "lazy", class: "hyperlink-avatar" },
            children: [],
          },
          {
            type: "element",
            tagName: "span",
            properties: { class: "hyperlink-body" },
            children: [
              title && {
                type: "element",
                tagName: "span",
                properties: { class: "hyperlink-title" },
                children: [{ type: "text", value: title }],
              },
              subtitle && {
                type: "element",
                tagName: "span",
                properties: { class: "hyperlink-desc" },
                children: [{ type: "text", value: subtitle }],
              },
            ].filter(Boolean),
          },
        ].filter(Boolean),
      };
    });
  };
}
