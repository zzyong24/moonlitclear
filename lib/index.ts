import { env } from '~/env.mjs'

export function url(path = '') {
  const rawUrl =
    process.env.NODE_ENV === 'production'
      ? env.NEXT_PUBLIC_SITE_URL
      : 'http://localhost:3000'

  // 容错：环境变量可能只配了域名，缺少 https:// 前缀
  const baseUrl =
    rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}`

  return new URL(path, baseUrl)
}
