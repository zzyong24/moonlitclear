import { env } from '~/env.mjs'

const rawSiteUrl = env.NEXT_PUBLIC_SITE_URL
const siteUrl =
  rawSiteUrl.startsWith('http://') || rawSiteUrl.startsWith('https://')
    ? rawSiteUrl
    : `https://${rawSiteUrl}`

export const emailConfig = {
  from: env.NEXT_PUBLIC_SITE_EMAIL_FROM,
  baseUrl: env.VERCEL_ENV === 'production' ? siteUrl : 'http://localhost:3000',
}
