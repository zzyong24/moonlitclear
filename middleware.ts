import { authMiddleware } from '@clerk/nextjs'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}

async function beforeAuthMiddleware(req: NextRequest) {
  const { geo, nextUrl } = req
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (process.env.EDGE_CONFIG) {
    const blockedIPs = await get<string[]>('blocked_ips')
    const ip = getIP(req)

    if (blockedIPs?.includes(ip)) {
      if (isApi) {
        return NextResponse.json(
          { error: 'You have been blocked.' },
          { status: 403 }
        )
      }

      nextUrl.pathname = '/blocked'
      return NextResponse.rewrite(nextUrl)
    }

    if (nextUrl.pathname === '/blocked') {
      nextUrl.pathname = '/'
      return NextResponse.redirect(nextUrl)
    }
  }

  if (geo && !isApi) {
    const country = geo.country
    const city = geo.city

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo) {
      const flag = countryInfo.flag
      try {
        await redis.set(kvKeys.currentVisitor, { country, city, flag })
      } catch {
        // Redis 连接失败时忽略
      }
    }
  }

  return NextResponse.next()
}

export default authMiddleware({
  beforeAuth: beforeAuthMiddleware,
  publicRoutes: [
    '/',
    '/studio(.*)',
    '/api(.*)',
    '/blog(.*)',
    '/confirm(.*)',
    '/projects',
    '/guestbook',
    '/newsletters(.*)',
    '/about',
    '/rss',
    '/feed',
    '/ama',
  ],
})
