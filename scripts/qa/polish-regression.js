async initialPage=>{
 const context=await initialPage.context().browser().newContext({viewport:{width:1280,height:720}}),page=await context.newPage();
 const button=name=>page.getByRole('button',{name,exact:true}),check=(v,m)=>{if(!v)throw Error(m);};
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:4181');await button('Try the sample household').click();
  check(await page.locator('.hero .avatar[data-tone]').count()===3,'Viewer identities missing');
  const tones=await page.locator('.hero .avatar').evaluateAll(list=>list.map(x=>x.dataset.tone));check(new Set(tones).size===3,'Sample viewers have indistinguishable tone identities');
  await button('Find our common ground →').click();await button('Find our common ground →').click();
  check((await page.locator('article h2').allTextContents()).every(s=>s.endsWith('(Illustrative)')),'Labelled fictional titles missing');
  check(await page.locator('article .art svg').count()===3,'Original genre artwork missing');
  await button('Could this be tonight?').first().click();
  check(await page.getByRole('heading',{name:'Everyone accepts this choice.',exact:true}).count()===0,'Celebrated before acceptance');
  for(let i=0;i<3;i++)await button('Works for me').nth(i).click();
  await page.getByRole('heading',{name:'Everyone accepts this choice.',exact:true}).waitFor();await button('Save our choice →').click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tonight-together-m2-v1'))),expected=saved.history[0].title.title;
  const fixture={...saved,history:saved.history.map(r=>({...r,title:{...r.title,title:'Illustrative title '+r.titleId.split('-')[1]}}))};
  const historical=JSON.stringify(fixture);await page.evaluate(raw=>localStorage.setItem('tonight-together-m2-v1',raw),historical);await page.reload();
  await button('Our evenings').click();await page.getByRole('searchbox').fill(expected);check(await button('Open evening →').count()===1,'New name cannot find old saved record');
  await page.getByRole('searchbox').fill(fixture.history[0].title.title);check(await button('Open evening →').count()===1,'Legacy name search no longer works');
  await button('Open evening →').click();check(await page.locator('h1').innerText()===expected,'Historical title not projected to current display name');
  check(await page.evaluate(()=>localStorage.getItem('tonight-together-m2-v1'))===historical,'Rendering rewrote historical data');
  await page.setViewportSize({width:390,height:844});await page.reload();await button('Find our common ground →').click();await button('Find our common ground →').click();
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Narrow app view overflows horizontally');
  check(errors.length===0,errors.join('; '));
  return {fictionalLabels:true,originalArt:true,distinctViewerIdentities:true,noPrematureCelebration:true,legacyHistoryDisplayAndBothSearches:true,snapshotUnchanged:true,narrowLayout:true,scriptErrors:errors};
 }finally{await context.close();}
}
