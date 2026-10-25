/** 首页产品目录用的简短说明与状态（产品详情页仍用 brand.ts）。状态有变化时改这里。 */
export const productNotes: Record<string, { status: string; note: string }> = {
  moving: {
    status: '在售 · macOS / Windows',
    note: '从剧本、口播稿或商品图出发，在一个项目里完成讨论、生成、选片与导出。',
  },
  creatoros: {
    status: 'Mac 验收中',
    note: '住在本机的抖音编导系统：选题、脚本、发布到数据复盘，一条线跑完。',
  },
  aiterm: {
    status: '开源 · 团队共建',
    note: '终端、编辑器、Git 整合进一个窗口，多项目并行开发，团队日常主力工具。',
  },
  thirdspace: {
    status: '开源模板',
    note: 'Agent 原生的知识库模板：资料按规则自动归位，任何 AI Agent 都能接手整理。',
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
