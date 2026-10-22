import test from 'node:test';
import assert from 'node:assert/strict';
import {Rooms} from '../server/rooms.mjs';
import {catalogue,sampleProfiles} from '../src/catalogue.js';
import {rankAdaptive,learningFacts} from '../src/core/adaptation.js';
import {negotiate} from '../src/core/negotiation.js';
import {providerServer} from '../server/provider-server.mjs';
import {roomServer} from '../server/rooms-server.mjs';
import {emptyHousehold,validateHousehold,recordChoice,deleteProfile} from '../src/core/household.js';
let counter=0;const command=(m,r,action,extra={},token=r.token,revision=r.revision)=>m.command(r.roomId,token||m.get(r.roomId).host,{action,revision,requestId:'request_'+(++counter),...extra});
const create=m=>m.create({profiles:sampleProfiles(),titles:catalogue,session:{maxMinutes:90,mood:'',requiredLanguages:[],exclusions:[],rejectedTitleIds:[]}});
test('room approval, private responses and invalidation preserve unanimous current-revision agreement',()=>{
 const m=new Rooms();let r=create(m);const joined=m.join({code:r.code,alias:'Independent viewer',nonce:'abcdefghijklmnop'});
 const pending=m.view(m.get(r.roomId),joined.token);assert.equal(pending.own.profileId,null);assert.equal(pending.votes,undefined);assert.equal(pending.profiles[0].genres,undefined);assert.equal(pending.shortlist[0].score.viewers.length,0);assert.equal(pending.shortlist[0].score.fairnessFacts,undefined);
 assert.throws(()=>command(m,r,'candidate',{titleId:r.shortlist[0].title.id},joined.token),/Host/);
 r=command(m,r,'approve',{personId:pending.own.id,profileId:r.profiles[0].id});
 r=command(m,r,'candidate',{titleId:r.shortlist[0].title.id});const old=r.revision;
 command(m,r,'vote',{vote:'yes'},joined.token);r=m.view(m.get(r.roomId),r.token||m.get(r.roomId).host);
 assert.equal(r.accepted,1);r=command(m,r,'settings',{settings:{maxMinutes:120}},m.get(r.roomId).host);
 assert.equal(r.accepted,0);assert.throws(()=>command(m,r,'vote',{vote:'yes'},joined.token,old),/changed/);
});
test('duplicate join and save retries are idempotent; removed capabilities and expired rooms fail',()=>{
 let now=1000;const m=new Rooms(()=>now);let r=create(m),host=r.token;const a=m.join({code:r.code,alias:'A',nonce:'abcdefghijklmnop'});assert.deepEqual(m.join({code:r.code,alias:'A',nonce:'abcdefghijklmnop'}),a);
 const person=m.view(m.get(r.roomId),a.token).own.id;r=command(m,r,'remove',{personId:person},host);assert.throws(()=>m.view(m.get(r.roomId),a.token),/valid/);
 r=command(m,r,'candidate',{titleId:r.shortlist[0].title.id},host);assert.throws(()=>command(m,r,'save',{},host),/Every/);
 for(const p of r.profiles)r=command(m,r,'host-vote',{profileId:p.id,vote:'yes'},host);
 const body={action:'save',revision:r.revision,requestId:'repeat_save_001'};const saved=m.command(r.roomId,host,body);assert.deepEqual(m.command(r.roomId,host,body).decision,saved.decision);
 now+=7200001;assert.throws(()=>m.get(r.roomId),/expired/);
});
test('firm rejection cannot recur and changed participant preferences clear candidate and votes',()=>{
 const m=new Rooms();let r=create(m);const host=r.token,j=m.join({code:r.code,alias:'A',nonce:'abcdefghijklmnop'}),person=m.view(m.get(r.roomId),j.token).own.id;
 r=command(m,r,'approve',{personId:person,profileId:r.profiles[0].id},host);const rejected=r.shortlist[0].title.id;
 r=command(m,r,'candidate',{titleId:rejected},host);r=command(m,r,'vote',{vote:'no'},j.token);assert(!r.shortlist.some(s=>s.title.id===rejected));
 const preferences={genres:['documentary'],softDislikes:[],exclusions:['horror'],preferredLanguages:[],requiredLanguages:[]};r=command(m,r,'preferences',{preferences},j.token);assert.equal(r.candidate,null);assert.equal(r.accepted,0);
});
test('joining expiry, duplicate profile ownership and stale proposal application are rejected',()=>{
 let now=1000;const m=new Rooms(()=>now);let r=create(m),host=r.token;const a=m.join({code:r.code,alias:'A',nonce:'abcdefghijklmnop'}),b=m.join({code:r.code,alias:'B',nonce:'qrstuvwxyzabcdef'});
 const pa=m.view(m.get(r.roomId),a.token).own.id,pb=m.view(m.get(r.roomId),b.token).own.id;r=command(m,r,'approve',{personId:pa,profileId:r.profiles[0].id},host);
 assert.throws(()=>command(m,r,'approve',{personId:pb,profileId:r.profiles[0].id},host),/unavailable/);
 assert.throws(()=>command(m,r,'proposal',{index:99},host),/no longer/);now+=300001;assert.throws(()=>m.join({code:r.code,alias:'C',nonce:'1234567890123456'}),/expired/);
});
test('feedback learning requires two explicit watched ratings, stays capped and can reset or disable',()=>{
 const p=sampleProfiles()[0],title={...catalogue[1],genres:['comedy']};const history=[1,2].map(n=>({sessionId:'learn'+n,titleId:title.id,title,status:'watched',watchedAt:n*1000,feedback:{[p.id]:{rating:5}},fits:{[p.id]:50}}));
 assert.equal(learningFacts(p,history.slice(0,1))[0].adjustment,0);assert.equal(learningFacts(p,history)[0].adjustment,3);
 assert.equal(learningFacts({...p,learningDisabled:true},history)[0].adjustment,0);assert.equal(learningFacts({...p,learningResetAt:3000},history).length,0);
 assert.equal(learningFacts(p,history.map(r=>({...r,status:'selected'}))).length,0);
 const out=rankAdaptive({titles:[title],profiles:[p],session:{},history});assert.equal(out.ranked[0].adaptationBonus,3);
 const blocked=rankAdaptive({titles:[{...title,contentTags:['horror']}],profiles:[{...p,exclusions:['horror']}],session:{},history});assert.equal(blocked.ranked.length,0);
});
test('negotiation suggests a deliberate longer duration without relaxing a firm exclusion',()=>{
 const p=sampleProfiles()[0],titles=[{...catalogue[1],runtimeMinutes:45},{...catalogue[2],runtimeMinutes:45,contentTags:['horror']}];
 const n=negotiate({titles,profiles:[{...p,exclusions:['horror']}],session:{maxMinutes:30},history:[]});assert.equal(n.proposals[0].value,60);assert.match(n.proposals[0].reason,/1 eligible/);
});
test('legacy v1 profiles retain neutral learning; invalid flags fail and deletion scrubs adaptation facts',()=>{
 const profiles=sampleProfiles().slice(0,2),state={...emptyHousehold(),profiles};assert.equal(validateHousehold(state).profiles.length,2);assert.equal(learningFacts(profiles[0],[]).length,0);
 assert.throws(()=>validateHousehold({...state,profiles:[{...profiles[0],learningDisabled:'false'}]}),/learning/);
 const score=rankAdaptive({titles:catalogue,profiles,session:{},history:[]}).ranked[0],title=catalogue.find(t=>t.id===score.titleId);
 const saved=recordChoice(state,{sessionId:'privacy-learning',title,score,participants:profiles.map(p=>p.id),votes:Object.fromEntries(profiles.map(p=>[p.id,'yes']))});
 assert(!JSON.stringify(deleteProfile(saved,profiles[0].id)).includes(profiles[0].id));
});
async function withServer(server,fn){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));try{return await fn(`http://127.0.0.1:${server.address().port}`);}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
test('controlled provider streams actual range bytes and rejects forged, expired and unentitled links',async()=>withServer(providerServer(),async base=>{
 const ticket=async scenario=>(await (await fetch(base+'/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'sample-07',scenario})})).json()).ticket;
 const ready=await ticket('ready');let r=await fetch(base+'/resolve?ticket='+ready);assert.equal(r.status,200);
 r=await fetch(base+'/media/test-clip.mp4?ticket='+ready,{headers:{Range:'bytes=0-127'}});assert.equal(r.status,206);assert.equal((await r.arrayBuffer()).byteLength,128);assert.match(r.headers.get('content-range'),/^bytes 0-127\//);
 assert.equal((await fetch(base+'/media/test-clip.mp4?ticket='+ready,{headers:{Range:'bytes=99999999-'}})).status,416);
 assert.equal((await fetch(base+'/resolve?ticket='+await ticket('expired'))).status,410);
 assert.equal((await fetch(base+'/resolve?ticket='+ready.slice(0,-1)+'x')).status,403);
 assert.equal((await fetch(base+'/media/test-clip.mp4?ticket='+await ticket('subscription'))).status,403);
 assert.equal((await fetch(base+'/resolve?ticket='+await ticket('service-error'))).status,503);
}));
test('HTTP room service rejects foreign origins and preserves auth boundaries',async()=>withServer(roomServer(),async base=>{
 let r=await fetch(base+'/rooms',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'});assert.equal(r.status,403);
 r=await fetch(base+'/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profiles:sampleProfiles(),titles:catalogue,session:{}})});assert.equal(r.status,201);const room=await r.json();
 assert.equal((await fetch(base+'/rooms/'+room.roomId)).status,403);assert.equal((await fetch(base+'/rooms/'+room.roomId,{headers:{Authorization:'Bearer '+room.token}})).status,200);
}));

