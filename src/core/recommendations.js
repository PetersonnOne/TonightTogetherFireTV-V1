// Pure local decision logic. No network, storage, telemetry, or platform imports.
export const SCORING_VERSION = '1.0';
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const unique = (values = []) => [...new Set(values)];
const intersection = (a = [], b = []) => unique(a).filter(value => b.includes(value));
const fraction = (wanted, actual = []) => intersection(wanted, actual).length / unique(wanted).length;

function eligibility(title, profiles, session) {
  const blockers = [];
  if ((session.rejectedTitleIds ?? []).includes(title.id)) blockers.push({ type: 'session-rejection' });
  if (session.maxMinutes != null) {
    if (!Number.isFinite(title.runtimeMinutes) || title.runtimeMinutes <= 0) blockers.push({ type: 'unknown-runtime' });
    else if (title.runtimeMinutes > session.maxMinutes) blockers.push({ type: 'runtime-limit' });
  }
  const checkLanguage = (languages, profileId = null) => {
    if (!languages?.length) return;
    if (!Array.isArray(title.languages)) blockers.push({ type: 'unknown-language', profileId });
    else if (!intersection(languages, title.languages).length) blockers.push({ type: 'required-language', profileId });
  };
  checkLanguage(session.requiredLanguages);
  for (const profile of profiles) {
    checkLanguage(profile.requiredLanguages, profile.id);
    for (const tag of unique([...(profile.exclusions ?? []), ...(session.exclusions ?? [])])) {
      if (!(title.coveredExclusionTags ?? []).includes(tag) || !Array.isArray(title.contentTags)) {
        blockers.push({ type: 'unknown-exclusion-coverage', tag, profileId: profile.id });
      } else if ((title.contentTags ?? []).includes(tag)) {
        blockers.push({ type: 'excluded-content', tag, profileId: profile.id });
      }
    }
  }
  return blockers;
}

function individualFit(title, profile, session) {
  const components = [];
  const add = (factor, weight, wanted, actual) => {
    if (!wanted?.length) return;
    components.push({ factor, weight, matched: intersection(wanted, actual), wanted: unique(wanted),
      unknown: !Array.isArray(actual), value: fraction(wanted, actual) });
  };
  add('genre', 0.60, profile.genres, title.genres);
  add('language', 0.25, profile.preferredLanguages, title.languages);
  add('mood', 0.15, session.mood ? [session.mood] : [], title.moods);
  const totalWeight = components.reduce((sum, item) => sum + item.weight, 0);
  const base = totalWeight ? components.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight : 0.5;
  const disliked = intersection(profile.softDislikes, [...(title.genres ?? []), ...(title.contentTags ?? []), ...(title.moods ?? [])]);
  const dislikePenalty = profile.softDislikes?.length ? 0.25 * disliked.length / unique(profile.softDislikes).length : 0;
  return { profileId: profile.id, score: 100 * clamp(base - dislikePenalty, 0, 1),
    components, disliked, limitedPreferences: totalWeight === 0 };
}

function recentWatched(history, profileId) {
  return history.filter(record => record.status === 'watched' && Number.isFinite(record.fits?.[profileId]))
    .sort((a, b) => b.watchedAt - a.watchedAt).slice(0, 5);
}

/** Inputs use IDs and explicit catalogue fields; output facts drive explanations. */
export function rankTitles({ titles, profiles, session = {}, history = [] }) {
  if (!profiles.length) throw new Error('Select at least one viewer.');
  if (new Set(profiles.map(profile => profile.id)).size !== profiles.length) throw new Error('Viewer IDs must be unique.');
  if (profiles.length > 6) throw new Error('A session supports up to six viewers.');
  if (session.maxMinutes != null && (!Number.isFinite(session.maxMinutes) || session.maxMinutes <= 0)) throw new Error('Time limit must be positive.');
  if (new Set(titles.map(title => title.id)).size !== titles.length) throw new Error('Title IDs must be unique.');
  if (new Set(history.map(record => record.sessionId)).size !== history.length) throw new Error('History must contain one record per session.');
  const ranked = [], excluded = [];
  for (const title of titles) {
    const blockers = eligibility(title, profiles, session);
    if (blockers.length) { excluded.push({ titleId: title.id, blockers }); continue; }
    const viewers = profiles.map(profile => individualFit(title, profile, session));
    const meanFit = viewers.reduce((sum, viewer) => sum + viewer.score, 0) / viewers.length;
    const minimumFit = Math.min(...viewers.map(viewer => viewer.score));
    const groupFit = 0.6 * meanFit + 0.4 * minimumFit;
    const fairnessFacts = viewers.map(viewer => {
      const recent = recentWatched(history, viewer.profileId);
      const historicalMean = recent.length ? recent.reduce((sum, record) => sum + record.fits[viewer.profileId], 0) / recent.length : null;
      const need = historicalMean == null ? 0 : clamp((60 - historicalMean) / 60, 0, 1);
      return { profileId: viewer.profileId, sampleCount: recent.length, historicalMean, need,
        contribution: 5 * need * viewer.score / 100 / viewers.length };
    });
    const fairnessBonus = fairnessFacts.reduce((sum, item) => sum + item.contribution, 0);
    const watched = history.filter(record => record.titleId === title.id && record.status === 'watched');
    ranked.push({ titleId: title.id, scoringVersion: SCORING_VERSION, viewers, meanFit, minimumFit,
      groupFit, fairnessBonus, fairnessFacts, rankScore: groupFit + fairnessBonus,
      lastWatchedAt: watched.length ? Math.max(...watched.map(record => record.watchedAt)) : null });
  }
  ranked.sort((a, b) => b.rankScore - a.rankScore || b.minimumFit - a.minimumFit ||
    (a.lastWatchedAt ?? -Infinity) - (b.lastWatchedAt ?? -Infinity) ||
    (a.titleId < b.titleId ? -1 : a.titleId > b.titleId ? 1 : 0));
  return { scoringVersion: SCORING_VERSION, ranked, excluded };
}
