import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const redirects = JSON.parse(fs.readFileSync(new URL('./redirects.json', import.meta.url), 'utf8'));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }
  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ ok: true, site: 'moonlitclear-astrowind' }));
    return;
  }
  const redirect = redirects[pathname.toLowerCase()] || redirects[pathname];
  if (redirect) {
    res.writeHead(308, { Location: encodeURI(redirect) });
    res.end();
    return;
  }
  if (pathname.includes('\0') || pathname.split('/').some((p) => p.startsWith('.'))) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  let target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  let status = 200;
  try {
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.statSync(target).isFile()) throw Error();
  } catch {
    target = path.join(root, '404.html');
    status = 404;
  }
  const type = mime[path.extname(target)] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', pathname.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'no-cache');
  if (process.env.PREVIEW_NOINDEX === '1') res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const accept = req.headers['accept-encoding'] || '';
  res.setHeader('Vary', 'Accept-Encoding');
  if (/\bbr\b/.test(accept) && fs.existsSync(target + '.br')) {
    target += '.br';
    res.setHeader('Content-Encoding', 'br');
  } else if (/\bgzip\b/.test(accept) && fs.existsSync(target + '.gz')) {
    target += '.gz';
    res.setHeader('Content-Encoding', 'gzip');
  }
  try {
    const stat = fs.statSync(target);
    if (status === 200 && type.startsWith('video/')) {
      res.setHeader('Accept-Ranges', 'bytes');
      const range = req.method === 'GET' && req.headers.range;
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        let start = match?.[1] ? Number(match[1]) : 0;
        let end = match?.[2] ? Number(match[2]) : stat.size - 1;
        if (match && !match[1] && match[2]) {
          start = Math.max(0, stat.size - Number(match[2]));
          end = stat.size - 1;
        }
        if (
          !match ||
          (!match[1] && !match[2]) ||
          !Number.isSafeInteger(start) ||
          !Number.isSafeInteger(end) ||
          start >= stat.size ||
          start > end
        ) {
          res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
          res.end();
          return;
        }
        end = Math.min(end, stat.size - 1);
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Content-Length': end - start + 1,
        });
        fs.createReadStream(target, { start, end })
          .on('error', () => res.destroy())
          .pipe(res);
        return;
      }
    }
    res.writeHead(status, { 'Content-Length': stat.size });
    if (req.method === 'HEAD') res.end();
    else
      fs.createReadStream(target)
        .on('error', () => res.destroy())
        .pipe(res);
  } catch {
    res.writeHead(503);
    res.end('Build unavailable');
  }
});
server.listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1', () =>
  console.log(`moonlitclear-astrowind http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3001}`)
);
