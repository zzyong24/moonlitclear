import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const owner = 'zzyong24';
const output = fileURLToPath(new URL('../src/data/github-stats.json', import.meta.url));
const previous = existsSync(output) ? JSON.parse(readFileSync(output, 'utf8')) : { repos: {} };
const repos = {};

for (let page = 1; ; page++) {
  const response = execFileSync('gh', ['api', `users/${owner}/repos?per_page=100&page=${page}`], {
    encoding: 'utf8',
  });
  const batch = JSON.parse(response);
  if (!Array.isArray(batch)) throw new Error('GitHub 返回了非仓库列表');
  for (const repo of batch) {
    if (repo.owner?.login?.toLowerCase() !== owner.toLowerCase() || repo.private || repo.fork || repo.archived)
      continue;
    repos[repo.name.toLowerCase()] = { stars: repo.stargazers_count, url: repo.html_url };
  }
  if (batch.length < 100) break;
}

const snapshot = { owner, updatedAt: new Date().toISOString(), repos };
const added = Object.keys(repos).filter((name) => !previous.repos[name]);
const changed = Object.keys(repos).filter((name) => previous.repos[name]?.stars !== repos[name].stars);
if (process.argv.includes('--write')) {
  if (changed.length || added.length) writeFileSync(output, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    JSON.stringify({ total: Object.keys(repos).length, added, changed, wrote: !!(changed.length || added.length) })
  );
} else {
  console.log(JSON.stringify({ total: Object.keys(repos).length, added, changed, wrote: false }));
}
