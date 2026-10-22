import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyHousehold, createStore, saveProfile, deleteProfile, recordChoice, markWatched, saveFeedback } from '../src/core/household.js';
import { sampleProfiles, catalogue } from '../src/catalogue.js';
import { rankTitles } from '../src/core/recommendations.js';
const household = () => ({...emptyHousehold(),profiles:sampleProfiles()});
function choice(state = household(), votes = {'sample-a':'yes','sample-b':'yes'}) {
  const profiles = state.profiles.slice(0,2), score = rankTitles({titles:catalogue,profiles}).ranked[0];
  return recordChoice(state,{sessionId:'session-1',title:catalogue.find(t => t.id === score.titleId),score,participants:profiles.map(p => p.id),votes,now:1});
}
test('choice cannot save without all selected viewers accepting', () => {
  assert.throws(() => choice(household(),{'sample-a':'yes','sample-b':'another'}),/Every/);
});
test('chosen is not watched; marking watched twice does not duplicate or retime fairness', () => {
  let state = choice(); assert.equal(state.history[0].status,'selected');
  state = markWatched(state,'session-1',10); state = markWatched(state,'session-1',20);
  assert.equal(state.history.length,1); assert.equal(state.history[0].watchedAt,10);
});
test('profile deletion scrubs votes, individual score components, feedback and fairness facts', () => {
  let state = markWatched(choice(),'session-1');
  state = saveFeedback(state,'session-1','sample-a',4,'Private test note');
  const next = deleteProfile(state,'sample-a');
  assert.ok(!JSON.stringify(next).includes('Private test note'));
  assert.ok(!JSON.stringify(next).includes('sample-a'));
  assert.deepEqual(next.history[0].participants,['sample-b']);
  assert.equal(deleteProfile(next,'sample-b').history.length,0);
});
test('failed storage writes do not advance the in-memory household', () => {
  const store = createStore({read:()=>'',write:()=>false});
  assert.throws(() => store.commit(household()),/Not saved/);
  assert.equal(store.get().profiles.length,0);
});
test('save and reload restore the complete household; corrupt and future formats are preserved', () => {
  let raw = ''; const adapter = {read:()=>raw,write:value=>{raw=value;return true;}};
  const first = createStore(adapter); first.commit(choice());
  assert.equal(createStore(adapter).get().history[0].sessionId,'session-1');
  raw = '{invalid'; assert.throws(() => createStore(adapter)); assert.equal(raw,'{invalid');
  raw = JSON.stringify({version:2,profiles:[],history:[],titles:[]});
  assert.throws(() => createStore(adapter),/unsupported/); assert.match(raw,/"version":2/);
});
test('feedback requires watched status and valid participant/rating; duplicate choices are rejected', () => {
  const state = choice();
  assert.throws(() => saveFeedback(state,'session-1','sample-a',4,'note'),/watched/);
  assert.throws(() => saveFeedback(markWatched(state,'session-1'),'session-1','unknown',4,'note'),/Viewer/);
  assert.throws(() => saveFeedback(markWatched(state,'session-1'),'session-1','sample-a',0,'note'),/1 to 5/);
  assert.throws(() => choice(state),/already saved/);
});
test('profiles have a six-viewer ceiling and require inspectable preferences', () => {
  const profile = sampleProfiles()[0]; let state = emptyHousehold();
  for(let i=0;i<6;i++) state=saveProfile(state,{...profile,id:String(i)});
  assert.throws(() => saveProfile(state,{...profile,id:'7'}),/profile IDs/);
  assert.throws(() => saveProfile(emptyHousehold(),{...profile,alias:'  '}),/profile/);
});
