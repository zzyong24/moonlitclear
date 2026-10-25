import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const registry = JSON.parse(fs.readFileSync('design/visuals/registry.json', 'utf8'));
const out = 'public/brand/generated';
fs.mkdirSync(out, { recursive: true });
const assets = {};
const expected = new Set();
for (const [id, item] of Object.entries(registry.assets)) {
  const source = path.join('design/visuals', item.source);
  const bytes = fs.readFileSync(source);
  const sourceHash = sha(bytes);
  const meta = await sharp(bytes).metadata();
  if (!meta.width || !meta.height || !['png', 'webp', 'jpeg'].includes(meta.format)) throw Error('无效位图：' + id);
  const variants = [];
  for (const width of item.kind === 'atlas' ? [800, 1600] : [480, 800, 1600]) {
    const name = `${id}-${sourceHash.slice(0, 12)}-${width}.webp`;
    expected.add(name);
    const buffer = await sharp(bytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
    const result = await sharp(buffer).metadata();
    if (!fs.existsSync(path.join(out, name)) || sha(fs.readFileSync(path.join(out, name))) !== sha(buffer))
      fs.writeFileSync(path.join(out, name), buffer);
    variants.push({
      url: '/brand/generated/' + name,
      width: result.width,
      height: result.height,
      bytes: buffer.length,
      sha256: sha(buffer),
    });
  }
  let og;
  if (item.kind === 'editorial') {
    const name = `${id}-${sourceHash.slice(0, 12)}-og.jpg`;
    expected.add(name);
    const buffer = await sharp(bytes)
      .rotate()
      .resize({ width: 1200, height: 630, fit: 'contain', background: '#f7f6ef' })
      .jpeg({ quality: 88 })
      .toBuffer();
    fs.writeFileSync(path.join(out, name), buffer);
    og = { url: '/brand/generated/' + name, width: 1200, height: 630, bytes: buffer.length, sha256: sha(buffer) };
  }
  assets[id] = {
    kind: item.kind,
    alt: item.alt,
    source,
    sourceHash,
    width: meta.width,
    height: meta.height,
    variants,
    og,
  };
}
// Preserve superseded outputs outside public so rejected variants cannot enter a release.
for (const entry of fs.readdirSync(out, { withFileTypes: true })) {
  if (!entry.isFile() || expected.has(entry.name)) continue;
  const archive = '.content-cache/unused-brand/' + crypto.randomUUID();
  fs.mkdirSync(archive, { recursive: true });
  fs.renameSync(path.join(out, entry.name), path.join(archive, entry.name));
}
const manifest = JSON.stringify({ version: registry.version, generator: registry.generator, assets }, null, 2) + '\n';
const target = 'src/data/generated-visuals.json';
if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== manifest) {
  fs.writeFileSync(target + '.tmp', manifest);
  fs.renameSync(target + '.tmp', target);
}
console.log(`已导出 ${Object.keys(assets).length} 件文生图素材；仅转换尺寸和文件格式，不绘制主体。`);
