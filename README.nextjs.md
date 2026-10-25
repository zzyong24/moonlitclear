# 🌙 MoonlitClear — 个人博客 & 数字花园

> 造系统的工程师 · AI 实践者 · 跨界探索者 · 创造者

MoonlitClear 的个人站点，基于 [cali.so](https://github.com/CaliCastle/cali.so) 开源项目二次开发。

博客内容采用 **Vault 模式**（本地 Markdown 文件驱动），告别 CMS 依赖，用 Obsidian 写文章，Git 管版本。

## ✨ 特色功能

- 📝 **Vault 博客系统** — 本地 Markdown 文件即文章，支持 frontmatter、自动生成 slug、阅读时间估算
- 🎨 **项目展示** — 静态配置，支持 emoji 图标、技术标签、项目状态
- 💬 **评论 & 留言墙** — 基于 Clerk 认证 + Neon PostgreSQL
- 📧 **邮件订阅** — Resend + React Email，支持订阅确认 & 留言通知
- 📊 **浏览统计** — Upstash Redis 驱动的阅读量 & 反应计数
- 🎭 **Framer Motion 动画** — 流畅的页面过渡和交互动效

## 🛠 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 框架 | [Next.js 14](https://nextjs.org/) (App Router) | 服务端渲染 + 静态生成 |
| 语言 | [TypeScript](https://www.typescriptlang.org/) | 全栈类型安全 |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) | 原子化 CSS |
| 内容 | Vault (本地 Markdown) | Obsidian 写文章，Git 管版本 |
| 数据库 | [Neon](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/) | 评论 / 留言 / 订阅 |
| 认证 | [Clerk](https://clerk.com/) | 用户登录（留言 / 评论） |
| 邮件 | [Resend](https://resend.com/) + [React Email](https://react.email) | 订阅确认 / 留言通知 |
| 缓存 | [Upstash Redis](https://upstash.com/) | 浏览统计 / 反应计数 |
| 动画 | [Framer Motion](https://www.framer.com/motion/) | 页面过渡动画 |
| UI | [Radix UI](https://www.radix-ui.com/) | 无障碍组件 |
| 部署 | [Vercel](https://vercel.com/) | 自动构建部署 |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 安装 & 运行

```bash
# 克隆仓库
git clone https://github.com/zzyong24/cali.so.git
cd cali.so

# 安装依赖
pnpm install

# 复制环境变量并配置
cp .env.example .env.local

# 启动开发服务器
pnpm dev
```

### 环境变量

查看 `.env.example` 了解所有配置项。核心变量：

| 变量 | 必需 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | 站点 URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk 认证公钥 |
| `CLERK_SECRET_KEY` | ✅ | Clerk 认证密钥 |
| `DATABASE_URL` | ⚠️ | PostgreSQL 连接串（评论 / 留言需要） |
| `RESEND_API_KEY` | ⚠️ | 邮件服务（订阅通知需要） |
| `UPSTASH_REDIS_REST_URL` | ⚠️ | Redis（浏览统计需要） |

## 📝 写博客文章

在 `vault/space/crafted/writing/` 目录创建 Markdown 文件即可：

```yaml
---
title: "文章标题"
publish_slug: "article-slug"
publish_description: "一句话描述"
created: "2026-03-19 10:00:00"
tags: ["ai", "engineering"]
mood: "happy"
---

# 文章标题

正文内容...
```

文件命名规范：`YYYYMMDD_文章标题.md`，保存后开发服务器自动热更新。

## 📁 项目结构

```
cali.so/
├── app/                    # Next.js App Router
│   ├── (main)/             # 主要页面（首页/博客/项目/留言墙）
│   ├── admin/              # 管理后台
│   └── api/                # API 路由
├── assets/                 # 头像、图标等静态资源
├── components/             # 通用组件（评论、Markdown 渲染等）
├── config/                 # 导航、邮件、缓存 key 配置
├── db/                     # 数据库 schema
├── emails/                 # React Email 邮件模板
├── lib/                    # 工具库（vault 引擎、SEO 等）
└── vault/                  # 博客文章（Markdown 文件）
```

## 🙏 致谢

本项目基于 [Cali Castle](https://github.com/CaliCastle) 的 [cali.so](https://github.com/CaliCastle/cali.so) 开源项目开发，感谢 Cali 的慷慨分享。

## 📜 License

MIT
