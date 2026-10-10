import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const width of [1440, 900, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${process.env.BLOG_PREVIEW_URL ?? 'http://localhost:3102'}/blog/2299146/revisao-rapida-de-condicionais-em-js-5emd`);
    await page.locator('.blog-prose').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const actual = await page.evaluate(() => {
      const style = (selector) => {
        const node = document.querySelector(selector);
        const c = getComputedStyle(node);
        return { family: c.fontFamily, size: c.fontSize, weight: c.fontWeight, line: c.lineHeight, bg: c.backgroundColor, color: c.color, shadow: c.boxShadow, radius: c.borderRadius };
      };
      return {
        body: style('.blog-prose'), paragraph: style('.blog-prose p'), heading: style('.blog-detail-hero h1'), code: style('.blog-prose code'),
        share: style('.blog-byline .share-trigger'),
        arrows: [...document.querySelectorAll('.blog-detail a.home-button svg, .blog-byline .share-trigger svg')].map(n => ({ width: n.getBoundingClientRect().width, cls: n.getAttribute('class') })),
        overflow: document.documentElement.scrollWidth > innerWidth,
        unicode: [...document.querySelectorAll('.blog-detail a')].some(a => /[↗←]/u.test(a.textContent)),
        loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family),
      };
    });
    assert.match(actual.body.family, /Inter/, `body family at ${width}`);
    assert.equal(actual.body.size, width <= 600 ? '18px' : '20px');
    assert.equal(actual.body.line, width <= 600 ? '31.5px' : '35px');
    assert.equal(actual.paragraph.weight, '400', 'ordinary first paragraph remains body text');
    assert.match(actual.heading.family, /Barlow Condensed/);
    assert.match(actual.code.family, /IBM Plex Mono/);
    assert.equal(actual.share.bg, 'rgb(252, 240, 80)');
    assert.equal(actual.share.color, 'rgb(0, 0, 0)');
    assert.equal(actual.share.radius, '4px');
    assert.match(actual.share.shadow, /7px 7px/);
    assert.ok(actual.arrows.length >= 3);
    assert.ok(actual.arrows.filter(a => a.width > 0).every(a => a.width === 24 && a.cls === 'home-arrow'));
    assert.ok(!actual.unicode, 'detail controls use actual SVGs');
    assert.ok(!actual.overflow, `document overflow at ${width}`);
    assert.ok(actual.loaded.includes('Inter') && actual.loaded.includes('Barlow Condensed'));
    console.log(`PASS ${width}: loaded fonts, body hierarchy, palette, Home controls, no overflow`);
  }
  for (const width of [1440, 900, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${process.env.BLOG_PREVIEW_URL ?? 'http://localhost:3102'}/blog/999999999999999/missing`);
    assert.equal(response.status(), 404);
    await page.getByRole('heading', { name: 'Artigo não encontrado' }).waitFor();
    const canvas = await page.evaluate(() => {
      const parent = document.querySelector('.blog-page');
      const child = parent.firstElementChild;
      return { parentHeight: parent.getBoundingClientRect().height, childHeight: child.getBoundingClientRect().height, parentColor: getComputedStyle(parent).backgroundColor, childColor: getComputedStyle(child).backgroundColor };
    });
    assert.equal(canvas.parentColor, canvas.childColor, 'short detail canvas identity');
    assert.ok(Math.abs(canvas.parentHeight - canvas.childHeight) < 1, 'short detail fills parent');
    console.log(`PASS short 404 ${width}: correct canvas and shell occupation`);
  }
} finally { await browser.close(); }
