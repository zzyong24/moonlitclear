# Hero 人像抠图 v1

- 来源：`src/assets/moonlit/portrait.png`（官网主形象，原图未改）。
- 处理：rembg `isnet-general-use` 仅去除背景（2026-10-25）；无重绘、无美颜、无换装。
- 裁切：保留头顶至腰下，`-trim` 去除透明边 → `src/assets/moonlit/portrait-cutout-v1.png`。
- 页面通过 astro:assets 导出 WebP；原始抠图保存在本目录 `portrait-cutout-raw.png`。
