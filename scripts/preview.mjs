import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname,'..');
createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://127.0.0.1');
    const part = decodeURIComponent(url.pathname);
    const path = resolve(root, part.startsWith('/src/') ? `.${part}` : `web/${part === '/' ? 'index.html' : part.slice(1)}`);
    const allowed = path.startsWith(root+sep+'web'+sep) || path.startsWith(root+sep+'src'+sep);
    if (!allowed) { res.writeHead(403).end(); return; }
    const data = await readFile(path);
    res.writeHead(200, {'Content-Type': ({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml'})[extname(path)] || 'text/plain', 'Cache-Control':'no-store'}); res.end(data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4181,'127.0.0.1',() => console.log('Tonight Together development preview: http://127.0.0.1:4181'));

