/** 合作方式：首页 M9 与 /links 共用一份数据。 */
import { brand } from './brand';

export const communityUrl = 'https://wx.zsxq.com/group/88882141588552';
export const submissionUrl = `mailto:${brand.email}?subject=${encodeURIComponent('作品投稿｜月明Verse官网')}`;

export const consultationTopics = [
  'AI 原生开发：从需求、Agent 分工到验证与交付的实际工作流',
  '产品从 0 到 1：方向、商业模式、上线、收款与首批用户',
  '个人助理搭建：两次咨询中解决飞书机器人、本地知识库与消息闭环',
  'AI 辅助自媒体：选题、脚本、制作和复盘怎样连成流程',
];

export const offers = [
  {
    id: 'consult',
    label: '01 / 一对一',
    title: '咨询',
    price: '¥399',
    unit: '/ 小时',
    description: '带着问题来。我们一起梳理现状、拆开卡点，讨论下一步怎么做。',
    topics: consultationTopics,
    action: { label: '查看咨询付款方式', href: '/links#offers', payment: true },
  },
  {
    id: 'community',
    label: '02 / 持续交流',
    title: '知识星球 · 交流答疑',
    price: '长期',
    description: '把值得继续讨论的 AI 工具、产品实践和内容创作问题放在一起，方便持续交流。',
    note: '适合想持续关注我的实践，或带着具体问题来讨论的朋友。',
    action: { label: '进入知识星球', href: communityUrl, external: true },
  },
  {
    id: 'submission',
    label: '03 / 分享作品',
    title: '作品投稿',
    price: '开放',
    description: '做出了能打开、能运行的作品？欢迎发来。好的、有趣的项目，我会了解后再决定是否分享给更多人。',
    note: '请附作品名称、可访问链接、解决的问题和你的联系方式。',
    action: { label: '通过邮件投稿', href: submissionUrl },
  },
] as const;
