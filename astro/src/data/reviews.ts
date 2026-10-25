/** 首页 M8「公开复盘」。claim 必须来自原文；为空时整段不渲染（docs/redesign-v6/03 M8）。 */
export interface ReviewItem {
  date: string; // YYYY.MM
  title: string;
  claim: string;
  result?: string;
  tag?: string;
  links: { label: string; href: string }[];
}
export const reviews: ReviewItem[] = [];
