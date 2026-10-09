import "server-only";
import sanitizeHtml from "sanitize-html";
import { safeBlogImage, safeBlogLink } from "./urls";
/** Parser-based allowlist. Source classes/CSS and active embeds never survive. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "s",
      "del",
      "u",
      "mark",
      "small",
      "sub",
      "sup",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "kbd",
      "samp",
      "span",
      "div",
      "a",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "caption",
      "details",
      "summary",
    ],
    allowedAttributes: {
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
      a: ["href", "title", "rel"],
      img: ["src", "alt", "title", "loading", "decoding", "referrerpolicy"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      ol: ["start"],
      code: ["class"],
      span: ["class"],
    },
    allowedClasses: {
      code: ["language-*"],
      span: ["k", "kd", "s", "s1", "s2", "n", "nf", "o", "p", "c", "c1", "mi"],
    },
    allowedSchemes: ["https"],
    allowProtocolRelative: false,
    nonTextTags: [
      "script",
      "style",
      "textarea",
      "option",
      "iframe",
      "object",
      "embed",
      "svg",
      "math",
    ],
    transformTags: {
      h1: "h2",
      "*": (tagName, { id, ...attrs }) => ({
        tagName,
        attribs: {
          ...attrs,
          ...(id && /^h[2-6]$/.test(tagName) && /^[a-zA-Z0-9_-]+$/.test(id)
            ? { id: `blog-${id}` }
            : {}),
        },
      }),
      a: (_tag, attrs) => {
        const href =
          attrs.href?.startsWith("#") &&
          /^[a-zA-Z0-9_-]+$/.test(attrs.href.slice(1))
            ? `#blog-${attrs.href.slice(1)}`
            : safeBlogLink(attrs.href);
        return {
          tagName: "a",
          attribs: {
            ...(href ? { href } : {}),
            ...(attrs.title ? { title: attrs.title } : {}),
            rel: "noopener noreferrer",
          },
        };
      },
      img: (_tag, attrs) => {
        const src = safeBlogImage(attrs.src);
        return {
          tagName: "img",
          attribs: {
            ...(src ? { src } : {}),
            alt: attrs.alt ?? "",
            loading: "lazy",
            decoding: "async",
            referrerpolicy: "no-referrer",
          },
        };
      },
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });
}
