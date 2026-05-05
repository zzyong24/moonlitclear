---
type: "article"
topic: "hermes"
created: "2026-04-15 00:30:05"
modified: "2026-04-15 00:30:05"
tags: ["article", "hermes", "hermes-agent", " Nous Research", "index", "自学指南", "架构", "配置", "gateway", "tools", "memory", "skills", "security", "crafted"]
origin: "crafted"
source: "mcp"
status: "active"
---

# Hermes Agent 完全自学指南

> 源码分析 + 官方文档整理 | Nous Research 出品的自改进 AI Agent

---

## 这是什么

Hermes Agent 是 **Nous Research** 出品的开源 AI Agent 项目，核心差异化是**自改进闭环**——Agent 在使用过程中能自主创建 skills、更新记忆、跨 session 召回知识。

**关键数字：**
- ~10,700 行核心 AIAgent 类（`run_agent.py`）
- ~10,000 行 CLI（`cli.py`）
- ~9,000 行 Gateway（`gateway/run.py`）
- 47 个内置工具 / 19 个工具集
- 18 个消息平台适配器
- 18+ 个 LLM providers

**官方文档（本地）：** `~/.hermes/hermes-agent/website/docs/`

---

## 模块索引

### [系统架构](./study/hermes/20260415_Hermes_Agent_系统架构完全指南.md)
从源码挖掘的系统架构完全解读：
- 五大入口共用 AIAgent 核心类
- 执行流程：Prompt Builder → Compression → Provider Resolution → LLM → Tool Dispatch → Backends
- 核心设计原则：Frozen snapshot、Observable execution、Interruptible、Profile isolation、Closed learning loop

### [配置完全指南](./study/hermes/20260415_Hermes_Agent_配置完全指南.md)
`config.py` 源码 + `configuration.md` 整理：
- 所有配置项速查（model、terminal、browser、compression、auxiliary、memory、tts、stt、voice...）
- 环境变量速查表（40+ 个平台变量）
- 常见配置场景：纯 CLI、开发 Gateway、生产部署、多 key 轮询、自建模型

### [Gateway 接入指南](./study/hermes/20260415_Hermes_Agent_Gateway_接入完全指南.md)
18 个消息平台接入完全手册：
- **Feishu/Lark** 完整接入（创建应用 → 配置 Webhook → Gateway 配置 → 反向代理）
- 授权系统：allowlist → DM pairing → per-platform 配置
- Gateway 消息流 + 生产部署检查清单

### [Tools 系统](./study/hermes/20260415_Hermes_Agent_Tools_系统完全指南.md)
47 个内置工具 + 工具集管理：
- 工具注册机制（`registry.register()` at import time）
- 六大执行 backend（local/docker/ssh/singularity/modal/daytona）
- 环境变量过滤（Skill 声明自动透传）
- SSRF 保护机制

### [Memory 系统](./study/hermes/20260415_Hermes_Agent_Memory_系统完全指南.md)
三层分层记忆架构：
- SOUL.md（Frozen）→ MEMORY.md + USER.md（Persistent）→ SQLite FTS5（Session）
- Context Compression 机制（lossy summarization）
- 8 个 external memory provider（honcho、mem0、openviking...）
- Agent 自改进闭环原理图

### [Skills 系统](./study/hermes/20260415_Hermes_Agent_Skills_系统完全指南.md)
自改进核心——Skills 机制：
- 三大来源：bundled / hub / agent-created
- SKILL.md 标准格式（name、triggers、required_environment_variables）
- Skill 生命周期 + Progressive Disclosure
- 与 Tools 的本质区别
- 60+ 内置 Skills 分类索引

### [Security 完全指南](./study/hermes/20260415_Hermes_Agent_Security_完全指南.md)
七层安全架构：
- 三种 Approval 模式（manual/smart/off）+ YOLO mode
- 危险命令模式列表（116 种模式）
- Docker 安全参数（cap-drop ALL、tmpfs 等）
- MCP 凭据过滤 + 凭据脱敏
- Tirith 预执行扫描 + Context File prompt injection 检测
- SSRF 保护 + Website blocklist
- 生产部署安全检查清单

### [Cron 调度](./study/hermes/20260415_Hermes_Agent_Cron_完全指南.md)
定时任务 + Skills 附加 + 多平台投递：
- 自然语言 cron 推断
- Skills 附加执行
- 多平台 deliver（Feishu/Telegram/local）
- 递归禁止安全护栏

### [MCP 集成](./study/hermes/20260415_Hermes_Agent_MCP_完全指南.md)
Model Context Protocol 扩展：
- stdio / HTTP-SSE 两种连接模式
- `mcp.json` 配置格式
- 工具动态注册流程
- 凭据过滤机制（subprocess 只收到 XDG_* + PATH）
- per-server 工具过滤

### [系统架构图](../doc/hermes-architecture.html)
HTML 架构图（可直接浏览器打开）：
`/Users/zyongzhu/Workbase/hermes-agent/doc/hermes-architecture.html`

包含：5 大入口 / AIAgent 核心子系统 / 18 平台 / 三层记忆 / Skills+Plugins / Provider 生态 / 7 层安全 / 关键设计原则

---

## 快速入门路径

```
1. 先读架构图（建立全局感）
       ↓
2. 读配置指南（搭本地环境）
       ↓
3. 跑 hermes chat（验证安装）
       ↓
4. 读 Tools + Memory（理解执行模型）
       ↓
5. 配置 Gateway（接入飞书/Telegram）
       ↓
6. 读 Skills + Security（深度定制）
```

## 关键文件索引

| 文件 | 说明 |
|------|------|
| `run_agent.py` | AIAgent 核心类 ~10,700 LOC |
| `hermes_cli/cli.py` | CLI 入口 ~10k LOC |
| `gateway/run.py` | Gateway 主循环 ~9k LOC |
| `hermes_cli/config.py` | **配置最终权威** ~3,356 LOC |
| `hermes_state.py` | SQLite session 存储 |
| `tools/registry.py` | 47 工具注册 |
| `tools/mcp_tool.py` | MCP 客户端 ~1,050 LOC |
| `website/docs/` | **官方文档本地镜像** |
