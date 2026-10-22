async initialPage => {
 const browser=initialPage.context().browser(),hostContext=await browser.newContext({viewport:{width:1280,height:720}}),host=await hostContext.newPage(),contexts=[],phones=[],errors=[];
 let phase='joining';
 const button=(p,name)=>p.getByRole('button',{name,exact:true});
 const check=(v,message)=>{if(!v)throw Error(message);};
 host.setDefaultTimeout(60000);host.on('pageerror',e=>errors.push(e.message));
 try{
  await host.goto('http://127.0.0.1:4181');await button(host,'Try the sample household').click();await button(host,'Find our common ground →').click();await button(host,'Invite phones to tonight →').click();
  await host.getByRole('heading',{name:'Make this evening yours.'}).waitFor();
  const phoneContext=await browser.newContext({viewport:{width:390,height:844}});contexts.push(phoneContext);
  const link=await host.locator('main').innerText();const match=link.match(/http:\/\/127\.0\.0\.1:4182\/\?code=([A-F0-9]+)/);check(match,'Room link missing');
  for(let i=0;i<3;i++){
   const p=await phoneContext.newPage();phones.push(p);p.on('pageerror',e=>errors.push(e.message));
   await p.goto(match[0]);await p.getByRole('textbox',{name:'Your alias'}).fill('Phone '+(i+1));await button(p,'Ask to join →').click();await p.getByRole('heading',{name:'Waiting for host approval'}).waitFor();
   await button(host,`Connect Phone ${i+1} as Viewer ${String.fromCharCode(65+i)}`).click();await p.getByRole('heading',{name:`Your evening, Viewer ${String.fromCharCode(65+i)}.`}).waitFor();
  }
  const sync=async()=>{const text=await host.locator('main .eyebrow').first().innerText(),rev=Number(text.match(/revision (\d+)/i)[1]);for(const p of phones)await p.waitForFunction(n=>document.querySelector('#connection')?.textContent.endsWith('revision '+n),rev,{timeout:60000});};
  const choose=async()=>{const responsePromise=host.waitForResponse(r=>r.url().endsWith('/commands')&&r.request().method()==='POST');await button(host,'Discuss this choice').first().click();const response=await responsePromise,result=await response.json();check(response.ok(),JSON.stringify(result));await host.waitForFunction(rev=>document.querySelector('main .eyebrow')?.textContent.endsWith('revision '+rev),result.revision);await sync();};
  await sync();phase='preference revision';
  await button(phones[0],'Edit my preferences').click();
  const preferenceResponse=phones[0].waitForResponse(r=>r.url().endsWith('/commands')&&r.request().method()==='POST');
  await button(phones[0],'Share my preferences').click();const response=await preferenceResponse;const preferenceResult=await response.json();check(response.ok(),JSON.stringify(preferenceResult));const preferenceRevision=preferenceResult.revision;
  await host.waitForFunction(rev=>document.querySelector('main .eyebrow')?.textContent.endsWith('revision '+rev),preferenceRevision);

  phase='first candidate';
  await choose();await button(phones[0],'Works for me').waitFor();
  await button(phones[0],'Works for me').click();await host.getByText('1 / 3 acceptances for this revision.',{exact:false}).waitFor();await phones[0].reload();await phones[0].getByText('Your current response: yes.',{exact:false}).waitFor();
  await choose();await host.getByText('0 / 3 acceptances for this revision.',{exact:false}).waitFor();phase='firm rejection';
  const noResponse=phones[1].waitForResponse(r=>r.url().endsWith('/commands')&&r.request().method()==='POST');await button(phones[1],'Firm no').click();const noRevision=(await (await noResponse).json()).revision;
  await host.waitForFunction(rev=>document.querySelector('main .eyebrow')?.textContent.endsWith('revision '+rev),noRevision);await choose();phase='offline recovery';await hostContext.route('http://127.0.0.1:4182/**',route=>route.abort());await host.getByText('Connection needs attention:',{exact:false}).waitFor();check(await host.locator('[data-room=host-vote]').first().isDisabled(),'Offline host controls remained active');await hostContext.unroute('http://127.0.0.1:4182/**');await host.getByText('Connected. 0 / 3 acceptances for this revision.',{exact:false}).waitFor();phase='final votes';
  for(const p of phones){await button(p,'Works for me').waitFor();await button(p,'Works for me').click();}
  phase='saving';await button(host,'Save our connected choice →').click();await button(host,'Open our saved evening →').click();
  const saved=await host.evaluate(()=>JSON.parse(localStorage.getItem('tonight-together-m2-v1')));check(saved.history.length===1&&saved.history[0].status==='selected','Connected save incorrect');
  const popupPromise=host.waitForEvent('popup');await button(host,'Open test streaming provider →').click();const provider=await popupPromise;
  await button(provider,'Play test clip').waitFor();await button(provider,'Play test clip').click();
  await provider.waitForFunction(()=>document.querySelector('video')?.currentTime>0.5);
  const playback=await provider.locator('video').evaluate(v=>({time:v.currentTime,duration:v.duration,readyState:v.readyState}));check(playback.duration>7,'Test media did not load');
  await button(provider,'Pause').click();const paused=await provider.locator('video').evaluate(v=>({time:v.currentTime,paused:v.paused}));check(paused.paused,'Pause did not pause playback');
  await button(provider,'Seek forward 3 seconds').click();await provider.waitForFunction(before=>document.querySelector('video').currentTime>=Math.min(8,before+3)-0.1,paused.time);
  const providerFocus=await provider.evaluate(()=>{const buttons=[...document.querySelectorAll('#player button')];buttons[0].focus();const visited=new Set([document.activeElement]);for(let n=0;n<buttons.length;n++){window.providerKey('ArrowRight');visited.add(document.activeElement);}for(let n=0;n<buttons.length;n++){window.providerKey('ArrowLeft');visited.add(document.activeElement);}return buttons.every(b=>visited.has(b));});check(providerFocus,'Provider controls unreachable by directional navigation');await provider.close();
  for(const scenario of ['sign-in','subscription']){await host.getByRole('combobox',{name:'Test provider situation'}).selectOption(scenario);const blockedPromise=host.waitForEvent('popup');await button(host,'Open test streaming provider →').click();const blocked=await blockedPromise;
   await blocked.getByRole('heading',{name:scenario==='subscription'?'Simulated subscription required. No purchase is made.':'Simulated sign-in required. No password is requested.'}).waitFor();await button(blocked,'Use demo access').click();await button(blocked,'Play test clip').waitFor();await blocked.close();}
  for(const scenario of ['region','unavailable','expired','service-error']){await host.getByRole('combobox',{name:'Test provider situation'}).selectOption(scenario);const opened=host.waitForEvent('popup');await button(host,'Open test streaming provider →').click();const p=await opened;await button(p,'Return to Tonight Together').waitFor();check(await p.locator('video').count()===0,scenario+' unexpectedly played');await p.close();}
  await host.reload();await button(host,'Our evenings').click();check(await button(host,'Open evening →').count()===1,'Saved room duplicated or lost');
  check(errors.length===0,errors.join('; '));return {participants:3,independentTabSessions:true,checks:['join and host approval','preferences revision','stale acceptance cleared','firm rejection and revision','three independent acceptances','single durable selected record','provider popup handoff','actual HTTP video playback and seek','simulated subscription recovery','reload retrieval'],playback,scriptErrors:errors};
 }catch(error){throw Error(phase+': '+error.message+'; host: '+(await host.locator('main').innerText()).slice(0,500)+'; phones: '+JSON.stringify(await Promise.all(phones.map(p=>p.locator('#connection').textContent().catch(()=> 'no status')))));}finally{for(const c of contexts)await c.close();await hostContext.close();}
}
