# 2026-10-12 官网内容同步

按作品 ID 比较 Creator `wechatArticle` 与官网 catalog，新增两篇。用户已确认作品库中登记的公众号文章均已发布；不按产物状态过滤。Creator 原稿只读。

| 作品 ID | 锁定版本 | 稳定 slug | 官网封面母版 |
| --- | --- | --- | --- |
| W-20261010-001 | v02 | `creator-positioning-who-you-help` | `design/cover-sources/creator-W-20261010-001-real-ip-v1.png` |
| W-20261011-001 | v02 | `what-my-ai-agents-do` | `design/cover-sources/creator-W-20261011-001-real-ip-v1.png` |

两图由内置 `image_gen` 分别生成，以 `design/cover-sources/enterprise-five-layers-real-ip-v2.png` 为版式基准、`src/assets/moonlit/portrait.png` 为本人身份基准。暖白细网格、深蓝标题、铜橙强调与自然肤色延续已有风格；母版已目视核对人物和主要文字。

- W-20261010-001 提示词要点：主标题“先想清楚，你能帮谁”，副标题“从我会什么，到我能帮谁”，右侧三步“我的能力 → 谁遇到问题 → 能交付什么”。
- W-20261011-001 提示词要点：主标题“我的 AI 正在替我做什么？”，副标题“交代任务 · 查看结果 · 继续调整”，右侧四项“视频剪辑、手机操作、产品测试、网页任务”。

首次 `content:scan` 发现 W-20261011-001 的已登记正文位于 `deliverables/article/`，而同步器只允许 `content/`。已将校验扩至作品内 `deliverables/article/`，仍要求唯一登记的 Markdown 与路径不越界；未复制或改写正文。随后扫描成功，预览 49 篇、140 个衍生资源。`build:local` 成功（65 页），公开 `build` 成功（48 篇、131 个衍生资源、64 页），`check` 通过（Astro 0 错误、警告、提示），`test:content` 8/8 通过。`content:discover` 复查零候选。

本轮只更新本地源码和构建产物，未提交、推送或部署。生产公网未验证。

公开构建的本地预览 HTTP 复核：两篇 `/blog/<slug>` 均为 200；首页、文章列表、RSS 和 sitemap 均含对应链接；每页引用的 6 个 `content-assets` 媒体请求均为 200。另独立遍历 Creator 作品库，11 个登记 `wechatArticle` 的作品 ID 与 catalog 锁定版本全部一致。预览服务已停止。
