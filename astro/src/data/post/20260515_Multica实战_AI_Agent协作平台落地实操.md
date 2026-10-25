---
title: Multica 实战：AI Agent 协作平台的落地实操
publish_slug: multica-ai-agent-hands-on
publishDate: 2026-05-15T10:09:27.000Z
excerpt: Multica 是一个开源的 Managed Agents 平台，核心理念是：**让 AI Agent 变成真正的队友**。
category: dev
tags:
  - dev
  - AI Agent
author: 月明水清深
---


> 本来想写一篇"如何使用 Multica"的教程，但写完发现不对——这类工具如果只讲功能，不讲具体场景和踩坑过程，读起来就像官方文档。索性改成一篇实操复盘，从安装到跑通 pipeline，把我遇到的问题和解决思路都记下来。

## 01. 什么是 Multica？

Multica 是一个开源的 Managed Agents 平台，核心理念是：**让 AI Agent 变成真正的队友**。

和传统 AI 工具不同，Multica 强调：
- **Agent 即队友**：Agent 有自己的名字、状态、任务队列，出现在看板里
- **多 Agent 协作**：可以创建多个 Agent，各司其职，通过 Issue 传递任务
- **自动化 Pipeline**：Issue 之间有依赖关系，上游完成自动解锁下游
- **本地 + 云端**：Agent 跑在你自己的机器上（通过 daemon），但管理界面在云端

官网：https://multica.ai

## 02. 安装和配置

### 安装 CLI

从 GitHub 下载最新的 CLI：

```bash
# macOS
curl -fsSL https://raw.githubusercontent.com/multica-ai/multica/main/scripts/install.sh | bash

# 或者直接下载二进制
cd ~/Downloads
tar -xzf multica-cli-*-darwin-arm64.tar.gz
export PATH="$HOME/Downloads/multica-cli-*-darwin-arm64:$PATH"
```

### 认证

```bash
multica setup cloud
```

这会打开浏览器让你登录 Multica 账号。登录后 CLI 就认证成功了。

### 添加到 PATH（永久）

```bash
echo 'export PATH="$HOME/Downloads/multica-cli-0.3.0-darwin-arm64:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## 03. 核心命令

### Agent 管理

```bash
# 查看所有 Agent
multica agent list --output table

# 创建 Agent
multica agent create \
  --name "Vision" \
  --description "配图生成智能体" \
  --instructions "你是绘图智能体，负责..." \
  --runtime-id "你的runtime-id"

# 更新 Agent
multica agent update <agent-id> --instructions "新的指令"
```

### Issue 管理

```bash
# 查看所有 Issue
multica issue list --output table

# 创建 Issue
multica issue create \
  --title "配图生成" \
  --description "任务描述..." \
  --priority high \
  --assignee Vision

# 设置依赖关系（关键！）
multica issue update CRE-31 --parent CRE-30

# 查看 Issue 详情
multica issue get CRE-29 --output json
```

### 项目管理

```bash
# 创建项目
multica project create --title "短视频创作管线" --icon "🎬"

# 查看项目里的 Issue
multica issue list --output table --project <project-id>
```

## 04. 我的实操：短视频创作 Pipeline

### 需求背景

我想把短视频创作流程自动化，核心链路：

```
选题 → 圆桌讨论 → 文档 → 内容审查 → 配图/HTML/口播稿 → 自修复 → TTS → 三者对齐 → Remotion视频 → 人工审查 → 多平台分发
```

### 第一步：创建 Agent

根据分工，我创建了 13 个 Agent：

| Agent | 职责 |
|-------|------|
| Mira | 口播稿生成、内容审查 |
| Vision | 配图生成 |
| HtmlGen | HTML生成 |
| HtmlReviewer | HTML审查 |
| ImageReviewer | 配图审查 |
| ScriptReviewer | 口播稿审查 |
| TTSGen | TTS配音生成 |
| ScriptWriter | 三者对齐编排 |
| MotionGen | Remotion视频生成 |
| Video | 多平台分发 |

每个 Agent 有自己的 instructions，记录了技能路径和工作流程。

### 第二步：设计 Pipeline

Pipeline 核心是 12 个 Issue（CRE-29 到 CRE-40）：

```
CRE-29 ①内容审查 → CRE-30②配图生成 → CRE-31③配图审查
                         ↓
CRE-32④HTML生成 → CRE-33⑤HTML审查
                         ↓
CRE-34⑥口播稿生成 → CRE-35⑦口播稿审查 → CRE-36⑧TTS → CRE-37⑨对齐 → CRE-38⑩视频 → CRE-39⑪人工 → CRE-40⑫分发
```

### 第三步：设置依赖链

这是最关键的一步——Multica 的 Issue 之间支持 parent-child 依赖，上游完成后下游自动解锁。

```bash
# 设置依赖关系
multica issue update CRE-30 --parent CRE-29
multica issue update CRE-31 --parent CRE-30
multica issue update CRE-32 --parent CRE-29
multica issue update CRE-33 --parent CRE-32
# ...以此类推
```

### 第四步：遇到的问题和解决

**问题 1：blocked 状态不是坏事**

一开始看到 Issue 显示 `blocked` 很慌，以为出了问题。后来发现这是 Multica 的正常机制——当一个 Issue 的 parent 还没完成时，它会自动被 blocked。直到 parent 完成，下游才会解锁。

**问题 2：依赖链设置要准确**

我之前设置的依赖链有错误，导致 CRE-31（配图审查）一直 blocked，但 CRE-30（配图生成）实际已经完成了。原因是依赖链设置错了一个 ID。修正方法是重新检查每个 Issue 的真实 UUID，然后正确设置 parent。

```bash
# 查看 Issue 的真实 ID
multica issue get CRE-30 --output json | grep '"id"'
```

**问题 3：Pipeline 顺序需要反复确认**

实际跑起来发现，有些步骤顺序不对。比如配图生成应该在 HTML 生成之前还是之后？我最终调整成：内容审查之后，配图、HTML、口播稿三者并行生成。

## 05. 关键心得

### 1. 父子依赖是关键

Multica 的 Pipeline 不是"自动按顺序跑"的，而是靠父子依赖来控制执行顺序。上游完成 → 下游解锁 → Agent 收到任务。

### 2. 每个角色只管自己那块

分工原则：**生成者负责生成，审查者负责审查，生成者自己修复问题**。不单独建 Fixer Agent，让生成者对自己的产出负责。

### 3. Canvas 文件是可视化地图

我把 Pipeline 画成了 Canvas 文件，可以直观看到每个节点的位置和关系。但 Canvas 文件不能直接控制 Multica——它只是辅助理解，真正的控制靠 CLI。

### 4. 阻塞不一定是问题

`blocked` 状态表示"等待上游完成"，这是正常的。只有当 `blocked` 持续很久但上游已经完成时，才需要检查依赖链是否设置错误。

## 06. 下一步

目前 Pipeline 已经跑起来了，但还有一些节点需要调优：

- **三者对齐**：需要确认 Remotion 是否支持时间轴配置
- **TTS 配音**：需要测试不同 TTS 工具的效果
- **人工审查**：需要明确审查标准，缩短打回循环

## 总结

Multica 不是一个"一键安装就能用"的工具，而是一个**需要根据自己场景设计的协作平台**。它的价值不在于功能多强大，而在于让你能够清晰地定义 Agent 的职责、设置任务依赖、监控执行状态。

对于复杂的创作流程，Multica 提供了一种结构化的管理方式——不是银弹，但足够实用。
