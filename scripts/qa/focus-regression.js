async initialPage => {
  if (!initialPage.url().startsWith('http://127.0.0.1:4181')) throw Error('Use the local preview');
  const context = await initialPage.context().browser().newContext({viewport:{width:1280,height:720}});
  const page = await context.newPage(), checked = [];
  const button = name => page.getByRole('button',{name,exact:true});
  async function checkFocus(screen) {
    const result = await page.evaluate(() => {
      const scope = document.querySelector('dialog[open]') || document.querySelector('#app');
      const controls = [...scope.querySelectorAll('button:not(:disabled),input,select,textarea')].filter(el=>el.offsetWidth&&el.offsetHeight);
      const original = document.activeElement, edges = controls.map(()=>[]);
      const selected = controls.filter(el=>el.tagName==='SELECT').map(el=>[el,el.selectedIndex]);
      for(let i=0;i<controls.length;i++) for(const key of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']) {
        controls[i].focus(); window.tonightKey(key); edges[i].push(controls.indexOf(document.activeElement));
      }
      selected.forEach(([el,index])=>{el.selectedIndex=index;el.dispatchEvent(new Event('change',{bubbles:true}));});
      const visited=new Set([controls.indexOf(original)]), queue=[...visited];
      while(queue.length) for(const next of edges[queue.shift()]||[]) if(next>=0&&!visited.has(next)){visited.add(next);queue.push(next);}
      original?.focus();
      return {controls:controls.length,unreachable:controls.filter((el,i)=>!visited.has(i)).map(el=>el.getAttribute('aria-label')||el.textContent||el.id)};
    });
    if(result.unreachable.length) throw Error(`${screen}: unreachable controls ${result.unreachable.join(', ')}`);
    checked.push({screen,controls:result.controls});
  }
  try {
    await page.goto('http://127.0.0.1:4181'); await checkFocus('fresh home');
    await button('Create your household →').click(); await checkFocus('empty household');
    await button('＋ Add a viewer').click(); await checkFocus('profile form');
    await button('Cancel').click(); await button('Try a sample household').click(); await checkFocus('sample home');
    await button('Find our common ground →').click(); await checkFocus('setup');
    await button('Invite phones to tonight →').click(); await page.getByRole('heading',{name:'Make this evening yours.'}).waitFor(); await checkFocus('connected room');
    await button('Discuss this choice').first().click(); await button('Works for me · Viewer A').waitFor(); await checkFocus('connected agreement');
    await button('End room / local setup').click(); await button('Invite phones to tonight →').waitFor();
    await button('Find our common ground →').click(); await checkFocus('shortlist');
    await button('About this title').first().click(); await checkFocus('source dialog'); await button('Back to choices').click();
    await button('Compare').first().click(); await button('Compare').first().click(); await button('Compare these two →').click(); await checkFocus('comparison');
    await button('Could this be tonight?').first().click(); await checkFocus('agreement');
    for(let i=0;i<3;i++) await button('Works for me').nth(i).click(); await button('Save our choice →').click(); await checkFocus('selected record');
    await button('We watched this').click(); await checkFocus('watched record with reflection forms');
    await button('Our evenings').click(); await checkFocus('history');
    await button('Your data').click(); await checkFocus('data controls');
    await button('Explore feedback learning · synthetic lab').click(); await checkFocus('synthetic learning lab');
    await button('2 synthetic rated evenings').click(); await checkFocus('learning after two ratings');
    await button('Back to data controls').click();
    await button('Clear all household data').click(); await checkFocus('confirmation dialog'); await button('Keep it').click();
    await button('Manage added titles').click(); await checkFocus('added-title manager');
    await button('Add a household title').click(); await checkFocus('title form');
    return {checked,scope:'Directional reachability calls the actual app navigation function; not screen-reader or physical-device certification.'};
  } finally {await context.close();}
}

