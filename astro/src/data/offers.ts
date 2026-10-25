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

export const coachingUrl = `mailto:${brand.email}?subject=${encodeURIComponent('AI 落地陪跑咨询｜月明Verse官网')}`;

export const offers = [
  {
    id: 'consult',
    label: '一对一咨询',
    title: '一小时，解决一个具体问题',
    price: '¥399',
    unit: '/ 小时',
    description: '带着你的项目或卡点来。一起梳理现状、拆开问题，给出能马上执行的下一步。',
    topics: consultationTopics,
    action: { label: '预约咨询', href: '/links#offers', payment: true },
  },
  {
    id: 'coaching',
    label: 'AI 落地陪跑',
    title: '把 AI 真正用进团队',
    price: '按项目',
    description: '面向创始人与小团队。从诊断现状开始，一起搭方法、跑通第一个场景，再交给团队自己运转。',
    topics: ['现状诊断与落地方案', '工作流搭建与陪跑实施', '团队培训与交接'],
    action: { label: '发邮件沟通', href: coachingUrl },
  },
  {
    id: 'community',
    label: '知识星球',
    title: '持续交流与答疑',
    price: '长期',
    description: 'AI 工具实测、产品实践与内容方法持续更新，加入后随时提问，长期跟进你的进展。',
    topics: ['工具实测与方法更新', '产品与内容实践分享', '会员随时提问'],
    action: { label: '加入知识星球', href: communityUrl, external: true },
  },
] as const;

/** 用户反馈：只放真实发生过的评价与案例。 */
export const testimonials = [
  {
    quote: '老师搭建的这个模型初始框架就已经很符合当前需要了，接下来先熟悉怎么用好工作流。',
    who: '灵犀用户',
    role: '付费定制 AI 工作流',
  },
  {
    quote: '两次咨询，把飞书机器人、本地知识库和消息闭环全部跑通。',
    who: '咨询案例',
    role: '个人 AI 助理搭建',
  },
];
