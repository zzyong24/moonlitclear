/**
 * 首页「能力」：每项附一个可验证的案例。match 为文章标题片段，构建时匹配原文；
 * href 为站内固定链接（优先于 match）。都匹配不到时只隐藏案例行，不隐藏能力。
 */
export interface Capability {
  title: string;
  description: string;
  points: string[];
  proof: string;
  match?: string;
  href?: string;
}

export const capabilities: Capability[] = [
  {
    title: 'AI 原生开发',
    description: '把 AI 编程从“能跑”做到“可控”：规范、分工、验证与交付，一套可复用的工程方法。',
    points: ['项目规范与上下文工程', '多 Agent 分工与编排', '测试验证与质量门禁'],
    proof: '3 小时交付 10853 行生产代码',
    match: '10853',
  },
  {
    title: '产品从 0 到 1',
    description: '从方向判断、MVP 到上线收款，我自己完整走过 7 次，帮你把想法变成能卖的产品。',
    points: ['方向与商业模式', 'MVP 范围与技术选型', '上线、收款与首批用户'],
    proof: '媒措 Moving 已在售，覆盖 macOS 与 Windows',
    href: '/projects/moving',
  },
  {
    title: 'AI 助理与知识系统',
    description: '飞书机器人、本地知识库、MCP 工具链，搭一个真正懂你业务的个人或团队 AI 助理。',
    points: ['知识库架构与整理规则', 'MCP 工具与自动化', '消息与工作流闭环'],
    proof: '用 40 个 MCP 工具搭出知识操作系统',
    match: '40 个 MCP',
  },
  {
    title: 'AI 内容生产',
    description: '选题、脚本、剪辑到数据复盘连成流水线，让内容稳定、高质量地产出。',
    points: ['选题与脚本系统', '口播剪辑自动化', '数据复盘与迭代'],
    proof: '口播剪辑：20 分钟原片到 10 分钟成片',
    match: '口播视频自动剪辑',
  },
];

/** 文章区摘句。 */
export const pullQuote = {
  text: 'AI 最大的价值，不是帮你省时间，而是帮你把系统搭起来。',
  match: '凌晨2点半',
};
