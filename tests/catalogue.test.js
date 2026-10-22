import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { sourcedCatalogue } from '../src/catalogue-data.js';
import { catalogue, sampleProfiles } from '../src/catalogue.js';
import { rankTitles } from '../src/core/recommendations.js';
import { displayTitle } from '../src/sample-titles.js';

test('fictional display names preserve ranking and old saved snapshots without renaming real films', () => {
  const legacy=catalogue.map((t,i)=>({...t,title:`Illustrative title ${String(i+1).padStart(2,'0')}`}));
  const before=JSON.stringify(legacy),profiles=sampleProfiles();
  const scores=titles=>rankTitles({titles,profiles}).ranked.map(r=>({id:r.titleId,fit:r.groupFit,minimum:r.minimumFit,total:r.rankScore}));
  assert.deepEqual(scores(catalogue),scores(legacy));
  assert.equal(displayTitle(legacy[6]),'The Bronchos Show (Illustrative)');
  assert.equal(JSON.stringify(legacy),before,'Display must not mutate historical records');
  assert.ok(catalogue.every(t=>t.title.endsWith(' (Illustrative)')));
  assert.equal(new Set(catalogue.map(t=>t.title)).size,24);
  for(const t of sourcedCatalogue)assert.equal(displayTitle(t),t.title);
});
test('real catalogue has 24 unique sourced records and is separate from illustrative fixtures', () => {
  assert.equal(sourcedCatalogue.length,24);
  assert.equal(new Set(sourcedCatalogue.map(t => t.id)).size,24);
  for(const t of sourcedCatalogue) {
    assert.match(t.sourceUrl,/^https:\/\/www.wikidata.org\/wiki\/Q\d+$/);
    assert.equal(t.licence,'CC0-1.0'); assert.equal(t.illustrative,false);
    assert.ok(t.runtimeMinutes > 0); assert.ok(t.provenance.includes('app-authored'));
    assert.equal(t.coveredExclusionTags.length,0);
  }
  assert.ok(catalogue.every(t => t.illustrative));
});
test('unverified real content metadata never passes a firm exclusion', () => {
  const profile={...sampleProfiles()[0],exclusions:['violence']};
  const result=rankTitles({titles:sourcedCatalogue,profiles:[profile]});
  assert.equal(result.ranked.length,0);
  assert.ok(result.excluded.every(t => t.blockers.some(b => b.type === 'unknown-exclusion-coverage')));
});
test('invalid runtime and missing content data cannot bypass hard checks', () => {
  const base={...catalogue[1],runtimeMinutes:-1,contentTags:undefined};
  const result=rankTitles({titles:[base],profiles:[{...sampleProfiles()[0],exclusions:['violence']}],session:{maxMinutes:90}});
  assert.equal(result.ranked.length,0);
  assert.ok(result.excluded[0].blockers.some(b => b.type === 'unknown-runtime'));
});
test('100 entries and six viewers produce deterministic scores without mutating inputs', t => {
  const titles=Array.from({length:100},(_,i)=>({...catalogue[i%24],id:String(i)}));
  const profiles=Array.from({length:6},(_,i)=>({...sampleProfiles()[i%3],id:String(i)}));
  const input={titles,profiles}, before=JSON.stringify(input), start=performance.now();
  const first=rankTitles(input), elapsed=performance.now()-start;
  assert.deepEqual(first,rankTitles(input)); assert.equal(JSON.stringify(input),before);
  t.diagnostic(`Measured pure ranking: ${elapsed.toFixed(2)} ms; host-specific, not a TV frame timing.`);
});
