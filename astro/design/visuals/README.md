# 官网文生图素材

2026-09-21，本轮使用 **内置 image_gen**，未使用 CLI/API fallback。所有已选母版都保存在本目录，不依赖 Codex 全局生成目录运行。

## 交付清单

### 开源目录卡片 · 2026-09-23

| ID                                                                | 母版                           | 用途                                     |
| ----------------------------------------------------------------- | ------------------------------ | ---------------------------------------- |
| `hermes-book`、`skills-judgment`、`aiterm-open-source`、`mkd2pic` | `open-source/*-v1.png`         | 四个开源软件项目的独立卡片图             |
| 24 个 `moonlit-*` 工具 ID                                         | `open-source/moonlit-*-v1.png` | 每个公开工具一张专属概念图，不跨项目复用 |

28 张母版均由内置 image_gen 生成。参考 OIL 提供的开源目录截图只用于理解卡片尺寸和信息清晰度；主体另行设计为符合月明品牌的暖白、深蓝、铜橙 3D 静物，不复刻人物、宠物或页面配色。每张卡片的项目名称与用途由网页文字叠加，确保读者看图时能知道它做什么。完整提示词见 [prompts-v2.json](open-source/prompts-v2.json)。

| ID                   | 已选母版                                    | 用途                                         |
| -------------------- | ------------------------------------------- | -------------------------------------------- |
| book                 | `book-v1.png`                               | 精装书闭合、展开、对照、实践，2×2 关键画面   |
| skills               | `skills-v1.png`                             | 技能读取、扫描、评估、待确认，2×2 关键画面   |
| terminal             | `terminal-v1.png`                           | 终端、文件、编辑器、组合工作区，2×2 关键画面 |
| pages                | `pages-v1.png`                              | 手稿、排版、成图、多页，2×2 关键画面         |
| creatoros            | `creatoros-v1.png`                          | 创作模块概念图                               |
| thirdspace           | `thirdspace-v1.png`                         | 知识空间概念图                               |
| msg-collect          | `msg-collect-v1.png`                        | 信息采集概念图                               |
| ai-companion         | `ai-companion-v2.png`                       | 陪伴成长概念图，修掉 v1 多余文字             |
| 37 张历史文章封面    | `../cover-sources/legacy-article-*-v1.webp` | 每篇保留旧文独立的真人品牌文章封面           |
| wireframe-background | `wireframe-background-v1.png`               | 暖白浅灰绿空间线框背景                       |

[registry.json](registry.json) 是已选版本入口；[prompts-v1.json](open-source/prompts-v1.json) 保存早期素材提示词；[prompts-v2.json](open-source/prompts-v2.json) 记录 24 张独立开源工具图的统一规范和逐项场景。

## 统一风格与迭代

提示词锁定暖白、深蓝、铜橙、陶瓷与纸张质感、柔光和足够留白。网页标题与用途用 HTML 展示，不让模型生成文字。验收每张主体明确、无文字伪影或多项目共用图；卡片静止展示，不触发鼠标位移或自动切换。

图片是产品与内容的概念插画，不代替真实截图或事实证据。宇航员沿用用户既有 3D IP，本轮没有用线稿替换。

新增一版时生成 sibling 文件，例如 `book-v2.png`，先看图再修改 registry，不覆盖旧母版。历史文章只在 `content/legacy-covers.json` 中为当前保留的文章登记独立封面；每张封面有版本化文生图位图母版。旧的三张系列图已退出当前 registry，原始母版仍留在本目录作为历史记录。

## 网页导出

在站点根目录执行：

```sh
npm run assets:build
npm run build:local
```

Sharp 只负责缩放、WebP/JPEG 格式转换和分享图尺寸适配，不绘制图片主体。网页资源为带母版哈希的 480/800/1600px WebP；图集为 800/1600px；每张历史文章封面另有 1200×630 JPG 分享图。生成元数据记录原图与各衍生图 SHA-256。

导出文件数量和大小以最近一次 `npm run assets:build` 生成的元数据为准；该统计覆盖全部尺寸，不代表首屏下载量。

原有四个开源项目的四阶段图集仍留档，当前目录改用上表登记的静态卡片概念图，不触发鼠标位移或自动切换。完整规则见 [视觉规则](../../docs/brand-visual-system.md)。
