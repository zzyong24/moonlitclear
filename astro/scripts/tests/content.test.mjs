import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { collectSources, rewriteMarkdown } from '../lib/content-sources.mjs';
import { buildSnapshot, activateSnapshot, validateSnapshot } from '../lib/content-build.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'moonlit-content-test-'));
  const external = path.join(root, 'creator');
  const work = path.join(external, 'works/2026/W-20260913-002-示例');
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect width="160" height="90" fill="#faf8f2"/><circle cx="90" cy="45" r="24" fill="#39ec88"/></svg>';
  const put = (file, raw) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, raw);
  };
  put(
    path.join(root, 'vault/writing/20260101_旧文章.md'),
    '---\ntitle: 旧文章\ncreated: 2026-01-01\npublish_slug: old-post\n---\n# 旧文章\n保留旧文。'
  );
  put(path.join(root, 'design/cover-sources/cover.svg'), svg);
  put(path.join(work, 'content/article/assets/有 空格.svg'), svg);
  const body = path.join(work, 'content/article/article.md');
  put(
    body,
    '# 试跑文章\n\n![图片](<assets/有 空格.svg>)\n\n> [!KEY] 有明确依据\n\n==保留意思==\n\n```md\n![代码不改](assets/missing.png)\n```\n'
  );
  const json = {
    id: 'W-20260913-002',
    artifacts: {
      articleDraft: {
        version: 'v01',
        status: 'draft',
        files: [{ role: 'content', path: 'content/article/article.md', scope: 'work' }],
      },
    },
  };
  put(path.join(work, 'work.json'), JSON.stringify(json));
  const entry = {
    id: json.id,
    source: { kind: 'moonlit-creator', artifact: 'articleDraft', version: 'v01' },
    slug: 'trial',
    visibility: 'preview',
    date: '2026-09-13',
    category: '方法',
    summary: '测试',
    cover: { source: 'design/cover-sources/cover.svg', template: 'mechanism', designVersion: 'v1', alt: '五层' },
  };
  const catalog = path.join(root, 'content/catalog/W-20260913-002.json');
  put(catalog, JSON.stringify(entry));
  return { root, external, work, body, catalog, entry, put };
}

test('preview/public 分离；只读取选中的 artifact；转换图片、强调与调用块，保留代码', () => {
  const f = fixture(),
    preview = collectSources({ ...f, mode: 'preview' }),
    normal = collectSources({ ...f, mode: 'public' });
  assert.equal(preview.posts.length, 2);
  assert.equal(normal.posts.length, 1);
  assert.equal(normal.assets.size, 0);
  const post = preview.posts.find((p) => p.entry.kind === 'creator');
  assert.equal(post.entry.images.length, 1);
  assert.match(post.body, /\/content-assets\//);
  assert.match(post.body, /\*\*保留意思\*\*/);
  assert.doesNotMatch(post.body, /\[!KEY\]/);
  assert.match(post.body, /!\[代码不改\]\(assets\/missing.png\)/);
});

test('调用块中的强调与带强调的首标题不会重复修改同一段内容', () => {
  const f = fixture();
  const result = rewriteMarkdown('# ==标题==\n\n> [!KEY] ==保留强调==\n', f.body, f.work, () => ({}));
  assert.equal(result.body, '> **保留强调**\n');
});

test('重复同步不改快照，正文更新保留 slug、生成新版本；旧快照不被覆盖', async () => {
  const f = fixture(),
    p = collectSources({ ...f, mode: 'preview' }),
    m = await buildSnapshot(p, f);
  assert.equal(activateSnapshot(f.root, m), true);
  const before = fs.statSync(path.join(f.root, 'docs/content-manifest.json')).mtimeMs;
  assert.equal(activateSnapshot(f.root, await buildSnapshot(collectSources({ ...f, mode: 'preview' }), f)), false);
  assert.equal(fs.statSync(path.join(f.root, 'docs/content-manifest.json')).mtimeMs, before);
  fs.appendFileSync(f.body, '\n新增正文。\n');
  const updated = collectSources({ ...f, mode: 'preview' });
  assert.notEqual(updated.fingerprint, p.fingerprint);
  assert.equal(updated.posts[0].entry.slug, p.posts[0].entry.slug);
  assert.doesNotThrow(() => validateSnapshot(f.root, m));
});

test('缺图/缺源失败时，已激活内容保持完整', async () => {
  const f = fixture(),
    m = await buildSnapshot(collectSources({ ...f, mode: 'preview' }), f);
  activateSnapshot(f.root, m);
  const before = fs.readFileSync(path.join(f.root, 'docs/content-manifest.json'), 'utf8');
  fs.appendFileSync(f.body, '\n![缺图](assets/不存在.png)\n');
  assert.throws(() => collectSources({ ...f, mode: 'preview' }));
  assert.throws(
    () => collectSources({ ...f, external: path.join(f.root, 'offline'), mode: 'preview' }),
    /源目录不可用/
  );
  assert.equal(fs.readFileSync(path.join(f.root, 'docs/content-manifest.json'), 'utf8'), before);
});

test('引用式图片、越界路径和符号链接', () => {
  const f = fixture();
  const body = '![引用][photo]\n\n[photo]: <assets/有 空格.svg>\n';
  assert.equal(rewriteMarkdown(body, f.body, f.work, () => ({ name: 'ok.webp' })).images.length, 1);
  assert.throws(() => rewriteMarkdown('![x](../../../../../../etc/passwd)', f.body, f.work, () => ({ name: 'bad' })));
  fs.symlinkSync(
    path.join(f.root, 'design/cover-sources/cover.svg'),
    path.join(f.work, 'content/article/assets/external.svg')
  );
  assert.throws(() => rewriteMarkdown('![x](assets/external.svg)', f.body, f.work, () => ({ name: 'bad' })), /越出/);
});

test('公众号文章 GIF 保留动画源文件并作为 image/gif 导出', async () => {
  const f = fixture();
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64');
  f.put(path.join(f.work, 'content/article/assets/demo.gif'), gif);
  f.put(f.body, '# 动图文章\n\n![演示动画](assets/demo.gif)\n');
  const plan = collectSources({ ...f, mode: 'preview' });
  const asset = [...plan.assets.values()].find((item) => item.format === 'gif');
  assert.ok(asset);
  assert.match(plan.posts.find((post) => post.entry.kind === 'creator').body, /\.gif\)/);
  const manifest = await buildSnapshot(plan, f);
  const output = manifest.assets.find((item) => item.name.endsWith('.gif'));
  assert.equal(output.type, 'image/gif');
  assert.deepEqual(
    fs.readFileSync(path.join(f.root, '.content-cache', manifest.generation, 'assets', output.name)),
    gif
  );
});

test('稳定 ID、重复网址、被更换的 artifact 版本和损坏快照均可识别', async () => {
  const f = fixture();
  const p = collectSources({ ...f, mode: 'preview' }),
    m = await buildSnapshot(p, f);
  fs.appendFileSync(path.join(f.root, '.content-cache', m.generation, m.files[0].path), 'corrupt');
  assert.throws(() => validateSnapshot(f.root, m), /被修改/);
  f.entry.slug = 'old-post';
  fs.writeFileSync(f.catalog, JSON.stringify(f.entry));
  assert.throws(() => collectSources({ ...f, mode: 'preview' }), /重复文章或网址/);
  f.entry.slug = 'trial';
  f.entry.source.version = 'v02';
  fs.writeFileSync(f.catalog, JSON.stringify(f.entry));
  assert.throws(() => collectSources({ ...f, mode: 'preview' }), /版本变化/);
});

test('hidden 撤下从目标集合和资源中同时排除', () => {
  const f = fixture();
  f.entry.visibility = 'hidden';
  fs.writeFileSync(f.catalog, JSON.stringify(f.entry));
  const plan = collectSources({ ...f, mode: 'preview' });
  assert.equal(plan.posts.length, 1);
  assert.equal(plan.assets.size, 0);
});
