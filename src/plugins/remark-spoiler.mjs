import { visit } from "unist-util-visit";

export function remarkSpoiler() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.name !== "spoiler") return;

      node.data ??= {};
      if (node.type === "textDirective") {
        node.data.hName = "span";
        node.data.hProperties = { class: "spoiler", tabindex: "0" };
      } else if (node.type === "leafDirective" || node.type === "containerDirective") {
        node.data.hName = "div";
        node.data.hProperties = { class: "spoiler spoiler--block", tabindex: "0" };
      }
    });
  };
}
