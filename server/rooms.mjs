import { randomBytes } from 'node:crypto';
import { rankAdaptive } from '../src/core/adaptation.js';
import { negotiate } from '../src/core/negotiation.js';
import { validateHousehold, emptyHousehold } from '../src/core/household.js';
const copy=v=>JSON.parse(JSON.stringify(v));
const secret=()=>randomBytes(24).toString('hex');
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
export class Rooms {
  constructor(now=()=>Date.now()){this.rooms=new Map();this.now=now;}
  create(payload){
    for(const [key,r] of this.rooms)if(this.now()>=r.expires)this.rooms.delete(key);
    if(this.rooms.size>=40)fail(429,'Too many active rooms.');
    const profiles=copy(payload.profiles),titles=copy(payload.titles);
    validateHousehold({...emptyHousehold(),profiles});
    if(!profiles.length||!Array.isArray(titles)||titles.length>100||titles.some(t=>typeof t.id!=='string'||typeof t.title!=='string'||!Array.isArray(t.genres)))fail(400,'Invalid room catalogue.');
    const r={id:secret().slice(0,16),code:randomBytes(5).toString('hex').toUpperCase(),host:secret(),revision:1,change:1,profiles,titles,
      history:copy(payload.history||[]),session:{mood:'',maxMinutes:90,requiredLanguages:[],exclusions:[],rejectedTitleIds:[],...copy(payload.session)},
      people:[],votes:{},candidate:null,expires:this.now()+7200000,joinExpires:this.now()+300000,seen:new Set(),closed:false,decision:null};
    if(r.history.length>30)fail(400,'Too much history.');
    this.rank(r);this.rooms.set(r.id,r);return {roomId:r.id,token:r.host,code:r.code,...this.view(r,r.host)};
  }
  get(id){const r=this.rooms.get(id);if(!r||r.closed||this.now()>=r.expires)fail(410,'Room ended or expired. Local saved evenings remain available.');return r;}
  auth(r,token){if(token===r.host)return 'host';const p=r.people.find(p=>p.token===token&&!p.revoked);if(!p)fail(403,'This invitation is no longer valid.');return p;}
  rank(r){if(r.rankRevision===r.revision)return r.rankCache;const result=rankAdaptive({titles:r.titles,profiles:r.profiles,session:r.session,history:r.history});r.rankCache=result;r.rankRevision=r.revision;return result;}
  invalidate(r){r.revision++;r.votes={};r.candidate=null;r.decision=null;}
  join({code,alias,nonce}){
    const r=[...this.rooms.values()].find(r=>r.code===String(code).toUpperCase());if(!r)fail(404,'Room code not found.');this.get(r.id);
    if(this.now()>=r.joinExpires)fail(410,'Joining has expired. Ask the host to renew invitations.');
    if(typeof nonce!=='string'||nonce.length<16||nonce.length>100)fail(400,'Invalid join request.');
    const old=r.people.find(p=>p.nonce===nonce);if(old){if(old.revoked)fail(403,'Access revoked.');return {roomId:r.id,token:old.token};}
    if(r.people.filter(p=>!p.revoked).length>=6)fail(409,'Six participants have joined.');
    if(typeof alias!=='string'||!alias.trim()||alias.length>32)fail(400,'Enter an alias up to 32 characters.');
    const p={id:secret().slice(0,12),alias:alias.trim(),token:secret(),nonce,profileId:null,revoked:false};r.people.push(p);r.change++;
    return {roomId:r.id,token:p.token};
  }
  view(r,token){
    const actor=this.auth(r,token),host=actor==='host',rank=this.rank(r);
    if(r.negotiationRevision!==r.revision){r.negotiationCache=negotiate({titles:r.titles,profiles:r.profiles,session:r.session,history:r.history});r.negotiationRevision=r.revision;}
    return copy({roomId:r.id,revision:r.revision,change:r.change,expires:r.expires,joinExpires:r.joinExpires,code:host?r.code:undefined,
      candidate:r.candidate,shortlist:rank.ranked.slice(0,6).map(s=>({title:r.titles.find(t=>t.id===s.titleId),score:host?s:{groupFit:s.groupFit,minimumFit:s.minimumFit,viewers:s.viewers.filter(v=>v.profileId===actor.profileId)}})),
      negotiation:r.negotiationCache,
      profiles:host?r.profiles:r.profiles.map(p=>({id:p.id,alias:p.alias})),
      people:r.people.filter(p=>!p.revoked).map(p=>({id:p.id,alias:p.alias,profileId:p.profileId})),
      own:host?null:{id:actor.id,profileId:actor.profileId,profile:r.profiles.find(p=>p.id===actor.profileId),vote:r.votes[actor.profileId]},
      votes:host?r.votes:undefined,accepted:Object.values(r.votes).filter(v=>v==='yes').length,total:r.profiles.length,
      session:host?r.session:undefined,decision:host?r.decision:r.decision?{saved:true}:null});
  }
  command(id,token,body){
    const r=this.get(id),actor=this.auth(r,token),host=actor==='host';
    if(!/^[a-zA-Z0-9_-]{8,100}$/.test(body.requestId||''))fail(400,'Invalid request ID.');
    const key=token+':'+body.requestId;if(r.seen.has(key))return this.view(r,token);
    if(body.revision!==r.revision)fail(409,'Tonight changed. Refresh and respond to the current choice.');
    const hostOnly=['approve','remove','candidate','settings','proposal','save','renew','close','host-vote'];
    if(hostOnly.includes(body.action)&&!host)fail(403,'Host action only.');
    if(r.decision&&body.action==='save'&&host)return this.view(r,token);
    if(r.decision&&!['close','renew'].includes(body.action))fail(409,'This room has completed its choice. Start a new room for another evening.');
    if(r.seen.size>=3000)fail(429,'Room request limit reached.');
    switch(body.action){
      case 'approve':{const p=r.people.find(p=>p.id===body.personId&&!p.revoked);if(!p||!r.profiles.some(v=>v.id===body.profileId)||r.people.some(q=>q!==p&&!q.revoked&&q.profileId===body.profileId))fail(409,'Viewer unavailable.');p.profileId=body.profileId;this.invalidate(r);break;}
      case 'remove':{const p=r.people.find(p=>p.id===body.personId&&!p.revoked);if(!p)fail(404,'Participant not found.');p.revoked=true;this.invalidate(r);break;}
      case 'preferences':{
        if(host||!actor.profileId)fail(403,'Wait for host approval.');
        const old=r.profiles.find(p=>p.id===actor.profileId);const patch={};
        for(const field of ['genres','softDislikes','exclusions','preferredLanguages','requiredLanguages']){const a=body.preferences?.[field];if(!Array.isArray(a)||a.length>12||a.some(s=>typeof s!=='string'||s.length>40))fail(400,'Invalid preferences.');patch[field]=a;}
        const next={...old,...patch};validateHousehold({...emptyHousehold(),profiles:[next]});r.profiles=r.profiles.map(p=>p.id===next.id?next:p);this.invalidate(r);break;}
      case 'candidate':if(!this.rank(r).ranked.some(s=>s.titleId===body.titleId))fail(409,'That title is not eligible.');this.invalidate(r);r.candidate=body.titleId;break;
      case 'settings':{
        const patch={};for(const k of ['mood','maxMinutes','requiredLanguages','exclusions'])if(Object.hasOwn(body.settings||{},k))patch[k]=body.settings[k];
        if(patch.mood!=null&&typeof patch.mood!=='string'||patch.requiredLanguages&&!Array.isArray(patch.requiredLanguages)||patch.exclusions&&!Array.isArray(patch.exclusions))fail(400,'Invalid settings.');
        const next={...r.session,...patch};rankAdaptive({titles:r.titles,profiles:r.profiles,session:next,history:r.history});r.session=next;this.invalidate(r);break;}
      case 'proposal':{const p=negotiate({titles:r.titles,profiles:r.profiles,session:r.session,history:r.history}).proposals[body.index];if(!p)fail(409,'Proposal no longer available.');r.session[p.field]=p.value;this.invalidate(r);break;}
      case 'vote':case 'host-vote':{
        const profileId=host?body.profileId:actor.profileId;if(!profileId||!r.profiles.some(p=>p.id===profileId)||!r.candidate)fail(409,'Wait for an approved viewer and current choice.');
        if(!['yes','another','no'].includes(body.vote))fail(400,'Invalid response.');
        if(body.vote==='no'){r.session.rejectedTitleIds=[...new Set([...r.session.rejectedTitleIds,r.candidate])];this.invalidate(r);}else r.votes[profileId]=body.vote;break;}
      case 'save':{
        if(!r.candidate||r.profiles.some(p=>r.votes[p.id]!=='yes'))fail(409,'Every current viewer must accept this revision.');
        const score=this.rank(r).ranked.find(s=>s.titleId===r.candidate);if(!score)fail(409,'Choice no longer eligible.');
        r.decision={sessionId:`room-${r.id}-${r.revision}`,title:r.titles.find(t=>t.id===r.candidate),score,participants:r.profiles.map(p=>p.id),votes:copy(r.votes)};break;}
      case 'renew':r.joinExpires=this.now()+300000;break;
      case 'close':r.closed=true;this.rooms.delete(r.id);return {closed:true};
      default:fail(400,'Unknown action.');
    }
    r.change++;r.seen.add(key);return this.view(r,token);
  }
}
