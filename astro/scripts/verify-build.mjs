import fs from 'node:fs';
import path from 'node:path';
import { collectSources, digest, readJson } from './lib/content-sources.mjs';
import { validateSnapshot } from './lib/content-build.mjs';
const manifest = readJson('docs/content-manifest.json');
validateSnapshot(process.cwd(), manifest);
const fresh = collectSources({ mode: manifest.mode });
if (fresh.fingerprint !== manifest.generation) throw Error('源内容、素材或转换规则已变化，请重新构建');
const missing = [];
const visualFile = 'src/data/generated-visuals.json';
const visuals = readJson(visualFile);
const legacyCovers = readJson('content/legacy-covers.json').covers;
const expectedVisuals = new Set();
for (const [id, visual] of Object.entries(visuals.assets)) {
  if (digest(fs.readFileSync(visual.source)) !== visual.sourceHash) missing.push(id + ':生成母版与导出清单不一致');
  for (const variant of [...visual.variants, ...(visual.og ? [visual.og] : [])]) {
    expectedVisuals.add(path.basename(variant.url));
    const file = path.join('dist', variant.url);
    if (!fs.existsSync(file) || digest(fs.readFileSync(file)) !== variant.sha256)
      missing.push(id + ':生成图片资源不一致');
  }
}
for (const file of fs.readdirSync('dist/brand/generated')) {
  if (!expectedVisuals.has(file) && !/\.(br|gz)$/.test(file)) missing.push(file + ':未选用品牌图片残留');
}
const seenSlugs = new Set();
for (const p of manifest.posts) {
  if (seenSlugs.has(p.slug)) missing.push(p.slug + ':重复网址');
  seenSlugs.add(p.slug);
  const file = path.join('dist', 'blog', p.slug, 'index.html');
  if (!fs.existsSync(file)) {
    missing.push(p.slug);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (p.kind === 'legacy') {
    const visual = visuals.assets[legacyCovers[p.slug]];
    if (!visual || !html.includes(visual.variants.at(-1).url) || !html.includes(visual.og.url))
      missing.push(p.slug + ':文生图封面或分享图未进入正文');
  }
  if (!html.includes(p.title.replaceAll('&', '&amp;').replaceAll('"', '&quot;')) && !html.includes(p.title))
    missing.push(p.slug + ':标题');
  for (const image of p.images || [])
    if (!html.includes('/content-assets/' + image.asset)) missing.push(p.slug + ':正文图片未进入 HTML');
  if (p.kind === 'creator') {
    if (!html.includes('property="og:image"') || !html.includes('-og.jpg')) missing.push(p.slug + ':分享图');
    if (/\[!(KEY|NOTE|VERDICT)\]/.test(html)) missing.push(p.slug + ':调用块未转换');
  }
}
if (fs.existsSync('dist/blog')) {
  for (const entry of fs.readdirSync('dist/blog', { withFileTypes: true })) {
    if (
      entry.isDirectory() &&
      fs.existsSync(path.join('dist/blog', entry.name, 'index.html')) &&
      !seenSlugs.has(entry.name)
    )
      missing.push(entry.name + ':已撤下文章仍存在');
  }
}
for (const route of [
  'index.html',
  'blog/index.html',
  'projects/index.html',
  'opensource/index.html',
  'about/index.html',
  'ama/index.html',
  'links/index.html',
  'feed.xml',
  'sitemap-index.xml',
  '404.html',
]) {
  if (!fs.existsSync('dist/' + route)) missing.push(route);
}
const toolCatalog = readJson('src/data/open-skills.json');
const directoryFile = 'dist/opensource/index.html';
const oldRouteFile = 'dist/skills/index.html';
if (toolCatalog.totalCount !== toolCatalog.skills?.length || toolCatalog.skills.length === 0)
  missing.push('开源工具清单数量与条目不一致');
const expectedRepos = [
  'hean-growth-journal',
  'hermes-openclaw-book',
  'skills-judgment',
  'AITerm',
  'mkd2pic',
  ...(toolCatalog.skills || []).map((item) => item.name),
];
const repoNames = new Set();
for (const name of expectedRepos) {
  const repo = `https://github.com/zzyong24/${name}`;
  if (repoNames.has(name)) missing.push(name + ':开源仓库重复');
  repoNames.add(name);
  if (!fs.existsSync(directoryFile) || !fs.readFileSync(directoryFile, 'utf8').includes(repo))
    missing.push(name + ':开源项目未进入目录页');
}
if (fs.existsSync(directoryFile)) {
  const directoryHtml = fs.readFileSync(directoryFile, 'utf8');
  for (const [label, value] of [
    ['目录标题', '开源项目'],
    ['搜索控件', 'opensource-query'],
    ['用途筛选', 'opensource-filters'],
    ['文生图卡片', '/brand/generated/'],
    ['图片用途说明', 'opensource-art-caption'],
  ])
    if (!directoryHtml.includes(value)) missing.push('开源目录缺少' + label);
  const cardCount = directoryHtml.match(/<article\b[^>]*class="opensource-card(?:\s[^"]*)?"/g)?.length || 0;
  if (cardCount !== expectedRepos.length) missing.push(`开源卡片数量不符：${cardCount}/${expectedRepos.length}`);
  const captionCount = directoryHtml.match(/class="opensource-art-caption"/g)?.length || 0;
  if (captionCount !== expectedRepos.length)
    missing.push(`开源图片用途说明数量不符：${captionCount}/${expectedRepos.length}`);
  if (directoryHtml.includes('initProjectMotion')) missing.push('开源目录仍加载鼠标探索动效');
}
if (fs.existsSync(oldRouteFile) && !fs.readFileSync(oldRouteFile, 'utf8').includes('/opensource'))
  missing.push('旧开源目录入口缺少新目录跳转');
const redirects = readJson('redirects.json');
if (redirects['/skills'] !== '/opensource' || redirects['/skills/'] !== '/opensource')
  missing.push('旧开源目录 HTTP 跳转配置缺失');
if (!fs.existsSync('dist/opensource/index.html')) {
  missing.push('开源目录页面缺失');
}
const expectedAssets = new Set(manifest.assets.map((a) => a.name));
for (const asset of manifest.assets) {
  const file = path.join('dist/content-assets', asset.name);
  if (!fs.existsSync(file) || digest(fs.readFileSync(file)) !== asset.sha256)
    missing.push(asset.name + ':媒体产物缺失或变化');
}
if (fs.existsSync('dist/content-assets'))
  for (const file of fs.readdirSync('dist/content-assets')) {
    if (!expectedAssets.has(file) && !/\.(br|gz)$/.test(file)) missing.push(file + ':多余媒体残留');
  }
const library = fs.readFileSync('dist/blog/index.html', 'utf8'),
  feed = fs.readFileSync('dist/feed.xml', 'utf8');
const sitemap = fs
  .readdirSync('dist')
  .filter((n) => /^sitemap-.*\.xml$/.test(n))
  .map((n) => fs.readFileSync('dist/' + n, 'utf8'))
  .join('');
for (const post of manifest.posts.filter((p) => p.kind === 'creator')) {
  for (const [label, text] of [
    ['文章库', library],
    ['RSS', feed],
    ['sitemap', sitemap],
  ])
    if (!text.includes(post.slug)) missing.push(post.slug + ':' + label);
}
if (missing.length) throw Error('构建验证失败：' + JSON.stringify(missing));
fs.writeFileSync(
  'dist/build-info.json',
  JSON.stringify(
    {
      mode: manifest.mode,
      generation: manifest.generation,
      articles: manifest.posts.length,
      manifestHash: digest(fs.readFileSync('docs/content-manifest.json')),
      visualManifestHash: digest(fs.readFileSync(visualFile)),
    },
    null,
    2
  ) + '\n'
);
console.log(`内容验证通过：${manifest.posts.length} 篇，${manifest.assets.length} 个衍生资源；模式 ${manifest.mode}。`);
