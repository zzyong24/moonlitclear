# 月明Verse · AstroWind 完整个人站

以 AstroWind 完整源码为基础改造的个人品牌站，2026-09-28 已替换 `aitongban.cloud` 的旧 Next.js 站。开源框架免费，无编辑后台或数据库。旧站目录与切换前完整备份保留在服务器，回滚见 [部署手册](docs/deployment.md)。

## 直接入口

- `npm ci`：安装构建依赖。
- `npm run dev -- --host 127.0.0.1 --port 4334`：开发。
- `npm run check`：Astro 类型、ESLint、Prettier。
- `npm run content:scan`：只读检查 Creator 文章与素材。
- `npm run assets:build`：导出文生图母版的响应式位图与分享图。
- `npm run build:local`：包含仅本地预览文章的完整构建。
- `npm run build`：仅公开内容同步、静态构建、路由校验、Brotli/gzip。
- `npm run preview:replacement`：完整替换服务器预览，`127.0.0.1:4333`。
- `npm run pack`：生成带 SHA-256 的独立发布包。

构建需 Node >=22.22.3（建议上游支持的 Node 24 LTS）；静态运行服务器 `serve.mjs` 只使用 Node 标准库，与现网 Node 20 兼容。

首次克隆后，先运行 `npm run assets:build` 和 `npm run content:sync` 再启动开发或检查；生成快照不进 git。本地查看 Creator 样本可先运行 `npm run build:local`，随后启动预览服务器。

## 单一维护入口

日常新增文章、新增产品、更新和撤下，统一从 [官网维护方案](docs/site-maintenance.md) 开始。用户用自然语言提出需求，AI 可调用 `moonlit-site-maintainer`；方案注明现有命令、发布边界和待补能力，并包含访客查找、阅读与分享路径。

| 内容                       | 位置                                                                    |
| -------------------------- | ----------------------------------------------------------------------- |
| 品牌、产品、合作、社交资料 | `src/data/brand.ts`                                                     |
| 开源目录                   | `src/data/open-source.ts`（软件项目 + 公开、非 fork、未归档的工具仓库） |
| 文章源文件                 | 旧文 `vault/writing/*.md`；新文由 Creator `work.json.artifacts` 指定    |
| 官网选稿与封面             | `content/catalog/*.json`、`design/cover-sources/`                       |
| 文生图母版与历史封面映射   | `design/visuals/registry.json`、`content/legacy-covers.json`            |
| 文章转换与迁移核验         | `scripts/sync-content.mjs`、`docs/content-manifest.json`                |
| 站点 SEO / 博客路径 / 主题 | `src/config.yaml`                                                       |
| 视觉样式                   | `src/assets/styles/daylight.css`（亮色主题）、`moonlit.css`（结构）     |
| 真人首屏                   | `src/components/moonlit/ProfileHero.astro`（静态照片）                  |
| 站内导航与页脚             | `src/components/moonlit/`                                               |
| 旧链接重定向               | `redirects.json`                                                        |
| 运行与发布                 | `serve.mjs`、`scripts/pack.mjs`                                         |

`docs/content-manifest.json` 指向 `.content-cache/<generation>` 内的完整生成快照，不直接编辑。`src/data/post` 是保留的旧生成目录，已不再读取。公开文章数量自动计算，校验按实际源文件、哈希、路由与标题执行，新增文章无需改数量。内容 hash 记录原始 Markdown，不修改旧 moonlitclear 仓库。

新增、草稿、更新和撤下统一遵循 [文章维护流程](docs/content-workflow.md)，可用 `npm run article:new -- --help` 查看新建命令。

## 对 AstroWind 的实际复用

上游 `arthelokyo/astrowind`，commit `14e1a691f80548dcc36370847b1a02c0d0b12821`，MIT（`LICENSE.md`）。保留完整 components、layouts、utils、vendor 和工具链；沿用 `PageLayout/Layout`、`ClientRouter`、`Projects`、`Content`、`Features3`、`SinglePost`、内容集合、SEO、图像优化与 sitemap。示例页面和示例文章归档在 `reference/`，不参与构建，避免混入虚构履历。编辑器示例也在 reference，不发布 CMS。

## 视觉与素材

后续 Agent 必须先阅读 [官网视觉规则](docs/brand-visual-system.md)，再生成封面、产品图或修改演示。规范包含用户认可的真人封面 v2、四产品主图 v3、提示词模板、配色与交互验收；AGENTS.md 和 CLAUDE.md 均已接入。

亮色细网格、暖白/深蓝/铜橙为品牌基础。首页与关于页使用本人照片，首页静态展示；关于页按原始竖版比例完整展示。宇航员组件、动作素材及旧设计只保留历史，不再由首页加载。照片与产品事实不重绘成虚构证据；个人肖像与 IP 不随模板 MIT 授权给第三方。

产品首页卡片、列表与详情共用 registry 中的产品素材 ID；七个产品各有独立 AI 主视觉与主题。产品详情统一复用 ProductDemo，默认静止、点击播放、支持暂停/步骤选择/键盘与减少动态效果，明确标注为流程示意。内容与步骤统一维护于 src/data/product-details.ts。

## 内容范围与已知缺失

Creator 预览样文已使用真人封面 v2；后续新增封面沿用真实内容加本人照片的方向。57 篇历史文章目前仍复用三组系列封面，并未批量改为真人图。四个开源项目保留鼠标驱动的四阶段生成画面。主体插画均为 AI 生成位图，32px 背景网格与可读演示 UI 由 CSS/HTML 实现。旧透视线框与宇航员封面是历史素材，不再作为新内容的参考。

公开模式保留 57 篇正文；当前本地预览另含一篇 Creator 样本。原 slug、4 条历史 308、项目总览与 7 个详情、关于、合作、RSS、sitemap、404 已接入。首屏/目录/文章/项目不跳回旧站；外部产品官网、开源仓库与社交平台保留正常外链。

旧源码中有 9 张被引用但未附带的图片（两篇文章），已核查旧站源码及本地内容目录未找回，清单见 `docs/missing-source-assets.json`。正文保留，缺图位置明确标为“原文配图暂缺”，没有用虚构图片补齐。这是原始资产缺失，迁移尚未恢复这些图片。

发布操作见 `docs/deployment.md`。上线前需要执行该文件的备份、隔离验收与切换步骤；不能只复制 dist 去覆盖旧 Next.js 文件。预览服务器添加 X-Robots-Tag，正式域名的 SEO 配置可索引。
