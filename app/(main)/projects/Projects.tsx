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
    _id: 'skills-judgment',
    name: 'Skills Judgment',
    url: 'https://github.com/zzyong24/skills-judgment',
    description:
      'Hermes Skills 生态评判系统 — 通过自然选择机制实现 Skill 全生命周期自管理，自动淘汰低效 Skill、合并相似 Skill，让 Agent 技能库持续进化。',
    icon: '⚖️',
    tags: ['Python', 'MCP', 'Agent', 'Skills'],
    status: 'active' as const,
  },
  {
    _id: 'hermes-openclaw-book',
    name: 'Hermes OpenClaw Book',
    url: 'https://github.com/zzyong24/hermes-openclaw-book',
    description:
      'OpenClaw 实战手册，开源书籍形式记录 AI Agent 架构设计与工程实践。',
    icon: '📖',
    tags: ['HTML', 'OpenClaw', 'Agent'],
    status: 'active' as const,
  },
  {
    _id: 'thirdspace-pub',
    name: 'ThirdSpace',
    url: 'https://github.com/zzyong24/thirdspace-pub',
    description:
      'AI 驱动的个人知识管理系统。基于 Obsidian + MCP 协议，实现「收集 → 沉淀 → 反思 → 实践 → 输出」全闭环，36 个 MCP 工具让 AI 对话即知识沉淀。',
    icon: '🧠',
    tags: ['Python', 'MCP', 'Obsidian', 'AI'],
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
    _id: 'moonos',
    name: 'MoonOS',
    url: 'https://github.com/zzyong24/moonos',
    description:
      '个人 AI 操作系统探索。基于 TypeScript 的 AI Agent 编排框架，探索用系统论方法构建个人 AI 基础设施。',
    icon: '🌙',
    tags: ['TypeScript', 'Agent', 'AI OS'],
    status: 'planning' as const,
  },
  {
    _id: 'ai-pipeline',
    name: 'AI Pipeline',
    url: 'https://github.com/zzyong24/ai-pipeline',
    description:
      '基于 LangGraph 的 AI 流水线编排系统。支持多 Agent 协作、工作流调度与可视化，让复杂的 AI 任务流水线化、可复现。',
    icon: '🔗',
    tags: ['Python', 'LangGraph', 'Agent', 'Pipeline'],
    status: 'building' as const,
  },
  {
    _id: 'aiterm',
    name: 'AITerm',
    url: 'https://github.com/zzyong24/AITerm',
    description:
      '终端 AI 管理器。在命令行环境中直接与 AI 对话，支持多模型切换、上下文管理，让终端成为 AI 操作界面。',
    icon: '🖥️',
    tags: ['Vue', 'TypeScript', 'CLI', 'AI'],
    status: 'building' as const,
  },
  {
    _id: 'nuwa-skill',
    name: 'Nuwa Skill',
    url: 'https://github.com/zzyong24/nuwa-skill',
    description:
      '蒸馏任何人的思维方式——心智模型、决策启发式、表达 DNA。让你欣赏的人成为你随身携带的智囊。',
    icon: '🧩',
    tags: ['Python', 'MCP', 'Skill', 'AI'],
    status: 'planning' as const,
  },
  {
    _id: 'mkd2pic',
    name: 'mkd2pic',
    url: 'https://github.com/zzyong24/mkd2pic',
    description:
      '精美的 Markdown 转图片工具。实时预览、智能分页，支持数学公式、Mermaid 图表、ECharts 可视化，一键导出 PNG / PDF / ZIP，适配小红书、朋友圈等社交媒体场景。',
    icon: '🎨',
    tags: ['JavaScript', 'KaTeX', 'Mermaid', 'ECharts'],
    status: 'active' as const,
  },
  {
    _id: 'artifacts-tech',
    name: 'Artifacts Tech',
    url: 'https://github.com/zzyong24/artifacts-tech',
    description:
      '教学短视频工程工具链。原始文稿一键生成口播稿 + GSAP 教学动画，提词器与幻灯片 BroadcastChannel 联动录制，把每一篇文章「立体化」为可发布的视频作品。',
    icon: '🎞️',
    tags: ['JavaScript', 'GSAP', 'HTML', 'Claude'],
    status: 'building' as const,
  },
  {
    _id: 'moonlitclear-site',
    name: 'MoonlitClear',
    url: 'https://github.com/zzyong24/moonlitclear',
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
