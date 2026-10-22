import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {networkInterfaces} from 'node:os';
import {pathToFileURL} from 'node:url';
import {Rooms} from './rooms.mjs';
import {json,body,cors} from './http.mjs';
const root=resolve(import.meta.dirname,'..');
export function roomServer({rooms=new Rooms(),publicBase='http://127.0.0.1:4182'}={}){
 const rate=new Map();
 return createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,publicBase),own=new URL(publicBase).origin;
   if(!cors(req,res,[own,'http://127.0.0.1:4181','http://localhost:4181','http://127.0.0.1:4182','https://tonight.local']))return;
   const key=req.socket.remoteAddress,now=Date.now();let entry=rate.get(key);if(!entry||now-entry.at>60000){entry={at:now,count:0};rate.set(key,entry);}if(++entry.count>600){json(res,429,{error:'Please wait before trying again.'});return;}
   if(url.pathname==='/config')return json(res,200,{joinBase:publicBase});
   if(req.method==='POST'&&url.pathname==='/rooms')return json(res,201,rooms.create(await body(req)));
   if(req.method==='POST'&&url.pathname==='/join')return json(res,200,rooms.join(await body(req)));
   const match=url.pathname.match(/^\/rooms\/([a-f0-9]{16})(\/commands)?$/);
   if(match){const token=(req.headers.authorization||'').replace(/^Bearer /,'');const r=rooms.get(match[1]);
    if(req.method==='GET'&&!match[2])return json(res,200,rooms.view(r,token));
    if(req.method==='POST'&&match[2])return json(res,200,rooms.command(match[1],token,await body(req)));
   }
   const assets={'/':'phone/index.html','/phone.js':'phone/phone.js','/style.css':'web/style.css','/src/catalogue.js':'src/catalogue.js','/src/sample-titles.js':'src/sample-titles.js','/presentation.js':'web/presentation.js'};
   if(req.method==='GET'&&assets[url.pathname]){const data=await readFile(resolve(root,assets[url.pathname]));res.writeHead(200,{'Content-Type':url.pathname.endsWith('.js')?'application/javascript':url.pathname.endsWith('.css')?'text/css':'text/html','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});return res.end(data);}
   json(res,404,{error:'Not found.'});
  }catch(error){json(res,error.status||400,{error:error.message});}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const lan=process.argv.includes('--lan'),ip=Object.values(networkInterfaces()).flat().find(n=>n.family==='IPv4'&&!n.internal&&!n.address.startsWith('169.254.'))?.address;
 const publicBase=process.env.ROOM_PUBLIC_URL||`http://${lan&&ip?ip:'127.0.0.1'}:4182`;
 roomServer({publicBase}).listen(4182,lan?'0.0.0.0':'127.0.0.1',()=>console.log(`Room service and participant page: ${publicBase}; local test environment, not a public cloud deployment.`));
}
