---
type: "article"
topic: "hermes"
created: "2026-04-18 01:31:07"
modified: "2026-04-18 01:31:07"
tags: ["article", "hermes", "skills", "claude-code", "multi-agent", "proposal", "crafted"]
origin: "crafted"
source: "mcp"
status: "active"
---

---
# Hermes Skills 系统诊断提案 — Claude Code 多Agent工作流提示词

请帮我深入分析 Hermes Agent 的 skills 系统，找到它的设计缺陷，并形成一套可提交的优化方案。

## 目标

产出一份能给 Hermes 官方看的系统诊断报告 + 解决方案提案。
格式要求：结构清晰、有问题定位、有方案细节、有优先级。

## 约束

- 不修改任何文件，只读
- 所有分析基于源码，不要猜测
- 用多 Agent 并行工作，数据通过文件传递

## 工作方式

**Agent A — 源码机制研究**

读 Hermes 源码和官方文档，准确回答以下问题（要有代码证据）：

1. skills 的触发机制到底是什么（keyword matching? exact match? fuzzy? vector search?）
2. 如果多个 skill 的 trigger 关键词相同，会触发一个还是多个？
3. frontmatter 里哪些字段会被源码读取和使用（列出所有字段名）？
4. skill 的创建、更新、删除有没有任何规范约束或生命周期管理？
5. skill 的加载（skill_view 调用）有没有计数机制？

把结论写入 `~/.hermes/skills/hermes/skills-diagnosis/reports/agent_a_findings.md`

---

**Agent B — 生态现状研究**

扫描 `~/.hermes/skills/` 目录结构和现有 skills，以及 `~/.hermes/scripts/skills_check.py`，统计和归纳：

1. 现在有多少个 category？每个 category 有多少个 skill？
2. 有哪些已知冲突组（多个 skill 做同一件事）？具体是哪些？
3. frontmatter 的实际使用情况：哪些字段被普遍采用？哪些几乎没人用？
4. 现有维护机制有哪些？解决了什么？还有什么没解决？
5. 如果要给官方提 issue，目前最大的 3 个问题是什么？

把结论写入 `~/.hermes/skills/hermes/skills-diagnosis/reports/agent_b_findings.md`

---

**Agent C — 方案设计**

基于 A 和 B 的结论，设计一套完整的 skills 系统优化方案：

1. **元字段规范**：哪些字段是源码必须支持的，哪些是人类约定要标准化的
2. **触发机制增强**：如何支持更智能的 skill 匹配和去重
3. **生命周期管理**：skill 的创建、版本管理、废弃（deprecation）、删除规范
4. **使用追踪**：如何让 load_count 真正生效（给出代码方案）
5. **健康检查机制**：如何自动发现重复/过时/冲突的 skill
6. **优先级排序**：先做什么后做什么，给出理由

把方案写入 `~/.hermes/skills/hermes/skills-diagnosis/reports/agent_c_proposal.md`

---

## 最终输出格式

三份报告写完后，汇总成一份完整提案，格式如下：

```
# Hermes Skills 系统诊断报告 + 优化提案

## 一、现状分析（基于源码）
[Agent A 的核心发现，准确无误]

## 二、生态现状（基于统计）
[Agent B 的核心发现]

## 三、核心问题定位
[Agent B 给出的 Top 3 问题]

## 四、优化方案
[Agent C 的完整方案，含优先级]

## 五、可提交的 Issue 草稿
[给 Hermes 官方的 issue 格式，含背景、复现步骤、期望行为、建议方案]
```

把完整提案写入 `~/.hermes/skills/hermes/skills-diagnosis/reports/FINAL_PROPOSAL.md`，然后把内容完整输出给我。
