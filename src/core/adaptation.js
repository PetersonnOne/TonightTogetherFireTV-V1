import { rankTitles } from './recommendations.js';
export const ADAPTATION_VERSION = '1.0';
// Two explicit ratings for a genre are required. Each adjustment is bounded to +/-3.
export function learningFacts(profile, history) {
  const since = profile.learningResetAt || 0;
  const evidence = history.filter(r => r.status === 'watched' && r.watchedAt > since && r.feedback?.[profile.id]?.rating)
    .sort((a,b)=>b.watchedAt-a.watchedAt).slice(0,10);
  const genres = [...new Set(evidence.flatMap(r=>r.title?.genres || []))];
  return genres.map(genre => {
    const ratings = evidence.filter(r=>r.title.genres.includes(genre)).map(r=>r.feedback[profile.id].rating);
    return {genre,count:ratings.length,adjustment:profile.learningDisabled || ratings.length<2 ? 0 : Math.max(-3,Math.min(3,ratings.reduce((a,b)=>a+b-3,0)/ratings.length*1.5))};
  });
}
export function rankAdaptive(input) {
  const result = rankTitles(input);
  for(const score of result.ranked) {
    const title = input.titles.find(t=>t.id===score.titleId);
    score.adaptationVersion = ADAPTATION_VERSION;
    score.adaptationFacts = input.profiles.map(p=>({profileId:p.id,facts:learningFacts(p,input.history||[]).filter(f=>title.genres.includes(f.genre))}));
    const adjustments = score.adaptationFacts.map(p=>p.facts.length ? p.facts.reduce((n,f)=>n+f.adjustment,0)/p.facts.length : 0);
    score.adaptationBonus = adjustments.reduce((a,b)=>a+b,0)/adjustments.length;
    score.rankScore += score.adaptationBonus;
  }
  result.ranked.sort((a,b)=>b.rankScore-a.rankScore || b.minimumFit-a.minimumFit || (a.lastWatchedAt??-Infinity)-(b.lastWatchedAt??-Infinity) || a.titleId.localeCompare(b.titleId));
  return result;
}
