/**
 * 首页 M3「路径」时间轴。内容必须由本人提供或确认。
 * draft: true 的条目不渲染；没有已确认条目时整段不渲染（docs/redesign-v6/03 M3）。
 */
export interface TimelineItem {
  period: string;
  title: string;
  note?: string;
  current?: boolean;
  draft?: boolean;
}

export const timeline: TimelineItem[] = [
  { period: '待确认', title: '全栈开发工程师', note: '写代码、做系统', draft: true },
  { period: '待确认', title: '在职独立开发', note: '下班后一个人做产品', draft: true },
  { period: '现在', title: '一个人 + AI 团队', note: '做产品、做内容、做增长', current: true, draft: true },
];
