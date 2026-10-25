# 官网视觉与演示规范 · moonlit-brand-5

2026-09-21 用户已认可真人封面、四产品主图与产品流程演示的方向，要求后续保持一致。2026-10-02 用户将全平台统一为「月明Verse｜独立开发者，一个人做产品、做内容、做增长」，并提供新的蓝紫光环头像；官网主品牌更新，首页和链接页继续使用原有全身人物形象，新头像只作小尺寸品牌标识。本文是本站当前视觉的单一依据；AGENTS.md / CLAUDE.md、README 和文章维护流程均引用此文。旧设计记录仅作历史，用户最新明确反馈优先。

## 1. 已认可的基准

生成前必须实际查看相应图片，不能仅凭文字记忆另起风格。

| 类型 | 当前基准 | 必须保持 | 可以变化 |
| --- | --- | --- | --- |
| 真人文章封面 | [封面 v2](../design/cover-sources/enterprise-five-layers-real-ip-v2.png) | 真人身份、暖白/深蓝/铜橙、自然肤色、清楚的文字层级、内容笔记板 | 真实文章标题、关键内容、笔记板结构、与内容有关的物件 |
| 产品主视觉 | [CreatorOS](../design/visuals/creatoros-detail-v3.png)、[ThirdSpace](../design/visuals/thirdspace-detail-v3.png)、[Msg-collect](../design/visuals/msg-collect-detail-v3.png)、[AI 童伴](../design/visuals/ai-companion-detail-v3.png) | 亮色棚拍、柔和自然光、精致有触感的 3D 静物、留白、无字主图 | 产品专属物件、叙事和下表主题色 |
| 产品演示 | [桌面示例](../design/product-pages-v1/creatoros-desktop-demo.png)、[手机示例](../design/product-pages-v1/creatoros-mobile-demo.png) | 统一演示外框、步骤导航、结果反馈、播放控制与降级行为 | 各产品的具体操作、内容、布局与主题色 |
| 官网主形象 | [原有全身像](../src/assets/moonlit/portrait.png) | 首页与链接页使用同一张人物图，保持比例和人物识别度 | 响应式尺寸与 WebP 格式 |
| 品牌小图标 | [月明Verse蓝紫光环头像](../src/assets/moonlit/portrait-verse-v1.png) | 用在页眉、页脚、favicon 和分享图，不充当大幅站点主形象 | 小尺寸压缩与格式转换 |

首页和链接页使用同一张原有全身人物图，链接页完整显示人物、不拉伸。新封面不再采用虚拟宇航员 IP。官网继续使用亮色页面与细网格；蓝紫光环头像只用于小图标和分享图，不把全站改为暗色霓虹。历史文章的署名源稿保留原始文本，官网展示层统一为「月明Verse」。

## 2. 品牌基础与产品差异

全站颜色、字体的代码来源是 `src/assets/styles/brand-tokens.css`：暖白底、深蓝标题 #182b42、正文 #394b60、辅助文字 #536176、铜橙细节 #9b4f2c。使用系统中文字体；正文说明以 16px 为基准，避免低对比度浅灰小字。背景保持 32px 平面细网格、1px 线、黑色 3% 透明度，不新增透视线框。

产品主题代码来源是 `src/assets/styles/product-detail.css`。统一材质、光线、留白和版式语言，各产品保留自己的颜色和物件，不能把所有产品换成同一套装饰。

| 产品 | 主题 key | 主色 / 淡底 | 视觉叙事 |
| --- | --- | --- | --- |
| CreatorOS | coral | #a3462e / #fcf1e9 | 摄影机、脚本、分镜、胶片；从选题到复盘 |
| ThirdSpace | blue | #305aa0 / #edf3fc | 蓝色玻璃档案、知识卡片、连接桥；本地资料整理 |
| Msg-collect | amber | #8e5b0b / #fff6e4 | 琥珀提取装置、视频/网页/纸张变笔记 |
| AI 童伴 | sage | #4b6548 / #f1f5ed | 阅读角、故事书、对话；儿童问题与家长交流 |

文案直接说明“给谁用、从什么开始、做什么、得到什么”。保持朴素，不用宏大口号；不编造使用数据、评价、功能或真实软件界面。AI 童伴已有线上入口；概念演示仍只展示设计思路，具体功能以当前线上版本为准。

## 3. 新增文章封面的固定流程

1. 阅读选定版本的真实文章，提炼一个主标题、一个具体收益和 3–5 个真实要点，避免与正文不符。
2. 查看真人封面 v2 与官网原有全身人物图。通过图像生成工具做以图生图，以 v2 作版式/风格参考，以原有全身像作人物身份参考；蓝紫光环头像只用于品牌小图标，不作为封面人物参考。参照的是本站已认可图，不继续复制 OIL 的人物、文案和配色。
3. 沿用左侧清楚标题、右侧内容笔记板与真人相结合的关系；按内容调整构图。不要把所有文章写成“五层”，不要复用上篇事实。字体够大，缩小到手机卡片仍能识别主题。
4. 保存新版本母版到 `design/cover-sources/`，并保存完整提示词、参考文件、生成来源；旧版保留。检查脸、手、中文、逻辑层次及边缘裁切。生成的乱码必须修正后再接入。
5. Creator 文章在 `content/catalog/<作品ID>.json` 选择封面；历史文章通过 `content/legacy-covers.json` 与 registry 维护，每篇保留文章使用独立、可版本化的生成封面；目录和内容取舍遵循原创实践证据、可复用方法、读者帮助和时效性筛选。先沿用当前发布边界，本地试图不等于公开发布。

可复用提示词骨架（替换所有方括号字段后调用，使用工具支持的参考图参数）：

> 为月明Verse生成 16:9 横版文章封面。参考已认可的真人封面 v2 的视觉层级和版式，以原有全身人物图保持身份、五官与自然肤色。暖白纸感背景、极细网格，深蓝主标题、少量铜橙强调与淡杏色标记，明亮、有真实生活质感。左侧清晰呈现“[文章短标题]”，副标题“[具体收益]”；右侧以笔记板表达 [真实要点及关系]，结合本人真实形象。可用 [与文章有关的具体物件]，保持克制留白。关键文字与脸留在安全区，考虑列表 16:9 与分享图约 1.91:1 的裁切。不用宇航员、虚拟人物、霓虹、伪造数据或大段难读小字。不得改变本人身份，不照搬参考文章的内容。

[v2 实际修订提示词](../design/cover-studies/real-ip-v2/prompt.txt) 可用于后续同类定向调整。提示词无法保证每次生成完全一致，必须与基准并排审看。

## 4. 新增产品图的固定流程

1. 查核产品 README、公开官网或用户提供的当前资料。把核心功能转成一组有因果关系的物件，不能只放通用悬浮面板。
2. 查看四张基准，选择已有产品主题；新产品按同一明亮材质语言选择有区分的主题。生成全新 AI 位图，原图建议 16:9，关键主体放在中央约 70% 宽度，兼顾详情桌面 4:3 裁切。
3. 查看图像，确认物件能解释产品、没有乱码/水印、色调与相邻卡片协调。主图不嵌页面标题；页面标题和说明由 HTML 展示。
4. 保存版本化母版和提示词，更新 `design/visuals/registry.json` 同一个产品 ID。首页、作品列表、详情、关联产品统一消费该 ID，禁止各页面另指定一份主图。
5. 用 `npm run assets:build` 导出响应式 WebP 与分享图。构建负责尺寸/格式转换，不画主体；不直接修改 `src/data/generated-visuals.json` 或导出图。

可复用提示词骨架：

> Create a premium editorial 3D still-life illustration for Moonlit's software portfolio. Landscape 16:9, bright warm ivory studio background, soft natural light from upper left, realistic tactile materials, refined sculptural composition with breathing room. Product: [name and verified purpose]. Use [specific connected objects and transformation] to communicate [input → useful result]. Palette: [product accent], ivory and restrained charcoal. Keep key objects within the central 70% width for a 4:3 crop. Consistent with the approved Moonlit product artwork family, but with a distinct product composition. No text, letters, numbers, watermark, logos, astronauts, human characters or generic floating dashboard UI. This is conceptual artwork, not a real software screenshot.

四份完整提示词与事实来源见 [产品设计记录](../design/product-pages-v1/README.md)。AI 生成的概念图明确标注为概念主视觉；真实截图、证据图保留事实来源，不能以生成图冒充。

## 5. 产品页与演示的复用约定

| 内容 | 唯一维护入口 |
| --- | --- |
| 产品基本信息与链接 | `src/data/brand.ts` |
| 用途、步骤、示例、核心功能、场景、FAQ | `src/data/product-details.ts` |
| 统一页面结构 | `src/pages/projects/[slug].astro` |
| 演示结构与无 JS 内容 | `src/components/moonlit/ProductDemo.astro` |
| 交互与清理 | `src/scripts/product-demo.ts` |
| 产品主题和响应式布局 | `src/assets/styles/product-detail.css` |
| 生成素材选择 | `design/visuals/registry.json` |

新产品默认复用上述模板，按“明确用途 → 输入/用户/产物 → 四步示例 → 功能 → 适用场景 → FAQ → 下一步”组织。每步必须有动作、可读界面内容、明确结果，不能只换一个宣传标题。

演示外框与控制统一，内部按产品语义变化：CreatorOS 分镜卡、ThirdSpace 文件笔记、Msg-collect 文档行、AI 童伴对话气泡。界面文字用 HTML 保持可读与无障碍，主体插图必须是生成位图，不用 SVG、Canvas 或 CSS 拼插画。CSS 网格、边框、按钮与 UI 排版不属于插画。

固定交互：

- 默认静止，用户点击才播放；四步有限播放，结束停止，不自动循环。
- 播放/暂停/重播、上下步、步骤按钮与滑块共享一个进度状态；按钮可用性和计数同步。
- 支持键盘方向键、Home/End、明确焦点和选中态。
- 当前节奏为每步 5200ms、入场 430ms、条目错开 120ms，集中在共用脚本；修改时统一调整。
- 离屏与后台暂停；Astro 页面退出清理监听、定时器、观察器与动画；无常驻 RAF 和演示用后台 API 请求。
- 减少动态效果时不执行位移/淡入；无 JS 时顺序呈现全部步骤，隐藏播放控件。
- 流程示意明确标注“示例内容 / 流程示意”，不宣称真实产品录屏或已执行真实操作。

开源目录借鉴 OIL 的清楚分组与图片卡片表达，沿用本站暖白网格、深蓝正文与铜橙强调。项目与工具统一展示在 `/opensource`，按类别筛选并支持搜索；卡片使用文生图生成的概念图，统一通过 `CardEffect` 在鼠标触发时显色、扫过斜条纹、展开底线并小幅倾斜；不做横向探索或自动播放。图片上叠加 HTML 用途短句，保证访问者一眼看懂项目作用；不让图像模型生成中文，避免变形且便于维护。数据入口为 `src/data/open-source.ts`；首页与目录共用 `OpenSourceCard.astro`，`OpenSourceCards.astro` 只组织首页网格。旧 `/skills` 路径跳转到开源目录。

手机端分类为可横向滚动的单行按钮，带 URL 分类参数进入时要露出当前选项。卡片用途短句只在图片上显示一次；图片下方保留分类、Star 和项目名称，不重复同一句描述。

GitHub Star 数量放在图片下方的信息行，与项目分类左右对齐，使用铜橙色文字星号和等宽数字；不要叠在封面上，也不要用黄色胶囊角标。首页卡片与 `/opensource` 目录卡片保持同一规则。数字来自构建时的 GitHub 快照，页面不在浏览器端实时请求 GitHub。

### 列表闪卡与背景（T-413，2026-10-09）

借鉴 Banmabox 的材质交互，但采用本站亮色、生成封面和产品主题，不复制其斑马标识、封面或深色页面。

- 作品封面随指针倾斜，X/Y 最大 ±3°；文章减为 ±1.5°。链接与文字保持稳定，只有图片区域变换；移开、滚动与页面切换清理状态。文字始终可读，无字符乱码动效。
- T-414 用户反馈优先：按最新反馈：人像不能黑白。所有文章封面始终彩色，默认仅轻微柔化（saturate 0.94、contrast 0.97、brightness 1.02），悬停/键盘焦点恢复原图色彩；不依赖逐图识别人像，避免以后新增封面误变黑白。产品与开源仍可默认黑白（grayscale 1、contrast 1.1、brightness 0.9），悬停显色。首页真人 IP、头像和文章正文图片不加这些滤镜。720ms 斜条纹由深蓝与主题色交替，横扫封面；图片底部 4px 主题色线在 650ms 内从左展开，是交互装饰，不代表网络加载或播放进度。
- 快速掠过也保留 780ms 的一次揭幕，使条纹和彩色切换能完整出现；仍在悬停时保持彩色，移开后文章回到柔和彩色、产品与开源回到黑白，不自动循环。页面退出和动态偏好改变清理揭幕计时器。
- 随指针局部柔光、主题边框与阴影沿用；图片放大 1.035 倍。作品名称浅主题划线，箭头轻微移动。手机、粗指针与减少动态效果始终呈现原色，无斜条纹或进度线。
- 产品主题名仍由 `product-details.ts` 提供；闪卡色值维护在 `brand-tokens.css`，对应产品详情配色。文章统一铜橙强调，不建立另一个产品目录。
- T-416：首页、作品、文章、开源目录在 32px 网格上使用共用 WebGL 流线背景。T-417 改为全幅分层：暖白底/色池、宽丝带褶皱、细流线明暗刻痕、鼠标局部反光、固定颗粒。移除 CSS 中央遮罩，shader 中央覆盖至少 72%，中间与两侧使用相同纹理层；仅标题和卡片文字区加局部半透明浅底。鼠标附近发生局部旋转/波纹，移动速度决定扰动强度；滚动产生少量视差，卡片悬停联动产品/开源主题色。鼠标位置与纹理相位都按时间插值，避免输入直接跳变；输入结束后惯性收敛并停绘，无自动时间循环。详情与长文页保留普通网格。
- 流线是 Canvas/WebGL 绘制的程序装饰纹理，不是内容插画；文章、产品及 IP 图仍由已批准的 AI 位图提供，不新增 SVG 或程序绘制的内容图。
- 统一入口：`CardEffect.astro`、`OpenSourceCard.astro`、`SiteAtmosphere.astro`、`scripts/site-atmosphere.ts`、`scripts/site-interactions.ts`、`assets/styles/card-motion.css`。指针事件按 RAF 合并，仅当前卡片更新 CSS；背景跟随原生 RAF 刷新率（移除 32ms 限流，不保证所有设备固定 60fps）、先按 DPR 1.25 / 1440×1200 计算预算，再以 0.75 倍尺寸渲染（有效 DPR 上限 0.9375，尺寸上限约 1080×900），状态收敛后停止绘制，后台暂停，Astro 路由退出取消 RAF、清理监听与 GPU 资源。WebGL 不可用时回退 CSS 柔光，上下文丢失时暂停并回退，恢复后重建图形资源。
- 手机/粗指针不倾斜或反光，背景静态；减少动态效果时不位移、扫光或跟随。键盘焦点保留明确边框、提示与入口，无 JS 仍可浏览点击卡片。
- T-415：产品、文章、开源都调用 `CardEffect.astro`；该组件负责视觉容器、统一 data 属性与唯一底线，动效 CSS/运行时只依赖 `[data-card-visual]`，不按页面复制。开源卡片倾斜上限与作品相同，主题优先沿用产品主题，否则按类别分配已有品牌色。用途说明与角标在特效上层，Star 和标题保持稳定。首页与开源目录共用 `OpenSourceCard.astro`，仅通过 `compact` 调整密度。

## 6. 接入、验收与交付

1. 明确资产类型 → 读事实来源 → 查看对应基准 → 生成版本化候选 → 比较人物、语义、配色、光线、构图与手机可读性 → 接入原有数据入口。
2. `npm run assets:build`，`npm run check`，`npm run build`；需要查看 Creator 样文时最后执行 `npm run build:local`。普通构建不得包含 preview 内容；不手改生成快照。
3. 浏览器查看桌面 1280px 与手机 390px 的首页/列表/详情相关页面；图加载成功、无拉伸、无横向溢出、重要主体与文字不被裁切。关于页还应核对原图与导出图比例、自然高度、完整人物，不能只看 object-fit。
4. 若修改演示，验证从开始到结束、暂停/重播/选步/键盘、离屏暂停、减少动态效果与路由切换；确认其默认不播放。未实测项目如实写明。
5. 保存本地审看图、生成提示词与验收记录，更新 BACKLOG。用户新的风格反馈在此文更新并指向新基准，旧版仅留档；不建立相互矛盾的第二份规范。
6. 本地完成与生产发布分开，部署遵循上层运维规则和 `docs/deployment.md`。

## 7. 历史与当前边界

- 57 篇历史文章仍复用 systems / knowledge / practice 三组 AI 系列封面，未声称已经逐篇真人化；后续新图按真人封面规范执行。
- Creator 样文已选真人封面 v2，仍为 preview。原始 9 张缺失正文图继续明确标为暂缺，不造假补齐。
- 旧宇航员、透视背景、产品旧母版保留历史，不作为当前风格基准。未选衍生图由既有构建脚本归档到 `.content-cache/unused-brand/`，不删除母版。
- 当前视觉素材 registry 版本 `moonlit-open-source-2`，基础 CSS tokens `moonlit-web-2`；开源目录每个项目单独配图，卡片目的说明由 HTML 文字呈现。


## 产品扩充基准 · 2026-09-21

新增产品继续沿用前述生成与演示规范：禾安 `peach`（#9b543b / #fff2e9）、Moving `plum`（#79516b / #f7eff5）、AITerm `teal`（#256373 / #edf6f7）。母版与完整提示词见 [本轮产品扩充](../design/product-expansion-v1/README.md)。三张为本地候选，尚待用户审看，不替代前面已认可的四图基准。

产品数由 `projects.length` 自动计算，ProjectCards 默认呈现全部；新增项目必须同时具备产品数据、详情与视觉 registry。不能只加入数组却被固定数量截断。私有产品不加公开源码入口；内测状态与共同开发归属明确展示。`fork=false` 是筛选条件，不是独立原创的证据。
