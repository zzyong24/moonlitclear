/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 构建时跳过 ESLint 检查，避免第三方/遗留代码的严格规则阻断部署
  // ESLint 仍在开发时通过 IDE 和 pre-commit hook 运行
  eslint: {
    ignoreDuringBuilds: true,
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
