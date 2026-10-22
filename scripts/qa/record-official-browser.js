async initialPage => {
 const browser=initialPage.context().browser();
 const dir='D:/Agent Studio/Codex App/Hackathons/Amazon Hackathon 2026/Tonight Together - Milestone 2/build/official-demo/raw';
 const contexts=[],phones=[],events=[],errors=[];
 const hostContext=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir,size:{width:1280,height:720}}});contexts.push(hostContext);
 const host=await hostContext.newPage(),epoch=Date.now();host.setDefaultTimeout(60000);
 host.on('pageerror',e=>errors.push(e.message));
 const button=(p,n)=>p.getByRole('button',{name:n,exact:true});
 const hold=async(ms=1800)=>host.waitForTimeout(ms);
 const mark=(name)=>events.push({name,time:(Date.now()-epoch)/1000});
 const click=async(p,n)=>{await button(p,n).click();await hold(700);};
 try {
  await host.goto('http://127.0.0.1:4181');await click(host,'Try the sample household');
  mark('home');await hold(7000);
  await click(host,'Find our common ground →');mark('setup');await hold(4500);
  await click(host,'Invite phones to tonight →');await host.getByRole('heading',{name:'Make this evening yours.'}).waitFor();mark('invite');await hold(2500);
  const match=(await host.locator('main').innerText()).match(/http:\/\/127\.0\.0\.1:4182\/\?code=([A-F0-9]+)/);if(!match)throw Error('No invite');
  for(let i=0;i<3;i++){
   const c=await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir,size:{width:390,height:844}}});contexts.push(c);
   const p=await c.newPage();phones.push(p);p.on('pageerror',e=>errors.push(e.message));
   await p.goto(match[0]);await p.getByRole('textbox',{name:'Your alias'}).fill('Viewer '+String.fromCharCode(65+i));await click(p,'Ask to join →');
   await p.getByRole('heading',{name:'Waiting for host approval'}).waitFor();
   mark('approve-'+i);await click(host,`Connect Viewer ${String.fromCharCode(65+i)} as Viewer ${String.fromCharCode(65+i)}`);
   await p.getByRole('heading',{name:`Your evening, Viewer ${String.fromCharCode(65+i)}.`}).waitFor();await hold();
  }
  await host.evaluate(()=>scrollTo(0,0));mark('participants');await hold(5000);
  const sync=async()=>{const rev=Number((await host.locator('main .eyebrow').first().innerText()).match(/revision (\d+)/i)[1]);for(const p of phones)await p.waitForFunction(n=>document.querySelector('#connection')?.textContent.endsWith('revision '+n),rev);};
  const choose=async()=>{await click(host,'Discuss this choice');await sync();};
  // Three candidate buttons exist; choose the first through the actual UI.
  const chooseFirst=async()=>{await button(host,'Discuss this choice').first().click();await sync();await hold(1500);};
  await sync();await click(phones[0],'Edit my preferences');mark('phone-preferences');await hold(2500);await click(phones[0],'Share my preferences');await hold(1800);await sync();
  mark('recommendations');await button(host,'Discuss this choice').first().scrollIntoViewIfNeeded();await hold(4000);await chooseFirst();
  
  await host.locator('[data-room=host-vote]').first().scrollIntoViewIfNeeded();mark('decision-start');await hold(2000);
  await click(phones[0],'Works for me');await host.getByText('1 / 3 acceptances for this revision.',{exact:false}).waitFor();mark('one-yes');await hold(2500);
  await click(phones[1],'Firm no');await hold(1700);await sync();mark('rejected');await hold(2800);
  await chooseFirst();await host.getByText('0 / 3 acceptances for this revision.',{exact:false}).waitFor();mark('fresh-votes');await hold(2300);
  for(let i=0;i<3;i++){await click(phones[i],'Works for me');await hold(1000);}
  await button(host,'Save our connected choice →').scrollIntoViewIfNeeded();mark('unanimous');await hold(3500);await click(host,'Save our connected choice →');mark('connected-saved');await hold(2500);
  await click(host,'Open our saved evening →');mark('saved-record');await hold(4500);
  await click(host,'Our evenings');mark('history');await hold(4000);await host.reload();await click(host,'Our evenings');mark('after-reload');await hold(3500);
  await click(host,'Your data');await click(host,'Explore feedback learning · synthetic lab');mark('learning-before');await hold(3500);await click(host,'2 synthetic rated evenings');mark('learning-after');await hold(5000);
  await click(host,'Household');mark('learning-controls');await hold(3500);
  await click(host,'Tonight');await click(host,'Find our common ground →');await host.getByRole('combobox',{name:'How much time do you have?'}).selectOption('30');await click(host,'Find our common ground →');
  const proposal=host.getByRole('button',{name:/Would \d+ minutes work tonight\?/}).first();await proposal.scrollIntoViewIfNeeded();mark('time-proposal');await hold(3500);await proposal.click();mark('proposal-confirm');await hold(3200);await click(host,'Confirm');mark('proposal-applied');await hold(4500);
  await click(host,'Adjust tonight');await click(host,'Invite phones to tonight →');await host.getByRole('heading',{name:'Make this evening yours.'}).waitFor();
  await hostContext.route('http://127.0.0.1:4182/**',r=>r.abort());await host.getByText('Connection needs attention:',{exact:false}).waitFor();await host.evaluate(()=>scrollTo(0,0));mark('connection-lost');await hold(3500);await hostContext.unroute('http://127.0.0.1:4182/**');await host.getByText('Connected. 0 / 3 acceptances for this revision.',{exact:false}).waitFor();mark('reconnected');await hold(3500);
  await click(host,'Our evenings');await button(host,'Open evening →').first().click();await host.getByRole('combobox',{name:'Test provider situation'}).selectOption('unavailable');
  const pop=host.waitForEvent('popup');await click(host,'Open test streaming provider →');const provider=await pop;await button(provider,'Return to Tonight Together').waitFor();mark('provider-unavailable');await provider.waitForTimeout(4000);const providerPath=await provider.video().path();await provider.close();
  await host.evaluate(()=>scrollTo(0,0));mark('end');await hold(1800);
  const data={events,hostVideo:await host.video().path(),phoneVideos:await Promise.all(phones.map(p=>p.video().path())),unavailableVideo:providerPath,errors};
  if(errors.length)throw Error(errors.join('; '));return data;
 } finally {for(const c of contexts.reverse())await c.close();}
}
