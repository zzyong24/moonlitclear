/**
 * Vault 文章读取引擎
 *
 * 从本地 vault 目录读取 Markdown 文件作为博客数据源，
 * 替代原来的 Sanity CMS 数据层。
 *
 * 数据流：vault/space/crafted/writing/*.md → gray-matter 解析 → 统一 Post 类型
 *
 * 设计决策：
 * - 使用 gray-matter 解析 frontmatter，它是 Next.js 生态中最成熟的选择
 * - 使用 reading-time 自动计算阅读时长，替代 Sanity 的自定义字段
 * - 文章 ID 使用文件名作为唯一标识（去掉 .md 后缀）
 * - slug 支持 frontmatter 中的 publish_slug 字段自定义，否则自动从文件名生成
 * - 用 markdown 标题提取作为目录导航数据源
 */

import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

// ============================================================
// 类型定义 — 与原 Sanity Post 类型保持兼容
// ============================================================

/** 博客文章（列表展示用） */
export interface VaultPost {
  /** 文件名作为唯一 ID */
  _id: string
  /** 文章标题（从 markdown 第一个 # 标题提取，或 frontmatter title） */
  title: string
  /** URL slug，优先取 frontmatter.publish_slug */
  slug: string
  /** 发布时间 ISO 字符串 */
  publishedAt: string
  /** 文章描述/摘要 */
  description: string
  /** 分类标签 */
  categories: string[]
  /** 阅读时长（分钟） */
  readingTime: number
  /** 文章情绪（默认 neutral） */
  mood: 'happy' | 'sad' | 'neutral'
  /** 主图信息 — 兼容原 Sanity 图片结构 */
  mainImage: {
    _ref: string
    asset: {
      url: string
      lqip?: string
      dominant?: {
        background: string
        foreground: string
      }
    }
  }
}

/** 博客文章详情（包含正文和目录） */
export interface VaultPostDetail extends VaultPost {
  /** Markdown 正文内容（原始文本） */
  body: string
  /** 标题列表，用于目录导航 */
  headings: VaultHeading[]
  /** 相关文章 */
  related?: VaultPost[]
}

/** 目录标题节点 */
export interface VaultHeading {
  /** 标题级别：h1, h2, h3, h4 */
  style: 'h1' | 'h2' | 'h3' | 'h4'
  /** 标题文本 */
  text: string
  /** 唯一 ID（用于锚点跳转） */
  id: string
}

// ============================================================
// 配置
// ============================================================

/**
 * vault 文章目录的绝对路径
 * 文章存放在 cali.so/vault/writing/（仓库内部），
 * 本地通过 symlink 链接到 Obsidian vault 实现双向同步
 */
const VAULT_WRITING_DIR = path.join(process.cwd(), 'vault', 'writing')

/**
 * 默认封面配色方案
 * 为没有封面图的文章提供一套预设的配色
 * 设计决策：使用多组柔和的渐变色，通过文件名 hash 分配，保证同一篇文章每次颜色一致
 */
const DEFAULT_PALETTES = [
  { background: '#1a1a2e', foreground: '#e0e0e0' },
  { background: '#16213e', foreground: '#e8e8e8' },
  { background: '#0f3460', foreground: '#f0f0f0' },
  { background: '#1b262c', foreground: '#bbe1fa' },
  { background: '#2d132c', foreground: '#ee4540' },
  { background: '#222831', foreground: '#eeeeee' },
  { background: '#1b1b2f', foreground: '#e43f5a' },
  { background: '#162447', foreground: '#e6e6e6' },
]

// ============================================================
// 核心函数
// ============================================================

/**
 * 通过简单 hash 为文件名分配一个稳定的配色方案
 */
function getPaletteForFile(filename: string) {
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    hash = (hash << 5) - hash + filename.charCodeAt(i)
    hash |= 0
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return DEFAULT_PALETTES[Math.abs(hash) % DEFAULT_PALETTES.length]!
}

/**
 * 将中文/特殊字符的标题转为 URL 友好的 slug
 *
 * 策略：
 * 1. 如果 frontmatter 有 publish_slug，直接使用
 * 2. 否则从文件名生成：去掉日期前缀，转小写，空格替换为连字符
 */
function generateSlug(filename: string, frontmatter: Record<string, unknown>): string {
  // 优先使用 frontmatter 中的自定义 slug
  if (frontmatter.publish_slug && typeof frontmatter.publish_slug === 'string') {
    return frontmatter.publish_slug
  }

  // 从文件名生成 slug：去掉 .md，去掉日期前缀 (YYYYMMDD_)
  const name = filename.replace(/\.md$/, '')
  const withoutDate = name.replace(/^\d{8}_/, '')

  return withoutDate
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-') // 保留中英文，其他替换为连字符
    .replace(/^-+|-+$/g, '') // 去掉首尾连字符
}

/**
 * 从 Markdown 内容中提取第一个 # 标题作为文章标题
 * 如果没有 # 标题，返回 undefined
 */
function extractTitleFromContent(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : undefined
}

/**
 * 从 Markdown 内容中提取第一段（非标题、非空行）作为描述
 */
function extractDescription(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    // 跳过标题、空行、分隔线、图片
    if (
      trimmed === '' ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('---') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('>')
    ) {
      continue
    }
    // 取第一段有内容的文本，截取前 200 字符
    return trimmed.length > 200 ? trimmed.slice(0, 200) + '...' : trimmed
  }
  return ''
}

/**
 * 从 Markdown 内容中提取所有标题（h1-h4）用于目录导航
 *
 * 设计决策：使用正则解析标题行，id 使用标题文本的简化版本作为锚点
 * 这比 AST 解析轻量得多，且对 Obsidian 风格 markdown 兼容性好
 */
function extractHeadings(content: string): VaultHeading[] {
  const headings: VaultHeading[] = []
  const lines = content.split('\n')
  let counter = 0

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length as 1 | 2 | 3 | 4
      const text = match[2].trim()
        .replace(/\*\*/g, '') // 去掉加粗标记
        .replace(/\*/g, '')   // 去掉斜体标记
        .replace(/`/g, '')    // 去掉代码标记

      counter++
      headings.push({
        style: `h${level}`,
        text,
        id: `heading-${counter}`,
      })
    }
  }

  return headings
}

/**
 * 读取并解析单个 Markdown 文件为 VaultPost
 */
function parseMarkdownFile(filePath: string): VaultPostDetail | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)

    const filename = path.basename(filePath)
    const id = filename.replace(/\.md$/, '')
    const palette = getPaletteForFile(filename)

    // 提取标题：优先 frontmatter.title → 内容中第一个 # 标题 → 文件名
    const contentTitle = extractTitleFromContent(content)
    const title =
      String(frontmatter.title || '') ||
      contentTitle ||
      id.replace(/^\d{8}_/, '').replace(/_/g, ' ')

    // 提取描述：优先 frontmatter.publish_description → frontmatter.description → 自动提取
    const description =
      String(frontmatter.publish_description || '') ||
      String(frontmatter.description || '') ||
      extractDescription(content)

    // 生成 slug
    const slug = generateSlug(filename, frontmatter)

    // 计算发布时间：优先 frontmatter.created
    const publishedAt = frontmatter.created
      ? new Date(frontmatter.created as string).toISOString()
      : new Date().toISOString()

    // 计算阅读时长
    const readTime = readingTime(content)

    // 构建封面图：使用 frontmatter.publish_cover 或默认渐变色背景
    const coverUrl = frontmatter.publish_cover
      ? `/vault-assets/${id}/${frontmatter.publish_cover}`
      : '' // 空字符串表示使用默认样式

    // 分类：从 frontmatter.tags 或 publish_category 获取
    const categories: string[] = []
    if (frontmatter.publish_category) {
      categories.push(frontmatter.publish_category as string)
    } else if (Array.isArray(frontmatter.tags)) {
      // 过滤掉通用标签，保留有意义的分类
      const skipTags = ['crafted', 'note', 'article', 'writing']
      const filtered = (frontmatter.tags as string[]).filter(
        (t) => !skipTags.includes(t)
      )
      categories.push(...filtered.slice(0, 3))
    }

    // 提取标题结构
    const headings = extractHeadings(content)

    return {
      _id: id,
      title,
      slug,
      publishedAt,
      description,
      categories,
      readingTime: Math.ceil(readTime.minutes),
      mood: (frontmatter.mood as 'happy' | 'sad' | 'neutral') || 'neutral',
      mainImage: {
        _ref: id,
        asset: {
          url: coverUrl,
          lqip: '',
          dominant: palette,
        },
      },
      body: content,
      headings,
    }
  } catch (error) {
    console.error(`[vault] Failed to parse ${filePath}:`, error)
    return null
  }
}

// ============================================================
// 公开 API — 与原 sanity/queries.ts 函数签名兼容
// ============================================================

/**
 * 获取所有已发布文章的 slug 列表
 * 等价于原 getAllLatestBlogPostSlugs()
 */
export function getAllVaultPostSlugs(): string[] {
  const posts = getAllVaultPosts()
  return posts.map((p) => p.slug)
}

/**
 * 获取所有 vault 文章，按发布时间倒序
 * 内部函数，供其他公开 API 使用
 */
function getAllVaultPosts(): VaultPostDetail[] {
  if (!fs.existsSync(VAULT_WRITING_DIR)) {
    console.warn(`[vault] Writing directory not found: ${VAULT_WRITING_DIR}`)
    return []
  }

  const files = fs.readdirSync(VAULT_WRITING_DIR).filter((f) => f.endsWith('.md'))
  const posts: VaultPostDetail[] = []

  for (const file of files) {
    const post = parseMarkdownFile(path.join(VAULT_WRITING_DIR, file))
    if (post) {
      // 默认所有文章都可展示，除非 frontmatter.publish === false
      // 后续可以加 publish: true 的过滤逻辑
      posts.push(post)
    }
  }

  // 按发布时间倒序排列
  posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return posts
}

/**
 * 获取最新的博客文章列表
 * 等价于原 getLatestBlogPosts()
 *
 * @param options.limit - 返回数量限制，默认 5
 * @param options.forDisplay - 是否用于展示（当前忽略，保留接口兼容）
 */
export function getLatestVaultPosts(options?: {
  limit?: number
  forDisplay?: boolean
}): VaultPost[] {
  const { limit = 5 } = options || {}
  const allPosts = getAllVaultPosts()

  // 返回时去掉 body 和 headings（列表页不需要）
  return allPosts.slice(0, limit).map(({ body: _body, headings: _headings, ...rest }) => rest)
}

/**
 * 根据 slug 获取单篇文章详情
 * 等价于原 getBlogPost()
 */
export function getVaultPost(slug: string): VaultPostDetail | undefined {
  const allPosts = getAllVaultPosts()
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) return undefined

  // 附加相关文章（基于标签交集）
  const related = allPosts
    .filter((p) => {
      if (p._id === post._id) return false
      const sharedTags = p.categories.filter((c) =>
        post.categories.includes(c)
      )
      return sharedTags.length > 0
    })
    .slice(0, 3)
    .map(({ body: _body, headings: _headings, ...rest }) => rest)

  return {
    ...post,
    related: related.length > 0 ? related : undefined,
  }
}

/**
 * 获取站点设置信息
 * 等价于原 getSettings()
 * 返回你的个人信息（MoonlitClear）
 */
export function getVaultSettings() {
  return {
    projects: null,
    heroPhotos: null as string[] | null,
    resume: null as
      | {
          company: string
          title: string
          logo: string
          start: string
          end?: string
        }[]
      | null,
  }
}
