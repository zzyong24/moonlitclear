import rss from '@astrojs/rss';
import { fetchPosts } from '~/utils/blog';
export const prerender = true;
export async function GET() {
  const posts = await fetchPosts();
  return rss({
    title: '月明Verse',
    description: '月明Verse的 AI Native 实践、产品记录与文章',
    site: 'https://aitongban.cloud',
    items: posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      pubDate: p.publishDate,
      link: '/' + p.permalink,
    })),
    customData: '<language>zh-cn</language>',
  });
}
