# 04 · 交付阶段与验收标准

每一阶段结束，实施者逐条自检，在 `design/redesign-v6/review/<阶段>/` 保存截图，并在 `design/redesign-v6/review/ACCEPTANCE.md` 中按下表格式记录：`条目编号 | 结果（通过/不通过/未测） | 证据（截图或命令输出）| 备注`。**未实测的条目写「未测」，不得写通过。**

## 阶段划分

| 阶段 | 范围 | 完成标志 |
| --- | --- | --- |
| P0 | tokens-v6、字体子集、v6 基础组件、Header、Footer | 一个临时页面 `/_v6-kit`（仅 dev，构建排除）展示全部组件与状态 |
| P1 | 首页 M1–M11（M3、M8 数据为空时不渲染） | 首页验收全部通过 |
| P2 | `/projects` `/opensource` `/blog` `/links` | 子页面验收通过 |
| P3 | `/projects/[slug]` `/blog/[...slug]` `/ama` `404` | 详情页验收通过，ProductDemo 回归通过 |

## A. 构建与工程

- A1 `npm run check` 通过（astro check + ESLint + Prettier），零新增 warning。
- A2 `npm run build` 成功；`npm run test:content` 通过。
- A3 页面中没有手写的数量、Star 数、项目名列表；全部来自 `src/data/*` 或 Content Collection（代码评审 + `grep` 检查）。
- A4 新组件均有 TypeScript Props 接口；`index.astro` 只拼装模块、无 `<style>`。
- A5 首页、列表页不再引用 `SiteAtmosphere` / `home-index`；相关文件保留未删；“可清理候选”已列出。
- A6 所有新增脚本在 `astro:before-swap` 清理监听与观察器；页面静止 2 秒后 Performance 面板无持续 RAF（截图证明）。
- A7 不改动 `src/data/generated-visuals.json`、生成快照与 `.content-cache`。

## B. 视觉一致性（对照 01 / 02，桌面 1440 与 1280 截图）

- B1 首页色带顺序与 01 §3 一致，相邻段不同色。
- B2 H1 / H2 / H3 为 Noto Serif SC（DevTools Computed 截图），字号与 02 §3 表一致（±1px）。
- B3 所有段落标题使用 SectionHeading 句式：eyebrow「中文 · English」+ H2 + 右侧说明底对齐。
- B4 Hero：人像为原官网主形象抠图，无 AI 重绘痕迹；边缘无白边；底边贴住段落底；「月」字在人物身后、被右侧裁切、不遮挡脸。
- B5 页面中只有 Hero 一处月晕光效；无网格背景、无 WebGL、无霓虹/玻璃拟态。
- B6 颜色只使用 tokens-v6 中的变量（`grep` 新组件中无裸 hex，产品主题色除外）。
- B7 每段最多 1 个 primary 按钮；按钮高度 44px，圆角为胶囊。
- B8 产品与开源图片均来自 registry；文章封面保持彩色；产品卡悬停有 CardEffect 揭幕与主题色底线。
- B9 与参考站并排对比：结构气质接近，但没有出现参考站的绿色、Logo、文案、人物或社区功能。

## C. 响应式（390 / 360 / 768 / 1024 / 1440）

- C1 任何宽度 `document.documentElement.scrollWidth === innerWidth`（附 console 输出）。
- C2 手机 Hero：文字在上、人像在下，H1 不出现单字成行；按钮整行宽。
- C3 手机导航：汉堡按钮可打开/关闭，Esc 关闭，打开时焦点进入面板、背景不滚动。
- C4 时间轴手机端为纵向；数字统计 2×2；筛选条横向滚动且选中项可见。
- C5 图片无拉伸、无关键主体裁切；`/links` 全身像完整显示。
- C6 触控目标 ≥ 44×44px。

## D. 交互与动效

- D1 页面静止时无任何持续动画。
- D2 进入视口出现动画只播一次，时长 240–360ms。
- D3 数字统计：有 JS 时滚动到终值；**禁用 JS 时直接显示终值**（附禁用 JS 截图，不能出现 0）。
- D4 `prefers-reduced-motion: reduce` 下无位移、无数字滚动（DevTools 模拟截图）。
- D5 Header 首页滚动 24px 后变实底，非首页默认实底。
- D6 开源筛选：无 JS 显示全部；有 JS 可切换，支持方向键；结果数量正确。
- D7 合作方式「查看咨询付款方式」打开的仍是原付款 dialog，可用 Esc 关闭，焦点回到按钮。
- D8 Astro 路由切换（首页 ↔ 文章 ↔ 首页）后无重复监听、无控制台报错。

## E. 可访问性

- E1 `agent-browser a11y`（axe，wcag2a + wcag2aa）首页与 4 个列表页 0 个 serious / critical。
- E2 每页唯一 `h1`；每个 section 有 `aria-labelledby` 对应 `h2`。
- E3 全站键盘可达，焦点框可见（`--accent` 2px）；跳到正文链接可用。
- E4 文字对比度符合 02 §1；暗底 < 14px 文字未使用 `--fg-3`。
- E5 装饰元素（「月」字、月晕、分隔线）`aria-hidden="true"`；所有内容图片有意义的 `alt`。

## F. 性能（生产构建，Lighthouse 移动端模拟，首页 + /blog）

- F1 Performance ≥ 90，Accessibility ≥ 95，Best Practices ≥ 95，SEO = 100。
- F2 LCP ≤ 2.5s（LCP 元素应为 Hero 人像或 H1），CLS ≤ 0.05，TBT ≤ 150ms。
- F3 首屏衬线字体 woff2 合计 ≤ 250KB；无 FOIT（字体加载期间文字可见）。
- F4 首页 JS（gzip）≤ 30KB（不含 Astro 运行时 ClientRouter）。
- F5 Hero 人像 WebP，桌面 ≤ 180KB，提供 `srcset`，有宽高属性。

## G. 内容真实性（硬性，不通过即整体不通过）

- G1 没有编造的履历、数据、用户评价、合作方、媒体报道。
- G2 时间轴 / 复盘 / 评价等模块，若数据未经用户确认，则不渲染，并在 ACCEPTANCE.md「待用户补充」列出。
- G3 产品状态（内测、共同开发、私有）与 `brand.ts` 一致；私有产品无源码入口。
- G4 咨询价格、知识星球链接、邮箱与 `offers.ts` / `brand.ts` 一致，且首页与 `/links` 共用一份数据。
- G5 SEO：`<title>`、description、OG 图沿用 `config.yaml` 与页面 metadata；结构化数据仍只基于真实配置。

## H. 交付物

- H1 `design/redesign-v6/review/` 下：每阶段 1440 / 390 两个宽度的整页截图，首页额外附 1280 / 768，以及禁用 JS、减少动态效果各 1 张。
- H2 与参考站的并排对比图 1 张（左参考、右成品，首页首屏）。
- H3 `ACCEPTANCE.md` 全部条目有结论。
- H4 `docs/brand-visual-system.md` 顶部改版说明更新为「已实施（日期）」并链接验收记录。
- H5 本地完成不等于上线；部署按 `docs/deployment.md` 单独执行并另行确认。

## 禁止项速查

- 不抄参考站的颜色（深绿）、Logo、文案、人物、社区地图、AI 问答、书籍模块。
- 不用 AI 重绘本人照片；不用宇航员 / 虚拟人物 / 霓虹 / 赛博线框。
- 不在首页恢复 Tab 切换；不恢复 WebGL 背景或网格。
- 不整包加载中文衬线字体。
- 不手写数据；不编造任何事实。
- 不删除旧组件文件、不改生成快照、不在未授权情况下部署。
