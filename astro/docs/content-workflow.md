# 文章维护与本地预览

## 内容归属

- 历史文章：vault/writing/*.md，保留现有网址。
- Creator 新文章：moonlit-creator 的 work.json.artifacts 指定的当前 Markdown。
- 历史文章封面：content/legacy-covers.json 显式映射到 design/visuals/registry.json；每篇收录旧文使用自己的文生图位图封面，不跨文章复用。
- 官网选稿：content/catalog/<作品ID>.json；只管理选稿、稳定 slug、日期、分类、摘要和封面，不复制正文。
- docs/content-manifest.json：schemaVersion 2，指向一份完整、不可变的 .content-cache/<generation> 快照。
- src/data/post：保留的旧生成目录，已不被内容集合读取；不要继续编辑。

## 本地完整试跑

```sh
npm run content:scan
npm run content:discover
npm run build:local
npm run check
npm run preview:replacement
```

content:scan 只读扫描已选文章；content:discover 只读列出 Creator 中所有登记了 wechatArticle 的作品相对 catalog 的新增或版本变化，不以作品内部的 draft/submitted/published 状态过滤。用户已确认这些目录中的公众号文章均已发布。build:local 先导出文生图素材，再同步选中的 public/preview 文章、处理图片与封面、构建整站、验证、压缩。预览在 http://127.0.0.1:4333/。

默认作品库是 ~/moonlit-creator。可在当前命令环境用 MOONLIT_CREATOR_ROOT 指定别的作品库，无需把本机绝对路径写进官网目录。

本次示例为 W-20260913-002，visibility:preview，只进入本地预览。npm run build 仅纳入 public 和原本公开的旧文。预览模式输出 noindex，pack 拒绝包含预览内容的产物。源码中的作品状态不作为官网公开授权。

新建或替换封面时，先执行 [官网视觉规则](brand-visual-system.md) 的真人封面流程，沿用已认可 v2 样图、本人照片与真实文章内容。

## 新增或更新 Creator 文章

1. 找到作品的 artifacts，读回正文与版本；不得凭目录修改时间选最新稿。
2. 在 content/catalog 登记作品 ID、artifact key、明确版本、slug、日期、分类、摘要与封面。按用户本次要求，同步的公众号文章设为 public；生产部署仍单独执行。
3. 看 content:scan 的变化，执行 build:local 并审看实际正文、配图、封面、列表和分享信息。
4. 原文更新时保留 slug；artifact 版本变化后读回差异再修改目录中的 version，不静默跟随新草稿。
5. 正式纳入时由 Agent 按当前用户要求修改 visibility；生产发布仍遵循部署规则。

正文与源图一直在 Creator 中维护。正文可来自作品内 `content/` 或已登记的 `deliverables/article/` Markdown，媒体仍限作品内受控素材目录。同步脚本只读 Creator，不修改 work.json、current、公众号草稿或历史发布凭证。

## 已支持与限制

已支持普通 Markdown、GFM、内联/引用式本地图片、中文及带空格路径、作品内 content/production/deliverables 素材、KEY/NOTE/VERDICT 调用块和正文 ==强调==。代码块中的示例保持原样。

正文媒体转换器兼容 PNG/JPEG/WebP/AVIF/SVG，输出网页 WebP；GIF 保留原始动画并以 image/gif 输出。新品牌插画与封面母版必须来自文生图位图，不使用 SVG 或代码绘图。品牌导出器只接收 PNG/JPEG/WebP。官网封面输出 480/800/1200 三档 16:9，OG 输出 1200×630 JPG。原始图不进入 public，静态端点只导出当前清单列出的衍生图，普通构建不会带入预览图。

当前明确拒绝视频、远程图片和原始 HTML（注释除外），提示先制作受控网页版本；没有把不支持的媒体静默丢弃。GIF 是文章演示动图，原始帧会保留；静态图片统一转为网页 WebP。

对 Creator 中登记了 wechatArticle 的作品，按用户确认的发布事实同步，不再另设原创性、时效性或安全性选稿门槛。技术同步仍须核对源版本、正文路径、图片与构建完整性；不修改文章事实与措辞。撤下旧文时在源稿 frontmatter 设 publish:false，保留原始 Markdown 与媒体以便恢复。样本日期沿用作品日期，不能据此称为官网实际发布时间。

## 完整性与失败恢复

同步先读取全部输入，在临时位置完成转换，核对所有输入未变化，再原子更新唯一清单。相同输入重复执行复用快照。缺图、缺源、版本冲突不会把旧快照改成半成品。正文及图片 hash 一起参与版本判断。

有进程锁 .content-sync.lock；异常终止后先核对其中 PID 确实不在运行，再处理遗留锁。已有快照保留，不按日期自动删除。

隐藏条目用 visibility:hidden，普通/预览构建均排除。源文件缺失不会自动撤稿。旧文仍用 publish:false 撤下，修改 publish_slug 需同步 redirects.json。

## 检查与发布

```sh
npm run test:content
npm run check
npm run build
npm run pack
```

构建按实际源、图片、快照 hash、文章路由、列表、RSS、sitemap 与分享图检查。发布包要求 public 模式，内容清单与视觉素材清单均与构建匹配。品牌素材的母版哈希、导出图哈希及历史文章封面/分享图引用也在构建时验证。历史旧文的缺图继续记录在 missing-source-assets.json，并在正文中使用缺图占位说明。

部署见 docs/deployment.md。本地试跑不等于上线；本轮没有修改生产站点。
