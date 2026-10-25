import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
const buildInfo = JSON.parse(fs.readFileSync('dist/build-info.json', 'utf8'));
if (buildInfo.mode !== 'public') throw Error('本地产物含预览文章，禁止打包发布。请先运行 npm run build。');
if (
  buildInfo.manifestHash !==
  crypto.createHash('sha256').update(fs.readFileSync('docs/content-manifest.json')).digest('hex')
)
  throw Error('内容清单与产物不匹配，请重新构建。');
if (
  buildInfo.visualManifestHash !==
  crypto.createHash('sha256').update(fs.readFileSync('src/data/generated-visuals.json')).digest('hex')
)
  throw Error('图片清单与产物不匹配，请重新构建。');
const id = 'moonlitclear-' + new Date().toISOString().replace(/[:.]/g, '-');
const output = path.resolve('releases');
fs.mkdirSync(output, { recursive: true });
const file = path.join(output, id + '.tar.gz');
execFileSync('tar', ['-czf', file, 'dist', 'serve.mjs', 'server.js', 'redirects.json']);
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
fs.writeFileSync(file + '.sha256', sha256 + '  ' + path.basename(file) + '\n');
console.log(JSON.stringify({ file, sha256, bytes: fs.statSync(file).size }, null, 2));
