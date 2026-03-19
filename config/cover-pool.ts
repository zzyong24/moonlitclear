/**
 * 封面图池映射配置
 *
 * 设计决策：
 * - 使用固定数量的图片池（19 张），避免图片随文章增长导致网页加载变慢
 * - 每篇文章通过 slug 映射到图片池中的一张图
 * - 映射时注意视觉多样性：相邻文章不使用相同色调的封面
 * - 未映射的文章自动通过 hash 分配（保证一致性，但可能视觉不够理想）
 *
 * 图片池目录：public/covers/pool/cover-{01-19}.png
 *
 * 图片色调索引（方便选图时参考）：
 * cover-01: 🧠 蓝紫色 — 神经网络/大脑
 * cover-02: 🧠 暖金色 — 思维火花/灵感
 * cover-03: 🧠 粉玫瑰 — 共享意识/连接
 * cover-04: 🧠 冷青色 — 知识冰山
 * cover-05: 💻 橙琥珀 — 齿轮/工程系统
 * cover-06: 💻 深蓝色 — 代码/数据流
 * cover-07: 💻 银灰色 — 云架构/服务器
 * cover-08: 🌊 日出暖色 — 棱镜/光谱
 * cover-09: 🌊 银白星空 — 星座/神圣几何
 * cover-10: 🌊 深海蓝 — 海浪/数据波
 * cover-11: 🌊 紫金色 — 宇宙/无限
 * cover-12: 🏗️ 暖棕色 — 匠人/手工
 * cover-13: 🏗️ 薄荷绿 — 模块化/积木（有重叠，实际可能不同）
 * cover-14: 🏗️ 冰蓝色 — 晶体/六边形
 * cover-15: 🌱 暮色橙 — 光破云层/突破
 * cover-16: 🌱 翠绿色 — 珊瑚/水下花园
 * cover-17: 🌱 晨曦粉 — 山路/灯笼
 * cover-18: 🌱 绿金色 — 知识树/盆栽
 * cover-19: 🔮 迷宫金 — 迷宫/解题
 */

/** 图片池总数 */
export const COVER_POOL_SIZE = 19

/** 图片池路径前缀 */
export const COVER_POOL_PREFIX = '/covers/pool/cover-'

/**
 * 文章 slug → 图片编号 的手动映射
 *
 * 设计原则：
 * 1. 相邻发布的文章尽量使用不同色系
 * 2. 文章主题与图片意象大致匹配
 * 3. 新增文章时在此添加一行即可
 *
 * 使用方式：
 *   映射值为图片编号（01-19），对应 pool/cover-{num}.png
 */
export const COVER_MAP: Record<string, string> = {
  // === 现有文章映射 ===

  // AI本体论 — 哲学/抽象 → 紫金宇宙（无限/本体）
  'ai-ontology-from-tool-to-fundamental-substance': '11',

  // AI协作开发工程化实践 — 工程/代码 → 橙琥珀齿轮（工程系统）
  'ai-collaborative-dev-engineering-practice': '05',

  // AI行业替代性分析 — 认知/分析 → 深海数据波（深度分析）
  'ai-industry-replacement-analysis': '10',

  // 文本是知识的接口 — 知识/哲学 → 冷青知识冰山
  'text-is-the-interface-of-knowledge': '04',

  // ThirdSpace 部署教程 — 技术/架构 → 冰蓝晶体（系统结构）
  'thirdspace-build': '14',

  // 如何复刻本网站 — 教程/搭建 → 暖棕匠人（手工搭建）
  'guide-for-cloning-my-site': '12',
}

/**
 * 根据 slug 获取封面图路径
 *
 * 查找顺序：
 * 1. 手动映射表（COVER_MAP）
 * 2. 自动 hash 分配（保证同一篇文章每次结果一致）
 *
 * @param slug - 文章的 URL slug
 * @returns 封面图的公共路径，如 /covers/pool/cover-05.png
 */
export function getCoverFromPool(slug: string): string {
  // 优先查手动映射
  const mapped = COVER_MAP[slug]
  if (mapped) {
    return `${COVER_POOL_PREFIX}${mapped.padStart(2, '0')}.png`
  }

  // 自动 hash 分配（兜底）
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i)
    hash |= 0
  }
  const index = (Math.abs(hash) % COVER_POOL_SIZE) + 1
  const num = index.toString().padStart(2, '0')
  return `${COVER_POOL_PREFIX}${num}.png`
}
