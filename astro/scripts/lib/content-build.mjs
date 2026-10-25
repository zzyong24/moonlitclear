import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { digest, readJson } from './content-sources.mjs';

export function validateSnapshot(root, manifest) {
  if (manifest.schemaVersion !== 2 || !/^[a-f0-9]{64}$/.test(manifest.generation)) throw Error('无效内容快照');
  const dir = path.join(root, '.content-cache', manifest.generation);
  for (const file of manifest.files) {
    if (
      !/^(posts|assets)\//.test(file.path) ||
      file.path.split('/').some((n) => n === '..') ||
      file.path.includes('\\')
    )
      throw Error('无效快照路径：' + file.path);
    const p = path.join(dir, file.path);
    if (!fs.existsSync(p) || digest(fs.readFileSync(p)) !== file.sha256)
      throw Error('内容快照被修改或缺失：' + file.path);
  }
  return dir;
}

export async function buildSnapshot(plan, { root = process.cwd() } = {}) {
  const cacheRoot = path.join(root, '.content-cache');
  fs.mkdirSync(cacheRoot, { recursive: true });
  const generation = plan.fingerprint;
  const dir = path.join(cacheRoot, generation);
  let manifest;
  if (fs.existsSync(path.join(dir, 'manifest.json'))) {
    manifest = readJson(path.join(dir, 'manifest.json'));
    validateSnapshot(root, manifest);
  } else {
    const staging = fs.mkdtempSync(path.join(cacheRoot, 'preparing-'));
    fs.mkdirSync(path.join(staging, 'posts'));
    fs.mkdirSync(path.join(staging, 'assets'));
    const files = [],
      exported = [];
    for (const asset of plan.assets.values()) {
      // Process frozen bytes, not a changing source file. Preserve GIF frames so
      // article demos remain animated; all still images use optimized derivatives.
      let data, info;
      if (asset.format === 'gif') {
        data = asset.bytes;
        info = await sharp(asset.bytes, { limitInputPixels: 64000000 }).metadata();
      } else {
        let transform = sharp(asset.bytes, { limitInputPixels: 64000000 })
          .rotate()
          .resize({
            width: asset.width,
            height: asset.height,
            fit: asset.fit || 'inside',
            withoutEnlargement: true,
            background: '#faf8f2',
          });
        transform = asset.format === 'jpeg' ? transform.jpeg({ quality: 86 }) : transform.webp({ quality: 85 });
        ({ data, info } = await transform.toBuffer({ resolveWithObject: true }));
      }
      const relative = 'assets/' + asset.name;
      fs.writeFileSync(path.join(staging, relative), data);
      const sha256 = digest(data);
      files.push({ path: relative, sha256 });
      exported.push({
        name: asset.name,
        sha256,
        bytes: data.length,
        width: info.width,
        height: info.height,
        type: asset.format === 'jpeg' ? 'image/jpeg' : asset.format === 'gif' ? 'image/gif' : 'image/webp',
      });
    }
    for (const post of plan.posts) {
      const raw = '---\n' + yaml.dump(post.front, { lineWidth: -1 }) + '---\n' + post.body;
      const relative = 'posts/' + post.filename;
      fs.writeFileSync(path.join(staging, relative), raw);
      files.push({ path: relative, sha256: digest(raw) });
    }
    manifest = {
      schemaVersion: 2,
      mode: plan.mode,
      generation,
      posts: plan.posts.map((p) => p.entry),
      assets: exported,
      files,
      missingAssets: plan.missingAssets,
    };
    fs.writeFileSync(path.join(staging, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    fs.renameSync(staging, dir);
    validateSnapshot(root, manifest);
  }
  return manifest;
}

export function activateSnapshot(root, manifest) {
  validateSnapshot(root, manifest);
  const doc = path.join(root, 'docs/content-manifest.json');
  const raw = JSON.stringify(manifest, null, 2) + '\n';
  if (fs.existsSync(doc) && fs.readFileSync(doc, 'utf8') === raw) return false;
  fs.mkdirSync(path.dirname(doc), { recursive: true });
  const temp = doc + '.' + process.pid + '.tmp';
  fs.writeFileSync(temp, raw);
  fs.renameSync(temp, doc);
  fs.writeFileSync(
    path.join(root, 'docs/missing-source-assets.json'),
    JSON.stringify(manifest.missingAssets, null, 2) + '\n'
  );
  return true;
}
