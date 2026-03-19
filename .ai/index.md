# cali.so 项目索引

> 最后更新：2026-03-19
> 用途：快速定位「改什么内容去哪个文件」，理解页面-数据-组件的关系

---

## 一、快速查找表 — 我要改 XXX 去哪里？

### 1.1 个人品牌信息

| 要改什么 | 去哪个文件 | 具体位置 |
|---------|-----------|---------|
| 首页身份标签（造系统的工程师/AI实践者...） | `app/(main)/Headline.tsx` | 4 个函数组件：`SystemBuilder` `AIPractitioner` `CrossBoundaryExplorer` `Builder` |
| 首页自我介绍段落 | `app/(main)/Headline.tsx` | `<Balancer>` 标签内的文本（L81-85） |
| 首页社交链接 | `app/(main)/Headline.tsx` | 底部 `<SocialLink>` 列表（L99-109） |
| SEO 标题/描述 | `lib/seo.ts` | `seo.title` 和 `seo.description` |
| 全局 HTML meta | `app/layout.tsx` | `metadata` 对象（keywords, openGraph, twitter） |
| AMA 页面介绍 | `app/(main)/ama/page.tsx` | `description` 常量 + `<article>` 正文 |
| About 页面 | `app/(main)/about/page.tsx` | ⚠️ 当前占位，待开发 |
| 版权信息 | `app/(main)/Footer.tsx` | 底部 `© MoonlitClear. 基于 cali.so 开源项目` |
| 活动状态名称 | `app/(main)/Activity.tsx` | `MoonlitClear 在使用 {app}` 文本（L87） |
| 邮件签名/描述 | `emails/Layout.tsx` | `<strong>MoonlitClear</strong>` + 身份描述 |
| 邮件社交链接 | `emails/Layout.tsx` | 底部 `<Link>` 列表 |

### 1.2 头像/图片资源

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 主头像 | `assets/Portrait.png` | 146 KB，Header 左上角展示 |
| 备用头像 | `assets/PortraitAlt.jpg` | 77 KB，右键头像切换 |
| 网站 favicon | `app/icon.png` | 浏览器标签页图标 |
| Apple Touch Icon | `app/apple-icon.png` | iOS 收藏图标 |
| OpenGraph 分享图 | `app/opengraph-image.png` | 社交媒体分享时的预览图 |
| Twitter 分享图 | `app/twitter-image.png` | Twitter 分享预览图 |
| 首页轮播照片 | `app/(main)/Photos.tsx` | 5 张照片，存放在同目录 `image-*.jpg` |

### 1.3 导航/路由

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 顶部导航菜单 | `config/nav.ts` | `navigationItems` 数组 |
| 404 页面 | `app/not-found.tsx` | 找不到页面时展示 |
| IP 封禁页 | `app/blocked/page.tsx` | ✅ 邮箱已更新为 qq1968286694@gmail.com |
| 站点地图 | `app/sitemap.ts` | 自动生成，基于 vault 文章 |

### 1.4 博客文章

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 写新文章 | `../vault/space/crafted/writing/` | 放一个 `.md` 文件即可 |
| 文章解析引擎 | `lib/vault.ts` | Markdown → 博客数据的核心逻辑 |
| 博客列表页样式 | `app/(main)/blog/page.tsx` + `BlogPosts.tsx` | 列表页和卡片组件 |
| 博客详情页样式 | `app/(main)/blog/[slug]/` | 动态路由，文章详情页 |
| 文章卡片样式 | `app/(main)/blog/BlogPostCard.tsx` | 单篇文章卡片组件 |
| 文章目录导航 | `app/(main)/blog/BlogPostTableOfContents.tsx` | 侧边目录 |
| 文章反应(emoji) | `app/(main)/blog/BlogReactions.tsx` | 文章底部点赞 |
| Markdown 渲染 | `components/PostMarkdown.tsx` | 文章正文渲染组件 |

### 1.5 项目展示

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 项目列表页 | `app/(main)/projects/page.tsx` | 项目列表 |
| 项目数据来源 | `app/(main)/projects/Projects.tsx` | ✅ 静态配置，5 个项目（ThirdSpace/AI童伴/LifeOS/Obsidian AI Chat/MoonlitClear） |
| 项目卡片样式 | `app/(main)/projects/ProjectCard.tsx` | 支持 emoji 图标、技术标签、项目状态展示 |

### 1.6 留言墙

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 留言墙页面 | `app/(main)/guestbook/page.tsx` | 主页面 |
| 留言列表 | `app/(main)/guestbook/GuestbookFeeds.tsx` | 留言展示组件 |
| 留言输入 | `app/(main)/guestbook/GuestbookInput.tsx` | 输入框组件 |
| 留言 API | `app/api/guestbook/route.ts` | CRUD 接口 |
| 新留言通知邮件 | `emails/NewGuestbook.tsx` | ✅ 已更新为 MoonlitClear |

### 1.7 邮件订阅（Newsletter）

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 订阅表单组件 | `app/(main)/Newsletter.tsx` | 首页/Footer 的邮件订阅表单 |
| 订阅 API | `app/api/newsletter/route.ts` | 邮件主题已更新为 `来自 MoonlitClear 的订阅确认` |
| 订阅确认邮件 | `emails/ConfirmSubscription.tsx` | ✅ 已更新为 MoonlitClear |
| 邮件基础布局 | `emails/Layout.tsx` | ✅ 已更新为 MoonlitClear |
| 邮件发送配置 | `config/email.ts` | `from` 邮箱和 `baseUrl` |
| Newsletter 管理 | `app/admin/newsletters/` | 后台发送 Newsletter |

### 1.8 评论系统

| 要改什么 | 去哪个文件 | 说明 |
|---------|-----------|------|
| 评论组件 | `components/Commentable.tsx` | 19.8 KB，最复杂的组件 |
| 评论 API | `app/api/comments/route.ts` | CRUD 接口 |
| 回复通知邮件 | `emails/NewReplyComment.tsx` | ✅ 已更新为 MoonlitClear |

---

## 二、内容数据流 — Vault 文章如何变成页面

```
vault/space/crafted/writing/*.md          ← 你在这里写文章
         │
         ▼
   lib/vault.ts (解析引擎)               ← gray-matter 解析 frontmatter + reading-time
         │
         ├── getLatestVaultPosts()         → 首页博客列表
         ├── getAllVaultPostSlugs()         → 生成静态路由
         └── getVaultPost(slug)            → 文章详情页
              │
              ▼
   app/(main)/blog/[slug]/page.tsx        ← 动态路由渲染
         │
         ├── PostMarkdown.tsx              ← Markdown 正文渲染
         ├── BlogPostTableOfContents.tsx   ← 目录导航
         └── BlogReactions.tsx             ← 反应/互动
```

### 2.1 Vault 文章 Frontmatter 字段

| 字段 | 类型 | 用途 | 默认值 |
|------|------|------|--------|
| `title` | string | 文章标题（优先于 Markdown # 标题） | 从文件名生成 |
| `description` | string | 文章描述/摘要 | 从正文第一段提取 |
| `publish_slug` | string | 自定义 URL slug | 从文件名生成 |
| `publish_description` | string | 发布用描述（优先于 description） | — |
| `publish_cover` | string | 封面图文件名 | 使用渐变色 |
| `publish_category` | string | 主分类 | 从 tags 取前 3 个 |
| `created` | datetime | 发布时间 | 当前时间 |
| `tags` | string[] | 标签列表 | [] |
| `mood` | happy/sad/neutral | 文章情绪 | neutral |

### 2.2 文件命名规范

```
YYYYMMDD_文章标题.md
例：20260312_AI本体论_从工具到基础物质的认知跃迁.md
```

- 日期前缀 `YYYYMMDD_` 会在生成 slug 时自动去除
- slug 生成规则：`publish_slug` > 文件名去日期前缀 > 转小写连字符

### 2.3 当前已有文章

| 文件名 | 预计 slug |
|--------|----------|
| `20260312_AI本体论_从工具到基础物质的认知跃迁.md` | `ai本体论-从工具到基础物质的认知跃迁` |
| `20260313_AI_协作开发工程化实践方法论.md` | `ai-协作开发工程化实践方法论` |
| `20260314_AI行业替代性分析_如何把AI拴在现实里.md` | `ai行业替代性分析-如何把ai拴在现实里` |
| `20260315_文本是知识的接口.md` | `文本是知识的接口` |

> 💡 建议给每篇文章加 `publish_slug` 字段，用英文 slug 提升 SEO 效果。

---

## 三、页面-组件-数据 关系图

```
┌─────────── 首页 (/) ───────────────────────────────────────────┐
│                                                                 │
│  ┌── Header.tsx ──────────────────────────────────────────┐     │
│  │ Avatar.tsx (Portrait.png)  NavigationBar.tsx (config/nav.ts)│ │
│  │ ThemeSwitcher.tsx          Sign-in (Clerk)             │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌── Headline.tsx ────────────────────────────────────────┐     │
│  │ 身份标签（4个）+ 自我介绍 + 社交链接                      │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌── Photos.tsx ──────────────────────────────────────────┐     │
│  │ 5 张轮播照片 (image-1~5.jpg)                            │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌── Resume.tsx ──────────────────────────────────────────┐     │
│  │ 工作经历 ← getVaultSettings().resume (当前 null)        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌── BlogPosts.tsx ───────────────────────────────────────┐     │
│  │ 文章列表 ← getLatestVaultPosts({ limit: 4 })           │     │
│  │   └── BlogPostCard.tsx × N                              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌── Activity.tsx ────────────────────────────────────────┐     │
│  │ 实时活动 ← /api/activity (外部 API)                     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌── Footer.tsx ──────────────────────────────────────────┐     │
│  │ Newsletter.tsx (订阅表单) + 导航链接 + 版权 + 浏览计数     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌── 博客列表 (/blog) ──────────────────────────┐
│ BlogPosts.tsx ← getLatestVaultPosts()         │
│   └── BlogPostCard.tsx × N                    │
└───────────────────────────────────────────────┘

┌── 博客详情 (/blog/[slug]) ───────────────────┐
│ BlogPostPage.tsx ← getVaultPost(slug)         │
│   ├── PostMarkdown.tsx (正文)                  │
│   ├── BlogPostTableOfContents.tsx (目录)       │
│   ├── BlogReactions.tsx (互动)                 │
│   └── Commentable.tsx (评论)                   │
└───────────────────────────────────────────────┘

┌── 项目 (/projects) ──────────────────────────┐
│ Projects.tsx ← getSettings().projects (Sanity) │
│   └── ProjectCard.tsx × N                      │
└────────────────────────────────────────────────┘

┌── 留言墙 (/guestbook) ──────────────────────┐
│ Guestbook.tsx                                 │
│   ├── GuestbookInput.tsx (需 Clerk 登录)       │
│   └── GuestbookFeeds.tsx ← /api/guestbook     │
└───────────────────────────────────────────────┘

┌── AMA (/ama) ────────────────────────────────┐
│ 纯静态文本，无数据源                            │
└───────────────────────────────────────────────┘
```

---

## 四、技术栈 & 基础设施

### 4.1 核心依赖

| 层 | 技术 | 说明 |
|---|------|------|
| 框架 | Next.js 14 (App Router) | 服务端渲染 + 静态生成 |
| 语言 | TypeScript | 全栈类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS |
| CMS | ~~Sanity~~ → Vault (本地 Markdown) | 文章已迁移到 vault |
| 数据库 | Neon (PostgreSQL) + Drizzle ORM | 评论/留言/订阅 |
| 认证 | Clerk | 用户登录（留言/评论需要） |
| 邮件 | Resend + React Email | 订阅确认/留言通知 |
| 缓存 | Upstash Redis | 浏览统计/反应计数 |
| 部署 | Vercel | 自动部署 |
| 动画 | Framer Motion | 页面过渡动画 |
| 状态 | Valtio | 轻量状态管理 |

### 4.2 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | 站点 URL |
| `DATABASE_URL` | ⚠️ | PostgreSQL 连接串（评论/留言需要） |
| `RESEND_API_KEY` | ⚠️ | 邮件服务 API key |
| `UPSTASH_REDIS_REST_URL` | ⚠️ | Redis 连接（浏览统计需要） |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ | Redis 认证 |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | 可选 | Sanity CMS（项目数据源） |
| `NEXT_PUBLIC_SANITY_DATASET` | 可选 | Sanity 数据集 |
| `NEXT_PUBLIC_SITE_EMAIL_FROM` | ⚠️ | 发件邮箱 |
| `SITE_NOTIFICATION_EMAIL_TO` | 可选 | 通知接收邮箱 |

---

## 五、Cali 残留清理清单（按优先级）

### 🔴 高优先级 — 用户直接可见 ✅ 已全部清理

| # | 文件 | 残留内容 | 状态 |
|---|------|---------|------|
| 1 | `emails/ConfirmSubscription.tsx` | ~~"确认订阅 Cali 的动态"~~ → MoonlitClear | ✅ 已修复 |
| 2 | `app/api/newsletter/route.ts` | ~~`subject: '来自 Cali 的订阅确认'`~~ → MoonlitClear | ✅ 已修复 |
| 3 | `app/blocked/page.tsx` | ~~`mailto:hi@cali.so`~~ → qq1968286694@gmail.com | ✅ 已修复 |
| 4 | `emails/NewGuestbook.tsx` | ~~`userFirstName = 'Cali'` `https://cali.so/icon.png`~~ → MoonlitClear | ✅ 已修复 |
| 5 | `emails/NewReplyComment.tsx` | ~~`postLink = 'https://cali.so'` `userFirstName = 'Cali'`~~ → MoonlitClear | ✅ 已修复 |

### 🟡 中优先级 — 功能相关 ✅ 已全部清理

| # | 文件 | 残留内容 | 状态 |
|---|------|---------|------|
| 6 | `app/api/favicon/route.tsx` | ~~硬编码 `https://cali.so/favicons/`~~ → 相对路径 `/favicons/` | ✅ 已修复 |
| 7 | `app/(main)/Activity.tsx` | ~~`hostname === 'cali.so'`~~ → 所有环境启用 | ✅ 已修复 |
| 8 | `app/(main)/newsletters/[id]/page.tsx` | ~~`@thecalicastle`~~ → @MoonlitClear | ✅ 已修复 |

### 🟢 低优先级 — 文档/注释

| # | 文件 | 残留内容 | 状态 |
|---|------|---------|------|
| 9 | `README.md` | 全文 Cali 引用 | ⏳ 待重写为 MoonlitClear 项目 README |
| 10 | `package.json` | `"name": "cali.so"` | ⏳ 可改为 `"moonlitclear-site"` |
| 11 | `lib/vault.ts` | ~~注释 "Sanity 中 Cali 的信息"~~ → MoonlitClear | ✅ 已修复 |
| 12 | `emails/newsletters/1.md` | Cali 的旧 Newsletter | ⏳ 可删除或重写 |

---

## 六、待开发功能

| 功能 | 当前状态 | 涉及文件 | 说明 |
|------|---------|---------|------|
| About 页面 | ⚠️ 占位文本 | `app/(main)/about/page.tsx` | 需要开发完整的个人介绍页 |
| 首页轮播照片 | ⚠️ 仍为原项目图片 | `app/(main)/Photos.tsx` + `image-*.jpg` | 需要替换为你的照片 |
| 工作经历(Resume) | ⚠️ 返回 null | `app/(main)/Resume.tsx` + `lib/vault.ts` | `getVaultSettings()` 返回空 |
| 社交链接 | ⚠️ 占位 URL | `app/(main)/Headline.tsx` | GitHub/邮箱链接需要换成真实地址 |
| 项目数据 | ✅ 已迁移到本地静态配置 | `app/(main)/projects/Projects.tsx` | 5 个项目，支持 emoji/标签/状态 |

---

## 七、常见操作指南

### 7.1 新增一篇博客文章

```bash
# 1. 在 vault 写文章目录创建 md 文件
touch ../vault/space/crafted/writing/20260319_文章标题.md
```

文件头部加 frontmatter：
```yaml
---
title: "文章标题"
publish_slug: "article-slug"          # 建议用英文
publish_description: "一句话描述"
publish_category: "AI"
created: "2026-03-19 10:00:00"
tags: ["ai", "engineering"]
mood: "happy"
---

# 文章标题

正文内容...
```

> 保存后，Next.js 开发服务器会自动重新读取，无需重启。

### 7.2 修改导航菜单

编辑 `config/nav.ts`：

```ts
export const navigationItems = [
  { href: '/', text: '首页' },
  { href: '/blog', text: '博客' },
  { href: '/projects', text: '项目' },
  { href: '/guestbook', text: '留言墙' },
  { href: '/ama', text: 'AMA 咨询' },
  // 取消注释或新增：
  // { href: '/about', text: '关于' },
]
```

### 7.3 修改社交链接

编辑 `app/(main)/Headline.tsx` 底部 `<SocialLink>` 部分：

```tsx
<SocialLink href="https://github.com/你的用户名" platform="github" />
<SocialLink href="mailto:你的邮箱" platform="mail" />
<SocialLink href="/feed.xml" platform="rss" />
// 可选平台: github | twitter | youtube | telegram | bilibili | mail | rss
```

### 7.4 替换头像

直接替换以下文件（保持文件名不变）：

```
assets/Portrait.png       → 主头像（推荐正方形，512×512 以上）
assets/PortraitAlt.jpg    → 备用头像
app/icon.png              → Favicon（推荐 32×32 或 64×64）
app/apple-icon.png        → Apple Touch Icon（推荐 180×180）
app/opengraph-image.png   → 社交分享图（推荐 1200×630）
```

---

## 八、目录结构速查

```
cali.so/
├── .ai/
│   └── index.md                ← 📍 你正在看的这个文件
├── app/
│   ├── layout.tsx              ← 根布局 + 全局 SEO metadata
│   ├── (main)/
│   │   ├── page.tsx            ← 首页入口
│   │   ├── Headline.tsx        ← ★ 核心：身份标签 + 自我介绍 + 社交链接
│   │   ├── Header.tsx          ← 顶部导航
│   │   ├── Footer.tsx          ← 底部 + 订阅
│   │   ├── blog/               ← 博客模块
│   │   ├── projects/           ← 项目模块
│   │   ├── guestbook/          ← 留言墙
│   │   ├── ama/                ← AMA 页面
│   │   └── about/              ← 关于页（待开发）
│   ├── admin/                  ← 管理后台
│   ├── api/                    ← API 路由
│   └── studio/                 ← Sanity Studio
├── assets/
│   ├── Portrait.png            ← ★ 主头像
│   ├── PortraitAlt.jpg         ← ★ 备用头像
│   └── icons/                  ← 47 个 SVG 图标组件
├── components/
│   ├── Avatar.tsx              ← 头像组件
│   ├── Commentable.tsx         ← 评论系统
│   ├── PostMarkdown.tsx        ← Markdown 渲染
│   ├── links/                  ← 链接组件（SocialLink, RichLink）
│   └── ui/                     ← 通用 UI 组件
├── config/
│   ├── nav.ts                  ← ★ 导航菜单配置
│   ├── email.ts                ← 邮件配置
│   └── kv.ts                   ← Redis key 定义
├── db/
│   └── schema.ts               ← 数据库表结构
├── emails/
│   ├── Layout.tsx              ← 邮件布局
│   ├── ConfirmSubscription.tsx ← 订阅确认邮件
│   ├── NewGuestbook.tsx        ← 留言通知
│   └── NewReplyComment.tsx     ← 回复通知
├── lib/
│   ├── seo.ts                  ← ★ SEO 配置
│   ├── vault.ts                ← ★ Vault 文章引擎
│   └── ...                     ← 工具库
├── sanity/
│   ├── schemas/                ← 内容模型定义
│   └── queries.ts              ← 数据查询（已部分替代）
└── public/
    ├── apps/                   ← Activity 组件 App 图标
    ├── avatars/                ← 留言墙默认头像
    └── reactions/              ← 文章反应 emoji
```

---

## 九、更新本索引

**何时更新**：
- 新增/删除页面路由时
- 新增/修改组件时
- 数据源变更时（如 Sanity → Vault 迁移）
- 品牌信息变更时
- 完成 Cali 残留清理时（勾掉清理清单对应项）

**谁来更新**：
- AI 助手在每次创建新文件或新模块后应主动更新本文件
- 日常修改可在完成后批量更新
