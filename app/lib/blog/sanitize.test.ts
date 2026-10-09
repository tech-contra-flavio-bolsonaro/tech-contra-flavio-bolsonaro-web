import { expect, it, vi } from "vitest";
import { sanitizeBlogHtml } from "./sanitize";
vi.mock("server-only", () => ({}));
it("preserves accents, structure, code operators/newlines and long articles", () => {
  const html =
    "<h2>Ação</h2><p>Olá 👋 &amp; educação</p><pre><code>if (a &lt; b) {\n  ação();\n}</code></pre><ul><li>item</li></ul><table><tr><td>dados</td></tr></table>";
  const result = sanitizeBlogHtml(html.repeat(300));
  expect(result).toContain("<h2>Ação</h2>");
  expect(result).toContain("if (a &lt; b) {\n  ação();\n}");
  expect(result).toContain("<td>dados</td>");
  expect(result.length).toBeGreaterThan(40000);
});
it.each([
  "<script>alert(1)</script>",
  '<iframe src="https://youtube.com/x"></iframe>',
  '<svg onload="alert(1)"><script>alert(1)</script></svg>',
  "<math><mtext><img src=x onerror=alert(1)></mtext></math>",
  '<object data="https://evil.test">embed</object>',
  "<style>body{display:none}</style>",
])("strips active markup %s", (html) =>
  expect(sanitizeBlogHtml(html)).not.toMatch(
    /script|iframe|svg|math|object|style|alert/,
  ),
);
it("removes handlers, srcset, CSS and unsafe images/links", () => {
  const result = sanitizeBlogHtml(
    '<p onclick="alert(1)" style="color:red">Texto</p><img src="https://media2.dev.to/a.png" srcset="https://evil.test/a.png 2x" onerror="alert(1)"><img src="http://media2.dev.to/x"><a href="jav&#x61;script:alert(1)">link</a><a href="//evil.test/x">relative</a><img src="https://media2.dev.to.evil.test/x">',
  );
  expect(result).not.toMatch(
    /onclick|onerror|srcset|style=|evil|javascript|http:/,
  );
  expect(result).toContain('loading="lazy"');
  expect(result).toContain("Texto");
  expect(result).toContain("link");
});
it("preserves safe links and prevents DOM clobbering", () => {
  const r = sanitizeBlogHtml(
    '<a href="https://example.org/" name="top" id="top" target="_blank">origem</a>',
  );
  expect(r).toContain('rel="noopener noreferrer"');
  expect(r).not.toMatch(/name=|id=/);
});

it("rejects credentialed, protocol-relative and suffix-spoof media, data URLs and encoded handlers", () => {
  const html =
    '<img src="https://user:pw@media2.dev.to/a"><img src="//media2.dev.to/a"><img src="https://media2.dev.to.evil.test/a"><img src="data:image/svg+xml,x"><a href="https://u:p@dev.to/a">autor</a><a href="/pachi/acao">seguro</a><p onmouseover="alert(1)">educação</p>';
  const result = sanitizeBlogHtml(html);
  expect(result).not.toContain("<img");
  expect(result).not.toMatch(/onmouseover|user:pw|u:p|data:|evil/);
  expect(result).toContain('href="https://dev.to/pachi/acao"');
  expect(result).toContain("educação");
});
it("preserves safe fragment navigation with prefixed heading ids", () => {
  const result = sanitizeBlogHtml(
    '<h2 id="condicionais">Condicionais</h2><a href="#condicionais">Ir ao trecho</a>',
  );
  expect(result).toContain('id="blog-condicionais"');
  expect(result).toContain('href="#blog-condicionais"');
});

it("drops invalid heading ids instead of allowing unprefixed DOM names", () => {
  expect(sanitizeBlogHtml('<h2 id="window name">Título</h2>')).not.toContain(
    "id=",
  );
});
