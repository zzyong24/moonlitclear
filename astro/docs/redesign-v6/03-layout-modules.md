# 03 · 布局与模块划分

## 1. 栅格与断点

| 断点 | 宽度 | 栅格 | 容器 |
| --- | --- | --- | --- |
| `sm` | < 768px（基准 390） | 4 栏，gap 16 | 100% − 40px |
| `md` | 768–1023 | 8 栏，gap 20 | 100% − 64px |
| `lg` | 1024–1279 | 12 栏，gap 24 | 100% − 64px，max 1120 |
| `xl` | ≥ 1280（基准 1440） | 12 栏，gap 24 | 1120 居中 |

- 桌面验收宽度：1440 / 1280；平板 768；手机 390 / 360。
- 任何宽度下 **禁止横向滚动**（时间轴、筛选条等组件内部的横向滚动除外，需有可见的滚动提示或渐隐边）。
- 段落标题句式统一用 `SectionHeading`（左 7 / 右 5，右列底对齐）。

## 2. 首页模块（`src/pages/index.astro`，从上到下）

线框标记：`[ ]` 区块，`|` 分栏。每个模块给出：目的 / 布局 / 内容与数据来源 / 交互 / 手机端。

---

### M1 · Header
见 02 §5.5。首页透明叠在 Hero 上。

---

### M2 · Hero（`night-800`，tone dark，高度 = min(100svh, 760px)，至少 640px）

```
[Header ...........................................................]
| eyebrow: 朱志勇 · 独立开发者          |        ┌───── 超大「月」字 ───── (向右溢出裁切)
| H1: 一个人做产品。                     |        │   人物抠图（半身，底边贴住段落底）
|     做内容，也做增长。                 |        │
| lead: 我是朱志勇，也叫月明Verse……       |        │
| [看我做的产品 primary] [读我的文章 secondary]  │
| 关注我 ○ ○ ○ ○                          |        └──────────────────
```

- 目的：3 秒内说清「我是谁、做什么、去哪看」。
- 布局：左 6 栏文字（垂直居中略偏上），右 6 栏人像。月晕：人像身后一个 `--moon-glow` 径向渐变，直径约 720px，静态。
- 文案（可微调措辞，不改事实）：
  - eyebrow：`朱志勇 · 月明Verse`
  - H1：`一个人做产品。<br />做内容，也做增长。`
  - lead：`我是朱志勇，也叫月明Verse。全栈开发工程师，在职独立开发者。这里有我做的 {projects.length} 个产品、{openSourceEntries.length} 个开源项目，以及 {posts.length} 篇从 0 到 1 的真实记录。`（数字来自数据，不手写）
  - 按钮：`看我做的产品` → `#products`；`读我的文章` → `#articles`。
  - 社交：`socials`（`src/data/brand.ts`）。
- 人像：`portrait-cutout-v1.png`（见 01 §5），`loading="eager"`、`fetchpriority="high"`，导出 WebP，桌面宽约 520px。
- 手机：文字在上、人像在下（高约 380px，「月」字缩到约 300px 仍在人物身后），H1 44px，按钮两个各占一行宽度 100%。

---

### M3 · 路径时间轴（`night-900`，tone dark，size sm）

```
| eyebrow: 路径 · Path   一句说明：从写代码到一个人做完整的产品。 |
|──○────────○────────○────────○────────●── |
| 节点1     节点2     节点3     节点4     现在 |
```

- 目的：替代参考站「履历」，给可信度。
- 数据：新建 `src/data/timeline.ts`：`{ period: string; title: string; note?: string; current?: boolean }[]`。
- **内容必须由用户提供或确认。** 已知可用事实：全栈开发工程师、在职独立开发者、产品与开源项目的上线顺序。实施时：
  1. 先用 `brand.ts` 里已有事实 + 产品上线顺序生成草稿，标记 `draft: true`；
  2. `draft: true` 的条目不渲染；全部为草稿时整个 M3 不渲染（页面直接从 Hero 接 M4），并在交付记录里写明「待用户补充时间轴」。
- 交互：无。手机改纵向。

---

### M4 · 数字与身份（`moon-50`，tone light，size sm）

```
| 07 + 产品      | 29 + 开源项目   | 240 + GitHub Star  | 46 + 篇文章 |
|─────────────────────────────────────────────────────── |
| 我在做的方向： AI Native · 独立产品 · 工具实测 · 内容与增长 |
```

- 4 个 `Stat`，中间 1px 竖线分隔（手机 2×2，无竖线、上下分隔）。
- 数据：
  - 产品 = `projects.length`
  - 开源 = `openSourceEntries.length`
  - GitHub Star = `github-stats.json` 中 `repos[*].stars` 求和（构建时计算，2026-10-25 快照为 240；≥1000 时显示为 `1.2K` 一位小数）。线框里的数字仅为示意
  - 文章 = `fetchPosts()` 总数
  - 「+」角标只在数据会持续增长时显示；数字为 0 的统计项不显示。
- 下方一行方向标签：沿用 `LinksPanel` 的 `intro-tags`（全栈开发 / AI Native / 独立产品 / 内容与增长）。
- 不做参考站的「评价」「受邀分享」行，除非用户提供真实材料（届时放 `src/data/endorsements.ts`，带来源链接）。

---

### M5 · 产品（`night-800`，tone dark，id=`products`）

```
| eyebrow: 产品 · Products                 |  说明：每个产品都从我自己遇到的问题开始…  |
| H2: 一个人，{n} 个产品。                 |  [全部产品 →]                          |
|──────────────────────────────────────────────────────────────── |
| [旗舰产品大卡：左图 7 栏 | 右 5 栏：标签/名称/一句话/4 个功能点/按钮] |
| [卡][卡][卡]                                                     |
| [卡][卡][卡]                                                     |
```

- 目的：替代参考站「我们在建一座城」——这一段是主角。
- 旗舰：`projects[0]`（当前为「媒措 Moving」），或在 `brand.ts` 给项目增加 `featured: true` 字段，取第一个。大卡左图（`CardEffect` + registry 主图，4:3），右侧 `tag`（Tag 组件）/ `name`（h3 32px）/ `headline`（lead）/ `features` 四项（2×2 小列表，前缀「—」）/ `查看产品 →` primary。
- 其余产品：3 栏 DarkCard 网格，每卡：图（16:10，CardEffect）、`tag`、`name`（h3）、`description`（2 行截断）、右上 ↗。数量 = `projects.length - 1`，不截断。
- 产品主题色：卡片悬停时底线 / 描边用该产品 `--card-accent`（现有 `data-card-theme`）。
- 手机：旗舰卡上图下文；其余单列。

---

### M6 · 开源（`moon-200`，tone light，id=`opensource`）

```
| eyebrow: 开源 · Open Source    |  说明：从独立软件到内容工作流……  |
| H2: 把做事的方法，             |                                 |
|     开源成可用的工具。         |                                 |
| [全部][独立软件][Skills][...] FilterChips                         |
| 左 7 栏：精选 4 张 OpenSourceCard（2×2）| 右 5 栏：Star 排行 EditorialRow ×5 |
| [查看全部 {n} 个开源项目 →]                                       |
```

- 目的：对应参考站「问问立正」两栏结构：左是可看的东西，右是“别人在看什么”。
- 左：现有 `OpenSourceCard.astro`（`compact`），取 Star 最高 4 个；筛选只影响左侧卡片，纯前端过滤，无 JS 时显示「全部」。
- 右：「最多人 Star」列表，按 `stars` 降序前 5，每行：序号（serif 20px）| 名称 + 用途短句 | `★ {stars}`（`--copper`，tabular-nums）。
- 底部：段尾 text 按钮到 `/opensource`。
- 手机：筛选条横滚 → 卡片单列 2 张 → 排行列表 → 链接。

---

### M7 · 文章（`moon-50`，tone light，id=`articles`）

```
| eyebrow: 文章 · Writing        | 说明：在做产品和内容的过程中反复遇到的问题。 |
| H2: 思考的过程，也值得留下。   | [全部 {n} 篇 →]                              |
|━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━|
| [精选文章大卡：左 封面 16:9 6 栏 | 右 分类/日期/标题/摘要/阅读 →] |
| 2026.10 | 让周报从工作记录里长出来 / 摘要一行          | →          |
| 2026.09 | ……                                                         |
| ×5                                                               |
```

- 精选：最新 1 篇（若有 `workId` 优先），封面用现有文章封面（始终彩色规则不变）。
- 列表：随后 5 篇，`EditorialRow`：日期 `YYYY.MM` | 标题（serif）+ `excerpt` 一行 | 分类 Tag + →。
- 数据：`fetchPosts()`，不手写标题。
- 手机：精选封面在上；列表行日期移到标题上方（small），箭头保留。

---

### M8 · 公开复盘（可选，`moon-100`，tone light）

- 对应参考站「先把判断写下来，再让时间检验」。月明已有《我给自己的 AI 系统打了 6 分》《MoonOS 立项自审》等复盘类文章，适合做「我做过的判断 / 复盘」时间线。
- 数据：新建 `src/data/reviews.ts`：`{ date: 'YYYY.MM'; title; claim: string; result?: string; links: {label; href}[]; tag?: string }[]`。`claim` 必须是文章原文中的观点原句或忠实概括，`links` 指向原文。
- 布局：左侧竖向时间线（节点 + 日期），右侧 LightCard（标题 serif、引用块左 2px `--accent` 竖线、正文、右栏「原始记录」链接列表）；默认展示 3 条，「再看 N 条 ⌄」展开（`<details>` 实现，无 JS 可用）。
- **P1 不做**，数据文件为空时整段不渲染。用户确认条目后再开启。

---

### M9 · 合作方式（`night-800`，tone dark，id=`offers`）

```
| eyebrow: 合作 · Work with me    | 说明：从你的具体问题开始。 |
| H2: 三种方式，                  |                           |
|     来找我聊。                  |                           |
| [强调卡 moon-100：咨询 ¥399/小时] [DarkCard：知识星球] [DarkCard：作品投稿] |
```

- 内容 **全部复用** `LinksPanel.astro` 中的三项（咨询 ¥399/小时 + 4 个主题、知识星球链接、邮件投稿），把数据抽到 `src/data/offers.ts`，首页与 `/links` 共用一份。
- 强调卡：`--moon-100` 实底、深色字、primary 按钮「查看咨询付款方式」，点击打开现有付款 `dialog`（复用，不重写逻辑）。
- 另两卡：DarkCard，secondary 按钮。
- 手机：三卡纵向，强调卡在最上。

---

### M10 · 收尾 CTA（`moon-50`，tone light，narrow 居中）

- H2 加大到 64px（手机 40px）：`边做边学。<br />有新的尝试，就记一笔。`
- 说明一行（lead，`--fg-2`）：`想交流产品、AI 工作流或内容创作，欢迎直接来聊。`
- 按钮：`聊一聊` primary → `/links#offers`；`订阅 RSS` secondary → `/feed.xml`。
- 居中排版，上下 128px。

---

### M11 · Footer
见 02 §5.6。

## 3. 子页面改造（P2 / P3）

| 页面 | 页头 | 主体 | 保留 |
| --- | --- | --- | --- |
| `/projects` | `night-800` 小 Hero（eyebrow + H2「一个人，{n} 个产品。」+ 说明），高约 360px | M5 同款：旗舰大卡 + 网格 | 现有数据、路由 |
| `/projects/[slug]` | 页头换新 tokens；产品名 serif | 结构、ProductDemo、`product-detail.css` 主题不动，只替换字体与外层底色为 `moon-50` | ProductDemo 全部交互规范 |
| `/opensource` | `moon-200` 小 Hero + 搜索框 | FilterChips + 卡片网格（3 栏）| 搜索、分类 URL 参数、Star 规则 |
| `/blog` | `moon-50` 小 Hero（H2「思考的过程，也值得留下。」）| 首篇精选 + EditorialRow 全量列表 + 分页 | 分页、分类 |
| `/blog/[...slug]` | 标题 serif 40px（手机 30px），元信息一行 | 正文 `narrow` 760px，`body` 17px / 1.85，正文 h2/h3 用 serif | 目录、封面、相关文章 |
| `/links` | `night-800` Hero：人像（原有全身像，完整显示不拉伸）+ 自我介绍 | M9 合作方式 + 社交列表 | 付款 dialog、全身像规则 |
| `/ama`、`404` | 换新 Header/Footer 与 tokens | 内容不动 | — |

## 4. 文件与组件落点

```
src/
  assets/styles/tokens-v6.css        # 新令牌（02 §1）
  components/v6/                     # 新基础组件（02 §5）
    Section.astro Container.astro SectionHeading.astro Button.astro
    Header.astro Footer.astro SocialIcon.astro Stat.astro TimelineRail.astro
    DarkCard.astro LightCard.astro EditorialRow.astro FilterChips.astro Tag.astro
  components/v6/home/                # 首页模块，一个模块一个文件
    Hero.astro PathTimeline.astro Stats.astro Products.astro
    OpenSource.astro Articles.astro Reviews.astro Offers.astro ClosingCta.astro
  data/
    timeline.ts reviews.ts offers.ts # 新数据文件（timeline / reviews 可为空）
  scripts/
    reveal.ts count-up.ts            # 进入视口出现 + 数字滚动，含 cleanup
```

- `index.astro` 只负责拼装模块，不写样式。
- 旧 `components/moonlit/*` 中仍被详情页使用的（CardEffect、OpenSourceCard、ProductDemo、ArticleCard 等）保留；不再使用的（ProfileHero、SpaceHero、SiteAtmosphere 在首页的引用、home-index 脚本）从页面移除，文件暂不删除，在交付记录中列出「可清理候选」。
- 所有脚本遵循现有约定：`astro:page-load` 初始化、`astro:before-swap` 清理，无常驻 RAF。
