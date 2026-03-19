import RSS from 'rss'

import { seo } from '~/lib/seo'
import { getLatestVaultPosts } from '~/lib/vault'

export const revalidate = 60 * 60 // 1 hour

export async function GET() {
  const feed = new RSS({
    title: seo.title,
    description: seo.description,
    site_url: seo.url.href,
    feed_url: `${seo.url.href}feed.xml`,
    language: 'zh-CN',
    image_url: `${seo.url.href}opengraph-image.png`,
    generator: 'Next.js + Vault',
  })

  const posts = getLatestVaultPosts({ limit: 999 })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      guid: post._id,
      url: `${seo.url.href}blog/${post.slug}`,
      description: post.description,
      date: new Date(post.publishedAt),
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}
