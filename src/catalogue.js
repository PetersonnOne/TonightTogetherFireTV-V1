import {sampleName} from './sample-titles.js';
export const genres = ['comedy','documentary','drama','adventure','animation','mystery'];
export const moods = ['relax','learn','explore','uplift'];
export const boundaries = ['horror','violence','strong language'];
export const languages = ['en','fr','es','ja','hi','it','de','bn'];
// Original fictional programmes; every name retains an explicit illustrative label.
export const catalogue = Array.from({ length: 24 }, (_, i) => ({
  id: `sample-${String(i + 1).padStart(2,'0')}`, title: sampleName(`sample-${String(i + 1).padStart(2,'0')}`),
  runtimeMinutes: [25,45,70,85,100,115][i % 6],
  genres: [genres[i % 6], genres[(i + 1 + Math.floor(i / 6)) % 6]],
  moods: [moods[Math.floor(i / 6)], moods[(i + 1) % 4]],
  languages: i % 3 === 0 ? ['en','fr'] : i % 3 === 1 ? ['en','es'] : ['en'],
  contentTags: i % 7 === 0 ? ['violence'] : [], coveredExclusionTags: [...boundaries],
  illustrative: true, synopsis: 'A fictional catalogue entry for testing shared preferences, time limits and compromises. It is not a real programme or streaming-availability listing.',
  provenance: 'Project-authored neutral test fixture; all metadata illustrative.'
}));
export function sampleProfiles() {
  return [
    { id: 'sample-a', alias: 'Viewer A', genres: ['comedy','animation'], softDislikes: ['mystery'], exclusions: ['violence'], preferredLanguages: ['en'], requiredLanguages: [] },
    { id: 'sample-b', alias: 'Viewer B', genres: ['documentary','adventure'], softDislikes: [], exclusions: [], preferredLanguages: ['fr'], requiredLanguages: [] },
    { id: 'sample-c', alias: 'Viewer C', genres: ['drama','mystery'], softDislikes: ['animation'], exclusions: ['horror'], preferredLanguages: ['en'], requiredLanguages: [] }
  ];
}
