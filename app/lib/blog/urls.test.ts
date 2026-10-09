import { expect, it } from "vitest";
import {
  blogPermalink,
  blogSourceUrl,
  safeBlogImage,
  safeBlogLink,
} from "./urls";
it("builds local navigation and validated DEV.to canonical", () => {
  const post = {
    id: 2299146,
    slug: "revisao-rapida-de-condicionais-em-js-5emd",
  };
  expect(blogPermalink(post)).toBe(
    "/blog/2299146/revisao-rapida-de-condicionais-em-js-5emd",
  );
  expect(blogSourceUrl(post, "https://evil.test/post")).toBe(
    "https://dev.to/techcontrabolsonaro/" + post.slug,
  );
  expect(blogSourceUrl(post, "https://dev.to/other/post")).toBe(
    "https://dev.to/techcontrabolsonaro/" + post.slug,
  );
});
it.each([
  "javascript:alert(1)",
  "http://dev.to/a",
  "//evil.test/x",
  "https://user:secret@dev.to/a",
  "https://dev.to.evil.test/x",
  "https://localhost/x",
  "https://127.0.0.1/x",
])("rejects unsafe image %s", (url) => expect(safeBlogImage(url)).toBeNull());
it("restricts images but permits public HTTPS article links and DEV relative links", () => {
  expect(safeBlogImage("https://media2.dev.to/image.png")).toBe(
    "https://media2.dev.to/image.png",
  );
  expect(safeBlogLink("/pachi/post")).toBe("https://dev.to/pachi/post");
  expect(safeBlogLink("//evil.test/x")).toBeNull();
  expect(safeBlogLink("https://user:pw@example.com/x")).toBeNull();
});

it.each([
  "https://dev.to.evil.test/techcontrabolsonaro/acao",
  "https://u:p@dev.to/techcontrabolsonaro/acao",
  "//dev.to/techcontrabolsonaro/acao",
  "http://dev.to/techcontrabolsonaro/acao",
  "https://dev.to/techcontrabolsonaro/acao?evil=1",
])("does not trust an arbitrary canonical: %s", (value) =>
  expect(blogSourceUrl({ slug: "acao" }, value)).toBe(
    "https://dev.to/techcontrabolsonaro/acao",
  ),
);
