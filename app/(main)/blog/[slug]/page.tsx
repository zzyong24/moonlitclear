import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { url } from '~/lib'
import { redis } from '~/lib/redis'
import { getVaultPost } from '~/lib/vault'

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const post = await Promise.resolve(getVaultPost(params.slug))
  if (!post) {
    notFound()
  }

  const { title, description } = post

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  } satisfies Metadata
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getVaultPost(params.slug)
  if (!post) {
    notFound()
  }

  // 从 Redis 读取真实浏览量，并自增 1（每次访问计数）
  let views = 0
  let reactions = [0, 0, 0, 0]
  try {
    views = await redis.incr(kvKeys.postViews(post._id))
    const storedReactions = await redis.get<number[]>(`reactions:${post._id}`)
    if (storedReactions) {
      reactions = storedReactions
    }
  } catch {
    // Redis 连接失败时使用默认值
  }

  // 相关文章浏览量也从 Redis 读取
  let relatedViews: number[] = []
  if (post.related && post.related.length > 0) {
    try {
      relatedViews = await Promise.all(
        post.related.map(async (rp) => {
          const v = await redis.get<number>(kvKeys.postViews(rp._id))
          return v ?? 0
        })
      )
    } catch {
      relatedViews = post.related.map(() => 0)
    }
  }

  return (
    <BlogPostPage
      post={post}
      views={views}
      relatedViews={relatedViews}
      reactions={reactions}
    />
  )
}

export const revalidate = 60
