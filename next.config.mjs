/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ====================================================================
  // Vault 文件包含配置
  // 设计决策：vault.ts 使用 fs.readFileSync 动态读取文章文件，
  // Next.js 的 output file tracing 无法自动检测到这些文件依赖，
  // 导致 Vercel serverless function 部署包中不包含 vault/writing/ 下的 .md 文件。
  // 必须通过 unstable_includeFiles 显式声明，让 Vercel 把文章打包进 function 中。
  // ====================================================================
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./vault/writing/**/*'],
    },
  },
  images: {
    remotePatterns: [
      // 允许加载本地和外部图片
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },


  redirects() {
    return []
  },

  rewrites() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
      },
      {
        source: '/rss',
        destination: '/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
      },
    ]
  },
}

export default nextConfig
