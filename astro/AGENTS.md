# AstroWind Agent Instructions

## Project Overview

AstroWind is a free, open-source website template built with **Astro v7** and **Tailwind CSS v4**. It generates a fully static site optimized for performance, SEO, and accessibility.

**Stack:** Astro v7 | Tailwind CSS v4 | TypeScript 5.9 | MDX | Sharp

## Skills

Before implementing a project-specific task (disabling the blog, Open Graph images, base paths, CMS, deployments, header customisation…), check `.agents/skills/` for an existing skill and follow it.

月明官网新增/更新文章和产品时，先读 [官网维护方案](docs/site-maintenance.md)。可使用本机 `moonlit-site-maintainer` Skill；即使未安装该 Skill，仍以本仓库流程和脚本为准。以下 AstroWind 通用说明不覆盖月明当前内容入口与视觉规则。

开源目录统一由 `src/data/open-source.ts` 组合 `src/data/open-skills.json` 与软件项目数据，页面入口为 `/opensource`。新增项目时核实对应 GitHub 仓库公开、非 fork、未归档；不要从本机安装清单复制未公开内容。卡片使用 `design/visuals/registry.json` 登记的文生图位图，通过共用 `CardEffect.astro` 接入鼠标触发的显色、斜条纹、底线和小幅倾斜；首页与目录共用 `OpenSourceCard.astro`，不用复制动效运行时，文章人像始终保留彩色。旧 `/skills` 路径保留跳转至 `/opensource`。

## Quick Reference

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run astro check + ESLint + Prettier |
| `npm run fix`     | Auto-fix ESLint + Prettier issues   |

**Node.js requirement:** >= 22.22.3

## Architecture

### Directory Structure

```
src/
  assets/styles/tailwind.css   # Tailwind v4 config (themes, utilities, plugins)
  components/
    common/        # Shared: Image, Metadata, Analytics, ToggleTheme
    ui/            # Primitives: Button, Form, Headline, Timeline, WidgetWrapper
    widgets/       # Page sections: Hero, Features, Bento, Pricing, Comparison, FAQs, Team, Gallery…
    blog/          # Blog: SinglePost, List, Pagination, Tags
    CustomStyles.astro  # CSS variables for colors and fonts
  content.config.ts    # Content Collections schema (Astro 5+ location)
  data/post/           # Historical generated files; no longer read
  layouts/             # Layout.astro, PageLayout.astro, MarkdownLayout.astro
  pages/               # File-based routing
  utils/               # blog.ts, images.ts, permalinks.ts, frontmatter.ts
  config.yaml          # Site configuration (loaded as virtual module)
  navigation.ts        # Navigation structure
  types.d.ts           # TypeScript type definitions
vendor/integration/    # Custom Astro integration for config loading
```

### Path Aliases

Use `~/` to import from `src/`:

```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';
```

### Configuration System

Site config lives in `src/config.yaml` and is loaded as a Vite virtual module `astrowind:config` by the custom integration in `vendor/integration/`. Exports: `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.

## Tailwind CSS v4

Configuration is CSS-first in `src/assets/styles/tailwind.css`:

- **Theme tokens:** `@theme { --color-primary: var(--aw-color-primary); ... }`
- **Custom utilities:** `@utility bg-page { ... }`
- **Dark mode:** Class-based via `@variant dark (&:where(.dark, .dark *))`
- **Plugins:** `@plugin "@tailwindcss/typography"`
- **Custom variant:** `@custom-variant intersect (&:not([no-intersect]))`

CSS variables for colors/fonts are defined in `src/components/CustomStyles.astro` with light/dark theme variants.

The Vite plugin `@tailwindcss/vite` is configured in `astro.config.ts` (not as an Astro integration).

### Class Merging

Components use `twMerge` from `tailwind-merge` v3 for conditional class composition.

## Content Collections

Defined in `src/content.config.ts` using Astro's Content Layer API with `glob()` loader. Posts are loaded from `.content-cache/<generation>/posts`, selected by `docs/content-manifest.json`. Edit original content and the website catalog, never the generated snapshot or `src/data/post/`. See [文章同步](docs/content-workflow.md).

Post frontmatter: `title` (required), `publishDate`, `updateDate`, `draft`, `excerpt`, `image`, `category`, `tags`, `author`, `metadata`.

## Component Patterns

- Props extend interfaces from `~/types`
- Use `class:list` for conditional classes
- Use `twMerge()` when accepting className overrides
- Use named slots for layout composition
- Widget components accept standardized props (see `~/types`)

## Image Handling

`src/components/common/Image.astro` supports:

- Local images via `astro:assets` (optimized by Sharp)
- Remote images via Unpic CDN
- Allowed domains (for providers Unpic can't detect, processed by Sharp): `cdn.pixabay.com`

Hero images use `loading="eager"` and `fetchpriority="high"`.

## Fonts

Fonts are handled by Astro's native **Fonts API**, configured in `astro.config.ts` under the `fonts` key (provider, family, `cssVariable`) and injected via the `<Font />` component in `src/layouts/Layout.astro`. Astro self-hosts, subsets, preloads, and generates metric-adjusted fallbacks. To change the typeface, edit the `fonts` entry and point `--aw-font-*` in `CustomStyles.astro` at the new `cssVariable`.

## Third-party Scripts (Partytown)

`@astrojs/partytown` is wired as an **opt-in** in `astro.config.ts`, gated behind `const hasExternalScripts = false`. Set it to `true` to offload third-party scripts (e.g. Google Analytics via `analytics.vendors.googleAnalytics.partytown`) to a web worker. It is disabled by default so the base template ships no external scripts.

## Content Security Policy

Astro's native CSP is intentionally **not** enabled in this version: it is incompatible with `<ClientRouter />` view transitions (shipped on by default) and would break the arbitrary third-party scripts a template user typically adds. CSP is deferred to AstroWind v2, where the component model (and optional SSR) make it clean and opt-in.

## Verification Checklist

After changes, always verify:

1. `npm run build` succeeds
2. `npm run check` passes (astro check + ESLint + Prettier)
3. Visual check in browser: affected homepage/list/detail pages in the confirmed light theme, mobile menu, and changed interactions
4. Structured data describes the site it is on: the `WebSite` / `Organization` block in `src/pages/index.astro` is built only from `config.yaml`; anything you add there must be true for your site

## 月明完整站本地补充

本仓库是从完整 AstroWind 改造并已上线 `aitongban.cloud` 的个人站。业务内容遵循 README 的单一入口，生成文章目录不直接编辑。示例仅在 reference，不发布。运行服务部署遵循上层运维仓库 AGENTS.md 与 docs/deployment.md；本地改动不等于已获下次生产重启授权。不得把 3D 渲染图称为真实宇航员网格模型；实时场景与角色图片是两层资产。

## 已确认的品牌视觉与演示规范

**2026-10-25 起官网进入改版 v6**：修改页面视觉、UI、布局或首页模块前，先完整阅读 [docs/redesign-v6/](docs/redesign-v6/README.md)（视觉风格、UI 规范、模块划分、验收标准）。素材类规则仍以下文的 brand-visual-system.md 为准。

新增或修改本站文章封面、产品主图、产品演示、本人照片及其布局前，必须阅读 [官网视觉规则](docs/brand-visual-system.md)。该文件是当前风格的单一依据，包含已认可样图、提示词模板、产品主题、共用组件与验收要求；历史设计记录不覆盖当前规范。沿用共享 tokens、素材 registry 和 ProductDemo，不为每页另做风格或交互运行时。用户最新明确反馈优先；改变方向时同步更新规范与样图。
