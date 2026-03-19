import { getLatestVaultPosts } from '~/lib/vault'

import { BlogPostCard } from './BlogPostCard'

export async function BlogPosts({ limit = 5 }) {
  const posts = getLatestVaultPosts({ limit, forDisplay: true })

  // 本地模式下使用随机浏览量
  const views = posts.map(() => Math.floor(Math.random() * 1000))

  return (
    <>
      {posts.map((post, idx) => (
        <BlogPostCard post={post} views={views[idx] ?? 0} key={post._id} />
      ))}
    </>
  )
}
