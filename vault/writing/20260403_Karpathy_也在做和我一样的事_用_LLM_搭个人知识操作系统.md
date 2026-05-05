---
type: "article"
topic: "writing"
created: "2026-04-03 22:22:58"
modified: "2026-04-03 22:22:58"
tags: ["article", "writing", "Karpathy", "LLM", "知识管理", "Obsidian", "ThirdSpace", "MCP", "个人知识库", "AI工作流", "crafted"]
origin: "crafted"
source: "mcp"
status: "active"
sources:
  - "[[twitter_20260403_221238_X_上的_Andrej_Karpathy__LLM_Knowledge_Bases_Somethin]]"
  - "[[20260401_我越来越确信_AI_时代最重要的_不是模型_而是你自己的_AI_资产]]"
  - "[[20260323_工具做脏活_AI做智能_一个人如何用_40_个_MCP_工具搭出知识操作系统]]"
---

# Karpathy 说需要一个知识操作系统产品，我已经做了一个免费的
![[Pasted image 20260403224123.png]]

今天 Karpathy 发了条长推，说他最近不怎么用 AI 写代码了。

**他把大量 token 花在让 LLM 帮他管理知识上。**

收集论文和文章 → 让 LLM 编译成 Obsidian wiki → 在 wiki 上做问答 → 结果归档回 wiki → 越滚越大。

推文最后他说了一句：

> "I think there is room here for an incredible new product instead of a hacky collection of scripts."
>
> 这里有巨大的产品机会，而不该只是一堆脚本的拼凑。

我看到这句话的时候愣了一下。

**因为这套东西我已经搭了三个月了。而且其中的轻量版——灵犀插件——已经免费开放快一个月了。**

---

## 先说 Karpathy 在做什么

翻译成人话就六步：

1. **收集** — 论文、文章、代码仓库丢进 raw/ 文件夹
2. **编译** — LLM 把 raw/ 编译成 wiki（.md 文件 + 目录结构 + 反向链接）
3. **浏览** — 用 Obsidian 看，但人几乎不直接编辑 wiki，全是 LLM 维护
4. **问答** — wiki 攒到 100 篇文章、40 万字后，LLM 可以在上面做复杂研究
5. **反哺** — 查询结果归档回 wiki，知识越用越厚
6. **质检** — LLM 做健康检查，查数据不一致、补缺失、发现新关联

一句话：**LLM 当知识库的管家，人只管输入和提问。**

---

## 我的系统长什么样

我做了三个月的东西，叫 ThirdSpace + Vault。88 个 MCP 工具，一个 Obsidian 知识库，5 套 AI 角色系统，6 个产品的开发运营全跑在上面。

拆开看对比：

| | Karpathy | 我 |
|---|---|---|
| 原始数据 | raw/ 文件夹 | flux/intake/（自动抓取 + frontmatter 状态追踪） |
| 知识编译 | LLM 生成 wiki | LLM 生成知识卡片（摘要 + 要点 + 思考题） |
| 浏览工具 | Obsidian | Obsidian |
| 写入方式 | LLM 全权维护 | MCP 工具守门（ItemManager 校验格式） |
| 问答能力 | LLM 直接查 wiki | MCP 工具检索 + LLM 分析 |
| 反哺机制 | 查询结果归档回 wiki | 反思闭环 → 行动项 → 验证 → 回写 |
| 质检 | LLM 健康检查 | 还没做（Karpathy 给我提了个醒） |

**核心理念完全一致：让 LLM 成为知识库的维护者，人只负责输入和决策。**

---

## 他的系统缺什么，我补了什么

不是说 Karpathy 的方案不好——他的场景是纯研究，wiki 自由度高效率也高。但如果你的知识库同时服务于写作、产品决策、内容发布，光靠 LLM 直接读写 Markdown 会出问题。

我踩了三个月的坑，总结出三层防线：

**1. 写入守门。**

LLM 直接写 Markdown 会怎样？标签带空格 Obsidian 不认、frontmatter 缺字段查不到、文件放错目录。内容一多就是灾难。

我的方案：**写入只走 MCP 工具（ItemManager），所有内容经过 frontmatter 校验、tag 清洗、路径规范化。** LLM 负责「写什么」，工具负责「怎么存」。今天刚修了一个 bug——所有含空格的 tag 统一替换成连字符，Obsidian 才认。

**2. 从知识到行动的闭环。**

Karpathy 的系统是「知识 → 问答 → 更多知识」。循环是闭的，但缺了一环——**行动**。知识如果不变成行动，就只是高级版的收藏夹。

我加了一层反思链路：知识卡片 → LLM 生成反思（Mirror/Deepen/Bridge）→ 我回答追问 → 闭环点评 → 自动提取行动项到 todos.md → 定期验证。

**知识不落地就不算懂。**

**3. 原文和加工品分离。**

所有抓取的原文都在 flux/intake/，frontmatter 里标 `status: raw` 或 `processed`。已生成卡片的标 processed，还没加工的标 raw。随时知道哪些内容还没消化。

Karpathy 的 raw/ 文件夹只是存原文，没有状态追踪。这在 100 篇的规模够用，但到 1000 篇你就不知道哪些看过哪些没看过了。

---

## 但这套系统只有我能用

问题来了。

ThirdSpace 需要 Python 环境、MCP server、命令行操作。88 个工具的配置和调试，不是一般人能搞的。

**过去一个月我在想的问题是：怎么把 80% 的价值，用 20% 的复杂度交付出去？**

答案是我做了一个 Obsidian 插件——**灵犀**。完全免费，已经迭代到 v0.2.0。

不需要装 MCP server，不需要 Python 环境，不需要命令行。装插件、填 API Key、五分钟上手。手机、平板、电脑都能用。

**灵犀能做什么：**

- 粘贴 URL 自动抓取正文，AI 生成知识卡片存进 Obsidian
- 对话时自动检索你的笔记内容（RAG），基于你自己的知识回答
- AI 记住你说过什么（持久记忆），下次对话不用重新自我介绍
- 场景化 Skill 系统——知识学习、自媒体创作、工作管理，AI 按场景切换工作方式
- 对话中提到的待办自动写入 todos，在 Obsidian 里直接勾选

**和 ThirdSpace 完整版的关系：** 灵犀是轻量前端，解决 80% 的日常场景。剩下 20% 的深度场景（批量编译、跨文档反思、工作流编排），走 ThirdSpace + Claude Code。

---

## 为什么是 Obsidian

Karpathy 用 Obsidian，我也用 Obsidian。这不是偶然。

- **纯本地 Markdown**：数据永远在自己手里，没有云端，没有账号系统
- **千万级用户**：成熟的插件生态，不用重新教育市场
- **本地优先的哲学**：和「AI 资产属于自己」的理念天然契合

**让 AI 进入你已有的知识库，比让你搬进一个新的 AI 平台，成本低十倍。**

---

## 如果你想试

灵犀完全免费，支持 iOS / Android / Mac / Windows / Linux。

安装方式两种：
- **手机用户**：Obsidian 里装 Remotely Save 插件，配置同步拉取即可
- **电脑用户**：下载 zip 解压到 Obsidian 插件目录

API 用豆包（火山引擎），新用户有免费额度，日常用大概几毛钱一天。也支持 DeepSeek、通义、硅基流动、OpenRouter 等十几个平台。

评论区留言「教程」我发你安装步骤。

---

## 最后

Karpathy 那条推下面很多人在讨论该怎么搭这套系统。

有人问用什么脚本，有人问 RAG 怎么做，有人问 Obsidian 用什么插件。

我想说的是：**不要被「搭系统」这件事吓住。**

你不需要会写代码。你不需要了解 RAG 原理。你甚至不需要知道 MCP 是什么。

你只需要一个 Obsidian + 一个灵犀 + 一个 API Key。

**先开始用。让 AI 帮你整理第一篇文章、记住你第一个偏好、在你的笔记里找到第一个关联。**

知识飞轮不需要一步到位。但它需要开始转。