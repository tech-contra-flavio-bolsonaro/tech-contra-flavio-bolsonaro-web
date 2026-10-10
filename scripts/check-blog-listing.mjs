import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base = process.env.BLOG_PREVIEW_URL ?? 'http://localhost:3111';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const font = async (selector, expected) => {
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    assert.ok(fonts.some(f => f.familyName.startsWith(expected) && f.isCustomFont && f.glyphCount > 0), `${selector}: actual rendered ${expected}: ${JSON.stringify(fonts)}`);
    return fonts;
  };
  for (const width of [1440, 900, 390, 195]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/blog`);
    await page.locator('.blog-card').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const fonts = {};
    for (const [s, f] of [['.blog-hero h1', 'Barlow Condensed'], ['.blog-intro', 'Inter'], ['.blog-card h2 a', 'Barlow Condensed'], ['.blog-source-bar a', 'Inter'], ['.blog-card-bottom time', 'IBM Plex Mono']]) fonts[s] = await font(s, f);
    const actual = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      unicode: [...document.querySelectorAll('#blog-main a')].some(n => /[↗←→]/u.test(n.textContent)),
      actions: [...document.querySelectorAll('#blog-main .home-button')].map(n => {
        const c = getComputedStyle(n), svg = n.querySelector('svg');
        return { text: n.textContent.trim(), width: svg?.getBoundingClientRect().width, height: svg?.getBoundingClientRect().height, shadow: c.boxShadow, radius: c.borderRadius, family: c.fontFamily, visible: n.getBoundingClientRect().height > 0 };
      }),
      footer: document.querySelector('footer').className,
      logo: document.querySelector('footer .site-footer-brand img')?.getAttribute('src'),
    }));
    assert.ok(!actual.overflow, `overflow at ${width}`);
    assert.ok(!actual.unicode);
    assert.ok(actual.actions.length >= 3);
    for (const a of actual.actions) { assert.equal(a.width, 24); assert.equal(a.height, 24); assert.equal(a.radius, '4px'); assert.match(a.shadow, /7px 7px/); assert.ok(a.visible); }
    assert.match(actual.footer, /home-footer/);
    assert.equal(actual.logo, '/images/home-pixel-logo.svg');
    const source = page.getByRole('link', { name: 'Conheça no DEV.to' });
    await source.hover();
    assert.equal(await source.evaluate(n => getComputedStyle(n).backgroundColor), 'rgb(212, 206, 255)');
    await source.focus();
    assert.equal(await source.evaluate(n => getComputedStyle(n).outlineWidth), '3px');
    if (width === 195) {
      await page.getByRole('button', { name: 'Menu' }).click();
      const contained = await page.locator('.site-nav-cta').evaluate(n => n.querySelector('svg').getBoundingClientRect().right <= n.getBoundingClientRect().right - 3);
      assert.ok(contained, 'narrow expanded menu keeps SVG inside the CTA');
      await page.keyboard.press('Escape');
    }
    console.log(JSON.stringify({ width, fonts, actual }));
  }
  // Stylesheets survive SPA transitions. Compare the Home preview before and after Blog.
  await page.setViewportSize({width:1440,height:1000});
  const metrics = () => page.locator('.home-blog-card').first().evaluate(n => { const s=getComputedStyle(n);return { shadow:s.boxShadow,border:s.borderWidth,background:s.backgroundColor,title:getComputedStyle(n.querySelector('h3')).fontSize,body:getComputedStyle(n.querySelector('.blog-card-description')).fontSize }; });
  await page.goto(`${base}/`); await page.locator('.home-blog-card').first().waitFor(); const before=await metrics();
  await page.locator('.home-blog-all').click(); await page.locator('.blog-hero').waitFor();
  await page.locator('.site-header-brand').click(); await page.locator('.home-blog-card').first().waitFor();
  assert.deepEqual(await metrics(), before, 'Home preview remains unchanged after listing SPA');
  console.log('PASS listing 1440/900/390/195: actual platform fonts, SVG24, primitives, focus/hover, footer and Home SPA regression');
} finally { await browser.close(); }
