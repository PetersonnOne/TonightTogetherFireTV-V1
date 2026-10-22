import {sampleName} from '../src/sample-titles.js';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {json,body,cors} from './http.mjs';
const root=resolve(import.meta.dirname,'..');
export const scenarios=['ready','sign-in','subscription','region','unavailable','expired','service-error'];
export function providerServer({clip=resolve(root,'provider/media/test-clip.mp4'),now=()=>Date.now()}={}){
 const key=randomBytes(32),sign=s=>createHmac('sha256',key).update(s).digest('hex');
 function ticket(id,scenario){const data=Buffer.from(JSON.stringify({id,scenario,expires:now()+(scenario==='expired'?-1:120000)})).toString('base64url');return data+'.'+sign(data);}
 function verify(value){const [data,sig]=String(value||'').split('.');if(!sig||sig.length!==64||!timingSafeEqual(Buffer.from(sign(data)),Buffer.from(sig)))throw Object.assign(Error('Invalid provider link.'),{status:403});const p=JSON.parse(Buffer.from(data,'base64url'));if(now()>p.expires)throw Object.assign(Error('This test link expired. Request a fresh link from Tonight Together.'),{status:410});return p;}
 return createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://127.0.0.1:4183');
   if(!cors(req,res,['http://127.0.0.1:4181','http://localhost:4181','http://127.0.0.1:4183','https://tonight.local']))return;
   if(req.method==='POST'&&url.pathname==='/tickets'){const p=await body(req);if(!/^(sample-\d{2}|Q\d+|[a-z0-9-]{1,80})$/.test(p.id||'')||!scenarios.includes(p.scenario))return json(res,400,{error:'Invalid test title or situation.'});return json(res,201,{ticket:ticket(p.id,p.scenario)});}
   if(url.pathname==='/resolve'){const p=verify(url.searchParams.get('ticket'));if(p.scenario==='service-error')return json(res,503,{error:'Injected test-provider outage. Your saved evening is safe.'});return json(res,200,{...p,testProvider:true,displayName:sampleName(p.id)||'Controlled test selection',clipSeconds:8,stream:`/media/test-clip.mp4?ticket=${encodeURIComponent(url.searchParams.get('ticket'))}`});}
   if(url.pathname==='/media/test-clip.mp4'){
    const p=verify(url.searchParams.get('ticket'));if(p.scenario!=='ready')return json(res,403,{error:'This simulated entitlement does not allow playback.'});
    const info=await stat(clip),range=req.headers.range;
    if(range){const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
     const start=m[1]?Number(m[1]):Math.max(0,info.size-Number(m[2])),end=m[1]?(m[2]?Math.min(Number(m[2]),info.size-1):info.size-1):info.size-1;
     if(start>=info.size||start>end){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
     res.writeHead(206,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1,'Cache-Control':'no-store'});if(req.method==='HEAD')return res.end();return createReadStream(clip,{start,end}).pipe(res);
    }
    res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':info.size,'Accept-Ranges':'bytes','Cache-Control':'no-store'});if(req.method==='HEAD')return res.end();return createReadStream(clip).pipe(res);
   }
   const assets={'/watch':'provider/index.html','/player.js':'provider/player.js','/style.css':'web/style.css','/poster.svg':'provider/media/shared-evening.svg'};
   if(req.method==='GET'&&assets[url.pathname]){const data=await readFile(resolve(root,assets[url.pathname]));res.writeHead(200,{'Content-Type':url.pathname.endsWith('.js')?'application/javascript':url.pathname.endsWith('.css')?'text/css':url.pathname.endsWith('.svg')?'image/svg+xml':'text/html','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'"});return res.end(data);}
   json(res,404,{error:'Not found.'});
  }catch(error){json(res,error.status||400,{error:error.message});}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)providerServer().listen(4183,'127.0.0.1',()=>console.log('Controlled streaming provider: http://127.0.0.1:4183. Test media only.'));
