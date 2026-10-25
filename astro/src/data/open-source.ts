import { openSource } from './brand';
import catalog from './open-skills.json';
import { productDetails } from './product-details';

const softwareArtwork: Record<string, string> = {
  禾安成长日记: 'hean',
  'Hermes OpenClaw Book': 'hermes-book',
  'Skills Judgment': 'skills-judgment',
  AITerm: 'aiterm-open-source',
  mkd2pic: 'mkd2pic',
};

export const openSourceEntries = [
  ...openSource.map((item) => ({
    name: item.name,
    title: item.name,
    description: item.description,
    url: item.url,
    category: '独立软件',
    type: '软件',
    image: softwareArtwork[item.name] ?? 'hermes-book',
  })),
  ...catalog.skills.map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    url: item.url,
    category: item.category,
    type: '工具',
    image: item.name,
  })),
];

export const openSourceCategories = ['全部', ...new Set(openSourceEntries.map((item) => item.category))];

export type OpenSourceEntry = (typeof openSourceEntries)[number];
const categoryThemes: Record<string, string> = {
  独立软件: 'blue',
  'Agent 与工作流': 'teal',
  内容与写作: 'coral',
  发布与分发: 'sage',
  视觉与视频: 'plum',
  选题与研究: 'amber',
};
export const openSourceTheme = (item: OpenSourceEntry) =>
  productDetails[item.image]?.theme ?? categoryThemes[item.category] ?? 'blue';
