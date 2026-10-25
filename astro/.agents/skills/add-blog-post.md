# 新增月明官网文章

此入口针对已改造的月明官网，不再使用 AstroWind 默认的 `src/data/post/` 写稿方式。

1. 先读 [官网维护方案](../../docs/site-maintenance.md) 第 3、6 节，以及 [文章同步流程](../../docs/content-workflow.md)。
2. Creator 文章读取 `work.json.artifacts` 中的明确版本，正文留在 Creator，官网维护 `content/catalog/<作品ID>.json`；默认 `preview`，同一作品更新时保持 slug。
3. 官网独立文章可用 `npm run article:new -- --help`；它只创建 `vault/writing` 草稿，不生成封面、不创建 Creator 作品。旧文的 `publish:true` 会进入公开构建，不能当作预览隔离。
4. 封面按 [官网视觉规则](../../docs/brand-visual-system.md) 制作或复用，不能照模板示例使用任意库存图。
5. 同步、预览、检查、公开包和发布沿用上述文档。`src/data/post`、`.content-cache` 和 `dist` 不直接编辑。

元信息、RSS 与 sitemap 来自实际构建；分类目前使用文章库筛选，没有独立分类页。不要依据上游模板说明声称尚未实现的目录、面包屑或相关推荐已具备。
