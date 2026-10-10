import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const results=[];
try {
 for(const width of [1440,900,390]) for(const route of ['/','/manifesto','/blog','/conteudos','/enviar','/ferramentas/enviar','/ferramentas','/missing-qa']) {
  const pages=await Promise.all([3213,3212].map(async port=>{
   const p=await browser.newPage({viewport:{width,height:1000}});await p.route('**/api/conteudos?**',r=>r.fulfill({json:{items:[{id:'qa-motion',title:'Conteúdo QA',description:'Fixture de QA',credit:'Comunidade',priority:1,media_path:null,mediaUrl:null,video_url:null}],hasMore:false}}));await p.route('**/api/ferramentas?**',r=>r.fulfill({json:{items:[0,1,2].map(i=>({id:String(i),slug:'fixture-'+i,title:'Ferramenta '+i,description:'Fixture de QA',category:i===0?'Mapas':'Organização',credit:'Comunidade',url:'https://example.org',priority:0,is_internal:false})),categories:[{name:'Mapas',count:1},{name:'Organização',count:2}],hasMore:false}}));await p.goto(`http://localhost:${port}${route}`);await p.waitForTimeout(1200);await p.evaluate(()=>document.fonts.ready);return p;
  }));
  const snapshots=await Promise.all(pages.map(p=>p.locator('.home-button,.site-nav-cta,.share-trigger,[data-slot=button],.tools-suggestion-link,.tool-detail-action,.tool-access .action-link,.not-found-home-link,.tool-filter-list button,.tools-categories .load-more').evaluateAll(nodes=>nodes.map(n=>{
   const c=getComputedStyle(n),surface=n.querySelector('[data-press-content]')?getComputedStyle(n,'::before'):c;
   return {text:n.textContent.trim(),rect:(()=>{const r=n.getBoundingClientRect().toJSON();if(n.querySelector("[data-press-content]")){const m=new DOMMatrix(surface.transform);for(const k of ["x","left","right"])r[k]+=m.m41;for(const k of ["y","top","bottom"])r[k]+=m.m42;}return r;})(),font:c.font,fontFamily:c.fontFamily,color:c.color,bg:surface.backgroundColor,shadow:surface.boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px,? ?/g, "").trim() || "none",opacity:c.opacity,radius:surface.borderRadius,border:surface.borderTopWidth==="0px"?["0px"]:[surface.borderTopWidth,surface.borderTopStyle,surface.borderTopColor],content:n.querySelector('svg')?.getBoundingClientRect().toJSON()};
  }))));
  assert.deepEqual(snapshots[1],snapshots[0],`resting appearance/geometry differs at ${route} ${width}`);
  results.push({route,width,actions:snapshots[1].length,resting:'identical'});
  await pages[1].screenshot({path:`/private/tmp/button-resting-${route.replaceAll('/','_')}-${width}.png`});
  for(const p of pages)await p.close();
 }
 console.log(JSON.stringify(results));await writeFile('/private/tmp/button-resting-evidence.json',JSON.stringify(results,null,2));
} finally {await browser.close();}
