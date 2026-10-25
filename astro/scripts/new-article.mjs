import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { parseArgs } from 'node:util';
import matter from 'gray-matter';
const { values } = parseArgs({
  options: {
    title: { type: 'string' },
    slug: { type: 'string' },
    date: { type: 'string' },
    category: { type: 'string' },
    help: { type: 'boolean' },
  },
});
if (values.help) {
  console.log('npm run article:new -- --title "文章标题" --slug stable-url [--date YYYY-MM-DD] [--category 分类]');
  process.exit(0);
}
const { title, slug } = values;
const date = values.date || new Date().toISOString().slice(0, 10);
if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || ''))
  throw Error('需要 --title 和稳定的英文小写 --slug（词间用连字符）');
if (
  !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
  !Number.isFinite(Date.parse(date)) ||
  new Date(date).toISOString().slice(0, 10) !== date
)
  throw Error('日期必须为有效 YYYY-MM-DD');
const dir = 'vault/writing';
fs.mkdirSync(dir, { recursive: true });
for (const filename of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
  const { data } = matter(fs.readFileSync(path.join(dir, filename), 'utf8'));
  if (data.publish_slug === slug) throw Error('该网址已被文章或草稿占用');
}
const file = path.join(dir, `${date.replaceAll('-', '')}_${slug}.md`);
const front = {
  title,
  created: date,
  publish: false,
  publish_slug: slug,
  publish_category: values.category || '实践记录',
  publish_description: '',
  tags: [],
};
fs.writeFileSync(file, '---\n' + yaml.dump(front) + '---\n\n在这里写入正文。\n', { flag: 'wx' });
console.log(`草稿已创建：${file}。完成正文与摘要后，将 publish 改为 true，再构建预览。`);
