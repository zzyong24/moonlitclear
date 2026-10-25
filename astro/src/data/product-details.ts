export type DemoStep = {
  label: string;
  title: string;
  description: string;
  result: string;
  screenTitle: string;
  items: { label: string; text: string }[];
};
export type ProductDetail = {
  theme: string;
  title: [string, string];
  intro: string;
  facts: { label: string; value: string }[];
  demoTitle: string;
  scenario: string;
  steps: DemoStep[];
  benefits: { title: string; description: string; detail: string }[];
  fit: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  cta: string;
  status?: string;
  resources?: { label: string; url: string }[];
};

export const productDetails: Record<string, ProductDetail> = {
  hean: {
    theme: 'peach',
    status: '内测中 · 单人本地记录',
    title: ['随手说一句，', '记下宝宝的一天。'],
    intro:
      '禾安成长日记是面向婴幼儿家庭的日常记录 App。文字或语音描述刚发生的事，整理为可回看、可纠正的记录；再用时间线、趋势与相册留住成长过程。',
    facts: [
      { label: '适合谁', value: '日常照护婴幼儿的家长' },
      { label: '从哪里开始', value: '一句话、一段语音或一张照片' },
      { label: '留下什么', value: '本地记录、趋势与成长相册' },
    ],
    demoTitle: '从一句话，到找得回的一天。',
    scenario: '虚构示例：家长记录一次喂养和午睡，再纠正奶量。演示中的时间与数字不对应任何真实宝宝。',
    steps: [
      {
        label: '随手记录',
        title: '照护的时候，不必先找表单。',
        description: '输入刚发生的事情，文字和语音都可作为记录入口。',
        result: '一段带时间和事件的原始描述',
        screenTitle: '记录对话',
        items: [
          { label: '家长输入', text: '下午两点喝了 90 毫升奶，两点半睡着了。' },
          { label: '识别事件', text: '瓶喂 · 14:00 · 90 mL' },
          { label: '识别事件', text: '睡眠 · 14:30 开始' },
        ],
      },
      {
        label: '整理事件',
        title: '明确的事记下来，含糊的地方再补充。',
        description: '明确事件经校验后保存；缺少关键信息时继续追问，不凭空补数字。',
        result: '喂养记录与进行中的睡眠计时',
        screenTitle: '事件时间线',
        items: [
          { label: '14:00', text: '瓶喂 90 mL · 保留原始描述' },
          { label: '14:30', text: '开始午睡 · 等待结束时间' },
          { label: '仍可编辑', text: '发现不对时，从原记录继续修改' },
        ],
      },
      {
        label: '补充纠正',
        title: '说错或漏记，可以接着改。',
        description: '纠正关联原事件；明确的醒来时间补齐睡眠区间，避免把一次事件记成多次。',
        result: '一条更正后的奶量和完整睡眠记录',
        screenTitle: '继续对话',
        items: [
          { label: '家长补充', text: '刚才那次是 100 毫升，三点半醒了。' },
          { label: '原记录更新', text: '14:00 瓶喂 · 90 → 100 mL' },
          { label: '睡眠补齐', text: '14:30—15:30 · 一次午睡' },
        ],
      },
      {
        label: '回看成长',
        title: '隔几天，也能找到发生过的事。',
        description: '按时间或类型回看记录，查看已记录数据的趋势，照片与视频进入成长相册。',
        result: '能查、能改、能导出的成长记录',
        screenTitle: '记录与相册',
        items: [
          { label: '时间线', text: '按日期找到这次喂养和午睡' },
          { label: '趋势', text: '只汇总已记录数据，不把漏记当作零' },
          { label: '相册与导出', text: '回看本地成长照片；导出记录 CSV' },
        ],
      },
    ],
    benefits: [
      {
        title: '说话也能做记录',
        description: '把一句话中的几件事分开整理，照护时减少反复点选。',
        detail: '文字 / 语音 / 多事件',
      },
      {
        title: '记录可以持续修正',
        description: '补充睡眠结束、纠正原来的奶量，保留可回看的时间线。',
        detail: '原始描述 / 编辑 / 纠错',
      },
      {
        title: '日常之外，留住成长',
        description: '回看日常趋势、测量和相册，也可尝试成长留念创作。',
        detail: '趋势 / 成长相册 / 记录导出',
      },
    ],
    fit: [
      { title: '照护时腾不出手', description: '通过简短文字或语音留下记录，稍后再检查。' },
      { title: '想回顾宝宝的日常', description: '从自己实际记下的数据和照片里查找，而不是依赖记忆。' },
      { title: '希望记录由自己保留', description: '当前以单人本地使用为主，可导出自己的记录。' },
    ],
    faq: [
      {
        question: '现在能直接下载正式版吗？',
        answer: '目前按内测产品展示。可联系月明了解体验方式，暂不承诺应用商店上架或公开下载。',
      },
      {
        question: '可以多人实时共享吗？',
        answer: '当前主线是单人、本地记录。家庭共享、跨设备账号与云同步不作为已交付能力宣传。',
      },
      {
        question: '它会判断宝宝是否生病吗？',
        answer: '本页展示的是记录与回看功能，AI 不应把照片、哭声或漏记推断成确定的健康结论。',
      },
    ],
    cta: '了解禾安内测',
    resources: [{ label: 'GitHub 源码', url: 'https://github.com/zzyong24/hean-growth-journal' }],
  },
  moving: {
    theme: 'plum',
    status: '桌面产品 · 版本与开放情况以产品页为准',
    title: ['把创意做成镜头，', '再把镜头交出去。'],
    intro:
      '媒措 Moving 是 AI 视频创作的桌面工作区。以剧本、口播稿、源视频或商品图开始，在同一个项目里讨论方案、生成和修改素材、比较镜头版本，再导出继续制作。',
    facts: [
      { label: '适合谁', value: 'AI 视频作者与小型内容工作室' },
      { label: '从哪里开始', value: '想法、剧本、源视频或商品图' },
      { label: '留下什么', value: '项目素材、选用镜头与导出文件' },
    ],
    demoTitle: '把一个短片想法，推进到镜头素材。',
    scenario: '示例：为一件陶瓷杯制作三个镜头的产品短片。这里演示创作流程，不会发起真实模型任务。',
    steps: [
      {
        label: '交代想法',
        title: '把目标和手头的材料放进项目。',
        description: '从明确的创作目标开始，提供相关素材，再围绕同一项目继续讨论。',
        result: '带素材与创作目标的项目',
        screenTitle: '创作输入',
        items: [
          { label: '目标', text: '为陶瓷杯做一段安静、明亮的短片' },
          { label: '已有素材', text: '杯子正面图、细节图与一句卖点说明' },
          { label: '表达方向', text: '突出触感和日常使用，不夸大功效' },
        ],
      },
      {
        label: '讨论镜头',
        title: '先把每个镜头要表达什么说清楚。',
        description: '把想法拆成可修改的镜头安排，在生成前核对画面、素材与表达。',
        result: '一份可修改的镜头计划',
        screenTitle: '分镜计划',
        items: [
          { label: '镜头 01', text: '清晨桌面上的杯子 · 建立场景' },
          { label: '镜头 02', text: '杯壁与釉面特写 · 展示细节' },
          { label: '镜头 03', text: '倒入茶水 · 回到日常使用' },
        ],
      },
      {
        label: '生成与选用',
        title: '同一个镜头，可以比较再决定。',
        description: '在项目中查看生成结果，按反馈继续修改并选择要使用的版本。',
        result: '明确的选用镜头与保留版本',
        screenTitle: '镜头版本',
        items: [
          { label: '镜头 02 · 版本 A', text: '近景角度偏高 · 保留作比较' },
          { label: '镜头 02 · 版本 B', text: '更清楚地呈现杯壁细节 · 本次选用' },
          { label: '继续修改', text: '保持主体，调整背景和镜头节奏' },
        ],
      },
      {
        label: '导出素材',
        title: '把成果带到下一步制作。',
        description: '整理本次选用的镜头与相关素材，再交给剪辑工具继续精剪。',
        result: '可以继续剪辑的项目素材',
        screenTitle: '交付清单',
        items: [
          { label: '已选镜头', text: '按镜头顺序整理视频片段' },
          { label: '相关材料', text: '图片、文稿与项目素材集中保留' },
          { label: '下一步', text: '导入剪辑工具完成节奏、字幕和声音' },
        ],
      },
    ],
    benefits: [
      {
        title: '支持不同创作起点',
        description: '保留自动路由、短剧、转绘、口播和电商等入口。',
        detail: '想法 / 剧本 / 视频 / 商品图',
      },
      {
        title: '在项目里反复打磨',
        description: '对话、生成素材和选用版本围绕同一个项目组织。',
        detail: '讨论 / 修改 / 版本比较',
      },
      {
        title: '成果能继续制作',
        description: '把生成的镜头交给后续剪辑环节，而不是停在一段孤立预览。',
        detail: '素材管理 / 选片 / 导出',
      },
    ],
    fit: [
      { title: 'AI 短片与短剧创作者', description: '从文字构思推进到分镜与镜头素材。' },
      { title: '口播与电商内容作者', description: '围绕台词或真实商品素材规划画面。' },
      { title: '同时处理多个创作项目', description: '需要把每个项目的上下文和生成结果放在一起。' },
    ],
    faq: [
      {
        question: '和 CreatorOS 有什么区别？',
        answer: 'CreatorOS 更侧重账号定位、选题和内容复盘；Moving 更聚焦视频项目里的镜头生成、修改、选用和导出。',
      },
      {
        question: '可以替代完整剪辑软件吗？',
        answer: '它聚焦 AI 创作与素材组织。需要精剪、调色或复杂混音时，继续使用相应的剪辑工具。',
      },
      {
        question: '有哪些版本，是否可以购买？',
        answer: '请以产品页当前说明为准。本站不复制价格、权益或下载地址，避免将旧版本信息当成当前可用状态。',
      },
    ],
    cta: '查看 Moving 产品页',
  },
  aiterm: {
    theme: 'teal',
    status: '共同开发 · 月明参与核心开发',
    title: ['终端、文件和 Git，', '放在一个工作区。'],
    intro:
      'AITerm 是多终端桌面管理器。把项目目录、真实终端、代码编辑器和 Git 放在同一个窗口，帮助开发者在多个项目间切换并恢复工作状态。',
    facts: [
      { label: '适合谁', value: '同时处理多个项目的开发者' },
      { label: '从哪里开始', value: '一个本地代码目录' },
      { label: '留下什么', value: '按项目组织的终端与编辑状态' },
    ],
    demoTitle: '在一个工作区里，完成一次修改。',
    scenario: '示例：打开个人网站项目，运行预览、修改内容，再检查 Git 改动。所有命令与文件均为流程示例。',
    steps: [
      {
        label: '打开项目',
        title: '先把工作放回它所属的目录。',
        description: '将项目加入侧边栏，文件浏览、终端与编辑器跟随当前项目。',
        result: '一个清楚的项目工作区',
        screenTitle: '项目与文件',
        items: [
          { label: '当前项目', text: 'personal-site' },
          { label: '文件目录', text: 'src / public / package.json' },
          { label: '工作区', text: '当前项目的终端、文件与 Git' },
        ],
      },
      {
        label: '使用终端',
        title: '不同任务，留在各自的终端里。',
        description: '一个终端保持本地预览，另一个终端处理检查或运行 AI 命令行工具。',
        result: '彼此独立的终端会话',
        screenTitle: '多终端会话',
        items: [
          { label: '终端 · 预览', text: 'npm run dev' },
          { label: '终端 · 检查', text: 'npm run check' },
          { label: '终端 · Agent', text: '运行自己已安装的 AI 命令行工具' },
        ],
      },
      {
        label: '编辑与检查',
        title: '看文件、改内容，不必反复换窗口。',
        description: '从目录树打开文件，在内置编辑器修改，再通过 Git 面板查看本次变化。',
        result: '能对应到文件的修改',
        screenTitle: '编辑与 Git',
        items: [
          { label: '正在编辑', text: 'src/pages/about.astro' },
          { label: '改动说明', text: '调整一句自我介绍' },
          { label: 'Git 状态', text: '查看 modified 文件，再决定是否暂存' },
        ],
      },
      {
        label: '保存工作状态',
        title: '下一次打开，继续手上的项目。',
        description: '工作区保存项目、终端与编辑状态，减少重新找目录和文件的步骤。',
        result: '可恢复的项目工作状态',
        screenTitle: '继续工作',
        items: [
          { label: '项目列表', text: '继续按分组管理多个项目' },
          { label: '编辑器', text: '找回上次打开的文件' },
          { label: '终端', text: '恢复已保存的会话状态与历史' },
        ],
      },
    ],
    benefits: [
      {
        title: '终端围绕项目组织',
        description: '真实 PTY、多会话标签和项目分组，减少窗口来回找。',
        detail: '项目分组 / 终端标签 / 会话历史',
      },
      {
        title: '文件与编辑放在一起',
        description: '目录树、搜索和内置代码编辑器组成连续操作路径。',
        detail: '目录树 / 文件搜索 / 代码编辑',
      },
      {
        title: '改动与状态找得回来',
        description: 'Git 面板便于查看改动，持久化工作状态帮助下次继续。',
        detail: 'Git 状态 / 常用操作 / 状态恢复',
      },
    ],
    fit: [
      { title: '同时维护多个项目', description: '希望将每个项目的文件与终端分开组织。' },
      { title: '使用 AI 命令行工具', description: '保留真实终端能力，同时方便查看 Agent 修改的文件。' },
      { title: '希望减少开发窗口切换', description: '在一个工作区连接运行、编辑与 Git 检查。' },
    ],
    faq: [
      {
        question: 'AITerm 是月明独立开发的吗？',
        answer: '仓库列出 love张 为 Owner，月明（zzyong24）参与核心开发，因此这里明确标注为共同开发。',
      },
      {
        question: '是否内置某个 AI 模型？',
        answer: '这里展示的是终端与开发工作区。可以在真实终端中使用已安装的工具，不把终端管理能力等同于模型服务。',
      },
      {
        question: '从哪里安装？',
        answer:
          'GitHub 已有 v0.1.0 的 Mac 发行附件，也提供源码与构建说明。当前版本和平台支持以仓库为准；本轮未逐个安装验证。',
      },
    ],
    cta: '查看源码与发行版',
  },

  creatoros: {
    theme: 'coral',
    title: ['一条内容，', '从选题做到复盘。'],
    intro:
      'CreatorOS 是一个本机创作工作台。把账号定位、选题、脚本、制作与发布后的复盘放在一起，让下一条内容用得上前一条的经验。',
    facts: [
      { label: '适合谁', value: '持续创作的个人与小团队' },
      { label: '从哪里开始', value: '账号定位、素材或一个选题' },
      { label: '留下什么', value: '作品项目、脚本与复盘记录' },
    ],
    demoTitle: '跟着一条选题，走一遍创作过程。',
    scenario: '示例：一位知识类创作者，准备做一条介绍 AI 工具的短视频。',
    steps: [
      {
        label: '明确定位',
        title: '先说清楚，这条内容给谁看。',
        description: '用定位信息约束后面的选题和表达，减少每次开新对话都从头介绍自己的重复劳动。',
        result: '一份可以继续修改的账号定位',
        screenTitle: '定位工作台',
        items: [
          { label: '我在分享什么', text: 'AI 工具的真实使用方法' },
          { label: '这次给谁看', text: '想尝试 AI，但不知道怎么开始的创作者' },
          { label: '表达习惯', text: '先展示结果，再讲操作；少用术语' },
        ],
      },
      {
        label: '选择选题',
        title: '从具体问题里，选一个值得做的题。',
        description: '结合定位、评论问题、参考资料和已有经验整理候选。选定后立项，材料跟着项目走。',
        result: '一个带受众、问题和切入角度的项目',
        screenTitle: '选题候选',
        items: [
          { label: '待比较', text: '第一次用 AI 写稿，怎么避免空话？' },
          { label: '本次选择', text: '同一份素材，如何做成一条讲得清楚的视频？' },
          { label: '需要补充', text: '一份原始素材、一个操作示例、前后对照' },
        ],
      },
      {
        label: '组织脚本',
        title: '把要说的话，和要展示的画面放在一起。',
        description: '围绕同一个项目打磨开头、结构和素材。AI 编导协助修改，人负责确认表达与事实。',
        result: '可继续制作的脚本和镜头安排',
        screenTitle: '脚本与制作',
        items: [
          { label: '开头 · 结果', text: '先给观众看最终视频和原始素材' },
          { label: '中段 · 操作', text: '选重点 → 写结构 → 匹配画面' },
          { label: '结尾 · 带走', text: '留一份可照着使用的检查清单' },
        ],
      },
      {
        label: '复盘回流',
        title: '发布之后，再回来看哪些判断有效。',
        description: '把发布前的判断与真实反馈放在一起，记录哪些表达值得保留，哪些地方需要重做。',
        result: '下一条内容可复用的经验',
        screenTitle: '项目复盘',
        items: [
          { label: '发布前判断', text: '观众更关心“怎么做”，而不是工具数量' },
          { label: '回收真实反馈', text: '补入作品数据、评论与观看反馈' },
          { label: '下一次试试', text: '把操作演示提前，减少开头的背景介绍' },
        ],
      },
    ],
    benefits: [
      {
        title: '定位会跟着项目走',
        description: '账号的人群、选题规则和表达习惯集中维护，后续写稿有共同依据。',
        detail: '定位访谈 / 定位卡 / 项目上下文',
      },
      {
        title: '创作过程放在一处',
        description: '选题、脚本和素材围绕作品组织，AI 编导对话也能使用当前项目的信息。',
        detail: '选题候选 / 编导对话 / 素材与制作',
      },
      {
        title: '做完以后有记录可查',
        description: '从发布登记到数据复盘，再到经验确认，留下下一次能继续用的记录。',
        detail: '发布登记 / 数据复盘 / 经验回流',
      },
    ],
    fit: [
      { title: '一个人持续做内容', description: '同时负责选题、写稿和制作，需要一处保留项目上下文。' },
      { title: '小团队协作创作', description: '围绕同一份定位、脚本和项目资料，减少来回找版本。' },
      { title: '已经有自己的制作方式', description: '可以从项目与复盘开始使用，不必一次改变全部创作习惯。' },
    ],
    faq: [
      {
        question: '它只是一个写稿工具吗？',
        answer:
          '写稿是其中一段。CreatorOS 还组织账号定位、选题、素材、制作、发布登记与复盘，重点是把一条作品的过程接起来。',
      },
      {
        question: '内容会自动发出去吗？',
        answer:
          '生成内容和对外发布是不同动作。这里的演示不会调用真实发布；实际发布需要对应平台账号与产品内的确认流程。',
      },
      {
        question: '需要准备什么？',
        answer: '准备账号定位或一份想做的素材，从一个项目开始。客户端支持情况、模型配置与可用版本请查看产品官网。',
      },
    ],
    cta: '了解 CreatorOS',
  },
  thirdspace: {
    theme: 'blue',
    title: ['把资料留下，', '让 Agent 帮你整理。'],
    intro:
      'ThirdSpace 是一个让 AI Agent 维护的本地知识库模板。笔记、项目、日志和输出各有位置；你描述想做的事，Agent 按知识库里的规则完成整理。',
    facts: [
      { label: '适合谁', value: '有资料积累、愿意使用 Agent 的人' },
      { label: '从哪里开始', value: '本地笔记、资料与项目' },
      { label: '留下什么', value: '自己持有的文件与工作区' },
    ],
    demoTitle: '从一段零散记录，到项目可用的资料。',
    scenario: '示例：把一次 AI 工具实践的笔记，整理进自己的知识库。',
    steps: [
      {
        label: '交给 Agent',
        title: '像交代一件事一样，把资料交进来。',
        description: '从自然语言请求开始。Agent 读取知识库入口与规范，找到这次操作该使用的工作区。',
        result: '一条有明确处理目标的输入',
        screenTitle: '给 Agent 的任务',
        items: [
          { label: '你的请求', text: '把这次 AI 工具试用记录整理进知识库，关联到内容创作项目。' },
          { label: '带上原始资料', text: '试用记录.md · 功能说明 · 待验证问题' },
          { label: '遵循库内规则', text: '先读取工作区索引，再选择整理方式' },
        ],
      },
      {
        label: '归入工作区',
        title: '先分清它是资料、知识，还是项目任务。',
        description: '收件箱、知识、项目、日记与输出有各自的职责。整理按已有结构进行，不凭空制造另一套目录。',
        result: '有明确位置的知识与项目文件',
        screenTitle: '工作区目录',
        items: [
          { label: '01-收件箱', text: '待整理的原始记录' },
          { label: '03-知识', text: 'AI 工具试用要点.md' },
          { label: '04-项目', text: '内容创作 / 待验证的问题.md' },
        ],
      },
      {
        label: '补充上下文',
        title: '整理时，把来源和相关项目一起留下。',
        description: '让 Agent 按知识库规范组织笔记，保留原始材料与相关文件的线索，方便以后继续查找。',
        result: '一份能继续阅读和引用的笔记',
        screenTitle: 'AI 工具试用要点.md',
        items: [
          { label: '主要发现', text: '先给出具体素材，再要求结构化输出' },
          { label: '相关项目', text: '内容创作 / 本周选题' },
          { label: '保留来源', text: '试用记录.md；结论仍需继续验证' },
        ],
      },
      {
        label: '继续使用',
        title: '下次写作时，从已有资料开始。',
        description: '知识库的目标是支持后续工作。通过 Agent 查找已有记录，继续写文章、整理项目或做阶段复盘。',
        result: '带已有上下文的新任务',
        screenTitle: '下一次写作',
        items: [
          { label: '新的请求', text: '参考这次工具试用记录，整理一篇实践文章提纲。' },
          { label: '已有材料', text: '试用要点 + 相关项目 + 待验证问题' },
          { label: '输出位置', text: '06-输出 / 实践文章提纲.md' },
        ],
      },
    ],
    benefits: [
      {
        title: '目录就是你的资料',
        description: '知识库以本地文件组织。结构和规范留在仓库里，便于检查、修改和迁移。',
        detail: '工作区索引 / 文件组织 / 路径无关',
      },
      {
        title: '用你熟悉的 Agent',
        description: '模板面向 Agent 工作方式，提供初始化与知识整理等技能入口，不绑定单一聊天窗口。',
        detail: 'Agent 原生 / 库内技能 / 按需读取',
      },
      {
        title: '需要时再加看板',
        description: '可以用 Obsidian 打开知识库，选择启用 Dashboard，查看文件统计、待办与快捷入口。',
        detail: 'Obsidian 可选 / 文件统计 / Todos',
      },
    ],
    fit: [
      { title: '积累了很多笔记', description: '希望整理进入稳定目录，以后能继续读、继续写。' },
      { title: '用 Agent 做项目', description: '需要把项目材料、过程记录和输出放进同一个可理解的工作区。' },
      { title: '重视文件可迁移', description: '希望保留本地文件与明确结构，自己掌握资料。' },
    ],
    faq: [
      {
        question: '一定要使用 Obsidian 吗？',
        answer: '不需要。模板本身是本地知识库目录，Agent 可直接读取。Obsidian 与 Dashboard 是可选的浏览和管理入口。',
      },
      {
        question: '第一次如何开始？',
        answer: '从开源仓库获取模板，在目录里打开支持的 Agent，让它初始化知识库。具体步骤与环境要求以仓库手册为准。',
      },
      {
        question: '开源免费是否包含模型调用？',
        answer: '模板使用 MIT 许可。你使用的 Agent、模型服务或其他外部服务，可能有各自的费用和使用条件。',
      },
    ],
    cta: '获取开源模板',
    resources: [{ label: '了解配套的 ThirdSpace Dashboard', url: 'https://github.com/zzyong24/thirdspace-dashboard' }],
  },
  'msg-collect': {
    theme: 'amber',
    title: ['视频、网页、PDF，', '整理成一份笔记。'],
    intro:
      'Msg-collect 把不同来源的内容接到同一条整理流程：视频先转录，网页和 PDF 提取正文，再用 AI 总结，输出可复制、下载的 Markdown 笔记。',
    facts: [
      { label: '适合谁', value: '经常看视频、读资料的创作者' },
      { label: '支持输入', value: '视频链接、网页与 PDF' },
      { label: '输出形式', value: '原文内容与 Markdown 总结' },
    ],
    demoTitle: '看一份资料，怎样变成可带走的笔记。',
    scenario: '示例：整理一段介绍内容创作方法的视频；网页与 PDF 从正文提取开始。',
    steps: [
      {
        label: '放入资料',
        title: '从一个链接或文件开始。',
        description: '支持视频 URL、本地视频文件、网页与 PDF。不同输入进入对应的提取流程。',
        result: '一个待处理的资料任务',
        screenTitle: '资料入口',
        items: [
          { label: '视频', text: '内容创作方法 · 示例视频' },
          { label: '网页', text: '文章正文 / 微信文章 / 知乎页面' },
          { label: 'PDF', text: '本地文件或可访问的 PDF 链接' },
        ],
      },
      {
        label: '提取内容',
        title: '先拿到内容，再谈总结。',
        description: '视频使用语音转录；网页提取主要正文；PDF 解析文字。处理进度会持续反馈。',
        result: '可以核对的原始文本',
        screenTitle: '视频转录',
        items: [
          { label: '00:12', text: '选题之前，先确认你准备回答谁的问题。' },
          { label: '00:35', text: '用一个具体例子解释方法，比列一串工具更清楚。' },
          { label: '01:08', text: '做完以后留下复盘，让下次能复用经验。' },
        ],
      },
      {
        label: '整理要点',
        title: '把长内容，收成有结构的摘要。',
        description: 'AI 在提取文本的基础上总结重点。关键事实仍可回到原资料核对，避免只留下脱离来源的短句。',
        result: '一份结构清楚的总结',
        screenTitle: 'AI 总结',
        items: [
          { label: '这段内容在讲什么', text: '围绕具体受众组织创作，并用复盘积累经验。' },
          { label: '三个要点', text: '明确问题 · 展示案例 · 留下复盘' },
          { label: '接下来可做', text: '选一条旧内容，对照这三个步骤重新检查。' },
        ],
      },
      {
        label: '带走笔记',
        title: '整理结果，放回你自己的工作流。',
        description: '复制或下载 Markdown，也可以导出分享图。资料整理结束后，继续在熟悉的笔记和创作工具里使用。',
        result: '一份可编辑、可归档的 Markdown',
        screenTitle: '创作方法总结.md',
        items: [
          { label: '# 主题', text: '用具体问题组织一条内容' },
          { label: '## 要点', text: '- 受众与问题\n- 示例与操作\n- 反馈与复盘' },
          { label: '## 来源', text: '保留原始视频链接与转录内容' },
        ],
      },
    ],
    benefits: [
      {
        title: '三种输入，一条流程',
        description: '视频、网页和 PDF 各自提取，后面统一总结，减少在不同工具之间搬运内容。',
        detail: 'Whisper 转录 / 正文提取 / PDF 解析',
      },
      {
        title: '过程看得见',
        description: '处理时反馈进度；长内容先有文本，再进入总结，便于检查整理依据。',
        detail: '任务进度 / 原始内容 / 结构化摘要',
      },
      {
        title: '结果可以带走',
        description: '总结支持复制、下载和分享图导出，也提供让 AI 助手调用的 MCP 入口。',
        detail: 'Markdown / 分享图 / MCP',
      },
    ],
    fit: [
      { title: '整理参考视频', description: '把视频里的方法转成文本，方便检索与引用。' },
      { title: '读长文章与文档', description: '先看结构化摘要，再回到原文确认关键细节。' },
      { title: '建立自己的资料库', description: '把总结导入已有笔记目录，保留后续写作的材料。' },
    ],
    faq: [
      {
        question: '什么内容都能提取吗？',
        answer: '不保证。来源权限、登录要求、页面结构、音频清晰度都会影响结果。扫描型 PDF 也可能需要额外的识别步骤。',
      },
      {
        question: '可以本地部署吗？',
        answer: '可以。仓库提供安装说明，需要 Python、Node.js 和 ffmpeg 等环境；使用 AI 总结还需要配置兼容的模型服务。',
      },
      { question: '总结能代替原文吗？', answer: '不能。摘要帮助快速理解结构，重要事实、数字和引文需要回到原文核对。' },
    ],
    cta: '了解 Msg-collect',
  },
  'ai-companion': {
    theme: 'sage',
    title: ['从孩子的问题，', '开始一次好好交流。'],
    intro:
      'AI 童伴围绕儿童成长对话与家长查看记录展开。通过追问、举例和小尝试，帮助孩子把自己的想法说清楚，也让家长有机会继续参与。',
    status: '已上线',
    facts: [
      { label: '围绕谁设计', value: '孩子与愿意参与的家长' },
      { label: '从哪里开始', value: '一个问题、一件日常小事' },
      { label: '关注什么', value: '思考过程与后续交流' },
    ],
    demoTitle: '用一个纸飞机问题，看看对话如何展开。',
    scenario: '对话设计示例，用于说明产品方向；实际功能以当前可用版本为准。',
    steps: [
      {
        label: '说出问题',
        title: '先听孩子具体遇到了什么。',
        description: '从孩子自己的描述开始，让问题有具体的场景，不急着给一大段标准答案。',
        result: '一个可以继续追问的问题',
        screenTitle: '今天想聊什么？',
        items: [
          { label: '孩子', text: '我的纸飞机一扔出去就往下掉。' },
          { label: '童伴', text: '你观察到它是机头先掉，还是先往一边歪？' },
        ],
      },
      {
        label: '一起观察',
        title: '把“大问题”，变成能观察的小细节。',
        description: '用容易理解的追问，引导孩子描述现象、比较差异，而不是只记住结论。',
        result: '孩子自己的观察与猜想',
        screenTitle: '先看看发生了什么',
        items: [
          { label: '孩子', text: '好像总是往左边歪。' },
          { label: '童伴', text: '把它放在桌上，看看两边机翼一样高吗？你觉得哪里不太一样？' },
        ],
      },
      {
        label: '试一个办法',
        title: '留一个可以动手的小尝试。',
        description: '把想法转成简单、适合家长陪同的小行动，让下一次交流有新的观察可说。',
        result: '一次可以回头讨论的小实验',
        screenTitle: '试试，再说说结果',
        items: [
          { label: '孩子', text: '左边机翼折得低一点。' },
          { label: '童伴', text: '可以请家长陪你把两边调得接近，再试一次。和刚才相比，有什么变化？' },
        ],
      },
      {
        label: '家长接着聊',
        title: '让对话回到真实的陪伴里。',
        description: '家长可以围绕孩子的问题继续交流。记录关注聊了什么、尝试了什么，不把短对话变成对孩子的定性评价。',
        result: '一个家长能接着问的问题',
        screenTitle: '给家长的交流线索',
        items: [
          { label: '今天的话题', text: '纸飞机为什么会往一侧偏' },
          { label: '孩子的尝试', text: '比较两边机翼，提出调整后再试的想法' },
          { label: '可以接着问', text: '这次飞行和上次哪里不同？你还想改哪个地方？' },
        ],
      },
    ],
    benefits: [
      {
        title: '围绕问题展开',
        description: '从日常提问进入对话，关注孩子怎么想、观察到了什么。',
        detail: '日常提问 / 具体追问 / 表达想法',
      },
      {
        title: '给思考留一点空间',
        description: '用比较、举例和小尝试延续交流，这是产品想探索的对话方式。',
        detail: '观察 / 比较 / 尝试',
      },
      {
        title: '家长继续参与',
        description: '以家长可理解的交流线索连接线上对话与线下陪伴。',
        detail: '对话记录 / 家长参与 / 后续交流',
      },
    ],
    fit: [
      { title: '孩子有个“为什么”', description: '找一个易理解的角度，陪他把问题描述得更具体。' },
      { title: '想一起做点小尝试', description: '把对话变成一次简单观察，而不是停在答案上。' },
      { title: '家长想接着聊', description: '从当天的话题继续交流，关注孩子自己的想法。' },
    ],
    faq: [
      {
        question: '这里是实际产品录屏吗？',
        answer:
          '不是。这里是基于现有产品方向制作的对话流程示例，帮助理解设计思路；当前可用功能请通过产品入口或联系月明确认。',
      },
      {
        question: '它会代替家长或老师吗？',
        answer: '不会。设计重点是辅助交流，让问题能继续讨论；真实陪伴与重要判断仍需要家长和老师参与。',
      },
      {
        question: '适合直接交给孩子独立使用吗？',
        answer:
          '建议家长先了解当前版本的内容、账号与隐私设置，再决定如何陪同使用。这里没有对儿童安全或学习效果作保证。',
      },
    ],
    cta: '访问 AI 童伴',
  },
};
