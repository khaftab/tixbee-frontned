import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function validateAndSanitizeHTML(content: string) {
  // Configure DOMPurify
  const config = {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ol",
      "ul",
      "li",
      "a",
      "img",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "style", "src", "alt", "width", "height"],
    ALLOWED_STYLES: {
      "*": [
        "color",
        "background-color",
        "font-size",
        "font-weight",
        "font-style",
        "text-decoration",
        "text-align",
        "padding",
        "margin",
      ],
    },
  };

  // Custom hook to allow base64 images
  purify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName === "src" && data.attrValue.startsWith("data:image/")) {
      data.forceKeepAttr = true;
    }
  });

  // Sanitize the HTML
  const cleanHtml = purify.sanitize(content, config);

  // Remove the custom hook after sanitization
  purify.removeHook("uponSanitizeAttribute");

  // Additional custom validation
  const doc = new JSDOM(cleanHtml).window.document;
  const links = doc.getElementsByTagName("a");
  for (let link of links) {
    // Ensure all links are absolute and use https
    if (link.getAttribute("href") && !link.getAttribute("href")!.startsWith("https://")) {
      link.setAttribute(
        "href",
        "https://" + link.getAttribute("href")!.replace(/^(https?:\/\/)?(www\.)?/, "")
      );
    }
    // Ensure all links open in a new tab and have security attributes
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }

  return doc.body.innerHTML;
}
