const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const identityTone=id=>[...String(id||'')].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0)%6;
export function avatarHTML(profile){
 const words=String(profile?.alias||'?').trim().split(/\s+/);
 const initials=(words.length>1?words[0][0]+words[words.length-1][0]:words[0].slice(0,2)).toUpperCase();
 return `<span class="avatar" data-tone="${identityTone(profile?.id)}" aria-hidden="true">${esc(initials)}</span>`;
}
export function artworkHTML(title){
 const kind=['comedy','documentary','drama','adventure','animation','mystery'].indexOf(title?.genres?.[0]);
 const n=Math.max(0,kind),id='art-'+String(title?.id||'unknown').replace(/[^a-zA-Z0-9_-]/g,''),shift=identityTone(title?.id)*17;
 const colors=[['#624238','#eebf86'],['#173f50','#8bd2ca'],['#403250','#efa5a2'],['#243f48','#e6c48a'],['#3c3764','#b8b3f4'],['#1c3048','#92b9d8']][n];
 const scenes=[
  '<path d="M0 0h95v280H0zM505 0h95v280h-95z" fill="#211e30" opacity=".7"/><path d="M95 0l22 280M505 0l-22 280" stroke="#f0cb8b" opacity=".3"/><ellipse cx="300" cy="244" rx="130" ry="22" fill="#f5dba2" opacity=".18"/><path d="M230 215v-85q0-60 70-60t70 60v85" fill="#10232c"/><circle cx="278" cy="136" r="8" fill="#f3d7ac"/><circle cx="323" cy="136" r="8" fill="#f3d7ac"/><path d="M270 165q30 32 60 0" fill="none" stroke="#f3d7ac" stroke-width="6"/>',
  '<path d="M0 240L130 90l120 150L400 62l200 178v40H0" fill="#173139"/><path d="M0 268l210-105 160 105 155-140 75 140" fill="#264c4b"/><path d="M400 62l-44 49 36-12 24 19 9-27" fill="#dbe9db" opacity=".8"/>',
  '<path d="M65 260V108h78v152m35 0V75h88v185m32 0V125h65v135m36 0V88h110v172" stroke="#1b2639" stroke-width="43"/><g fill="#f4ca93"><path d="M191 90h9v17h-9zm28 0h9v17h-9zm-28 38h9v17h-9zm218-30h12v20h-12zm35 0h12v20h-12zm-35 40h12v20h-12zm35 0h12v20h-12z"/></g><path d="M0 256h600" stroke="#f2c597" stroke-width="2" opacity=".4"/>',
  '<path d="M0 250L170 65l150 180L460 105l140 145v30H0" fill="#183238"/><path d="M0 280l190-116 138 116 155-69 117 69" fill="#31544d"/><path d="M290 280q95-45 42-75t51-45" fill="none" stroke="#e2c79b" stroke-width="9" opacity=".6"/><path d="M170 65l-34 42 33-12 27 8" fill="#f3dfb8"/>',
  '<ellipse cx="300" cy="155" rx="170" ry="38" fill="none" stroke="#d7c4fa" stroke-width="4" transform="rotate(-24 300 155)"/><circle cx="300" cy="155" r="65" fill="#a2b7b8"/><path d="M250 126q48-35 95 8m-104 37q68 25 119-1" stroke="#d8e9cd" stroke-width="12" opacity=".55"/><circle cx="440" cy="62" r="17" fill="#eccb9d"/><path d="M122 70l72 40" stroke="#f6d8ad" stroke-width="3"/>',
  '<path d="M205 280V140a95 95 0 01190 0v140" fill="#172633" stroke="#6d91a2" stroke-width="3"/><path d="M235 280V145a65 65 0 01130 0v135" fill="#101c2b"/><circle cx="300" cy="155" r="26" fill="#c0c4c3"/><path d="M290 170l-13 60h46l-13-60" fill="#c0c4c3"/><path d="M95 280l140-70m270 70l-140-70" stroke="#7293a2" opacity=".3"/>'
 ][n];
 return `<div class="art genre-${n}" aria-label="Original ${esc(title?.genres?.[0]||'genre')} illustration"><svg viewBox="0 0 600 280" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="#101f2c"/></linearGradient></defs><path fill="url(#${id})" d="M0 0h600v280H0z"/><circle cx="${460-shift}" cy="${65+shift/3}" r="${28+n*4}" fill="${colors[1]}" opacity=".8"/><g fill="#f3e4bc" opacity=".6"><circle cx="135" cy="42" r="2"/><circle cx="530" cy="128" r="2"/><circle cx="54" cy="90" r="2"/></g>${scenes}</svg><span class="art-kicker">Original genre art</span><b>${esc((title?.genres||[]).join(' / '))}</b></div>`;
}
export function consensusHTML(profiles,votes={},saved=false){
 const total=profiles.length,yes=profiles.filter(p=>votes[p.id]==='yes').length,all=total>0&&yes===total;
 return `<section class="consensus ${saved?'is-saved':all?'is-agreed':''}" aria-label="Household agreement"><div class="row spread"><div><p class="eyebrow">${saved?'An evening to share':all?'Common ground found':'Every voice counts'}</p><h2>${saved?'Your evening is saved.':all?'Everyone accepts this choice.':`${yes} of ${total} ready for this choice`}</h2></div><span class="consensus-seal" aria-hidden="true">${saved||all?'✓':'◌'}</span></div><div class="response-line">${profiles.map(p=>`<span class="response ${votes[p.id]==='yes'?'accepted':''}">${avatarHTML(p)}<span>${esc(p.alias)}<small>${votes[p.id]==='yes'?'✓ Accepted':votes[p.id]==='another'?'Prefers another':votes[p.id]==='no'?'Firm no':'Waiting'}</small></span></span>`).join('')}</div><p class="small muted">${saved?'Saved is separate from watched.':all?'Save this current agreement when you are ready.':'A different choice or changed needs will require fresh responses.'}</p></section>`;
}
