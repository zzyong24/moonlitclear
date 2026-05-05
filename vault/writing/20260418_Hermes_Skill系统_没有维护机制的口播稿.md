---
type: "article"
topic: "voiceover"
created: "2026-04-18 00:00:00"
modified: "2026-04-18 00:00:00"
tags: ["voiceover", "article", "hermes"]
origin: "crafted"
source: "mcp"
status: "active"
---

# Hermes 最大缺点：Skill 系统能创建，不能维护

**口播稿 | 目标受众：有 AI 编程经验的内容创作者 | 时长：约 4 分钟**

---

## 【开场 — 反直觉 Hook】

你知道 Hermes Agent 最讽刺的地方是什么吗？

它花了两年时间学会自己创建 Skill——但它没有办法判断自己创建的 Skill 靠不靠谱。

我前天就踩了一个这样的坑。

---

## 【第一段 — 故事引入：发生了什么】

事情是这样的：

我写完一篇关于多智能体协作的文章，需要配图。Hermes 给了我四个 Skill 都可以画图：

**svg-to-hires-png**，**hermes-article-illustration-workflow**，**html-to-png-render**，还有 **excalidraw**。

我读了一下，第一个 Skill 的避坑指南写着：

> "HTML + Playwright 截图绝对不要用，DPI 固定、字模糊，视频用直接废掉。"

听起来很权威对吧？我就信了。

结果呢？我用了它推荐的那个方案，画出来的图分辨率低得我直接关掉重来。

**HTML + Playwright 根本不是什么"绝对不要用"的方案——它就是这次翻车的罪魁祸首。**

问题来了：这个 Skill 写了对的避坑指南，但是避坑内容本身是错的。Hermes 系统没有任何机制能发现这件事。

---

## 【第二段 — 横向对比：用事实说话】

我们来横向对比一下这四个 Skill 的元数据情况。

[切换到截图：skills 元数据对比]

看这个表格：

| Skill | 有 created 日期 | 有 quality_score | 有 replaces 声明 | 避坑断言正确 |
|---|---|---|---|---|
| svg-to-hires-png | ❌ | ❌ | ❌ | ❌ 错了 |
| hermes-article | ✅ 2026-04-18 | ❌ | ❌ | ✅ |
| html-to-png-render | ❌ | ❌ | ❌ | 被错误踩了 |
| excalidraw | ❌ | ❌ | ❌ | 依赖已损坏 |

只有 hermes-article 这一个 Skill 有创建日期。其他三个，你根本不知道它是上个月写的还是两年前写的。

更严重的是，这四个 Skill 互相踩对方，但没有仲裁机制。svg-to-hires-png 踩了 html-to-png-render，说它"绝对不要用"。但 html-to-png-render 没有办法反驳——因为 Skill 系统根本没有提供"声明自己的方法是对的"这个能力。

**这就是 Hermes Skill 系统最根本的设计缺陷：它允许你创建一切，但没有办法判断谁更值得相信。**

---

## 【第三段 — 现有维护工具的能力边界】

你可能会问：Hermes 不是有一个 skills-maintenance 吗？不是说每月做健康检查吗？

[切换到录屏：skills-maintenance skill 内容]

对，这个工具存在。2026-04-15 创建的，会统计使用频率，会标记"从未触发"的 Skill。

但是——它解决的是不同的问题。

skills-maintenance 能告诉你的是：

- 哪些 Skill 加载次数多
- 哪些 Skill 存在重复
- 哪些 Skill 引用了不存在的文件

它**不能**告诉你的是：

- 哪个 Skill 的技术断言是对的
- 两个互踩的 Skill 到底该信哪个
- 一个 Skill 的 quality_score 应该是多少

**使用频率不等于质量。** 一个被高频加载的错误 Skill，加载次数越多，破坏力越大。

---

## 【第四段 — 解决方案：元标记系统】

解决这个问题其实很简单，在创建 Skill 的时候强制填写元标记。

具体来说，每个 Skill 的 YAML frontmatter 里必须有这几个字段：

```yaml
---
created: YYYY-MM-DD           # 创建日期，必填
updated: YYYY-MM-DD           # 最后更新
quality_score: 1-5             # 质量评分，5=最优
trust_level: verified | internal | deprecated
replaces: [skill_name]        # 声明覆盖了哪个 Skill
conflicts_with: [skill_name]  # 声明和谁冲突
---
```

有了 quality_score 和 conflicts_with，Agent 在加载多个重叠 Skill 的时候就能做仲裁——选分数高的，有冲突的标记 deprecated 而不是混用。

有了 trust_level，verified 的 Skill 优先于 internal 的，deprecated 的直接跳过。

这套机制不需要多复杂的技术，只需要创建 Skill 的时候多填四个字段。

---

## 【第五段 — 规避策略：当前怎么用 Hermes 的 Skill 系统】

在这个元标记机制还没有在 Hermes 里实现之前，我给你几个实战建议。

**第一，先读 Skill 的 created 日期。** 没有日期的 Skill 要存疑。2026-04-18 的 hermes-article 比没有日期的其他三个都更可信，不是因为它更早，是因为它至少说明有人在维护。

**第二，交叉验证避坑声明。** 如果一个 Skill 踩了另一个 Skill，不要直接信。去读被踩的那个 Skill 的内容，自己判断。

**第三，定期跑 skills-maintenance。** 虽然它不能解决质量仲裁问题，但能发现孤立文件、重复 Skill 和过时引用，每个月跑一次至少能保持 Skill 目录不乱。

**第四，不要迷信 load_count。** 高频使用的 Skill 不一定是好 Skill，可能只是因为它出现得早、被默认加载得多。

---

## 【收尾 — 一句话总结】

Hermes 的 Skill 系统是一个能生孩子、但不能养孩子的系统。

它给了你创建一切的工具，但没有给你判断质量的能力。

元标记不是可选项，而是让 Skill 系统真正可维护的基础。

---

**素材清单：**

1. `02_skills_comparison.png` — 四 Skill 横评对比截图（Playwright HTML 渲染）
2. `03_yaml_frontmatter.png` — YAML frontmatter 元数据对比截图
3. 录屏：skills-maintenance skill 的完整内容 + skills_check.py 运行输出
4. 录屏：skills 目录结构，展示 4 个同名 Skill 的目录分布
