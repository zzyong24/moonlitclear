# 真人文章封面样张 v1

本轮只制作一张候选封面，尚未替换官网文章封面，待用户审看。

- 成图：[enterprise-five-layers-real-ip-v1.png](enterprise-five-layers-real-ip-v1.png)
- OIL 封面截图：[oil-reference-screenshot.png](oil-reference-screenshot.png)，只参考构图与颜色，不沿用原作者身份或内容。
- 真人身份：站内 `src/assets/moonlit/portrait.png`，与关于页面肖像文件 SHA-256 相同；保留脸型、发型、自然微笑、深蓝外套与白 T 恤。
- 真实内容：`W-20260913-002`，《别急着上 Agent，先把业务拆成五层》，数据、语义、Skill、业务编排、Agent 五层分工。画面上的内容板是文章摘要排版，不是产品截图或业务成绩证明。
- 生成方式：内置 image_gen 图生图；输入为 OIL 截图和用户肖像。完整提示词见 [prompt.txt](prompt.txt)，输入/输出和哈希见 [study.json](study.json)。

## 背景更正

用户指的是 [OIL 网站](https://www.oiloil.org/#articles) 的平面方格。浏览器读取 `.bg-grid` 得到 32px × 32px、1px 线宽、`rgba(0,0,0,0.03)`，底色白。已用相同 CSS 渐变参数复刻到本地 `.brand-grid-bg`，不使用 SVG，也不再显示此前的透视线框图片。

旧透视线框母版保留作历史；尚在素材清单中，但页面不加载它。封面候选与参考截图均在 design 目录，未进入 dist/public。

本地背景改动前的两个文件备份位于本目录：`daylight.css.before-grid` 与 `SiteLayout.astro.before-grid`；仅限逐文件比对本次样式回退，不能覆盖用户其他改动。
