import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit, SKIP } from 'unist-util-visit';

export const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
export const creatorRoot = () =>
  path.resolve(process.env.MOONLIT_CREATOR_ROOT || path.join(os.homedir(), 'moonlit-creator'));
const parser = unified().use(remarkParse).use(remarkGfm);
const assert = (condition, message) => {
  if (!condition) throw Error(message);
};

export function inside(root, file) {
  const base = fs.realpathSync(root);
  const real = fs.realpathSync(file);
  assert(real.startsWith(base + path.sep), `资源越出允许目录：${path.basename(file)}`);
  return real;
}

export function rewriteMarkdown(content, sourceFile, workDir, loadImage) {
  workDir = fs.realpathSync(workDir);
  const tree = parser.parse(content);
  const definitions = new Map();
  const patches = [];
  const images = [];
  const calloutText = new Set();
  visit(tree, 'blockquote', (node) => {
    const child = node.children[0]?.children?.[0];
    if (child?.type === 'text' && /^\[!(KEY|NOTE|VERDICT)\]\s*/.test(child.value)) calloutText.add(child);
  });
  visit(tree, 'definition', (node) => definitions.set(node.identifier.toLowerCase(), node));
  const replace = (node, value) =>
    patches.push({ start: node.position.start.offset, end: node.position.end.offset, value });
  const imageUrl = (url) => {
    assert(!/^(?:[a-z][a-z\d+.-]*:|\/\/|\/)/i.test(url), '新文章的图片必须引用作品内本地文件：' + url);
    const file = inside(workDir, path.resolve(path.dirname(sourceFile), decodeURIComponent(url)));
    const relative = path.relative(workDir, file).split(path.sep).join('/');
    assert(
      /^(content|production|deliverables|notes\/source-materials)\//.test(relative),
      `图片不在内容素材目录：${relative}`
    );
    assert(/\.(png|jpe?g|webp|avif|svg|gif)$/i.test(file), `暂不支持此媒体格式，请先制作网页版本：${relative}`);
    const bytes = fs.readFileSync(file);
    const asset = loadImage({ file, relative, sha256: digest(bytes), bytes });
    images.push({ path: relative, sha256: digest(bytes), asset: asset.name });
    return '/content-assets/' + asset.name;
  };
  visit(tree, (node) => {
    if (node.type === 'image') {
      const alt = (node.alt || '').replaceAll(']', '\\]');
      replace(node, `![${alt}](${imageUrl(node.url)})`);
    } else if (node.type === 'imageReference') {
      const def = definitions.get(node.identifier.toLowerCase());
      assert(def, `图片定义缺失：${node.identifier}`);
      replace(node, `![${(node.alt || '').replaceAll(']', '\\]')}](${imageUrl(def.url)})`);
    } else if (node.type === 'html') {
      assert(/^<!--[\s\S]*-->$/.test(node.value.trim()), '文章含原始 HTML，请先提供 Markdown 或受控媒体适配');
    } else if (node.type === 'heading' && node.depth === 1 && node === tree.children[0]) {
      replace(node, '');
      return SKIP;
    } else if (node.type === 'text' && (node.value.includes('==') || calloutText.has(node))) {
      let original = content.slice(node.position.start.offset, node.position.end.offset);
      // Remove only the presentation marker; retain all callout words and emphasis.
      if (calloutText.has(node)) original = original.replace(/^\[!(KEY|NOTE|VERDICT)\]\s*/, '');
      replace(node, original.replace(/==([^=\n]+)==/g, '**$1**'));
    }
  });
  patches.sort((a, b) => b.start - a.start);
  let previous = content.length + 1;
  for (const patch of patches) {
    assert(patch.end <= previous, 'Markdown 转换出现重叠，请检查调用块');
    content = content.slice(0, patch.start) + patch.value + content.slice(patch.end);
    previous = patch.start;
  }
  return { body: content.trim() + '\n', images };
}

export function collectSources({ root = process.cwd(), external = creatorRoot(), mode = 'public' } = {}) {
  assert(['public', 'preview'].includes(mode), 'mode 必须为 public 或 preview');
  const posts = [],
    assets = new Map(),
    inputs = [],
    missingAssets = [];
  const loadImage = (asset) => {
    const animated = /\.gif$/i.test(asset.file);
    const name = asset.sha256.slice(0, 24) + (animated ? '.gif' : '.webp');
    assets.set(name, { ...asset, name, width: 1440, format: animated ? 'gif' : 'webp' });
    return { name };
  };
  const catalogPath = path.join(root, 'content/catalog');
  const catalog = fs.existsSync(catalogPath)
    ? fs
        .readdirSync(catalogPath)
        .filter((n) => n.endsWith('.json'))
        .sort()
        .map((n) => {
          const raw = fs.readFileSync(path.join(catalogPath, n));
          inputs.push({ name: 'catalog/' + n, sha256: digest(raw) });
          const item = JSON.parse(raw);
          assert(/^W-\d{8}-\d{3}$/.test(item.id) && n === item.id + '.json', '无效作品 ID：' + n);
          assert(['preview', 'public', 'hidden'].includes(item.visibility), '缺少明确 visibility：' + n);
          assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug), '无效 slug：' + n);
          assert(
            item.source?.kind === 'moonlit-creator' && typeof item.source.artifact === 'string',
            '无效内容来源：' + n
          );
          assert(typeof item.category === 'string' && typeof item.summary === 'string', '缺少分类或摘要：' + n);
          assert(
            /^\d{4}-\d{2}-\d{2}$/.test(item.date) && new Date(item.date).toISOString().slice(0, 10) === item.date,
            '无效日期：' + n
          );
          return item;
        })
    : [];
  const chosen = catalog.filter((p) => p.visibility === 'public' || (mode === 'preview' && p.visibility === 'preview'));
  const workMap = new Map();
  if (chosen.length) {
    const works = path.join(external, 'works');
    assert(fs.existsSync(works), 'Creator 源目录不可用，已有内容保留；请设置 MOONLIT_CREATOR_ROOT');
    for (const year of fs.readdirSync(works).filter((n) => /^\d{4}$/.test(n))) {
      for (const entry of fs.readdirSync(path.join(works, year), { withFileTypes: true })) {
        if (!entry.isDirectory() || !/^W-\d{8}-\d{3}-/.test(entry.name)) continue;
        const dir = path.join(works, year, entry.name),
          file = path.join(dir, 'work.json');
        if (!fs.existsSync(file)) continue;
        const work = readJson(file);
        assert(!workMap.has(work.id), '重复作品 ID：' + work.id);
        workMap.set(work.id, { dir, work });
      }
    }
  }
  for (const item of chosen) {
    const selected = workMap.get(item.id);
    assert(selected, '作品不存在：' + item.id);
    const { dir, work } = selected,
      artifact = work.artifacts?.[item.source.artifact];
    assert(artifact, '作品未登记所选产物：' + item.id);
    assert(
      !item.source.version || artifact.version === item.source.version,
      '作品产物版本变化，请读回新版本并更新目录：' + item.id
    );
    const candidates = artifact.files.filter(
      (f) => ['content', 'path', 'sourceArticle'].includes(f.role) && /\.md$/.test(f.path)
    );
    const uniqueCandidates = [...new Map(candidates.map((f) => [f.path, f])).values()];
    assert(
      uniqueCandidates.length === 1 && uniqueCandidates[0].scope === 'work',
      '需要唯一的作品内 Markdown 正文：' + item.id
    );
    const file = inside(dir, path.join(dir, uniqueCandidates[0].path)),
      raw = fs.readFileSync(file, 'utf8');
    assert(
      /^(content\/|deliverables\/article\/)/.test(uniqueCandidates[0].path),
      '正文必须来自 content 或 deliverables/article：' + item.id
    );
    const { data, content } = matter(raw);
    const title = item.title || data.title || content.match(/^#\s+(.+)$/m)?.[1];
    assert(title, '文章缺少标题：' + item.id);
    const converted = rewriteMarkdown(content, file, dir, loadImage);
    assert(item.cover?.designVersion && item.cover?.template && item.cover?.alt, '封面配置不完整：' + item.id);
    const coverFile = inside(path.join(root, 'design/cover-sources'), path.join(root, item.cover.source));
    const coverBytes = fs.readFileSync(coverFile),
      coverHash = digest(coverBytes);
    const coverBase = item.id + '-' + coverHash.slice(0, 12);
    const variants = [480, 800, 1200].map((width) => {
      const name = `${coverBase}-${width}.webp`;
      assets.set(name, {
        file: coverFile,
        bytes: coverBytes,
        sha256: coverHash,
        name,
        width,
        height: (width * 9) / 16,
        format: 'webp',
        fit: 'contain',
      });
      return { width, url: '/content-assets/' + name };
    });
    const og = coverBase + '-og.jpg';
    assets.set(og, {
      file: coverFile,
      bytes: coverBytes,
      sha256: coverHash,
      name: og,
      width: 1200,
      height: 630,
      format: 'jpeg',
      fit: 'contain',
    });
    const source = 'creator:' + item.id;
    const entry = {
      source,
      kind: 'creator',
      workId: item.id,
      artifact: item.source.artifact,
      artifactVersion: artifact.version,
      sourcePath: uniqueCandidates[0].path,
      sourceStatus: artifact.status,
      visibility: item.visibility,
      sha256: digest(raw),
      title: String(title),
      slug: item.slug,
      images: converted.images,
      designVersion: item.cover.designVersion,
      coverHash,
    };
    const front = {
      title,
      publish_slug: item.slug,
      publishDate: new Date(item.date),
      excerpt: item.summary,
      category: item.category,
      tags: item.tags || [],
      author: '月明水清深',
      image: variants[2].url,
      imageAlt: item.cover.alt,
      coverVariants: variants,
      previewOnly: item.visibility === 'preview',
      workId: item.id,
      metadata: { openGraph: { images: [{ url: '/content-assets/' + og, width: 1200, height: 630 }] } },
    };
    posts.push({ entry, front, body: converted.body, filename: item.id + '.md' });
    inputs.push({ name: source, sha256: digest(JSON.stringify({ entry, front })) });
  }
  const legacy = path.join(root, 'vault/writing');
  for (const filename of fs
    .readdirSync(legacy)
    .filter((n) => n.endsWith('.md'))
    .sort()) {
    const raw = fs.readFileSync(path.join(legacy, filename), 'utf8'),
      { data, content } = matter(raw);
    inputs.push({ name: 'legacy/' + filename, sha256: digest(raw) });
    if (data.publish === false) continue;
    const slug =
      data.publish_slug ||
      filename
        .replace(/\.md$/, '')
        .replace(/^\d{8}_/, '')
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const title = String(data.title || content.match(/^#\s+(.+)$/m)?.[1] || filename.replace(/\.md$/, ''));
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t) => !['crafted', 'note', 'article', 'writing'].includes(t)).map(String)
      : [];
    const published = new Date(data.created || filename.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    assert(!Number.isNaN(+published), '无效旧文日期：' + filename);
    const front = {
      title,
      publish_slug: slug,
      publishDate: published,
      excerpt: String(
        data.publish_description ||
          data.description ||
          content.split('\n').find((l) => l.trim() && !/^(#|>|!|---|```)/.test(l)) ||
          ''
      ).slice(0, 220),
      category: String(data.publish_category || tags[0] || '实践记录'),
      tags,
      author: '月明水清深',
    };
    if (data.publish_cover)
      front.image = String(data.publish_cover).startsWith('http')
        ? data.publish_cover
        : '/covers/' + data.publish_cover;
    const images = [];
    const body = content
      .replace(/!\[([^\]]*)\]\((\.\/[^)]+)\)/g, (_match, alt, relative) => {
        const file = path.join(legacy, relative);
        if (fs.existsSync(file)) {
          inside(legacy, file);
          const bytes = fs.readFileSync(file),
            sha256 = digest(bytes),
            { name } = loadImage({ file, relative, bytes, sha256 });
          images.push({ path: relative, sha256, asset: name });
          return `![${alt}](/content-assets/${name})`;
        }
        missingAssets.push({ source: filename, asset: relative, alt });
        return `> 图示：${alt}（原文配图暂缺）`;
      })
      .replace(/!\[\[([^\]]+)\]\]/g, (_match, asset) => {
        missingAssets.push({ source: filename, asset });
        return '> 原文配图暂缺。';
      })
      .replace(/^#\s+.+\r?\n/m, '');
    posts.push({
      entry: { source: filename, kind: 'legacy', slug, title, sha256: digest(raw), images },
      front,
      body,
      filename,
    });
  }
  const sources = new Set(),
    slugs = new Set();
  for (const p of posts) {
    assert(!sources.has(p.entry.source) && !slugs.has(p.entry.slug), '重复文章或网址：' + p.entry.slug);
    assert(p.entry.slug && !/[\/\\]/.test(p.entry.slug) && !['.', '..'].includes(p.entry.slug), '无效文章网址');
    sources.add(p.entry.source);
    slugs.add(p.entry.slug);
  }
  for (const [name, asset] of assets) inputs.push({ name: 'asset/' + name, sha256: asset.sha256 });
  const codeInputs = ['scripts/lib/content-sources.mjs', 'scripts/lib/content-build.mjs'].map((n) =>
    fs.existsSync(path.join(root, n)) ? digest(fs.readFileSync(path.join(root, n))) : 'test'
  );
  const fingerprint = digest(JSON.stringify({ mode, inputs, codeInputs }));
  return {
    mode,
    fingerprint,
    posts,
    assets,
    missingAssets,
    skipped: catalog.filter((p) => !chosen.includes(p)).map((p) => ({ id: p.id, reason: p.visibility })),
  };
}
