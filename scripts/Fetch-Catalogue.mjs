// Development-time metadata preparation only. This script is never bundled or called by the app.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
const cacheUrl = new URL('../data/catalogue-search-cache.json',import.meta.url);
await mkdir(new URL('../data/',import.meta.url),{recursive:true});
let cache = {}; try { cache = JSON.parse(await readFile(cacheUrl,'utf8')); } catch {}
const base = 'https://www.wikidata.org/w/api.php';
const titles = ['Toy Story','Finding Nemo','WALL-E','Paddington','My Neighbor Totoro',"Kiki's Delivery Service",'The Kid','The General','Sherlock Jr.','The Gold Rush','Modern Times','City Lights','The Iron Giant','The Red Balloon','A Trip to the Moon','March of the Penguins','Planet Ocean','Winged Migration','Fantastic Mr. Fox','The Secret of Kells','Ernest & Celestine','The Triplets of Belleville','The Lunchbox','Song of the Sea'];
async function api(params) {
  for (let attempt=0;attempt<4;attempt++) {
    const response = await fetch(base+'?'+new URLSearchParams({...params,format:'json',origin:'*'}),{headers:{'User-Agent':'TonightTogetherCatalogueResearch/0.1 (local educational prototype)'},signal:AbortSignal.timeout(45000)});
    if (response.status === 429 || response.status === 503) { console.log(`Rate limited; backing off ${10*(attempt+1)} seconds`); await pause(10000*(attempt+1)); continue; }
    if (!response.ok) throw new Error(`Wikidata HTTP ${response.status}`);
    return response.json();
  }
  throw new Error('Metadata endpoint remains rate limited; cached search progress is preserved.');
}
const ids = [], searchAudit = [];
// Modest sequential requests avoid flooding the public endpoint.
for (const title of titles) {
  let candidate = cache[title];
  if (!candidate) {
    await pause(1700);
    const data = await api({action:'wbsearchentities',search:title,language:'en',limit:'10'});
    candidate = data.search.find(r => /\bfilm\b/i.test(r.description || '') && !/film series|franchise|soundtrack|film producer|film director|actor|actress/i.test(r.description || ''));
    if (candidate) { cache[title] = candidate; await writeFile(cacheUrl,JSON.stringify(cache,null,2)); }
  }
  if (!candidate) throw new Error(`No film entity found for ${title}`);
  ids.push(candidate.id); searchAudit.push({requested:title,id:candidate.id,label:candidate.label,description:candidate.description});
  console.log(`${title}: ${candidate.id} — ${candidate.description}`);
}
const data = await api({action:'wbgetentities',ids:ids.join('|'),props:'labels|claims|descriptions',languages:'en'});
const values = (entity,key) => (entity.claims[key] || []).filter(c => c.rank !== 'deprecated' && c.mainsnak.snaktype === 'value').map(c => c.mainsnak.datavalue.value);
const linkedIds = [...new Set(Object.values(data.entities).flatMap(e => [...values(e,'P136'),...values(e,'P364')].map(v => v.id)))];
const labels = await api({action:'wbgetentities',ids:linkedIds.join('|'),props:'labels',languages:'en'});
const label = id => labels.entities[id]?.labels.en?.value || id;
const languageCodes = {Q1860:'en',Q150:'fr',Q1321:'es',Q5287:'ja',Q1568:'hi',Q652:'it',Q188:'de',Q9610:'bn'};
const records = ids.map((id,index) => {
  const entity = data.entities[id], sourceGenres = values(entity,'P136').map(v => label(v.id));
  const group = [...new Set(sourceGenres.flatMap(g => { const result=[]; const text=g.toLowerCase(); if(/comed/.test(text))result.push('comedy'); if(/document/.test(text))result.push('documentary'); if(/drama/.test(text))result.push('drama'); if(/adventure|fantasy|science fiction/.test(text))result.push('adventure'); if(/animat/.test(text))result.push('animation'); if(/mystery/.test(text))result.push('mystery'); return result; }))];
  if (/animat|anime|stop-motion/i.test(entity.descriptions.en?.value || '') && !group.includes('animation')) group.push('animation');
  const lengths = [...new Set(values(entity,'P2047').filter(v => v.unit.endsWith('/Q7727')).map(v => Number(v.amount)).filter(v => Number.isFinite(v) && v > 0))];
  const langs = values(entity,'P364').map(v => languageCodes[v.id]).filter(Boolean);
  return { id, title:entity.labels.en?.value || titles[index], runtimeMinutes:lengths.length ? Math.max(...lengths) : null,
    runtimeVariants:lengths, genres:group, sourceGenres, moods: group.includes('documentary') ? ['learn','explore'] : group.includes('comedy') || group.includes('animation') ? ['relax','uplift'] : ['explore'],
    languages:langs.length ? [...new Set(langs)] : undefined, originalLanguageLabels:values(entity,'P364').map(v => label(v.id)), contentTags:[], coveredExclusionTags:[], illustrative:false,
    synopsis:entity.descriptions.en?.value || 'Film metadata from Wikidata.', provenance:`Wikidata ${id} · CC0 structured metadata · checked 2026-10-20. Genre groups and mood tags are app-authored discovery aids.`,
    sourceUrl:`https://www.wikidata.org/wiki/${id}`, checkedAt:'2026-10-20', licence:'CC0-1.0', sourceRevision:entity.lastrevid,
    languageScope:'Original language metadata; current audio/subtitle availability is not verified.' };
});
await mkdir(new URL('../data/',import.meta.url),{recursive:true});
await writeFile(new URL('../data/catalogue-source-audit.json',import.meta.url),JSON.stringify({checkedAt:'2026-10-20',searchAudit,entities:data.entities,linkedLabels:labels.entities},null,2));
await writeFile(new URL('../src/catalogue-data.js',import.meta.url),'// Prepared from CC0 Wikidata structured metadata. See CATALOGUE_SOURCES.md.\nexport const sourcedCatalogue = '+JSON.stringify(records,null,2)+';\n');
console.log(`Prepared ${records.length} sourced records; no artwork, videos or availability data downloaded.`);
