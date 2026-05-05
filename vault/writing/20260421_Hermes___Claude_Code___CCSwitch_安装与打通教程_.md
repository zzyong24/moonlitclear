---
type: "article"
topic: "ai"
created: "2026-04-21 18:31:35"
modified: "2026-04-21 18:31:35"
tags: ["article", "ai", "hermes-agent", "claude-code", "cc-switch", "minimax", "installation", "tutorial", "三平台", "crafted"]
origin: "crafted"
source: "mcp"
status: "active"
sources:
  - "[[sources]]"
  - "[[index]]"
---

# Hermes + Claude Code + CCSwitch 安装与打通教程

> 全程实操 · 三平台覆盖 · 零基础友好 · 零成本入门

## 前言

Claude Code 是 Anthropic 出品的终端 AI 编程助手，但在国内使用有两个门槛：一是账号注册受限，二是官方模型需要海外支付方式。本文介绍一套完整方案，三步搞定，全程免费，不需要特殊网络。

**核心工具组合：**

- **Hermes Agent** — 开源 AI Agent，支持 Skills/Memory/MCP/IM 网关（飞书/微信），4.7万星
- **Claude Code** — Anthropic 编程助手，读写文件/运行命令/代码重构
- **CC Switch** — Claude Code 的模型 API 中间层，图形化切换供应商
- **MiniMax** — 国内模型，有免费额度，支持 Claude Code

---

## 一、痛点与解决方案

### 国内使用 Claude Code 的三大障碍

| 痛点 | 说明 | 解决方案 |
|---|---|---|
| 地域限制 | Claude Code 在国内无法直接注册 Anthropic 账号 | CC Switch 绕过登录 |
| 支付门槛 | 官方模型需要海外信用卡 | MiniMax 等国内模型 |
| 扩展受限 | Claude Code 本身无法加载 Skills | Hermes Agent 提供 Skills 系统 |

### 三者关系架构

```
用户（终端 / 飞书 / 微信）
    │
    ├─► Claude Code ──► CC Switch（端口 8950）
    │                      │
    │                      ▼
    │                 MiniMax / 硅基流动 / 火山引擎
    │
    └─► Hermes Agent（独立运行）
            │
            ├─ Memory（记忆持久化）
            ├─ Skills（技能扩展）
            └─ MCP（工具生态）
```

CC Switch 是 Claude Code 和模型 API 之间的中间层，不影响 Claude Code 本身功能，只负责路由和切换模型。Hermes Agent 独立运行，提供记忆和技能管理。

---

## 二、安装前准备

### 通用依赖

```bash
# Node.js ≥18
# macOS
brew install node
# Windows（PowerShell）
winget install OpenJS.NodeJS
# 验证
node -v

# Git
# macOS 通常已预装
# Windows
winget install Git.Git
git --version

# npm 随 Node.js 一起安装
npm -v

# Homebrew（macOS 推荐）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 三、安装步骤

### 3.1 Hermes Agent 安装

> 支持：macOS / Linux / WSL2 / Android (Termux)
> **不支持 Windows 原生！** Windows 用户需先安装 WSL2。

```bash
# 国内加速（一键，推荐）
curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash

# 官方脚本
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装后配置：

```bash
# macOS / Linux
source ~/.bashrc   # Bash
source ~/.zshrc    # Zsh

# 验证
hermes --version
```

> Windows 用户：先在管理员 PowerShell 运行 `wsl --install`，重启后进入 Ubuntu，再执行上面命令。

### 3.2 Claude Code 安装

**macOS（有代理）：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**macOS（无代理）：**

```bash
brew install --cask claude-code
```

**Windows：**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**绕过登录（跳过 Anthropic 账号注册）：**

```bash
# 编辑 ~/.claude.json（macOS/Linux）
# 或 C:\Users\你的用户名\.claude.json（Windows）
# 添加一行（注意逗号分隔）：
{
  "hasCompletedOnboarding": true
}
```

```powershell
# Windows PowerShell 编辑
notepad $env:USERPROFILE\.claude.json
```

```bash
# 验证
claude --version
```

### 3.3 CC Switch 安装

**macOS：**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

**Windows：**

下载 .msi 或便携版：https://github.com/farion1231/cc-switch/releases （最新 v3.10.3）

**启动：**

- macOS：应用程序文件夹中双击 CC Switch
- Windows：双击 CC Switch.exe

CC Switch 界面提供：模型配置 / Skills 管理 / 提示词管理 / MCP 管理。

---

## 四、MiniMax API 申请与配置

### Step 1：申请 API Key

1. 访问 [platform.minimaxi.com](https://platform.minimaxi.com/)
2. 注册账号（国内手机号即可）
3. 创建 API Key，**立即复制保存**（不显示第二次）

MiniMax 有免费额度，足够日常使用。

### Step 2：CC Switch 配置

1. 打开 CC Switch
2. 点击「+ 添加供应商」
3. 选择 **MiniMax**
4. 填入 API Key
5. 主模型填：`MiniMax-M2.7`

### Step 3：验证

```bash
claude -p "你是哪个模型？" --no-session-persistence
```

看到 MiniMax 相关 banner 说明配置成功。

### 飞书接入（可选）

Hermes Agent 支持直接接入飞书：

```bash
hermes gateway setup
```

按向导选择飞书，配置机器人 App 的 App ID 和 App Secret，即可通过飞书与 Hermes 对话。

---

## 五、启动与验证

```bash
# 启动 Claude Code（默认交互模式）
claude

# 在项目目录下启动（以该目录为工作区）
cd ~/my-project && claude

# 单次执行（不进入交互模式）
claude -p "解释这段代码" --no-session-persistence
```

**成功标志：** 启动后显示 MiniMax banner（`MiniMax-M2.7·APIUsageBilling`）。

---

## 六、常见问题

| 问题 | 解决方案 |
|---|---|
| `claude` 命令找不到 | npm bin 目录不在 PATH，重启终端或手动添加到 shell 配置 |
| CC Switch 端口冲突（8950） | 杀掉占用端口的进程，或在 CC Switch 设置中改端口 |
| API Key 报错 | 检查 Key 是否正确，确认供应商设置与模型匹配 |
| Hermes 安装卡住 | 使用国内镜像：`curl -fsSL https://res1.hermesagent.org.cn/install.sh \| bash` |
| Windows 无法安装 Hermes | 不支持原生 Windows，需先安装 WSL2 |

---

## 七、三步总结

| 步骤 | 命令 |
|---|---|
| Step 1：安装 Hermes Agent | `curl -fsSL https://res1.hermesagent.org.cn/install.sh \| bash` |
| Step 2：安装 Claude Code | `brew install --cask claude-code`（macOS）|
| Step 3：装 CC Switch + 配 MiniMax | 下载 [cc-switch/releases](https://github.com/farion1231/cc-switch/releases) |

**方案优势：**

- ✅ 全程免费（MiniMax 有免费额度）
- ✅ 享受 Claude Code 全部功能（Skills / MCP / 代码理解）
- ✅ Hermes Skills 系统扩展能力
- ✅ 善用 IM 网关接入（飞书/微信）

---

## 相关资源

| 资源 | 链接 |
|---|---|
| Hermes Agent 官方文档 | https://hermes-agent.nousresearch.com/docs/ |
| Hermes 国内镜像安装 | https://res1.hermesagent.org.cn/install.sh |
| Claude Code 菜鸟教程 | https://www.runoob.com/claude-code/claude-code-install.html |
| CC Switch Releases | https://github.com/farion1231/cc-switch/releases |
| MiniMax API 平台 | https://platform.minimaxi.com/ |
| CC Switch + MiniMax 接入教程 | https://blog.csdn.net/2301_79702677/article/details/160038789 |

---

*配套 PPT（12张幻灯片，可键盘← →翻页）和音频解说（12段）已同步生成，可搭配使用。*
