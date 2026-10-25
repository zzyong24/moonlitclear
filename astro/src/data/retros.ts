/**
 * 首页「复盘」：每条都来自已发表文章，match 用标题片段在构建时找到原文链接；
 * 找不到原文（例如本地缺创作者文章）时该条自动隐藏，不显示无出处的数字。
 */
export interface Retro {
  figure: string;
  unit?: string;
  context: string;
  conclusion: string;
  match: string;
}

export const retros: Retro[] = [
  {
    figure: '18.8',
    unit: '元',
    context: '第一笔「自己做的产品」的钱',
    conclusion: '最大的卡点从来不是产品好不好，是你敢不敢开口。',
    match: '收到第一笔钱',
  },
  {
    figure: '394',
    unit: '个问题',
    context: 'CreatorOS 做完 50 多个任务后的产品审计',
    conclusion: '每个任务单独看都正确，叠加起来的产品却是错的。',
    match: '394 个问题之后',
  },
  {
    figure: '6',
    unit: '分',
    context: '87 个 MCP 工具之后，还想再造一个系统管理它',
    conclusion: '听起来很美。让 AI 打完分，我才冷静下来。',
    match: '打了 6 分',
  },
  {
    figure: '10853',
    unit: '行',
    context: '预估 3–5 天的活，3 小时交付',
    conclusion: '前提不是模型更强，是把 AI 当新员工来管。',
    match: '10853',
  },
  {
    figure: '4',
    unit: '个坑',
    context: '把主力 AI 助手换成 Agent 的头两天',
    conclusion: '知道路径，比知道答案更重要。',
    match: '两天踩了四个坑',
  },
  {
    figure: '拆了',
    context: '在 Hermes 上叠了一层自定义编排',
    conclusion: '让它做擅长的事，长任务交给工作流引擎。',
    match: '然后拆了',
  },
];

/** 文章区摘句，同样按标题找原文。 */
export const pullQuote = {
  text: '这不是 AI 的问题。是你在用一个非常顺手的工具，帮自己建了一个更舒适的茧房。',
  match: '不可能实现的产品',
};
