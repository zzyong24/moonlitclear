/**
 * v6 标题字体子集化（docs/redesign-v6/02 §2）。
 * 在 astro build 之后运行：扫描 dist 中实际使用宋体的文字，只从 @fontsource/noto-serif-sc
 * 的分片里切出这些字，输出 dist/fonts/serif/*.woff2 与 dist/fonts/serif.css。
 * 未收录的字会自然回退到 Songti SC / STSong，不会出现空白。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parse } from 'parse5';
import subsetFont from 'subset-font';

const require = createRequire(import.meta.url);
const pkgDir = path.dirname(require.resolve('@fontsource/noto-serif-sc/package.json'));
const DIST = process.argv[2] || 'dist';
// 只出 900 一档，声明为 700–900 区间，h3/h4 等 700 字重也复用它，首屏字体体积减半。
const WEIGHTS = [900];
const SERIF_TAGS = new Set(['h1', 'h2', 'h3', 'h4']);
// 组件里显式使用 --font-serif 的类名；新增宋体元素时在这里登记。
const SERIF_CLASSES = new Set([
  'v6-display',
  'v6-h2',
  'v6-h3',
  'v6-h4',
  'v6-stat',
  'v6-header__brand',
  'v6-menu',
  'v6-os__name',
  'v6-proof__row',
  'v6-hero__path',
]);
const ALWAYS = '月明Verse朱志勇0123456789+.,，。、：；！？·—→↗《》「」（）%';

function walk(dir, out = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

const chars = new Set(ALWAYS);
for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));
function visit(node, serif) {
  if (node.nodeName === '#text') {
    if (serif) for (const ch of node.value) chars.add(ch);
    return;
  }
  if (node.nodeName === 'script' || node.nodeName === 'style') return;
  let isSerif = serif || SERIF_TAGS.has(node.nodeName);
  const cls = node.attrs?.find((a) => a.name === 'class')?.value;
  if (cls && cls.split(/\s+/).some((c) => SERIF_CLASSES.has(c))) isSerif = true;
  for (const child of node.childNodes ?? []) visit(child, isSerif);
  if (node.content) visit(node.content, isSerif);
}
const pages = walk(DIST);
for (const file of pages) visit(parse(fs.readFileSync(file, 'utf8')), false);

const parseRange = (range) => {
  const set = [];
  for (const part of range.split(',').map((s) => s.trim().replace(/^U\+/i, ''))) {
    const [a, b] = part.split('-').map((h) => parseInt(h, 16));
    set.push([a, b ?? a]);
  }
  return set;
};
const inRanges = (cp, ranges) => ranges.some(([a, b]) => cp >= a && cp <= b);
const toRange = (cps) => {
  cps.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < cps.length;) {
    let j = i;
    while (j + 1 < cps.length && cps[j + 1] === cps[j] + 1) j++;
    const hex = (n) => n.toString(16).toUpperCase();
    out.push(i === j ? `U+${hex(cps[i])}` : `U+${hex(cps[i])}-${hex(cps[j])}`);
    i = j + 1;
  }
  return out.join(',');
};

const outDir = path.join(DIST, 'fonts', 'serif');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const codepoints = [...chars].map((c) => c.codePointAt(0));
let css = '/* 由 scripts/build-serif-font.mjs 生成，勿手改 */\n';
let total = 0;
let files = 0;
for (const weight of WEIGHTS) {
  const source = fs.readFileSync(path.join(pkgDir, `${weight}.css`), 'utf8');
  const faces = [...source.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => m[1]);
  let idx = 0;
  for (const face of faces) {
    const file = face.match(/url\(\.\/files\/([^)]+\.woff2)\)/)?.[1];
    const range = face.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!file || !range) continue;
    const ranges = parseRange(range);
    const used = codepoints.filter((cp) => inRanges(cp, ranges));
    if (!used.length) continue;
    const buf = await subsetFont(fs.readFileSync(path.join(pkgDir, 'files', file)), String.fromCodePoint(...used), {
      targetFormat: 'woff2',
    });
    const name = `nss-${weight}-${idx++}.woff2`;
    fs.writeFileSync(path.join(outDir, name), buf);
    total += buf.length;
    files++;
    css += `@font-face{font-family:'Noto Serif SC';font-style:normal;font-weight:700 ${weight};font-display:swap;src:url(/fonts/serif/${name}) format('woff2');unicode-range:${toRange(used)};}\n`;
  }
}
// 数字与日期用 Source Serif 4 600（--font-num），只保留 ASCII 可见字符，约 10KB。
const numDir = path.dirname(require.resolve('@fontsource/source-serif-4/package.json'));
const ascii = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join('') + '·—→↗¥';
const numBuf = await subsetFont(
  fs.readFileSync(path.join(numDir, 'files', 'source-serif-4-latin-600-normal.woff2')),
  ascii,
  { targetFormat: 'woff2' }
);
fs.writeFileSync(path.join(outDir, 'num-600.woff2'), numBuf);
total += numBuf.length;
files++;
css += `@font-face{font-family:'Source Serif 4';font-style:normal;font-weight:500 700;font-display:swap;src:url(/fonts/serif/num-600.woff2) format('woff2');}\n`;
fs.writeFileSync(path.join(DIST, 'fonts', 'serif.css'), css);
console.log(
  `宋体子集：${chars.size} 字，${files} 个文件，共 ${(total / 1024).toFixed(0)}KB（扫描 ${pages.length} 页）。`
);
