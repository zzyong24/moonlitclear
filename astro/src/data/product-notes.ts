/** 首页产品目录用的简短说明与状态（产品详情页仍用 brand.ts）。状态有变化时改这里。 */
export const productNotes: Record<string, { status: string; note: string }> = {
  moving: {
    status: '在售 · macOS / Windows',
    note: '把剧本、口播稿或商品图丢进去，在一个项目里讨论、出镜头、挑版本、导素材。',
  },
  creatoros: {
    status: 'Mac 验收中',
    note: '我自己做抖音时用的编导系统：选题、写稿、发布、看数据，全放在本机。',
  },
  aiterm: {
    status: '开源 · 两人合写',
    note: '和朋友在公园长椅上写的。终端、编辑器、Git 放进一个窗口，我们自己每天在用。',
  },
  thirdspace: {
    status: '开源模板',
    note: '我的知识库方法：收件箱、项目、日志按规则放好，换哪个 Agent 都能接手整理。',
  },
  'msg-collect': {
    status: '可用 · 本地部署',
    note: '视频、网页、PDF 转写和提取，交给你自己的模型总结，结果留在本地。',
  },
  'ai-companion': {
    status: '已上线',
    note: '把孩子和 AI 的聊天贴进来，三分钟看出这段对话教得好不好。',
  },
  hean: {
    status: '内测 · 开源',
    note: '喂养、睡眠、日常观察，随手说一句就记下，回头能在时间线里找到。',
  },
};
