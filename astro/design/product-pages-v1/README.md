# 四产品详情页 · 2026-09-21 本地版

## 设计依据

阅读并对照了 [Linear](https://linear.app/) 的分段产品叙事、[Raycast](https://www.raycast.com/) 的具体操作演示和 [Readwise Reader](https://readwise.io/read) 的输入/场景说明。参考其信息组织，不复用页面代码、文案和视觉资产，保留本站亮色网格与低调文案。

## 主视觉

均为内置 image_gen 新生成的位图。完整提示词为本目录的四个 `*-prompt.txt`。母版在 `../visuals/`：

| 产品        | 母版                         | 配色与场景                   |
| ----------- | ---------------------------- | ---------------------------- |
| CreatorOS   | `creatoros-detail-v3.png`    | 铜橙摄影机、脚本、分镜和胶片 |
| ThirdSpace  | `thirdspace-detail-v3.png`   | 蓝色玻璃、知识档案与连接桥   |
| Msg-collect | `msg-collect-detail-v3.png`  | 琥珀色提取装置、资料与笔记   |
| AI 童伴     | `ai-companion-detail-v3.png` | 鼠尾草绿阅读角、故事书与对话 |

`design/visuals/registry.json` 已选用新版本；首页卡片、作品列表和详情页复用同一资产 ID，避免视觉不一致。母版不放 public，构建脚本仅转 WebP、响应式尺寸；旧母版保留。

## 维护与交互

- 产品基本信息：`src/data/brand.ts`。
- 详情说明、步骤、示例内容、场景与 FAQ：`src/data/product-details.ts`。
- 详情模板：`src/pages/projects/[slug].astro`；主题：`src/assets/styles/product-detail.css`。
- 演示结构：`src/components/moonlit/ProductDemo.astro`；交互：`src/scripts/product-demo.ts`。
- AI 图负责主视觉；可读的 UI 与演示文字由 HTML 渲染，没有使用 SVG 插画。演示已标注“示例内容 / 流程示意”，不冒充真实录屏或后台任务。
- 默认静止。点击播放后有限播放 4 步，每步约 5.2 秒；支持暂停、重播、上下步、滑块与键盘方向/Home/End。
- 滚出画面或页面隐藏暂停；路由切换清理定时器、观察器、事件和动画。减少动态效果时禁用位移/淡入，步骤仍可阅读。
- 无 JS 时全部步骤按顺序展示，播放控件隐藏；没有外部接口调用、自动发布或真实数据写入。

## 产品事实来源

- CreatorOS：本仓库 `sites/creatoros/index.html` 与 [公开官网](https://creatoros.aitongban.cloud/)，核查定位、选题、项目编导、制作、发布登记与复盘。
- ThirdSpace：[模板 README](https://github.com/zzyong24/thirdspace-vault-template)；本页聚焦已链接的知识库模板，不将整个其他项目生态能力全部归入模板。
- Msg-collect：`/Users/zyongzhu/Workbase/Msg-collect/README.md`，核查视频/网页/PDF、进度、Markdown、分享图、MCP。没有导入任何本地用户资料或凭证。
- AI 童伴：站内既有定位；公开站连接关闭，未取得当前实际功能证据。已向用户询问定位，未答前以产品探索和对话设计示例呈现，CTA 进入站内交流页，不承诺安全护栏或学习效果。

## 本地验证

- `npm run check`：127 个 Astro 文件，0 errors / warnings / hints；ESLint、Prettier 通过。
- 普通构建 57 篇 / 0 个 Creator 衍生资产；preview 构建 58 篇 / 9 个，均通过内容与视觉哈希核验。最终 dist 为 preview。
- 浏览器 1280px 与 390px 检查四页，主图加载、无横向溢出、步骤切换仅保留一个面板。
- CreatorOS 完整播放停在 04/04；暂停、重播、End 键、滑块 ArrowLeft、离屏暂停均实测；减少动态效果时动画数为 0。
- FAQ 一次展开一项。Astro 路由跨四个产品切换后演示可继续操作。
- 示例截图保存在本目录。仅本地，未上线；没有修改生产服务。
