# Hero 人像抠图 v1

- 来源：`src/assets/moonlit/portrait.png`（官网主形象，原图未改）。
- 处理：rembg `isnet-general-use` 仅去除背景（2026-10-25）；无重绘、无美颜、无换装。
- 裁切：保留头顶至腰下，`-trim` 去除透明边 → `src/assets/moonlit/portrait-cutout-v1.png`。
- 页面通过 astro:assets 导出 WebP；原始抠图保存在本目录 `portrait-cutout-raw.png`。

## 首屏书法字「月明」

`src/assets/moonlit/brush-yueming.svg` 由 Google Fonts 的 Ma Shan Zheng（马善政毛笔楷书，SIL Open Font License 1.1）字形转成路径，只含「月明」两个字，作为图形内联，不加载字体文件。生成方法：fontTools 读取字形 → SVGPathPen 输出 path，两字间距 40 单位，坐标取整。
