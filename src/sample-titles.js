// Original fictional display names. Metadata/IDs remain stable test fixtures.
export const sampleNames = [
 'The Last Table','Small Worlds, Wide Skies','Letters from Willow Bay',
 'Beyond the Lantern Hills','The Moonberry Express','The Ninth Door',
 'The Bronchos Show','The Mapmaker’s Journal','When the River Remembers',
 'The Paper Compass','Little Comet Club','A Question of Tuesday',
 'Room for One More','The Quiet Observatory','The Orchard Between Us',
 'Across the Amber Sea','The Pocket-Sized Planet','The Clockwork Postcard',
 'The Nearly Perfect Weekend','A Thousand Tiny Journeys','The Windows of Alder Street',
 'The Faraway Garden','Milo and the Midnight Sun','The Harbour After Nine'
];
export function sampleName(id) {
 const match=/^sample-(\d{2})$/.exec(id||'');
 const name=match&&sampleNames[Number(match[1])-1];
 return name?`${name} (Illustrative)`:null;
}
// Display-only compatibility: preserve historical snapshots/ratings byte-for-byte.
export function displayTitle(title) {
 return title?.illustrative && /^Illustrative title \d{2}$/.test(title.title)
  ? sampleName(title.id)||title.title : title?.title||'Unknown title';
}
