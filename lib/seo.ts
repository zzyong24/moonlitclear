export const seo = {
  title: 'MoonlitClear | 造系统的工程师、AI 实践者',
  description:
    '我是 MoonlitClear，00 后软件工程师。AI 为基，认知破界。已搭建 40+ 工具的 AI 知识管理系统，正在用架构思维 + AI 重构 100 个行业。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      : 'http://localhost:3000'
  ),
} as const
