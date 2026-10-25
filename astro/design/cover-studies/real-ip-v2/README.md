# 真人封面与静态首页 · v2

2026-09-21，用户认可 v1 构图，要求调整配色、去掉首页动态宇航员、改用本人照片并提高文字可读性。

- `enterprise-five-layers-real-ip-v2.png`：内置 image_gen 基于 v1 定向编辑，保留人物、版式、正文，改为暖白、深蓝、铜橙。完整提示词见 `prompt.txt`。
- 网站消费母版为 `../../cover-sources/enterprise-five-layers-real-ip-v2.png`；通过 `content/catalog/W-20260913-002.json` 接入，仅本地 preview。
- 首页直接使用既有本人照片 `src/assets/moonlit/portrait.png`；由 Astro 转换 WebP，未重绘人像。
- `homepage-desktop.png` / `mobile-articles.png` 为本地浏览器验收截图。
- 57 篇历史文章仍沿用三组系列封面，本轮未批量替换。

新配色在 `src/assets/styles/brand-tokens.css` 集中维护。旧宇航员代码和资产保留历史，首页不引用、不加载。
