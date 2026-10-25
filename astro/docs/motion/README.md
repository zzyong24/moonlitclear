# 宇航员鼠标动效

> 2026-09-21：用户已选择静态真人首页。以下为历史宇航员方案；首页不再引用 SpaceHero 或加载这些动画资源。

## 历史运行方式

- 首帧静态，仅鼠标触发；无自动播放、循环或重播控件。
- 网页加载 `public/motion/frames/atlas-01.jpg` 至 `atlas-06.jpg`，预解码 142 帧，使用 Canvas 绘制缓存帧。交互不请求视频、不调用 currentTime、不等待 seek。
- 鼠标 X 控制动作进度，XY 控制小幅透视倾斜；85ms 时间常数平滑跟随，相邻帧混合。移出立即冻结，停下后收敛并停止 RAF。
- 缓存准备期间显示原始海报。无精细指针设备或减少动态效果时初次不加载图集。失败保留海报，页面退出 abort 请求并 close ImageBitmap。
- 图集约 2.2 MB，帧 256×454，解码像素约 64 MiB；以分辨率与内存换取随机访问稳定性。原始高分辨率母版仍保留。
- 这是预制动作进度控制，不是任意方向实时转头的 3D 骨骼模型。

运行时：`src/scripts/hero-motion.ts`；组件：`src/components/moonlit/SpaceHero.astro`。

## 资产来源与重建

输入 `src/assets/moonlit/astronaut-original.png` 是用户指定 3D IP。母版 `source/astronaut-greeting-master.mp4` 为本机已有 MiniMax API 首尾帧模式（Hailuo-02）生成，提示词在 `source/wave-prompt.txt`，任务 ID 在 `source/video-task.json`。源视频 768×1364、24fps、142 帧；画面完整转头、抬手、挥手、收手。

API 生成与开源网站免费是两回事，不声称生成接口免费；网页仅读取本地资产。此前左右手切换的图集生成实验没有使用；当前图集是直接从通过检查的连续视频解码提取。

在站点根目录生成图集：

```sh
ffmpeg -i docs/motion/source/astronaut-greeting-master.mp4 -vf 'scale=256:454,tile=4x6:nb_frames=24:padding=0:margin=0' -fps_mode passthrough -q:v 3 public/motion/frames/atlas-%02d.jpg
```

旧 greeting/interactive MP4 保留作历史，当前组件不引用。图集最后两个填充格不读取。

## 验证

本地浏览器：零 video、一个 Canvas；鼠标跨至第 120 帧之后再反向回第 25 帧之前通过；离开后第 22.12 帧保持不变，控制台无错误。119 个连续模拟鼠标输入刷新样本，RAF 间隔中位 33.3ms / P95 42ms，属于本机浏览器测量，不承诺所有设备达到 60fps。
