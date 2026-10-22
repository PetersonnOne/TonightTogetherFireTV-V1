export const emptyHousehold = () => ({ version: 1, sample: false, profiles: [], titles: [], history: [] });
const clone = value => JSON.parse(JSON.stringify(value));
export function validateHousehold(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.profiles) || !Array.isArray(value.history) || !Array.isArray(value.titles)) throw new Error('Saved data has an unsupported format. Your original record has been preserved.');
  if (value.profiles.length > 6 || new Set(value.profiles.map(p => p.id)).size !== value.profiles.length) throw new Error('Saved profile IDs are invalid.');
  for (const p of value.profiles) {
    if (typeof p.id !== 'string' || typeof p.alias !== 'string' || !p.alias.trim() || p.alias.length > 32) throw new Error('Invalid saved profile.');
    if (p.learningDisabled != null && typeof p.learningDisabled !== 'boolean') throw new Error('Invalid feedback learning setting.');
    if (p.learningResetAt != null && (!Number.isFinite(p.learningResetAt) || p.learningResetAt < 0)) throw new Error('Invalid feedback reset time.');
    for (const key of ['genres','softDislikes','exclusions','preferredLanguages','requiredLanguages']) if (!Array.isArray(p[key]) || p[key].some(v => typeof v !== 'string')) throw new Error('Invalid profile preferences.');
  }
  for (const t of value.titles) {
    if (typeof t.id !== 'string' || typeof t.title !== 'string' || !t.title.trim() || t.title.length > 100 || !Array.isArray(t.genres) || !Array.isArray(t.coveredExclusionTags)) throw new Error('Invalid saved catalogue entry.');
    if (t.runtimeMinutes != null && (!Number.isInteger(t.runtimeMinutes) || t.runtimeMinutes < 1 || t.runtimeMinutes > 600)) throw new Error('Invalid saved runtime.');
    for (const key of ['genres','moods','contentTags','coveredExclusionTags']) if (!Array.isArray(t[key]) || t[key].some(tag => typeof tag !== 'string')) throw new Error('Invalid saved catalogue tags.');
    if (t.languages != null && (!Array.isArray(t.languages) || t.languages.some(tag => typeof tag !== 'string'))) throw new Error('Invalid saved language metadata.');
  }
  const profileIds = new Set(value.profiles.map(p => p.id));
  const sessions = new Set();
  for (const r of value.history) {
    if (typeof r.sessionId !== 'string' || sessions.has(r.sessionId) || !Array.isArray(r.participants) || !r.participants.length || new Set(r.participants).size !== r.participants.length || r.participants.some(id => !profileIds.has(id)) || !['selected','watched'].includes(r.status)) throw new Error('Invalid saved choice.');
    if (!r.title || typeof r.title.title !== 'string' || !Array.isArray(r.title.genres) || !r.score || !Number.isFinite(r.score.groupFit) || !Array.isArray(r.score.viewers) || !Array.isArray(r.score.fairnessFacts) || !r.fits || !r.feedback || typeof r.feedback !== 'object' || !Number.isFinite(r.selectedAt)) throw new Error('Saved choice details are incomplete.');
    if (r.status === 'watched' && !Number.isFinite(r.watchedAt)) throw new Error('Saved watched date is invalid.');
    if (r.score.viewers.some(p => !r.participants.includes(p.profileId)) || Object.keys(r.fits).some(id => !r.participants.includes(id)) || Object.keys(r.feedback).some(id => !r.participants.includes(id))) throw new Error('Saved choice has unknown participants.');
    if (r.score.viewers.some(p => !Number.isFinite(p.score) || p.score < 0 || p.score > 100) || Object.values(r.fits).some(fit => !Number.isFinite(fit) || fit < 0 || fit > 100)) throw new Error('Saved preference score is invalid.');
    for (const feedback of Object.values(r.feedback)) if (!feedback || ![1,2,3,4,5].includes(feedback.rating) || typeof feedback.note !== 'string' || feedback.note.length > 500) throw new Error('Saved feedback is invalid.');
    sessions.add(r.sessionId);
  }
  return value;
}
export function saveProfile(state, profile) {
  const next = clone(state), index = next.profiles.findIndex(p => p.id === profile.id);
  if (index < 0) next.profiles.push(profile); else next.profiles[index] = profile;
  return validateHousehold(next);
}
export function deleteProfile(state, id) {
  const next = clone(state);
  next.profiles = next.profiles.filter(p => p.id !== id);
  next.history = next.history.map(record => {
    record.participants = record.participants.filter(p => p !== id);
    for (const key of ['fits','feedback','votes']) if (record[key]) delete record[key][id];
    // Stored ranking details may contain viewer preferences: remove deleted viewer everywhere.
    if (record.score) {
      record.score.viewers = record.score.viewers.filter(p => p.profileId !== id);
      record.score.fairnessFacts = record.score.fairnessFacts.filter(p => p.profileId !== id);
      if(record.score.adaptationFacts) record.score.adaptationFacts=record.score.adaptationFacts.filter(p=>p.profileId!==id);
    }
    return record;
  }).filter(record => record.participants.length);
  return validateHousehold(next);
}
export function recordChoice(state, { sessionId, title, score, participants, votes, now = Date.now() }) {
  if (!participants.length || participants.some(id => votes[id] !== 'yes')) throw new Error('Every selected viewer must accept before saving.');
  if (state.history.some(record => record.sessionId === sessionId)) throw new Error('This session is already saved.');
  const next = clone(state);
  next.history.unshift({ sessionId, titleId: title.id, title: clone(title), score: clone(score), participants: [...participants], votes: clone(votes),
    fits: Object.fromEntries(score.viewers.map(p => [p.profileId,p.score])), feedback: {}, selectedAt: now, status: 'selected' });
  return validateHousehold(next);
}
export function markWatched(state, sessionId, now = Date.now()) {
  const next = clone(state), record = next.history.find(r => r.sessionId === sessionId);
  if (!record) throw new Error('Choice no longer exists.');
  if (record.status !== 'watched') { record.status = 'watched'; record.watchedAt = now; }
  return validateHousehold(next);
}
export function saveFeedback(state, sessionId, profileId, rating, note) {
  const next = clone(state), record = next.history.find(r => r.sessionId === sessionId);
  if (!record?.participants.includes(profileId)) throw new Error('Viewer is not part of this saved choice.');
  if (record.status !== 'watched') throw new Error('Mark this choice watched before adding feedback.');
  if (![1,2,3,4,5].includes(rating)) throw new Error('Choose a rating from 1 to 5.');
  record.feedback[profileId] = { rating, note: String(note).trim().slice(0,500) };
  return validateHousehold(next);
}
export function createStore(adapter) {
  let state;
  const raw = adapter.read();
  state = raw ? validateHousehold(JSON.parse(raw)) : emptyHousehold();
  return {
    get: () => clone(state),
    commit(next) {
      validateHousehold(next);
      const encoded = JSON.stringify(next);
      let written = false;
      try { written = adapter.write(encoded) === true; } catch { /* Preserve last saved state. */ }
      if (!written) throw new Error('Not saved. Your last saved data is unchanged. Please try again.');
      state = clone(next);
      return clone(state);
    }
  };
}
