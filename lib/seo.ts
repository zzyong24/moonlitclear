/**
 * 确保 URL 字符串包含协议前缀
 * 防御性处理：Vercel 环境变量可能只写域名（如 moonlitclear.vercel.app），
 * 而 new URL() 要求必须有协议，否则抛 ERR_INVALID_URL
 */
function ensureProtocol(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

export const seo = {
  title: 'MoonlitClear | 造系统的工程师、AI 实践者',
  description:
    '我是 MoonlitClear，00 后软件工程师。AI 为基，认知破界。已搭建 40+ 工具的 AI 知识管理系统，正在用架构思维 + AI 重构 100 个行业。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? ensureProtocol(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      : 'http://localhost:3000'
  ),
} as const
