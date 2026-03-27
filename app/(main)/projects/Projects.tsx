import { ProjectCard } from '~/app/(main)/projects/ProjectCard'

/**
 * 项目数据列表
 *
 * 每个项目包含：
 * - _id: 唯一标识
 * - name: 项目名称
 * - url: 项目链接（GitHub / 产品主页）
 * - description: 一句话介绍
 * - icon: 项目图标 emoji
 * - tags: 技术标签
 * - status: 项目状态（active / building / planning）
 *
 * 后续可迁移到 vault 读取，当前使用静态配置便于维护
 */
const projects = [
  {
    _id: 'thirdspace',
    name: 'ThirdSpace',
    url: 'https://github.com/zzyong24/thirdspace',
    description:
      'AI 驱动的个人知识管理系统。基于 Obsidian + MCP 协议，实现「收集 → 沉淀 → 反思 → 实践 → 输出」全闭环，36 个 MCP 工具让 AI 对话即知识沉淀。',
    icon: '🧠',
    tags: ['Python', 'MCP', 'Obsidian', 'AI'],
    status: 'active' as const,
  },
  {
    _id: 'ai-tongban',
    name: 'AI 童伴',
    url: 'https://aitongban.cloud',
    description:
      '让 AI 成为孩子的成长导师。为家长提供 59 个教育场景 Prompt + 内置 AI 对话服务，覆盖德育、智育、心理、生活四大领域，已完成 18 次产品迭代。',
    icon: '👶',
    tags: ['React', 'Go', 'WeChat Mini Program', 'AI'],
    status: 'active' as const,
  },
  {
    _id: 'lifeos',
    name: 'LifeOS',
    url: 'https://github.com/zzyong24/thirdspace',
    description:
      'AI 辅助决策系统。将人际关系和事件建模为 AI 可理解的结构化数据，通过人际图谱 + 事件闭环，让 AI 成为你的决策参谋，越用越懂你。',
    icon: '🎯',
    tags: ['Python', 'MCP', 'RAG', 'AI'],
    status: 'active' as const,
  },
  {
    _id: 'obsidian-lingxi',
    name: 'Obsidian lingxi',
    url: 'https://github.com/zzyong24/obsidian-lingxi',
    description:
      'Obsidian 侧边栏 AI 对话插件。通过 Skill/Prompt 模板 + 国内大模型，将创作灵感自动转化为结构化笔记，面向短视频创作者的知识管理解决方案。',
    icon: '💬',
    tags: ['TypeScript', 'Svelte', 'Obsidian Plugin', 'AI'],
    status: 'building' as const,
  },
  {
    _id: 'noteclear',
    name: '清记 NoteClear',
    url: 'https://github.com/zzyong24/noteclear',
    description:
      'Agent 驱动的长视频深度总结工具。支持 Bilibili、YouTube、小红书、抖音和本地文件，将视频转化为结构完整的 Markdown 笔记，内置 Faster-Whisper 本地转录，支持任意 OpenAI 兼容 API。',
    icon: '🎬',
    tags: ['Python', 'TypeScript', 'Whisper', 'AI'],
    status: 'active' as const,
  },
  {
    _id: 'my-artifacts',
    name: 'my-artifacts',
    url: 'https://github.com/zzyong24/my-artifacts',
    description:
      '教学短视频工程工具链。原始文稿一键生成口播稿 + GSAP 教学动画，提词器与幻灯片 BroadcastChannel 联动录制，把每一篇文章「立体化」为可发布的视频作品。',
    icon: '🎞️',
    tags: ['JavaScript', 'GSAP', 'HTML', 'Claude'],
    status: 'building' as const,
  },
  {
    _id: 'moonlitclear-site',
    name: 'MoonlitClear',
    url: 'https://github.com/zzyong24/cali.so',
    description:
      '你正在浏览的这个网站。基于 Next.js 14 + Vault 本地 Markdown 博客系统，从 cali.so 开源项目二次开发，实现个人品牌展示与内容输出。',
    icon: '🌙',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    status: 'active' as const,
  },
]

export function Projects() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </ul>
  )
}
