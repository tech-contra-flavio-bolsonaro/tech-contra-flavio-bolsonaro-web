import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(process.env.BUTTON_PREVIEW_URL ?? 'http://localhost:3212');
  const action = page.locator('.home-hero-manifesto-cta');
  await action.waitFor();
  const rect = await action.boundingBox();
  await page.mouse.move(1, 500);
  const sample = () => action.evaluate(n => ({rect: n.getBoundingClientRect().toJSON(), surface: getComputedStyle(n,'::before').transform, content: n.querySelector('[data-press-content]') ? getComputedStyle(n.querySelector('[data-press-content]')).transform : 'none',hover:n.matches(':hover')}));
  const resting = await sample();
  await page.mouse.move(rect.x + rect.width/2,rect.y + rect.height/2);
  await page.waitForTimeout(200);
  const hovered = await sample();
  assert.deepEqual(hovered.rect,resting.rect,'semantic hover hitbox must stay fixed');
  assert.notEqual(hovered.surface,'none','visual surface must move on hover');
  assert.equal(hovered.content,hovered.surface,'content and surface must move together');
  await page.mouse.down(); await page.waitForTimeout(200);
  const active = await sample();
  assert.deepEqual(active.rect,resting.rect,'active hitbox must stay fixed');
  assert.notEqual(active.surface,hovered.surface,'active is a deeper press');
  await page.mouse.move(1,500); await page.mouse.up();
  for (const [x,y] of [[1,rect.height/2],[rect.width-1,rect.height/2],[rect.width/2,1],[rect.width/2,rect.height-1],[1,1],[rect.width-1,1],[1,rect.height-1],[rect.width-1,rect.height-1]]) {
    await page.mouse.move(rect.x+x,rect.y+y);
    const timeline = await action.evaluate(async n => {
      const samples=[];
      for(let i=0;i<30;i++){ await new Promise(requestAnimationFrame); samples.push({hover:n.matches(':hover'),rect:n.getBoundingClientRect().toJSON()}); }
      return samples;
    });
    assert.ok(timeline.every(s=>s.hover),'hover lost at inset boundary');
    for(const s of timeline) assert.deepEqual(s.rect,resting.rect,'boundary jitter');
    await page.mouse.move(1,500); await page.waitForTimeout(180);
  }
  console.log('PASS real Chromium: moving surface, fixed hover/active rect, eight edges/corners stable');
} finally {await browser.close();}
