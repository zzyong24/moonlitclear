# 月明Verse 官网改版 v6 · 执行总纲

> 状态：设计规范已定稿，待实施（2026-10-25）
> 参考：[lizheng.ai](https://www.lizheng.ai/)（截图存档见 [`design/redesign-v6/reference/`](../../design/redesign-v6/reference/)）
> 适用范围：`astro/` 当前 Astro 站点。旧 Next.js 根目录不改。
> 读者：负责实施的开发者 / 模型。动手前按顺序读完本目录全部文件。

## 0. 一句话目标

把现在「亮色细网格 + WebGL 流线 + 卡片 Tab」的作品集首页，改成 **深夜蓝 × 月白纸色交替分段、宋体大标题、编辑部式排版** 的个人主页：像一本可以从上往下读完的个人档案，而不是一个需要点 Tab 才能看到内容的作品集。

## 1. 文件清单

| 文件 | 内容 | 什么时候读 |
| --- | --- | --- |
| [01-visual-style.md](01-visual-style.md) | 视觉风格、参考拆解、取舍、色彩/字体/图像/动效原则 | 第一个读 |
| [02-ui-spec.md](02-ui-spec.md) | 设计令牌（tokens）、字号表、间距、组件规范与状态 | 写 CSS / 组件时 |
| [03-layout-modules.md](03-layout-modules.md) | 栅格、断点、首页 11 个模块逐一定义、子页面改造、数据来源 | 搭页面时 |
| [04-acceptance.md](04-acceptance.md) | 分阶段交付、验收清单、截图与记录要求、禁止项 | 每个阶段结束时逐条自检 |

## 2. 与现有规范的关系（必须遵守）

1. [`docs/brand-visual-system.md`](../brand-visual-system.md) 仍是 **素材** 的单一依据：真人文章封面、产品主视觉、产品演示 ProductDemo、开源卡片配图、素材 registry、`npm run assets:build` 流程全部继续有效。
2. 本目录是 **页面视觉、UI 与布局** 的新依据，覆盖 brand-visual-system.md 中以下旧条目：
   - 「官网继续使用亮色页面与细网格」→ 改为亮/暗分段，首页取消 32px 细网格。
   - 「T-416/T-417 共用 WebGL 流线背景」→ 首页、作品、文章、开源列表页不再挂载 `SiteAtmosphere`；代码保留不删（可回滚），详见 01 §6。
   - 首页 `home-index` Tab 切换 → 改为纵向分段，Tab 只留在 `/opensource` 分类筛选里。
   - 字体「使用系统中文字体」→ 标题改用宋体系衬线（Noto Serif SC），正文仍用系统黑体。
3. 产品主题色（coral / blue / amber / sage / peach / plum / teal）、`CardEffect.astro` 的悬停揭幕、文章封面「始终彩色」规则保持不变。
4. 实施完成后，由实施者在 brand-visual-system.md 顶部的「改版说明」里把状态从「待实施」改为「已实施 + 日期 + 验收截图路径」。不要再新建第三份规范。

## 3. 不变的东西

- 品牌名「月明Verse」、姓名「朱志勇」、定位「独立开发者，一个人做产品、做内容、做增长」。
- 所有业务数据入口：`src/data/brand.ts`、`product-details.ts`、`open-source.ts`、`github-stats.json`、文章 Content Collection。**页面里不允许手写数量、Star 数或项目名列表。**
- 路由：`/`、`/projects`、`/projects/[slug]`、`/opensource`、`/blog`、`/blog/[...slug]`、`/links`、`/ama`、`/about → /links`、`/skills → /opensource`。不新增、不删除路由（除 04 中明确列出的可选模块）。
- 部署流程见 [`docs/deployment.md`](../deployment.md)；本地完成 ≠ 上线。

## 4. 推荐实施顺序

1. **P0 基础层**：新 tokens 文件 + 字体接入 + Section / Container / Button / Eyebrow / SectionHeading 基础组件 + 新 Header / Footer。
2. **P1 首页**：按 03 中模块顺序逐个实现，每完成 2–3 个模块截图自检一次。
3. **P2 列表页**：`/projects`、`/opensource`、`/blog`、`/links` 换上新外壳与列表样式。
4. **P3 详情页**：`/projects/[slug]`、`/blog/[...slug]` 只换字体、色彩与页头，不改结构与 ProductDemo。
5. 每阶段跑 [04-acceptance.md](04-acceptance.md) 全部适用条目，保存截图后再进下一阶段。

## 5. 遇到不确定时

- 规范没写到的：沿用参考站的做法，但颜色、字体、文案语气以本规范为准。
- 需要用户提供的真实信息（履历节点、合作名单等）：用 03 中规定的数据文件占位，**页面上不显示该模块**，并在交付记录里列出「待用户补充」。绝不编造经历、评价、数据。
- 与用户最新明确反馈冲突时，以用户反馈为准，并回写本目录。
