# 月明Verse · 个人品牌官网

线上网站：[aitongban.cloud](https://aitongban.cloud/)。

**当前使用的 Astro 版完整源码在 [`astro/`](astro/)。** 原 Next.js 版文件保留在仓库根目录，历史说明见 [README.nextjs.md](README.nextjs.md)，当前网站已不使用旧版运行方式。

## 最新源码

- **改版 v6 设计规范（待实施）**：[视觉风格 / UI 规范 / 模块划分 / 验收标准](astro/docs/redesign-v6/README.md)

- [页面、组件与样式](astro/src/)
- [共用卡片特效](astro/src/components/moonlit/CardEffect.astro)
- [全幅分层 WebGL 背景](astro/src/scripts/site-atmosphere.ts)
- [产品与开源数据](astro/src/data/)
- [文章目录与同步脚本](astro/content/)、[维护方案](astro/docs/site-maintenance.md)
- [文生图母版](astro/design/)、[静态资源](astro/public/)
- [版本打包与部署说明](astro/docs/deployment.md)

Astro 静态预渲染 + Tailwind CSS，Node 标准库文件服务器负责运行，内容维护使用 Markdown 与 JSON。真人封面、作品演示、产品/文章/开源共用闪卡，以及全幅分层背景均在当前源码中。

## 本地运行

需要 Node.js >=22.22.3；构建工具链使用 npm。请在 `astro/` 目录执行，而非旧 Next.js 根目录：

```bash
git clone https://github.com/zzyong24/moonlitclear.git
cd moonlitclear/astro
npm ci

# Creator 文章原稿是外部内容依赖，不随网站源码公开
export MOONLIT_CREATOR_ROOT="/path/to/your/moonlit-creator"
npm run assets:build
npm run content:sync
npm run dev -- --host 127.0.0.1 --port 4333
```

`MOONLIT_CREATOR_ROOT` 需包含目录配置指定的作品及锁定版本；仅克隆源码不等于已取得作者的原稿工作区。内容快照、草稿、node_modules、dist 与生产发布包不进 Git。没有外部作品库时，不要把缺源报错误认为构建已完成；按 [文章工作流](astro/docs/content-workflow.md) 准备自己的内容源。

## 验证与构建

```bash
cd astro
npm run check
npm run test:content
npm run build
npm run pack
```

此仓库是网站源码同步出口。线上部署需独立执行备份、候选验证、切换和公网检查；GitHub 推送不会由本仓库的 workflow 自动改动当前生产服务器。本次同步不表示本地新增文章已上线。

## 许可与素材

Astro 版保留上游 AstroWind 的 [MIT 许可证](astro/LICENSE.md) 和来源说明；旧版保留原项目的历史与说明。作者肖像、文章、品牌图、付款二维码和其他个人素材不随框架 MIT 自动授权他人使用。复用代码时请替换自己的身份、内容和素材。
