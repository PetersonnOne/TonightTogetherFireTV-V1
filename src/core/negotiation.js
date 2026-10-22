import { rankAdaptive } from './adaptation.js';
export function negotiate(input) {
  const result=rankAdaptive(input), proposals=[];
  if(input.session.maxMinutes && input.session.maxMinutes<120) {
    const next=[30,60,90,120].find(n=>n>input.session.maxMinutes);
    const count=rankAdaptive({...input,session:{...input.session,maxMinutes:next}}).ranked.length;
    if(count>result.ranked.length) proposals.push({field:'maxMinutes',value:next,label:`Would ${next} minutes work tonight?`,reason:`${count} eligible choices, with every firm exclusion still active.`});
  }
  if(input.session.mood) {
    const alternative=rankAdaptive({...input,session:{...input.session,mood:''}});
    if(alternative.ranked[0]?.minimumFit>(result.ranked[0]?.minimumFit??0)) proposals.push({field:'mood',value:'',label:'Would another mood work?',reason:'Removing the soft mood preference improves the least-served viewer’s fit.'});
  }
  const blockers=[...new Set(result.excluded.flatMap(r=>r.blockers.map(b=>b.type)))];
  return {proposals,blockers,message:result.ranked.length ? 'Compare who benefits and who compromises. A score is not a prediction of enjoyment.' : 'No title meets every firm requirement. Add a reviewed title, deliberately revise tonight, or pause. Unknown content stays unknown.'};
}
