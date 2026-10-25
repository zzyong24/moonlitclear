# 2026-10-08 公众号作品本地同步记录

用户确认 `/Users/zyongzhu/moonlit-creator/works` 中登记为 `wechatArticle` 的作品均已发布，要求直接同步到官网，不读取公众号后台，也不做原创性、时效性或安全性选稿审查。官网目录锁定下列源版本，正文仍只读引用 Creator。此前四篇的暂缓结论已撤销。

| 作品 ID | 版本 | 稳定 slug | 本地官网状态 |
| --- | --- | --- | --- |
| W-20260908-001 | v3 | `ai-native-organization` | `public` |
| W-20260919-001 | v04 | `creatoros-feature-overview` | `public` |
| W-20260924-001 | v07 | `chatcut-product-form-choice` | `public` |
| W-20260927-001 | v06 | `personal-ai-entry` | `public` |
| W-20260927-002 | v02 | `git-agent-rollback` | `public` |
| W-20261003-001 | v03 | `weekly-report-from-work-records` | `public` |

`content:discover` 现在按作品 ID 和 `wechatArticle` artifact 检索，不再以 artifact 的 `draft`、`submitted` 或 `published` 字段筛选。转换器按正文实际引用支持作品内 `notes/source-materials/` 图片，并对同一路径的 artifact 文件角色去重。本站仍检查源路径、版本、媒体和静态构建完整性。这里的 `public` 指本地公开构建纳入，生产站点是否更新须另以部署和公网访问验证。
