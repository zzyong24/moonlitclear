# Claude Code Configuration

See [AGENTS.md](./AGENTS.md) for all project documentation and AI agent instructions.

月明官网新增/更新文章和产品时，先读 [官网维护方案](docs/site-maintenance.md)。可使用本机 `moonlit-site-maintainer` Skill；即使未安装该 Skill，仍以本仓库流程和脚本为准。AstroWind 通用说明不覆盖月明当前内容入口与视觉规则。

公开 Skill 目录由 `src/data/open-skills.json` 驱动。新增时核实对应 GitHub 仓库公开、非 fork、未归档；不要从本机安装清单复制未公开 Skill。统一在 `/opensource` 展示，旧 `/skills` 跳转，不为每个工具复制页面。首页与目录共用 `OpenSourceCard.astro`；产品、文章与开源共用 `CardEffect.astro` 的鼠标触发动效，文章人像始终保留彩色，不为每页复制动效运行时。

## 月明完整站本地补充

本仓库是从完整 AstroWind 改造并已上线 `aitongban.cloud` 的个人站。业务内容遵循 README 的单一入口，生成文章目录不直接编辑。示例仅在 reference，不发布。运行服务部署遵循上层运维仓库 AGENTS.md 与 docs/deployment.md；本地改动不等于已获下次生产重启授权。不得把 3D 渲染图称为真实宇航员网格模型；实时场景与角色图片是两层资产。

## 已确认的品牌视觉与演示规范

新增或修改本站文章封面、产品主图、产品演示、本人照片及其布局前，必须阅读 [官网视觉规则](docs/brand-visual-system.md)。该文件是当前风格的单一依据，包含已认可样图、提示词模板、产品主题、共用组件与验收要求；历史设计记录不覆盖当前规范。沿用共享 tokens、素材 registry 和 ProductDemo，不为每页另做风格或交互运行时。用户最新明确反馈优先；改变方向时同步更新规范与样图。
