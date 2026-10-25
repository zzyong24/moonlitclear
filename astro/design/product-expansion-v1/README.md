# 产品扩充 · 2026-09-21

## 选入

- **禾安成长日记**：用户点名产品，依据本机 BabyAI 的 PRODUCT_SPEC.md（含 9 月 11 日修订）、README 与本仓库内测部署记录。README 部分旧确认流程已被后续规格覆盖，本页按明确事件校验保存、歧义追问、原记录纠正呈现。当前单人本地记录、趋势与相册，标注内测；CTA 为站内联系，不把 AI 网关当作可下载 App。GitHub 清单未找到对应仓库，本地也未配置 remote，不虚构仓库来源。
- **媒措 Moving**：GitHub `zzyong24/Thirdspace-moving` 元数据为非 fork 私有仓库；公开产品说明来自本仓库购买站配置与本机产品规格。定位为视频创作桌面工作区，不把未开放购买链路写成可购买。不对外链接私有仓库。用户口述第二个名称暂按此理解，已发起名称澄清，待其补充。
- **AITerm**：[仓库](https://github.com/zzyong24/AITerm) 为非 fork 公开项目，有 v0.1.0 Mac 发行附件（2026-05-04）。README 明确 love张 为 Owner、zzyong24 为核心开发，站内保留共同开发说明。README 的许可证徽章与 GitHub 文件识别存在差异，本页不自行承诺 MIT，许可证以实际 LICENSE 为准。
- **ThirdSpace Dashboard**：[仓库](https://github.com/zzyong24/thirdspace-dashboard) 有配套模板依赖、安装与数据源说明，作为 ThirdSpace 配套工具增加入口，不重复包装独立主产品。

## 主图与演示

三张主图均为本轮内置 image_gen 文生图，完整提示词见 prompts.json；母版在 `../visuals/`，registry 版本 `moonlit-products-4`。

| ID     | 母版                 | 主题                             |
| ------ | -------------------- | -------------------------------- |
| hean   | hean-detail-v1.png   | 暖桃成长日记、奶瓶、月亮灯       |
| moving | moving-detail-v1.png | 灰紫色放映机、镜头轨道、胶片     |
| aiterm | aiterm-detail-v1.png | 蓝绿多屏终端、文件夹与分支连接件 |

均沿用亮色自然光、暖白背景与有触感的静物。图片是 AI 概念视觉；四步演示为 HTML 流程示意，默认静止，共用 ProductDemo 与 product-demo.ts。禾安数字与时间均为虚构示例，不使用真实儿童数据。没有真实模型调用或真实项目操作。

## 维护修复

- 共用 ProjectCards 原来默认只显示 4 件，现默认显示 projects 全集。
- 首页产品和开源计数由数据长度计算，产品数从 4 变 7。
- 详情页关联作品限制为 3 件，避免每次新增产品都把所有详情无限拉长。
- 三套新主题加入 product-detail.css；演示内部依次为时间线、分镜卡、终端工作区条目。
- 公开/私有与原创归属分别核对，`fork=false` 只用于筛选，不等于宣称全部代码独立原创。

本轮只是官网展示与文档维护，未安装测试这些产品、未更改私有仓库权限、未部署生产。
