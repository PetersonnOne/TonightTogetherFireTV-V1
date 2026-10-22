import test from 'node:test';
import assert from 'node:assert/strict';
import { rankTitles } from '../src/core/recommendations.js';

// Neutral test fixtures, not real programmes or a shipped catalogue.
const title = (id, extra = {}) => ({ id, runtimeMinutes: 80, genres: ['comedy'], moods: ['relax'],
  languages: ['en'], contentTags: [], coveredExclusionTags: ['horror'], ...extra });
const viewer = (id, extra = {}) => ({ id, genres: ['comedy'], ...extra });

test('hard exclusions and missing coverage block titles before fairness', () => {
  const result = rankTitles({ titles: [title('conflict', { contentTags: ['horror'] }),
    title('unknown', { coveredExclusionTags: [] }), title('eligible')],
  profiles: [viewer('a', { exclusions: ['horror'] })],
  history: [{ sessionId: 'old', titleId: 'other', status: 'watched', watchedAt: 1, fits: { a: 0 } }] });
  assert.deepEqual(result.ranked.map(item => item.titleId), ['eligible']);
  assert.equal(result.excluded[0].blockers[0].type, 'excluded-content');
  assert.equal(result.excluded[1].blockers[0].type, 'unknown-exclusion-coverage');
});

test('unknown runtime and language cannot satisfy hard requirements', () => {
  const result = rankTitles({ titles: [title('unknown', { runtimeMinutes: null, languages: undefined }), title('long', { runtimeMinutes: 110 }), title('fit')],
    profiles: [viewer('a', { requiredLanguages: ['en'] })], session: { maxMinutes: 90 } });
  assert.deepEqual(result.ranked.map(item => item.titleId), ['fit']);
  assert.ok(result.excluded[0].blockers.some(item => item.type === 'unknown-runtime'));
  assert.ok(result.excluded[0].blockers.some(item => item.type === 'unknown-language'));
});

test('minimum individual fit makes a shared compromise beat a polarising choice', () => {
  const result = rankTitles({ titles: [title('polarising', { genres: ['comedy', 'drama'] }), title('shared', { genres: ['comedy', 'mystery'] })],
    profiles: [viewer('a', { genres: ['comedy', 'drama'] }), viewer('b', { genres: ['mystery'] })] });
  assert.equal(result.ranked[0].titleId, 'shared');
  assert.equal(result.ranked[0].groupFit, 65);
  assert.equal(result.ranked[1].groupFit, 30);
});

test('changing participants changes ranking and per-viewer explanation facts', () => {
  const titles = [title('comedy'), title('mystery', { genres: ['mystery'] })];
  const a = rankTitles({ titles, profiles: [viewer('a')] });
  const b = rankTitles({ titles, profiles: [viewer('b', { genres: ['mystery'] })] });
  assert.equal(a.ranked[0].titleId, 'comedy'); assert.equal(b.ranked[0].titleId, 'mystery');
  assert.deepEqual(b.ranked[0].viewers[0].components[0].matched, ['mystery']);
});

test('soft dislike lowers fit without removing the choice; absent preferences are neutral', () => {
  const result = rankTitles({ titles: [title('a')], profiles: [viewer('a', { softDislikes: ['comedy'] }), { id: 'b' }] });
  assert.equal(result.ranked[0].viewers[0].score, 75);
  assert.equal(result.ranked[0].viewers[1].score, 50);
  assert.equal(result.ranked[0].viewers[1].limitedPreferences, true);
});

test('fairness uses only five recent watched sessions and remains within five points', () => {
  const history = Array.from({ length: 6 }, (_, i) => ({ sessionId: String(i), titleId: 'other', status: 'watched', watchedAt: i, fits: { a: i === 0 ? 100 : 0 } }));
  history.push({ sessionId: 'not-watched', titleId: 'other', status: 'selected', watchedAt: 100, fits: { a: 100 } });
  const item = rankTitles({ titles: [title('a')], profiles: [viewer('a')], history }).ranked[0];
  assert.equal(item.fairnessFacts[0].sampleCount, 5);
  assert.equal(item.fairnessFacts[0].historicalMean, 0);
  assert.equal(item.fairnessBonus, 5);
  assert.equal(item.groupFit, 100);
});

test('removing deleted history removes its fairness contribution', () => {
  const input = { titles: [title('a')], profiles: [viewer('a')] };
  const history = [{ sessionId: 'old', titleId: 'other', status: 'watched', watchedAt: 1, fits: { a: 0 } }];
  assert.equal(rankTitles({ ...input, history }).ranked[0].fairnessBonus, 5);
  assert.equal(rankTitles(input).ranked[0].fairnessBonus, 0);
});

test('ties prefer never watched, then stable IDs regardless of input order', () => {
  const titles = [title('c'), title('b'), title('a')];
  const history = [{ sessionId: 'old', titleId: 'a', status: 'watched', watchedAt: 1, fits: { a: 100 } }];
  assert.deepEqual(rankTitles({ titles, profiles: [viewer('a')], history }).ranked.map(item => item.titleId), ['b', 'c', 'a']);
});

test('all rejected titles produce an actionable exclusion set without relaxed filters', () => {
  const result = rankTitles({ titles: [title('a')], profiles: [viewer('a')], session: { rejectedTitleIds: ['a'] } });
  assert.equal(result.ranked.length, 0);
  assert.deepEqual(result.excluded[0].blockers, [{ type: 'session-rejection' }]);
});

test('invalid sessions and duplicate history are rejected rather than silently double counted', () => {
  assert.throws(() => rankTitles({ titles: [], profiles: [] }), /viewer/);
  assert.throws(() => rankTitles({ titles: [], profiles: [viewer('a')], session: { maxMinutes: -1 } }), /positive/);
  const record = { sessionId: 'x', status: 'watched', fits: { a: 0 } };
  assert.throws(() => rankTitles({ titles: [], profiles: [viewer('a')], history: [record, record] }), /one record/);
});
