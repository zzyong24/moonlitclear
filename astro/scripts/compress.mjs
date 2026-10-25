import fs from 'node:fs';
import path from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) walk(p);
    else if (/\.(html|css|js|json|xml|svg)$/.test(p)) {
      const buf = fs.readFileSync(p);
      if (buf.length < 1024) continue;
      fs.writeFileSync(p + '.br', brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }));
      fs.writeFileSync(p + '.gz', gzipSync(buf, { level: 9 }));
    }
  }
}
walk('dist');
console.log('已生成静态 Brotli / gzip 资源。');
