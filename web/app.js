import {avatarHTML,artworkHTML,consensusHTML} from './presentation.js';
import {displayTitle} from './src/sample-titles.js';
import { rankAdaptive as rankTitles, learningFacts } from './src/core/adaptation.js';
import { negotiate } from './src/core/negotiation.js';
import { ConnectedRoom } from './connected.js';
import { createStore, emptyHousehold, saveProfile, deleteProfile, recordChoice, markWatched, saveFeedback } from './src/core/household.js';
import { catalogue, sampleProfiles, genres, moods, boundaries, languages } from './src/catalogue.js';
import { sourcedCatalogue } from './src/catalogue-data.js';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy = value => JSON.parse(JSON.stringify(value));
const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const native = window.TonightStorage;
const adapter = native ? { read: () => native.read(), write: value => native.write(value) } : {
  read: () => localStorage.getItem('tonight-together-m2-v1'), write(value) { localStorage.setItem('tonight-together-m2-v1',value); return true; }
};
let store, state, route = 'home', draft, selectedRecord, selectedTitle, compared = [], shortlistOffset = 0;
let titleReturn = 'results';
let session = freshSession();
const room = new ConnectedRoom(() => { if(route==='connected') { const active=document.activeElement; const key=active?.dataset.room, value=active?.dataset.title, profile=active?.dataset.profile, person=active?.dataset.person; render(); const match=[...document.querySelectorAll('[data-room]')].find(b=>b.dataset.room===key&&b.dataset.title===value&&b.dataset.profile===profile&&b.dataset.person===person); match?.focus({preventScroll:true}); } }, (decision,profiles) => { if(!state.history.some(r=>r.sessionId===decision.sessionId)) commit(recordChoice({...state,profiles:state.profiles.map(p=>profiles.find(v=>v.id===p.id)||p)},decision)); selectedRecord=decision.sessionId; });
const focusMemory = {};
function freshSession() { return { sessionId: id(), viewers: [], mood: '', maxMinutes: null, requiredLanguages: [], exclusions: [], rejectedTitleIds: [], votes: {}, rounds: 0 }; }
try { store = createStore(adapter); state = store.get(); } catch (error) { showRecovery(error); }

function toast(message) { $('#toast').textContent = message; $('#toast').style.display = 'block'; clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').style.display = 'none',4200); }
function commit(next) { state = store.commit(next); }
function allTitles() { return [...(state.sample ? catalogue : sourcedCatalogue), ...state.titles]; }
function viewers() { return state.profiles.filter(p => session.viewers.includes(p.id)); }
function ranked() { return rankTitles({ titles: allTitles(), profiles: viewers(), session, history: state.history }); }
function titleById(titleId) { return allTitles().find(t => t.id === titleId); }
function titleDescription(t) { return t.illustrative ? 'Illustrative catalogue entry.' : t.sourceUrl ? 'Sourced film metadata; availability unverified.' : 'Household-added metadata; availability unverified.'; }
function resultById(titleId) { return ranked().ranked.find(r => r.titleId === titleId); }
const name = profileId => state.profiles.find(p => p.id === profileId)?.alias ?? 'Removed viewer';
const btn = (label, action, value = '', kind = '') => `<button class="${kind}" data-action="${action}" data-value="${esc(value)}">${esc(label)}</button>`;
const badge = text => `<span class="pill">${esc(text)}</span>`;
const catalogueNotice = () => state.sample ? 'Sample mode · 24 illustrative entries, not real programmes or streaming listings.' : `${sourcedCatalogue.length} real film records · Wikidata CC0 metadata. Current streaming availability, audio tracks and content boundaries are not verified.`;
function go(next) {
  const active = document.activeElement;
  if (active?.closest('main') && active.dataset.action) focusMemory[route] = { action:active.dataset.action, value:active.dataset.value, viewer:active.dataset.viewer };
  route = next; render();
  if (!focusMemory[next]) window.scrollTo(0,0);
  document.activeElement?.scrollIntoView({block:'nearest',inline:'nearest'});
}
function setSessionViewers() { session.viewers = session.viewers.filter(p => state.profiles.some(v => v.id === p)); if (!session.viewers.length) session.viewers = state.profiles.map(p => p.id); }
function chips(field, options, values, prefix = 'profile-chip') {
  return `<div class="chips">${options.map(option => `<button data-action="${prefix}" data-field="${field}" data-value="${esc(option)}" aria-label="${esc(option)}" aria-pressed="${values.includes(option)}">${esc(option)}</button>`).join('')}</div>`;
}
function toggle(array, value) { return array.includes(value) ? array.filter(v => v !== value) : [...array,value]; }
function nextViewerAlias() {
  let number = 1;
  while (state.profiles.some(profile => profile.alias === `Viewer ${number}`)) number++;
  return `Viewer ${number}`;
}
function shell(content) {
  return `<header><div class="brand"><span class="brand-orbit" aria-hidden="true"><i></i><i></i><i></i></span><span>Tonight Together<small>An evening for everyone</small></span><span class="pill">CONNECTED EDITION</span></div><nav aria-label="Main">${btn('Tonight','nav','home')}${btn('Household','nav','household')}${btn('Our evenings','nav','history')}${btn('Your data','nav','data')}</nav></header><main class="route-${route}">${content}<footer class="footer"><span>One screen. Different tastes. A night worth sharing.</span><span>Local household memory · ${native ? 'Android app' : 'Browser development preview'}</span></footer></main>`;
}
function render() {
  const content = ({ home: homeView, household: householdView, profile: profileView, setup: setupView, results: resultsView, compare: compareView, agreement: agreementView, history: historyView, record: recordView, data: dataView, add: addTitleView, learning: learningView, connected: () => room.html(), titles: addedTitlesView })[route]?.();
  $('#app').innerHTML = shell(content ?? homeView());
  const remembered = focusMemory[route];
  const focus = (remembered && [...document.querySelectorAll('main [data-action]')].find(el => el.dataset.action === remembered.action && el.dataset.value === remembered.value && el.dataset.viewer === remembered.viewer)) || $('main button:not(:disabled), main input, main select');
  focus?.focus({ preventScroll: true });
}
function homeView() {
  return `<div class="hero"><section><p class="eyebrow">A little less choosing. A little more together.</p><h1>Make room for<br>everyone's evening.</h1><p class="lead muted">Different tastes can share a great night. Find a few choices, see the tradeoffs, and decide together.</p><div class="row">${btn(state.profiles.length ? 'Find our common ground →' : 'Create your household →', 'start','','primary')}${!state.profiles.length ? btn('Try the sample household','samples') : ''}</div><p class="small muted section">No account. No need to connect your streaming services.</p></section><section class="panel"><p class="eyebrow">${state.sample ? 'Your sample household' : 'Around the screen'}</p>${state.profiles.length ? state.profiles.map(p => `<div class="profile">${avatarHTML(p)}<div><h3>${esc(p.alias)}</h3><p class="muted">${esc(p.genres.join(' · ') || 'Open to something new')}</p></div></div>`).join('') : '<div class="step"><span>01</span><p>Tell us who is watching</p></div><div class="step"><span>02</span><p>Find a compromise that makes sense</p></div><div class="step"><span>03</span><p>Let everyone have a say</p></div>'}<div class="section row">${badge(`${state.history.length} saved evenings`)}${badge('Up to 6 viewers')}</div></section></div><div class="notice section">${esc(catalogueNotice())}</div>`;
}
function householdView() {
  return `<p class="eyebrow">Every preference deserves a place</p><h1>Your household.</h1><p class="muted">Keep setup light. Likes guide a choice; a firm exclusion rules it out. Profiles are shared with people using this device.</p><div class="grid">${state.profiles.map(p => `<section class="panel"><div class="row">${avatarHTML(p)}<h2>${esc(p.alias)}</h2></div><p class="muted section">Likes: ${esc(p.genres.join(', ') || 'No preferences yet')}</p><p class="small">Firm exclusions: ${esc(p.exclusions.join(', ') || 'None')}</p><p class="small">Learned preference adjustment: ${p.learningDisabled?'disabled':learningFacts(p,state.history).filter(f=>f.count>=2).map(f=>`${esc(f.genre)} ${f.adjustment.toFixed(1)} (${f.count} explicit ratings)`).join(' · ')||'not enough rated evenings yet'}. Each genre needs two ratings; influence is capped at ±3.</p>${btn(p.learningDisabled?'Enable feedback learning':'Disable feedback learning','learning-toggle',p.id)}${btn('Reset learned evidence','learning-reset',p.id)}<div class="row">${btn('Edit preferences','edit-profile',p.id)}${btn('Delete profile','delete-profile',p.id,'danger')}</div></section>`).join('')}</div><div class="section row">${state.profiles.length < 6 ? btn('＋ Add a viewer','new-profile','','primary') : ''}${state.profiles.length ? btn('Set up tonight →','start') : btn('Try a sample household','samples')}</div>`;
}
function profileView() {
  return `<p class="eyebrow">A say in the evening</p><h1>${state.profiles.some(p => p.id === draft.id) ? 'Edit' : 'Meet'} your viewer.</h1><div class="form panel"><label for="alias">Name or alias</label><input id="alias" data-edit="alias" maxlength="32" value="${esc(draft.alias)}" placeholder="What should we call you?"><h3>What do you enjoy?</h3>${chips('genres',genres,draft.genres)}<h3>Prefer to avoid <span class="pill">Soft preference</span></h3>${chips('softDislikes',genres,draft.softDislikes)}<h3>A firm no <span class="pill gold">Always excluded</span></h3>${chips('exclusions',boundaries,draft.exclusions)}<h3>Preferred languages <span class="pill">Soft preference</span></h3>${chips('preferredLanguages',languages,draft.preferredLanguages)}<h3>Required source language <span class="pill gold">Required</span></h3>${chips('requiredLanguages',languages,draft.requiredLanguages)}<p class="small muted section">These checks use original-language metadata, not verified audio tracks on your streaming service. Each selected language is an acceptable match. Exclusions are preference filters, not a guarantee of age suitability.</p><div class="row">${btn('Save viewer','save-profile','','primary')}${btn('Cancel','nav','household')}</div></div>`;
}
function setupView() {
  return `<p class="eyebrow">Tonight is its own occasion</p><h1>Who's sharing the screen?</h1><div class="row">${btn('Invite phones to tonight →','connect-room')}</div><p class="small muted">Connected mode shares selected preferences and bounded rating/fit summaries with the local room service. Raw notes stay on this device. Remote-only mode remains available below.</p><div class="two"><section class="panel"><h2>The people</h2><div class="chips">${state.profiles.map(p => `<button data-action="viewer" data-value="${esc(p.id)}" aria-label="${esc(p.alias)}" aria-pressed="${session.viewers.includes(p.id)}">${esc(p.alias)}</button>`).join('')}</div><h3 class="section">What's the mood?</h3><div class="chips">${['',...moods].map(m => `<button data-action="mood" data-value="${m}" aria-pressed="${session.mood === m}">${m || 'Anything'}</button>`).join('')}</div><div class="field"><label for="minutes">How much time do you have?</label><select id="minutes" data-session="maxMinutes">${[0,30,60,90,120].map(m => `<option value="${m}" ${Number(session.maxMinutes || 0) === m ? 'selected' : ''}>${m ? `${m} minutes maximum` : 'No time limit'}</option>`).join('')}</select></div></section><section class="panel"><h2>The boundaries</h2><p class="muted small">Saved firm exclusions remain active. Tonight's extra boundaries apply to this session only.</p>${chips('exclusions',boundaries,session.exclusions,'session-chip')}<h3 class="section">Source language requirement</h3>${chips('requiredLanguages',languages,session.requiredLanguages,'session-chip')}<p class="small muted section">Choosing several options means at least one must be listed in the source metadata. Current audio/subtitle tracks are unverified.</p><div class="notice">Active profile exclusions: ${esc([...new Set(viewers().flatMap(p => p.exclusions))].join(', ') || 'None')}</div></section></div><div class="row section">${btn('Find our common ground →','rank','','primary')}${btn('Back','nav','home')}</div>`;
}
function fitLines(score) {
  return score.viewers.map(v => `<div class="fitline"><span class="fit-person">${avatarHTML(state.profiles.find(p=>p.id===v.profileId)||{id:v.profileId,alias:name(v.profileId)})}${esc(name(v.profileId))}${v.limitedPreferences ? ' · limited preferences' : ''}</span><strong>${Math.round(v.score)} / 100</strong></div><meter min="0" max="100" value="${v.score}" aria-label="${esc(name(v.profileId))} fit">${Math.round(v.score)}</meter>`).join('');
}
function reasons(score, title) {
  const positive = score.viewers.map(v => {
    const matches = v.components.flatMap(c => c.matched);
    return matches.length ? `${name(v.profileId)}: ${[...new Set(matches)].join(', ')}` : `${name(v.profileId)}: no strong match expressed`;
  });
  const weakest = [...score.viewers].sort((a,b) => a.score-b.score)[0];
  return `<p class="reason">${esc(positive.join(' · '))}</p><p class="small muted">${session.maxMinutes ? `Fits the ${session.maxMinutes}-minute limit. ` : ''}${weakest.score < 70 ? `Tradeoff: a weaker match for ${esc(name(weakest.profileId))}.` : 'A strong preference match across this group.'}${score.viewers.some(v => v.components.some(c => c.unknown)) ? ' Some preference metadata is unknown.' : ''}</p>${score.fairnessBonus > 0 ? `<p class="small warning">Fairness bonus: +${score.fairnessBonus.toFixed(1)} ranking points, reflecting previous watched choices.</p>` : ''}`;
}
function card(score, index) {
  const t = titleById(score.titleId);
  return `<article class="panel card">${artworkHTML(t)}<div class="row spread"><span class="pill gold">${index === 0 ? 'OUR FIRST SUGGESTION' : 'ANOTHER WAY TOGETHER'}</span><span class="small muted">${t.runtimeMinutes ?? '?'} min</span></div><h2 class="section">${esc(t.title)}</h2><div class="row spread"><span class="muted small">Group preference fit</span><span class="score">${Math.round(score.groupFit)}<small> / 100</small></span></div>${fitLines(score)}${reasons(score,t)}<div class="actions row">${btn('Could this be tonight?','choose',t.id,'primary')}${btn(compared.includes(t.id) ? '✓ In comparison' : 'Compare','compare-pick',t.id)}${btn('About this title','title-info',t.id)}</div></article>`;
}
function resultsView() {
  const result = ranked(), shown = result.ranked.slice(shortlistOffset,shortlistOffset+3), proposal = negotiate({titles:allTitles(),profiles:viewers(),session,history:state.history});
  return `<div class="row spread"><div><p class="eyebrow">${session.rounds ? 'A different way forward' : 'Find your common ground'}</p><h1>A few good possibilities.</h1></div>${btn('Adjust tonight','nav','setup')}</div><p class="muted">${esc(viewers().map(p => p.alias).join(' + '))} · ${session.maxMinutes ? `${session.maxMinutes} minutes` : 'No time limit'} · ${session.mood || 'Any mood'}</p><div class="notice">${esc(catalogueNotice())} Fit scores reflect entered preferences, not programme quality or predicted enjoyment.</div>${session.rounds >= 2 ? '<p class="warning section">Two choices have met a firm no. It may help to revise tonight’s setup or pause the decision.</p>' : ''}${proposal.proposals.length?`<section class="panel section negotiation"><h2>Find a way forward</h2><p>${esc(proposal.message)}</p>${proposal.proposals.map((p,i)=>btn(p.label,'negotiation-proposal',String(i))).join('')}</section>`:''}<div class="grid section">${shown.map((score,i) => card(score,shortlistOffset+i)).join('')}</div>${!shown.length ? `<section class="panel section"><h2>No choice fits these boundaries yet.</h2><p>We have kept every firm exclusion. Nothing has been quietly relaxed.</p><p class="muted">${esc([...new Set(result.excluded.flatMap(t => t.blockers.map(b => b.type.replace(/-/g,' '))))].join(' · '))}</p><div class="row">${btn('Review tonight’s settings','nav','setup','','primary')}${btn('Add a title you know','nav','add')}</div></section>` : ''}<div class="row section">${result.ranked.length > 3 ? btn('Show another shortlist','more') : ''}${compared.length === 2 ? btn('Compare these two →','nav','compare','primary') : ''}${btn('Add a title','nav','add')}</div>`;
}
function compareView() {
  return `<p class="eyebrow">See the compromise side by side</p><h1>Which works better for you?</h1><div class="two">${compared.map((titleId,i) => card(resultById(titleId),i)).join('')}</div><div class="section">${btn('Return to shortlist','nav','results')}</div>`;
}
function agreementView() {
  const t = titleById(selectedTitle), score = resultById(selectedTitle);
  return `<p class="eyebrow">The people make the final choice</p><h1>Does this work for everyone?</h1>${consensusHTML(viewers(),session.votes)}<div class="two section"><section class="panel">${artworkHTML(t)}<h2>${esc(t.title)}</h2><p class="muted">${t.runtimeMinutes ?? '?'} minutes · ${esc(t.languages?.join(', ') || 'Language unknown')}</p>${fitLines(score)}${reasons(score,t)}</section><section class="panel"><p class="small muted">Pass the remote or record the group's stated responses together. These are shared-device responses, not private authenticated votes.</p>${viewers().map(p => `<div class="section"><h3 class="viewer-heading">${avatarHTML(p)}${esc(p.alias)} ${session.votes[p.id] === 'yes' ? '✓' : session.votes[p.id] === 'another' ? '· prefers another' : ''}</h3><div class="chips"><button data-action="vote" data-viewer="${esc(p.id)}" data-value="yes" aria-label="Works for me" aria-pressed="${session.votes[p.id] === 'yes'}">Works for me</button><button data-action="vote" data-viewer="${esc(p.id)}" data-value="another" aria-label="Prefer another" aria-pressed="${session.votes[p.id] === 'another'}">Prefer another</button><button data-action="vote" data-viewer="${esc(p.id)}" data-value="no">Firm no</button></div></div>`).join('')}<div class="section row">${viewers().every(p => session.votes[p.id] === 'yes') ? btn('Save our choice →','save-choice','','primary') : '<p class="small warning">Everyone needs to accept before this choice can be saved.</p>'}${btn('Look at alternatives','nav','results')}</div></section></div>`;
}
function historyView() {
  const rows = filteredHistory().map(r => `<article class="panel"><div class="row spread"><div><span class="pill">${r.status === 'watched' ? 'WATCHED' : 'CHOSEN · NOT MARKED WATCHED'}</span><h2 class="section">${esc(displayTitle(r.title))}</h2><p class="muted">${esc(r.participants.map(name).join(' + '))} · ${new Date(r.selectedAt).toLocaleDateString()}</p></div>${btn('Open evening →','open-record',r.sessionId)}</div></article>`).join('');
  return `<p class="eyebrow">Good evenings leave a little memory</p><h1>Our evenings.</h1><div class="two"><div><label for="history-search">Find a title, date, genre, viewer or note</label><input id="history-search" type="search" placeholder="Search your saved evenings" value="${esc(historyView.query || '')}"></div><div><label for="history-status">Show evenings</label><select id="history-status">${[['','All evenings'],['selected','Chosen, not watched'],['watched','Watched']].map(([value,label]) => `<option value="${value}" ${value === (historyView.status || '') ? 'selected' : ''}>${label}</option>`).join('')}</select></div></div><div class="stack section">${rows || `<section class="panel"><h2>${state.history.length ? 'No matching evenings.' : 'Your first evening is ahead.'}</h2><p class="muted">Saved choices, ratings and notes will appear here.</p>${btn('Start tonight','start','','primary')}</section>`}</div>`;
}
function filteredHistory() { const q = (historyView.query || '').toLowerCase(); return state.history.filter(r => (!historyView.status || r.status === historyView.status) && `${r.title.title} ${displayTitle(r.title)} ${r.title.genres.join(' ')} ${new Date(r.selectedAt).toISOString().slice(0,10)} ${r.participants.map(name).join(' ')} ${Object.values(r.feedback).map(f => f.note).join(' ')}`.toLowerCase().includes(q)); }
function recordView() {
  const r = state.history.find(r => r.sessionId === selectedRecord);
  if (!r) return '<h1>This evening is no longer saved.</h1>';
  return `<div class="record-heading"><div><p class="eyebrow">Your shared memory</p><h1>${esc(displayTitle(r.title))}</h1></div>${artworkHTML(r.title)}</div>${consensusHTML(r.participants.map(id=>state.profiles.find(p=>p.id===id)).filter(Boolean),r.votes,true)}<div class="row">${badge(r.status)}${badge(new Date(r.selectedAt).toLocaleDateString())}${badge(`Group fit at selection: ${Math.round(r.score.groupFit)}`)}</div><p class="muted section">${esc(r.participants.map(name).join(' + '))}. ${esc(titleDescription(r.title))}</p>${r.status !== 'watched' ? `<div class="panel"><h2>Chosen is different from watched.</h2><p class="muted">Only mark this watched after viewing. Fairness history uses watched evenings.</p>${btn('We watched this','watched',r.sessionId,'primary')}</div>` : `<div class="grid">${r.participants.map(p => { const f = r.feedback[p] || {}; return `<section class="panel"><h2>${esc(name(p))}</h2><label for="rating-${esc(p)}">Your rating</label><select id="rating-${esc(p)}"><option value="0">Choose your rating</option>${[1,2,3,4,5].map(n => `<option value="${n}" ${f.rating === n ? 'selected' : ''}>${n} / 5</option>`).join('')}</select><div class="field"><label for="note-${esc(p)}">Your own note (optional)</label><textarea id="note-${esc(p)}" maxlength="500">${esc(f.note || '')}</textarea></div>${btn('Save my reflection','feedback',p)}</section>`; }).join('')}</div>`}${r.title.illustrative?`<section class="panel section"><h2>Continue to the test provider</h2><p>A separate controlled service streams an original eight-second clip. It does not play this illustrative programme or connect to a commercial provider. No household data is passed.</p><label for="provider-scenario">Test provider situation</label><select id="provider-scenario">${['ready','sign-in','subscription','region','unavailable','expired','service-error'].map(s=>`<option>${s}</option>`).join('')}</select>${btn('Open test streaming provider →','provider','','primary')}</section>`:''}<div class="row section">${btn('Back to our evenings','nav','history')}${btn('Delete this evening','delete-record',r.sessionId,'danger')}</div>`;
}
function dataView() {
  return `<p class="eyebrow">Your household, your control</p><h1>A little memory.<br>Clear boundaries.</h1><div class="two"><section class="panel"><h2>What we save</h2><p>Profiles you enter, choices you accept, watched status and optional feedback. People using this device can see the household's records.</p><p class="muted">The Android build stores this in an app-private local file. Connected mode uses optional local network services; raw notes remain on this device. The app requests Internet permission for room participation and controlled test streaming. Remote-only decisions still work offline.</p><p class="small muted">No cloud backup or device-to-device sync. Uninstalling or resetting the device can erase records. This is not private storage between household members.</p></section><section class="panel"><h2>Keep only what you want.</h2><p class="muted">Delete individual profiles in Household, or individual choices in Our evenings. Clearing the household removes profiles, history and manually added titles. Bundled catalogue metadata remains. Active room closure is attempted; if the room service is unreachable, its session data expires within two hours.</p>${btn('Clear all household data','clear-all','','danger')}<div class="section">${btn('Explore feedback learning · synthetic lab','nav','learning')}${btn('Manage household','nav','household')}${btn('Manage added titles','nav','titles')}</div></section></div>`;
}
function addedTitlesView() {
  return `<p class="eyebrow">Your own catalogue</p><h1>Titles you brought along.</h1><p class="muted">Edit what you know. Unknown content stays unknown until you explicitly review it. Saved evenings keep their title snapshots.</p><div class="stack">${state.titles.map(t => `<section class="panel"><h2>${esc(t.title)}</h2><p class="muted">${t.runtimeMinutes ?? 'Unknown'} minutes · ${esc(t.genres.join(', '))}</p><div class="row">${btn('Edit title','edit-title',t.id)}${btn('Remove title','remove-title',t.id,'danger')}</div></section>`).join('') || '<section class="panel"><p>No household-added titles yet. The bundled film records are still available for tonight.</p></section>'}</div><div class="row section">${btn('Add a household title','new-title','','primary')}${btn('Back to data controls','nav','data')}</div>`;
}
function addTitleView() {
  return `<p class="eyebrow">Bring something you already know</p><h1>Add a title.</h1><div class="panel form"><label for="new-title">Title</label><input id="new-title" maxlength="100" value="${esc(draft?.title || '')}" placeholder="Title you would like to consider"><div class="field"><label for="new-runtime">Runtime in minutes (optional)</label><input id="new-runtime" type="number" min="1" max="600" value="${draft?.runtimeMinutes ?? ''}" placeholder="Unknown"></div><h3>Genre tags</h3>${chips('genres',genres,draft?.genres || [],'title-chip')}<h3>Mood tags</h3>${chips('moods',moods,draft?.moods || [],'title-chip')}<h3>Language metadata you know</h3>${chips('languages',languages,draft?.languages || [],'title-chip')}<h3>Content knowledge <span class="pill gold">Optional · household-entered</span></h3><p class="small muted">Only mark reviewed if you know whether this title includes each of these three themes. Select every theme it contains. This is your own information, not a certified safety assessment.</p>${chips('contentTags',boundaries,draft?.contentTags || [],'title-chip')}<div class="section"><button data-action="review-content" aria-pressed="${!!draft?.contentReviewed}">${draft?.contentReviewed ? '✓ I have reviewed all three themes' : 'I have reviewed all three themes'}</button></div><p class="notice section">Unreviewed content remains unknown and cannot pass a firm exclusion. No streaming availability or age suitability is guaranteed.</p><div class="row section">${btn('Save title','save-title','','primary')}${btn('Cancel','nav',titleReturn)}</div></div>`;
}
async function confirmAction(title, detail, action) {
  const dialog = document.createElement('dialog'); dialog.innerHTML = `<h2>${esc(title)}</h2><p>${esc(detail)}</p><div class="row"><button data-cancel>Keep it</button><button class="danger" data-confirm>Confirm</button></div>`;
  const previous = document.activeElement; document.body.appendChild(dialog); dialog.showModal();
  const close = () => { dialog.close(); dialog.remove(); previous?.focus(); };
  dialog.querySelector('[data-cancel]').onclick = close;
  dialog.querySelector('[data-confirm]').onclick = () => { close(); try { action(); } catch (e) { toast(e.message); } };
  dialog.addEventListener('cancel',e => { e.preventDefault(); close(); }); dialog.querySelector('[data-cancel]').focus();
}
function refreshKeepingFocus(action, value, field, viewer) {
  render(); const target = [...document.querySelectorAll('[data-action]')].find(el => el.dataset.action === action && el.dataset.value === value && (!field || el.dataset.field === field) && (!viewer || el.dataset.viewer === viewer)); target?.focus({preventScroll:true});
}
function showTitleInfo(titleId) {
  const t = titleById(titleId), dialog = document.createElement('dialog');
  dialog.innerHTML = `<p class="eyebrow">${t.illustrative ? 'Illustrative entry' : 'Know the source'}</p><h2>${esc(t.title)}</h2><p>${esc(t.synopsis || 'Metadata entered by your household.')}</p><p class="small muted">${esc(t.provenance)}</p>${t.sourceUrl ? `<p class="small">Source: ${esc(t.sourceUrl)}<br>Checked: ${esc(t.checkedAt)} · ${esc(t.licence)}</p>` : ''}<p class="small muted">${esc(t.languageScope || 'Language details are household-entered or illustrative.')} ${t.runtimeVariants?.length > 1 ? `Source durations: ${esc(t.runtimeVariants.join(', '))} minutes. We use the longest recorded version for time-limit filtering.` : ''}</p><p class="notice">${t.coveredExclusionTags.length ? 'Content coverage reflects the labelled fixture or household entry; it is not a parental-control certification.' : 'Content-exclusion coverage is unknown. This title cannot pass a firm content check.'}</p><button id="close-info" class="primary">Back to choices</button>`;
  const previous = document.activeElement; document.body.appendChild(dialog); dialog.showModal();
  const close = () => { dialog.close(); dialog.remove(); previous?.focus(); };
  dialog.querySelector('#close-info').onclick = close; dialog.addEventListener('cancel',e => {e.preventDefault();close();}); dialog.querySelector('button').focus();
}
document.addEventListener('click', e => {
  const input = e.target.closest('input,textarea');
  if (input && native?.editText) { native.editText(input.id,input.value,input.tagName === 'TEXTAREA'); return; }
  const b = e.target.closest('[data-action]'); if (!b) return;
  const { action, value, field, viewer } = b.dataset;
  try {
    if(action === 'connect-room') {
      if(!viewers().length)throw Error('Select at least one viewer.');
      const profiles=viewers(), ids=profiles.map(p=>p.id);
      const history=state.history.filter(r=>r.status==='watched').slice(0,30).map(r=>({sessionId:r.sessionId,titleId:r.titleId,title:{genres:r.title.genres},status:r.status,watchedAt:r.watchedAt,fits:Object.fromEntries(Object.entries(r.fits).filter(([id])=>ids.includes(id))),feedback:Object.fromEntries(Object.entries(r.feedback).filter(([id])=>ids.includes(id)).map(([id,f])=>[id,{rating:f.rating}]))}));
      go('connected');room.start({profiles,titles:allTitles(),session,history});
    } else if(action === 'lab-count') { learningView.count=Number(value);go('learning'); } else if(action === 'provider') { openProvider(selectedRecord);
    } else if(action === 'learning-toggle' || action === 'learning-reset') {
      commit({...state,profiles:state.profiles.map(p=>p.id!==value?p:action==='learning-toggle'?{...p,learningDisabled:!p.learningDisabled}:{...p,learningResetAt:Date.now()})});room.stop();go('household');
    } else if(action === 'negotiation-proposal') {
      const proposal=negotiate({titles:allTitles(),profiles:viewers(),session,history:state.history}).proposals[Number(value)];
      if(proposal)confirmAction(proposal.label,proposal.reason+' Earlier acceptances will be cleared.',()=>{session[proposal.field]=proposal.value;session.votes={};go('results');});
    } else if (action === 'nav') {
      if (value === 'add') { if (!session.viewers.length) throw new Error('Start a viewing session first.'); titleReturn = 'results'; draft = { genres: [], moods: [], languages: [], contentTags: [], contentReviewed: false }; delete focusMemory.add; }
      if (value === 'compare' && compared.length !== 2) return;
      go(value);
    } else if (action === 'start') { if (!state.profiles.length) go('household'); else { setSessionViewers(); go('setup'); } }
    else if (action === 'title-info') showTitleInfo(value);
    else if (action === 'new-title' || action === 'edit-title') {
      titleReturn = 'titles';
      draft = action === 'edit-title' ? copy(state.titles.find(t => t.id === value)) : { genres:[], moods:[], languages:[], contentTags:[], contentReviewed:false };
      draft.languages = draft.languages || []; delete focusMemory.add; go('add');
    }
    else if (action === 'remove-title') confirmAction('Remove this added title?', 'It will leave your catalogue. Saved evenings keep their snapshots; delete those evenings separately to remove them too.', () => { commit({...state,titles:state.titles.filter(t => t.id !== value)}); go('titles'); });
    else if (action === 'samples') {
      if (state.profiles.length) throw new Error('Sample setup is available only for an empty household.');
      commit({ ...emptyHousehold(), sample: true, profiles: sampleProfiles() }); toast('Sample household loaded'); go('home');
    } else if (action === 'new-profile' || action === 'edit-profile') {
      draft = action === 'edit-profile' ? copy(state.profiles.find(p => p.id === value)) : { id: id(), alias: nextViewerAlias(), genres: [], softDislikes: [], exclusions: [], preferredLanguages: [], requiredLanguages: [] }; delete focusMemory.profile; go('profile');
    } else if (action === 'profile-chip') { draft[field] = toggle(draft[field],value); refreshKeepingFocus(action,value,field); }
    else if (action === 'save-profile') { draft.alias = draft.alias.trim(); commit(saveProfile(state,draft)); room.stop(); session = freshSession(); toast('Viewer saved'); go('household'); }
    else if (action === 'delete-profile') confirmAction('Delete this viewer?', 'Their preferences, votes, ratings, notes and individual scores will be removed from saved history. Other viewers’ records remain.', () => { commit(deleteProfile(state,value)); room.stop(); session = freshSession(); go('household'); });
    else if (action === 'viewer') { session.viewers = toggle(session.viewers,value); session.votes = {}; refreshKeepingFocus(action,value); }
    else if (action === 'mood') { session.mood = value; session.votes = {}; refreshKeepingFocus(action,value); }
    else if (action === 'session-chip') { session[field] = toggle(session[field],value); session.votes = {}; refreshKeepingFocus(action,value,field); }
    else if (action === 'rank') { if (!viewers().length) throw new Error('Choose at least one viewer.'); shortlistOffset = 0; compared = []; session.votes = {}; go('results'); }
    else if (action === 'more') { shortlistOffset = shortlistOffset + 3 >= ranked().ranked.length ? 0 : shortlistOffset + 3; render(); }
    else if (action === 'compare-pick') { compared = compared.includes(value) ? compared.filter(t => t !== value) : [...compared.slice(-1),value]; refreshKeepingFocus(action,value); }
    else if (action === 'choose') { selectedTitle = value; session.votes = {}; go('agreement'); }
    else if (action === 'vote') {
      if (value === 'no') { session.rejectedTitleIds.push(selectedTitle); session.rounds++; session.votes = {}; compared = []; shortlistOffset = 0; toast('Firm no respected. That title is out for tonight.'); go('results'); }
      else { session.votes[viewer] = value; refreshKeepingFocus(action,value,undefined,viewer); }
    } else if (action === 'save-choice') {
      const next = recordChoice(state,{ sessionId: session.sessionId, title: titleById(selectedTitle), score: resultById(selectedTitle), participants: [...session.viewers], votes: session.votes });
      commit(next); selectedRecord = session.sessionId; session = freshSession(); toast('Your choice is saved'); go('record');
    } else if (action === 'open-record') { selectedRecord = value; go('record'); }
    else if (action === 'watched') { commit(markWatched(state,value)); toast('Marked watched. Add your own thoughts below.'); render(); }
    else if (action === 'feedback') { commit(saveFeedback(state,selectedRecord,value,Number(document.getElementById(`rating-${value}`).value),document.getElementById(`note-${value}`).value)); toast('Reflection saved'); }
    else if (action === 'delete-record') confirmAction('Delete this evening?', 'This also removes its ratings, notes and fairness evidence.', () => { commit({...state, history: state.history.filter(r => r.sessionId !== value)}); room.stop(); go('history'); });
    else if (action === 'clear-all') confirmAction('Clear the household?', 'All profiles, choices, feedback and manually added titles will be deleted from this app. This cannot be undone.', () => { commit(emptyHousehold()); room.stop(); session = freshSession(); go('home'); });
    else if (action === 'title-chip') {
      const title = $('#new-title').value, runtime = $('#new-runtime').value;
      draft[field] = toggle(draft[field],value); refreshKeepingFocus(action,value,field); $('#new-title').value = title; $('#new-runtime').value = runtime;
    } else if (action === 'review-content') {
      const title = $('#new-title').value, runtime = $('#new-runtime').value;
      draft.contentReviewed = !draft.contentReviewed; render(); $('#new-title').value = title; $('#new-runtime').value = runtime; $('[data-action="review-content"]').focus();
    } else if (action === 'save-title') {
      const title = $('#new-title').value.trim(), rawRuntime = $('#new-runtime').value;
      if (!title) throw new Error('Enter a title.');
      const runtimeMinutes = rawRuntime ? Number(rawRuntime) : null;
      if (runtimeMinutes != null && (!Number.isInteger(runtimeMinutes) || runtimeMinutes < 1 || runtimeMinutes > 600)) throw new Error('Runtime must be 1–600 minutes, or leave it unknown.');
      const record = { ...draft, id:draft.id || id(), title, runtimeMinutes, languages:draft.languages.length ? draft.languages : undefined, contentTags:draft.contentTags, coveredExclusionTags:draft.contentReviewed ? [...boundaries] : [], illustrative:false, provenance:'Manually entered by household; content coverage is a household assertion when explicitly reviewed. No availability or safety certification.' };
      commit({...state,titles:[...state.titles.filter(t => t.id !== record.id),record]});
      toast('Title saved with the knowledge you entered.'); go(titleReturn);
    }
  } catch (error) { toast(error.message); }
});
document.addEventListener('input',e => {
  if (e.target.dataset.edit && draft) draft[e.target.dataset.edit] = e.target.value;
  if (e.target.id === 'history-search') { const q = e.target.value; historyView.query = q; render(); const input = $('#history-search'); input.focus(); input.setSelectionRange(q.length,q.length); }
});
document.addEventListener('change',e => {
  if (e.target.dataset.session === 'maxMinutes') { session.maxMinutes = Number(e.target.value) || null; session.votes = {}; }
  if (e.target.id === 'history-status') { historyView.status = e.target.value; render(); $('#history-status').focus(); }
});
window.acceptNativeText = (elementId,value) => { const input = document.getElementById(elementId); if (input) { input.value = value; input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); } };
window.tonightBack = () => {
  const modal = $('dialog[open]'); if (modal) { modal.dispatchEvent(new Event('cancel',{cancelable:true})); return true; }
  if(route==='connected') { room.stop(); go('setup'); return true; }
  const previous = { profile:'household', household:'home', setup:'home', results:'setup', compare:'results', agreement:'results', record:'history', history:'home', data:'home', add:titleReturn, titles:'data', learning:'data' }[route];
  if (previous) { go(previous); return true; } return false;
};
function moveFocus(key) {
  const modal = $('dialog[open]'), scope = modal || $('#app');
  const controls = [...scope.querySelectorAll('button:not(:disabled),input,select,textarea')].filter(el => el.offsetWidth && el.offsetHeight);
  const current = document.activeElement;
  if (!controls.includes(current)) { controls[0]?.focus(); return; }
  if (key === 'Enter') { current.click(); return; }
  if (current.tagName === 'SELECT') { const direction = key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1; if (key === 'ArrowLeft' || key === 'ArrowRight') { current.selectedIndex = Math.max(0,Math.min(current.options.length-1,current.selectedIndex+direction)); current.dispatchEvent(new Event('change',{bubbles:true})); return; } }
  const rect = current.getBoundingClientRect(), cx = rect.x + rect.width/2, cy = rect.y + rect.height/2;
  const horizontal = key === 'ArrowLeft' || key === 'ArrowRight', sign = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
  const candidates = controls.filter(el => el !== current).map(el => { const r = el.getBoundingClientRect(), dx = r.x+r.width/2-cx, dy=r.y+r.height/2-cy; return {el,primary:(horizontal ? dx:dy)*sign,secondary:Math.abs(horizontal?dy:dx)}; }).filter(c => c.primary > 4).sort((a,b) => (a.primary+a.secondary*3)-(b.primary+b.secondary*3));
  if (candidates.length) { candidates[0].el.focus({preventScroll:true}); candidates[0].el.scrollIntoView({block:'nearest',inline:'nearest'}); }
}
window.tonightKey = key => moveFocus(key);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'BrowserBack') { e.preventDefault(); window.tonightBack(); return; }
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); moveFocus(e.key); }
});
function showRecovery(error) {
  const reason = error.message.includes('unsupported') ? 'This saved format is different from the version this app can open.' : 'The saved household could not be read safely.';
  $('#app').innerHTML = `<main><section class="panel error"><p class="eyebrow">Your original data is preserved</p><h1>We couldn't open your household.</h1><p>${reason}</p><p>Close and reopen the app to retry. Reset only if you are ready to delete the saved record.</p><button id="recovery-reset" class="danger">Delete saved data and start again</button></section></main>`;
  $('#recovery-reset').onclick = () => confirmAction('Delete saved data?', 'This cannot be undone. The original saved record will be replaced with an empty household.', () => {
    try {
      if (!adapter.write(JSON.stringify(emptyHousehold()))) throw new Error('Reset failed');
      store = createStore(adapter); state = store.get(); session = freshSession(); go('home');
    } catch { throw new Error('Could not reset the saved record. Close and reopen the app to retry.'); }
  });
  $('#recovery-reset').focus();
}
if (store) render();








async function openProvider(recordId) {
 try { const r=state.history.find(r=>r.sessionId===recordId); if(!r?.title.illustrative)throw Error('Test provider is only for labelled illustrative entries.');
 const scenario=document.querySelector('#provider-scenario')?.value||'ready';
 const response=await fetch('http://127.0.0.1:4183/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:r.titleId,scenario})});
 const data=await response.json();if(!response.ok)throw Error(data.error);
 if(native?.openProvider)native.openProvider(data.ticket);else window.open('http://127.0.0.1:4183/watch?ticket='+encodeURIComponent(data.ticket),'_blank','noopener');
 }catch(error){toast('Provider unavailable. Your saved choice is unchanged. '+error.message);}
}
window.onProviderResult=result=>toast(result==='missing'?'Test provider is not installed. Your saved choice is safe.':result==='invalid'?'The test link was rejected.':'Opening the controlled test provider.');
document.addEventListener('click',async e=>{const b=e.target.closest('[data-room]');if(!b)return;try{const action=b.dataset.room;if(action==='exit'){await room.stop();go('setup');}else if(action==='history'){go('record');}else if(action==='retry'){room.start(room.input);}else if(action==='recover-save'){room.acceptDecision();render();}else if(action==='proposal'){const p=room.view.negotiation.proposals[Number(b.dataset.index)];confirmAction(p.label,p.reason+' Everyone must accept again.',()=>room.command('proposal',{index:Number(b.dataset.index)}).catch(e=>toast(e.message)));}else await room.command(action,{personId:b.dataset.person,profileId:b.dataset.profile,titleId:b.dataset.title,vote:b.dataset.vote});}catch(error){toast(error.message);}});


function learningView(){
 const count=learningView.count||0, profile={id:'lab',alias:'Synthetic viewer',genres:[],softDislikes:[],exclusions:[],preferredLanguages:[],requiredLanguages:[]};
 const titles=[{...catalogue[1],id:'lab-comedy',title:'Synthetic comedy choice',genres:['comedy']},{...catalogue[2],id:'lab-drama',title:'Synthetic drama choice',genres:['drama']}];
 const history=Array.from({length:count},(_,i)=>({sessionId:'lab-'+i,titleId:'lab-comedy',title:titles[0],status:'watched',watchedAt:(i+1)*1000,feedback:{lab:{rating:5}},fits:{lab:50}}));
 const result=rankTitles({titles,profiles:[profile],history,session:{}});
 return '<p class="eyebrow">Synthetic learning lab · not household observations</p><h1>See what explicit feedback changes.</h1><p>This temporary demonstration has no declared preferences. Two explicit watched ratings are required before a genre adjustment is applied. It writes no profiles or history.</p><div class="row">'+[0,1,2].map(n=>btn(n+' synthetic rated evenings','lab-count',String(n))).join('')+'</div><div class="two section">'+result.ranked.map(s=>'<section class="panel"><h2>'+titles.find(t=>t.id===s.titleId).title+'</h2><p>Declared preference fit: '+s.groupFit+'</p><p>Feedback adjustment: '+s.adaptationBonus.toFixed(1)+'</p><p>Fairness: '+s.fairnessBonus.toFixed(1)+'</p><p>Ranking total: '+s.rankScore.toFixed(1)+'</p></section>').join('')+'</div><p class="notice section">'+count+' labelled synthetic ratings. Real learning uses only voluntary individual ratings on explicitly watched records. Disable/reset learning in Household; deleting evidence removes its contribution.</p>'+btn('Back to data controls','nav','data');
}
