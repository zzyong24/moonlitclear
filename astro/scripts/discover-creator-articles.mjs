import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const creator = process.env.MOONLIT_CREATOR_ROOT || join(homedir(), 'moonlit-creator');
const worksRoot = join(creator, 'works');
const catalogRoot = new URL('../content/catalog/', import.meta.url);
const selected = new Map(
  readdirSync(catalogRoot)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const entry = JSON.parse(readFileSync(new URL(name, catalogRoot), 'utf8'));
      return [entry.id, entry];
    })
);
const candidates = [];

for (const year of readdirSync(worksRoot).filter((name) => /^\d{4}$/.test(name))) {
  for (const dir of readdirSync(join(worksRoot, year)).filter((name) => /^W-\d{8}-\d{3}-/.test(name))) {
    const file = join(worksRoot, year, dir, 'work.json');
    if (!existsSync(file)) continue;
    const work = JSON.parse(readFileSync(file, 'utf8'));
    const article = work.artifacts?.wechatArticle;
    if (!article) continue;
    const item = selected.get(work.id);
    const state = !item ? 'new' : item.source?.version !== article.version ? 'updated' : null;
    if (!state) continue;
    const entry = { id: work.id, title: work.title, version: article.version, state, file };
    candidates.push({ ...entry, articleStatus: article.status });
  }
}

candidates.sort((a, b) => b.id.localeCompare(a.id));
console.log(JSON.stringify({ creator, scannedAt: new Date().toISOString(), candidates }, null, 2));
