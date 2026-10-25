import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { collectSources, creatorRoot } from './lib/content-sources.mjs';
import { buildSnapshot, activateSnapshot } from './lib/content-build.mjs';

const { values } = parseArgs({
  options: {
    'dry-run': { type: 'boolean', default: false },
    mode: { type: 'string', default: process.env.CONTENT_MODE || 'public' },
    help: { type: 'boolean', default: false },
  },
  strict: true,
});
if (values.help) {
  console.log(
    'content:sync [--dry-run] [--mode public|preview]\n正文按 content/catalog/*.json 选择。MOONLIT_CREATOR_ROOT 可指定作品库。'
  );
} else {
  const root = process.cwd(),
    lock = path.join(root, '.content-sync.lock');
  let locked = false;
  try {
    if (!values['dry-run']) {
      fs.writeFileSync(lock, String(process.pid), { flag: 'wx' });
      locked = true;
    }
    const plan = collectSources({ root, mode: values.mode, external: creatorRoot() });
    let changed = false;
    if (!values['dry-run']) {
      const manifest = await buildSnapshot(plan, { root });
      const fresh = collectSources({ root, mode: values.mode, external: creatorRoot() });
      if (fresh.fingerprint !== plan.fingerprint) throw Error('构建期间源文件变化，保留旧快照，请重新同步');
      changed = activateSnapshot(root, manifest);
    }
    console.log(
      JSON.stringify(
        {
          mode: plan.mode,
          dryRun: values['dry-run'],
          changed,
          generation: plan.fingerprint,
          articles: plan.posts.length,
          creator: plan.posts
            .filter((p) => p.entry.kind === 'creator')
            .map((p) => ({
              id: p.entry.workId,
              title: p.entry.title,
              slug: p.entry.slug,
              version: p.entry.artifactVersion,
              images: p.entry.images.length,
            })),
          assets: plan.assets.size,
          legacyMissingImages: plan.missingAssets.length,
          skipped: plan.skipped,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error(
      error.code === 'EEXIST' ? '已有内容同步在运行；检查 .content-sync.lock 中 PID 后再处理。' : error.message
    );
    process.exitCode = 1;
  } finally {
    if (locked) fs.unlinkSync(lock);
  }
}
