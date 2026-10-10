import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const base=process.env.BUTTON_PREVIEW_URL??'http://localhost:3212';
const browser=await chromium.launch();const evidence=[];
const item={id:'qa-motion',title:'Conteúdo QA',description:'Fixture local para verificar interação.',credit:'Comunidade',priority:1,media_path:null,mediaUrl:null,video_url:null};
async function fixtures(page){await page.route('**/api/conteudos?**',r=>r.fulfill({json:{items:[item],hasMore:false}}));await page.route('**/api/ferramentas?**',r=>r.fulfill({json:{items:[],categories:[],hasMore:false}}));}
async function sample(a){return a.evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),hover:n.matches(':hover'),surface:getComputedStyle(n,'::before').transform,shadow:getComputedStyle(n,'::before').boxShadow,content:getComputedStyle(n.querySelector('[data-press-content]')).transform}));}
async function boundaries(page,a,label){await a.scrollIntoViewIfNeeded();await page.mouse.move(1,120);await page.waitForTimeout(180);const rest=await sample(a),r=rest.rect;
 for(const [x,y] of [[1,r.height/2],[r.width-1,r.height/2],[r.width/2,1],[r.width/2,r.height-1],[1,1],[r.width-1,1],[1,r.height-1],[r.width-1,r.height-1]]){
  await page.mouse.move(r.x+x,r.y+y);const frames=await a.evaluate(async n=>{const arr=[];for(let i=0;i<16;i++){await new Promise(requestAnimationFrame);arr.push({hover:n.matches(':hover'),rect:n.getBoundingClientRect().toJSON()})}return arr;});
  assert.ok(frames.every(f=>f.hover),`${label} lost hover at ${x},${y}`);for(const f of frames)assert.deepEqual(f.rect,r,`${label} jitter`);
  await page.mouse.move(1,120);await page.waitForTimeout(150);
 }
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.waitForTimeout(170);const hover=await sample(a);assert.deepEqual(hover.rect,r);assert.equal(hover.content,hover.surface);
 await page.mouse.down();await page.waitForTimeout(170);const active=await sample(a);assert.deepEqual(active.rect,r);assert.notEqual(active.surface,hover.surface);await page.mouse.move(1,120);await page.mouse.up();
 // Slow traversal, returning to 1px inside, followed by a single native click.
 await a.evaluate(n=>{n.dataset.qaClicks='0';n.addEventListener('click',e=>{e.preventDefault();n.dataset.qaClicks=String(Number(n.dataset.qaClicks)+1)})});
 await page.mouse.move(r.x-2,r.y+r.height/2);await page.mouse.move(r.x+2,r.y+r.height/2,{steps:8});await page.mouse.move(r.x-2,r.y+r.height/2,{steps:8});await page.mouse.move(r.x+1,r.y+r.height/2,{steps:8});await page.mouse.click(r.x+1,r.y+r.height/2);assert.equal(await a.getAttribute('data-qa-clicks'),'1');
 // The shifted paint/shadow must never become an enlarged target outside the original rect.
 await page.mouse.click(r.right+1,r.y+r.height/2);assert.equal(await a.getAttribute('data-qa-clicks'),'1');
 evidence.push({label,points:8,frames:16,rect:'constant',activation:1,paintOutside:'inert',hover: hover.surface,active:active.surface});
}
try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}});await fixtures(p);
 for(const route of ['/','/manifesto','/blog','/conteudos','/enviar','/ferramentas','/missing-qa']){
  await p.goto(base+route);await p.waitForTimeout(800);await p.evaluate(()=>document.fonts.ready);
  const controls=p.locator('a:has(> [data-press-content]),button:has(> [data-press-content])');const count=await controls.count();
  for(let i=0;i<count;i++){const a=controls.nth(i);if(!await a.isVisible() || await a.getAttribute('aria-label')==='Compartilhar')continue;const state=await a.evaluate(n=>({disabled:n.matches(':disabled,[aria-disabled="true"]'),paint:getComputedStyle(n,'::before').content}));if(state.paint==='none')continue;if(state.disabled){await a.scrollIntoViewIfNeeded();const rest=await sample(a);const r=rest.rect;await p.mouse.click(r.x+r.width/2,r.y+r.height/2);assert.deepEqual((await sample(a)).rect,rest.rect);assert.match((await sample(a)).surface,/matrix\(1, 0, 0, 1, 0, 0\)/);evidence.push({route,disabled:'stable'});continue;}await boundaries(p,a,`${route}:${i}:${await a.innerText()}`);}
 }
 // Real BaseUI dialog composition, keyboard activation, focus and Escape restoration.
 await p.goto(base);await p.waitForTimeout(500);const share=p.getByRole('button',{name:'Compartilhar',exact:true});await share.scrollIntoViewIfNeeded();await share.focus();await p.keyboard.press('Enter');await p.getByRole('dialog',{name:'Compartilhar conteúdo',exact:true}).waitFor();const copy=p.getByRole('button',{name:'Copiar link',exact:true});await boundaries(p,copy,'dialog copy');await p.keyboard.press('Escape');await p.getByRole('dialog',{name:'Compartilhar conteúdo',exact:true}).waitFor({state:'hidden'});assert.ok(await share.evaluate(n=>document.activeElement===n));await share.focus();await p.keyboard.press('Space');await p.getByRole('dialog',{name:'Compartilhar conteúdo',exact:true}).waitFor();await p.getByRole('button',{name:'Close',exact:true}).click();await p.getByRole('dialog',{name:'Compartilhar conteúdo',exact:true}).waitFor({state:'hidden'});assert.ok(await share.evaluate(n=>document.activeElement===n));evidence.push({baseUI:'Enter/Space/Close/Escape/focus restoration'});
 await p.goto(base+'/manifesto');const sign=p.getByRole('link',{name:'Assinar o manifesto',exact:true});await sign.focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>document.activeElement?.id),'assinar-manifesto');
 await p.emulateMedia({reducedMotion:'reduce'});const cta=p.locator('.site-nav-cta');await cta.hover();const reduced=await sample(cta);assert.match(reduced.surface,/matrix\(1, 0, 0, 1, 0, 0\)/);assert.equal(await cta.evaluate(n=>getComputedStyle(n,'::before').transitionDuration),'0s');evidence.push({reducedMotion:'zero spatial transition'});await p.close();
 const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await fixtures(touch);await touch.goto(base);const menu=touch.getByRole('button',{name:'Menu',exact:true});await menu.tap();const link=touch.locator('.site-nav-cta');const r=await link.boundingBox();assert.ok(r);await link.evaluate(n=>n.addEventListener('click',e=>e.preventDefault()));await link.tap();await touch.waitForTimeout(200);assert.ok(['none','matrix(1, 0, 0, 1, 0, 0)'].includes((await sample(link)).surface));evidence.push({touch:'activation and no sticky hover'});await touch.close();
 await writeFile('/private/tmp/button-interaction-evidence.json',JSON.stringify(evidence,null,2));console.log(`PASS ${evidence.length} real interaction checks; evidence /private/tmp/button-interaction-evidence.json`);
}finally{await writeFile('/private/tmp/button-interaction-evidence.json',JSON.stringify(evidence,null,2));await browser.close();}
