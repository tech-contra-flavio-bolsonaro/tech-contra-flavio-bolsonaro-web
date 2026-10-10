import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.goto(process.env.BUTTON_PREVIEW_URL??'http://localhost:3212');
 await page.emulateMedia({reducedMotion:'reduce'});const cta=page.locator('.home-hero-manifesto-cta');await cta.hover();
 assert.equal(await cta.evaluate(n=>getComputedStyle(n,'::before').transitionDuration),'0s','reduced motion must remove surface transitions');
 await page.route('**/api/conteudos?**',r=>r.fulfill({json:{items:[{id:'qa-state',title:'QA',description:'QA',credit:'Comunidade',priority:0,media_path:null,mediaUrl:null,video_url:null}],hasMore:false}}));await page.reload();
 await page.getByRole('button',{name:'Compartilhar',exact:true}).click();const outline=page.getByRole('button',{name:'Copiar link',exact:true});
 await outline.evaluate(n=>{n.setAttribute('aria-invalid','true');n.setAttribute('aria-expanded','true')});
 assert.equal(await outline.evaluate(n=>getComputedStyle(n,'::before').borderTopColor),'rgb(255, 141, 120)','invalid border must override outline variant');
 console.log('PASS real Chromium reduced surface transition and outline invalid/expanded contracts');
}finally{await browser.close();}
