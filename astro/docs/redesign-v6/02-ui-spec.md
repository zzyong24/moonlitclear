# 02 · UI 规范

## 1. 设计令牌（新建 `src/assets/styles/tokens-v6.css`，版本名 `moonlit-web-3`）

在 `SiteLayout` 中于 `brand-tokens.css` 之后引入。旧 `--brand-*` 变量保留，并改为指向新令牌，保证详情页、ProductDemo 不需逐个改。

```css
:root {
  /* 夜（暗段） */
  --night-900: #0a1828;   /* 时间轴、Footer */
  --night-800: #10233a;   /* Hero、产品、合作 */
  --night-700: #1a3150;   /* 暗段卡片底 / 悬停 */
  --line-dark: rgba(246, 239, 226, 0.14);
  --line-dark-strong: rgba(246, 239, 226, 0.28);

  /* 月白（亮段） */
  --moon-50: #fcfaf5;     /* 主亮底 */
  --moon-100: #f5f0e6;    /* 暖底 */
  --moon-200: #ece4d4;    /* 更暖底 */
  --line-light: #e2dacb;
  --line-light-strong: #cfc4b0;
  --card-light: #fffdf9;  /* 亮段内的卡片 */

  /* 文字 */
  --moon-cream: #f6efe2;                      /* 暗底主文字 */
  --moon-cream-2: rgba(246, 239, 226, 0.72);  /* 暗底正文 */
  --moon-cream-3: rgba(246, 239, 226, 0.6);   /* 暗底辅助，仅 ≥14px */
  --ink: #182b42;      /* 亮底标题 */
  --body: #394b60;     /* 亮底正文 */
  --muted: #536176;    /* 亮底辅助 */

  /* 强调 */
  --copper: #9b4f2c;        /* 亮底强调：eyebrow、链接、当前态 */
  --copper-moon: #e2a676;   /* 暗底强调 */
  --moon-glow: rgba(132, 150, 255, 0.16); /* Hero 月晕，仅此一处 */

  /* 字体 */
  --font-serif: 'Noto Serif SC', 'Songti SC', STSong, serif;
  --font-sans: var(--brand-font);

  /* 圆角 */
  --radius-sm: 8px;    /* 标签、输入框 */
  --radius-md: 14px;   /* 卡片 */
  --radius-lg: 20px;   /* 大卡片、Hero 方案 B 照片框 */
  --radius-btn: 10px; /* 按钮（2026-10-25 细节打磨：由胶囊改为 10px） */

  /* 阴影：只用于亮段浮起卡片 */
  --shadow-card: 0 1px 2px rgba(24, 43, 66, 0.04), 0 12px 32px -12px rgba(24, 43, 66, 0.12);

  /* 动效 */
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --dur-fast: 160ms;
  --dur-base: 300ms;
}
```

对比度（已核算，WCAG AA）：cream/night-800 13.9；cream-72%/night-800 7.8；copper-moon/night-800 7.5；ink/moon-50 13.8；body/moon-200 7.1；muted/moon-200 5.0；copper/moon-50 5.7；copper/moon-200 4.7。**新增任何文字色组合都必须 ≥ 4.5（正文）/ 3.0（≥24px 标题）。**

段落容器用 `data-tone="dark|light"` 切换文字色，组件内部只引用语义变量：

```css
[data-tone='dark']  { --fg: var(--moon-cream); --fg-2: var(--moon-cream-2); --fg-3: var(--moon-cream-3); --accent: var(--copper-moon); --line: var(--line-dark); }
[data-tone='light'] { --fg: var(--ink);        --fg-2: var(--body);         --fg-3: var(--muted);        --accent: var(--copper);      --line: var(--line-light); }
```

## 2. 字体接入

- 用 Astro Fonts API（`astro.config.ts` 的 `fonts`）接入 `Noto Serif SC`，只要 700、900，`cssVariable: '--font-serif-loaded'`，`display: swap`。
- 中文必须子集化：构建时扫描页面实际出现的标题字符生成子集（可用 `subset-font` / `glyphhanger` 脚本，或 Fonts API 支持的 `unicode-range` 分片）。首屏需要的衬线字体文件合计 **≤ 250KB（woff2）**。
- 背景大字「月」单独确保包含在子集中。
- 字体未加载完时回退 `Songti SC / STSong`，不允许出现长时间不可见文字（FOIT）。

## 3. 字号表

| Token | 用途 | 桌面 ≥1024 | 平板 768 | 手机 390 | 字重 / 行高 / 字距 | 字体 |
| --- | --- | --- | --- | --- | --- | --- |
| `display` | Hero H1 | 84px | 64px | 44px | 900 / 1.12 / 0.02em | serif |
| `h2` | 每段大标题 | 46px | 40px | 32px | 900 / 1.2 / 0.02em | serif |
| `h3` | 卡片标题、文章标题 | 26px | 24px | 20px | 700 / 1.3 / 0.02em | serif |
| `h4` | 时间轴节点名、列表小标题 | 20px | 20px | 18px | 700 / 1.35 | serif |
| `stat` | 大数字 | 56px | 48px | 40px | 400 / 1 | serif，tabular-nums |
| `lead` | Hero 介绍、段落说明 | 18.5px | 18px | 16px | 400 / 1.85 | sans |
| `body` | 正文 | 16px | 16px | 15px | 400 / 1.75 | sans |
| `small` | 卡片辅助、日期 | 14px | 14px | 13px | 400 / 1.6 | sans |
| `eyebrow` | 段落小标 | 13px | 13px | 12px | 500 / 1.4 / 0.08em | sans |

规则：
- 最小可读字号 13px，仅用于 eyebrow / 日期；暗底上 < 14px 的文字必须用 `--fg-2` 及以上，不得用 `--fg-3`。
- H1、H2 允许手动 `<br />` 断行，保证每行是完整语义（参考：「学点真本事，/ 做点真东西。」）。手机端也要检查断行，不能出现单字成行。
- 标题用 `text-wrap: balance`，正文用 `text-wrap: pretty`。

## 4. 间距

基准 4px。常用：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128。

| 场景 | 桌面 | 手机 |
| --- | --- | --- |
| 段落上下内边距 | clamp(64px, 6.4vw, 96px)（大段）/ clamp(48px, 4.8vw, 72px)（小段） | 同左，随视口收缩 |
| 段落标题区 → 内容 | 56px | 32px |
| eyebrow → H2 | 12px | 8px |
| H2 → 说明 | 20px | 12px |
| 卡片内边距 | 28px | 20px |
| 卡片间距 | 24px | 16px |
| 列表行上下内边距 | 28px | 20px |

## 5. 组件规范

所有新组件放 `src/components/v6/`，一个组件一个文件，Props 写 TypeScript 接口。

### 5.1 `Section.astro`
- Props：`tone: 'dark' | 'light'`，`bg: 'night-900' | 'night-800' | 'moon-50' | 'moon-100' | 'moon-200'`，`size: 'lg' | 'sm'`，`id?`，`labelledby?`。
- 输出 `<section data-tone data-bg>`，整幅背景，内部包 `Container`。

### 5.2 `Container.astro`
- 内容宽 `max-width: 1200px`；左右内边距 `--gutter: clamp(20px, 4vw, 48px)`；`margin-inline: auto`。页头与内容同宽。
- 变体 `narrow`：760px（收尾 CTA、文章正文）。

### 5.3 `SectionHeading.astro`（每段标题固定句式）
- 结构：左列 `eyebrow` + `h2`；右列 `lead` 说明 + 可选文字链接。
- 桌面：12 栏中左 7 栏 / 右 5 栏，右列 **底部对齐** 左列标题最后一行。
- 手机：上下堆叠，说明在标题下方。
- eyebrow 格式：`中文名 · English`，例如 `产品 · Products`。颜色 `--accent`。

### 5.4 `Button.astro`
| 变体 | 暗段 | 亮段 | 用途 |
| --- | --- | --- | --- |
| `primary` | 底 `--moon-cream`，字 `--night-800` | 底 `--night-800`，字 `--moon-cream` | 每段最多 1 个 |
| `secondary` | 1px `--line-dark-strong` 描边，字 `--fg` | 1px `--ink` 描边，字 `--ink` | 次要动作 |
| `text` | 字 `--fg`，后接「→」 | 同左 | 列表、段尾链接 |

- 尺寸：高 44px（手机 ≥ 44px 触控），左右内边距 20px，`--radius-btn`（10px），字号 15px / 500；悬停上移 1px，主按钮加投影。
- 悬停：primary 底色混 8% 黑或白；secondary 底色变 `--line`；text 箭头右移 4px。
- 焦点：`outline: 2px solid var(--accent); outline-offset: 3px;`，所有可点击元素统一。
- 外链加 `target="_blank" rel="noreferrer"`，箭头用「↗」；站内用「→」。

### 5.5 `Header.astro`（替换 `components/moonlit/Header.astro`）
- 高 72px（手机 60px）。左：24px 蓝紫光环头像 + 「月明Verse」（serif 700 18px）+ 下方小字「朱志勇 · 独立开发者」（12px，`--fg-2`）。
- 中右：导航 `产品 /projects`、`开源 /opensource`、`文章 /blog`、`关于我 /links`，15px，间距 28px，当前页文字 `--accent` + 底部 2px 线。
- 最右：`GitHub ↗` secondary 小按钮（高 36px）+ `聊一聊` primary 小按钮（链接 `/links#offers`）。
- 首页顶部透明叠在 Hero 上（tone dark）；滚动超过 24px 后底色 `--night-800` 95% + `backdrop-filter: blur(8px)` + 底部 `--line-dark`。其他页面默认实底。
- 手机：导航收为右侧汉堡按钮，展开为全屏 `--night-800` 面板，链接 serif 28px 竖排，`Esc` 和点击链接关闭，打开时锁定滚动并把焦点移到第一个链接。

### 5.6 `Footer.astro`（替换）
- `--night-900`。上排：左「月明Verse」serif + 一句定位 + 邮箱；右「关注」+ 社交图标按钮组。下排：站内链接（产品 / 开源 / 文章 / 关于我 / RSS）左，`© {year} 朱志勇 · MoonlitVerse` 右，中间 1px `--line-dark` 分隔。
- 社交：GitHub、抖音、B 站、小红书（链接以现有 Footer 为准，不新增未核实账号）。

### 5.7 `SocialIcon.astro`
- 36px 圆形，1px `--line-dark-strong` 描边，图标 16px，`aria-label` 写平台名。悬停底色 `--night-700`。

### 5.8 `Stat.astro`
- 数字（`stat`）+ 右上角 `+` 角标（`--accent`，可选）+ 下方说明（`small`，`--fg-2`）。
- 数值通过 props 传入，来源见 03。HTML 里直接输出终值；JS 只负责「从 0 滚到终值」的增强。

### 5.9 `TimelineRail.astro`（横向路径时间轴）
- 一条 1px `--line-dark-strong` 横线，节点为 9px 空心圆；最后一个节点实心 `--copper-moon` 且外圈 4px 同色 20% 光晕（静态）。
- 节点下：`h4` 名称（serif，`--fg`）+ 1–2 行说明（small，`--fg-2`）。
- 桌面 ≤ 6 个节点等分；手机改为纵向时间轴（左侧竖线）。

### 5.10 `DarkCard.astro` / `LightCard.astro`
- DarkCard：底透明，1px `--line-dark`，`--radius-md`，悬停底 `--night-700`。
- LightCard：底 `--card-light`，1px `--line-light`，`--radius-md`，`--shadow-card` 仅在“浮起”变体使用。
- 强调卡（合作方式第 1 张）：暗段中使用 `--moon-100` 实底、深色文字，形成反差（参考站「从这里开始」卡）。

### 5.11 `EditorialRow.astro`（文章、开源排行等列表行）
- 栅格：日期/序号列 120px | 标题+摘要 1fr | 右侧元信息/箭头 auto。
- 标题 `h3` serif，摘要 1 行 `--fg-2`，超出省略号。行间 1px `--line` 分隔，列表顶部一条 2px `--fg` 粗线（参考「最近在想的事」）。
- 整行可点击（`<a>` 包裹整行，内部不再嵌套链接）。悬停：底色 `color-mix(in srgb, var(--fg) 3%, transparent)`，箭头右移。

### 5.12 `FilterChips.astro`（仅 /opensource 与开源段使用）
- 高 34px，`--radius-pill`，未选中 1px `--line` 描边，选中底 `--fg` 字反色。`role="tablist"` 或 `aria-pressed`，支持方向键。手机横向滚动，选中项自动滚入视野。

### 5.13 `Tag.astro`
- 高 24px，`--radius-sm`，12px，底 `--accent` 12% 透明，字 `--accent`。用于「内测」「共同开发」「写于 xx」等状态。

## 6. 状态与可访问性通用要求

- 每个交互组件必须有：默认 / 悬停 / 焦点可见 / 按下 / 禁用（如适用）五态。
- 图片必须有 `alt`；装饰性元素（背景字、月晕、分隔线）`aria-hidden`。
- 每个 Section 有唯一 `h2`，`aria-labelledby` 指向它；页面只有一个 `h1`。
- 跳到正文链接保留在 Header 第一位。

## 附：2026-10-25 细节打磨（已实施，优先于上文冲突处）

对照参考站逐项测量后补充的细节，代码在 `src/assets/styles/tokens-v6.css` 与 `src/components/v6/`：

- **数字字体**：统计数字、日期、价格用 `--font-num`（Source Serif 4 600，构建时只保留 ASCII，约 10KB），不用宋体 900，显得更轻更精致。
- **颗粒质感**：暗色段落（首屏、产品、合作、页脚）加 `.v6-grain`，SVG 噪点 7% overlay。首屏另有两层径向光（右上偏亮、左下压暗）。
- **首屏书法字**：「月明」用 Ma Shan Zheng 毛笔字形转成的 SVG（`src/assets/moonlit/brush-yueming.svg`），人像压在字前；入场时字从左向右揭开，文案依次上浮。
- **首屏色带**：首屏底部接一条更深的色带，显示「方向」（有已确认时间轴时显示「路径」），节点圆点 + 细线，最后一项高亮。
- **卡片**：`.v6-card` = 1px 描边 + `0 26px 50px -38px` 长淡投影，圆角 14px，悬停上移 4px。
- **文章列表**：日期栏 8rem、宋体标题 22px、单行摘要、右侧箭头；不再显示分类标签，悬停标题变强调色。
- **段落标题**：左右 1 : 0.9，底对齐，右侧说明 16.5px 弱化色。
- **数据条**：数字下方一行「在这些地方更新」，平台名用宋体列出。
