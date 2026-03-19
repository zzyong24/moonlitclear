---
created: "2026-03-16 22:30:00"
modified: "2026-03-16 22:30:00"
tags: ["tools", "教程", "ThirdSpace", "MCP", "Obsidian", "COS"]
source-type: created
source: mcp
status: created
topic: "tools"
origin: "crafted"
publish_slug: "thirdspace-build"
---

# ThirdSpace 完整部署教程：从零搭建 AI 驱动的个人知识库

> 本文是《我是如何用 AI 搭建个人知识库的》配套教程，手把手教你完成 ThirdSpace + Obsidian + 腾讯云 COS 的完整部署。

---

## 一、系统架构概览

在开始之前，先了解整体架构：

```
┌─────────────┐     MCP 协议      ┌─────────────────┐
│ CodeBuddy   │ ◄───────────────► │  ThirdSpace     │
│ (AI 助手)   │                   │  (MCP Server)   │
└─────────────┘                   └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │    Obsidian     │
                                  │   (本地知识库)   │
                                  └────────┬────────┘
                                           │ Remotely Save
                                           ▼
                                  ┌─────────────────┐
                                  │   腾讯云 COS    │
                                  │   (云端备份)    │
                                  └─────────────────┘
```

**三层职责**：
- **CodeBuddy**：AI 对话入口，负责理解、分析、生成
- **ThirdSpace**：MCP 工具集，负责数据读写（抓网页、存文件、生成报告）
- **Obsidian + COS**：数据存储与备份，本地编辑 + 云端同步

---

## 二、环境准备

### 2.1 必备软件

| 软件 | 版本要求 | 用途 |
|------|----------|------|
| **Python** | ≥ 3.10 | 运行 ThirdSpace |
| **Git** | 任意版本 | 克隆代码 |
| **CodeBuddy** | 最新版 | AI 对话（或 Cursor/Windsurf/Claude Desktop） |
| **Obsidian** | 最新版 | 本地知识库编辑 |

### 2.2 检查 Python 版本

```bash
python3 --version
# 输出应 >= 3.10，如：Python 3.12.0
```

如果版本不够，Mac 用户可用 Homebrew 安装：

```bash
brew install python@3.12
```

---

## 三、ThirdSpace 安装

### 3.1 克隆项目

```bash
# 选择一个工作目录
cd ~/workbase  # 或你喜欢的任意目录

# 克隆 ThirdSpace
git clone https://github.com/youfangg/ThirdSpace.git
cd ThirdSpace
```

### 3.2 创建虚拟环境

```bash
# 创建虚拟环境
python3 -m venv .venv

# 激活虚拟环境
# Mac/Linux:
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate

# 确认激活成功（命令行前缀应显示 .venv）
which python
# 输出类似：/Users/xxx/workbase/ThirdSpace/.venv/bin/python
```

### 3.3 安装依赖

```bash
# 安装 ThirdSpace 及其依赖
pip install -e .

# 验证安装
pip list | grep thirdspace
# 输出：thirdspace  0.1.0  /Users/xxx/workbase/ThirdSpace
```

### 3.4 配置文件

```bash
# 复制示例配置
cp config.example.yaml config.yaml
```

编辑 `config.yaml`，主要配置数据目录：

```yaml
# config.yaml

sync:
  # 原始数据目录（存放抓取的原文）
  raw_dir: "../vault/flux"
  
  # 知识库目录（Obsidian Vault）
  context_dir: "../vault/space"
```

**目录结构说明**：

```
~/workbase/
├── ThirdSpace/          # ThirdSpace 代码
│   ├── src/
│   ├── skills/
│   └── config.yaml
│
└── vault/               # 数据目录（与代码分离）
    ├── flux/            # 原始数据（Git 忽略）
    │   ├── topics.json
    │   └── intake/
    └── space/           # Obsidian Vault（Git 备份）
        ├── found/
        └── crafted/
```

### 3.5 创建数据目录

```bash
# 返回上级目录
cd ..

# 创建 vault 目录结构
mkdir -p vault/flux/intake
mkdir -p vault/space/found
mkdir -p vault/space/crafted

# 初始化 topics.json
echo '{}' > vault/flux/topics.json

# 查看结构
tree vault -L 2
```

---

## 四、MCP Server 配置

### 4.1 获取 Python 路径

```bash
# 确保在 ThirdSpace 目录下，虚拟环境已激活
cd ThirdSpace
source .venv/bin/activate

# 获取 Python 绝对路径
which python
# 记下输出，如：/Users/zyongzhu/workbase/ThirdSpace/.venv/bin/python
```

### 4.2 配置 CodeBuddy

1. 打开 CodeBuddy 设置
2. 找到 **MCP Servers** 配置
3. 添加以下配置：

```json
{
  "mcpServers": {
    "thirdspace": {
      "command": "/Users/zyongzhu/workbase/ThirdSpace/.venv/bin/python",
      "args": ["-m", "ts.mcp_server"],
      "cwd": "/Users/zyongzhu/workbase/ThirdSpace/thirdspace"
    }
  }
}
```

**配置说明**：

| 字段 | 说明 |
|------|------|
| `command` | Python 解释器绝对路径（必须是虚拟环境中的 Python） |
| `args` | 启动参数，`-m ts.mcp_server` 表示运行 MCP Server 模块 |
| `cwd` | 工作目录，必须是 `ThirdSpace/thirdspace`（注意有两层） |

### 4.3 验证 MCP 连接

1. 重启 CodeBuddy
2. 在对话框输入：`list_topics`
3. 如果看到主题列表返回，说明 MCP 配置成功

**常见问题排查**：

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `ModuleNotFoundError` | Python 路径错误 | 确认使用虚拟环境中的 Python |
| `FileNotFoundError: config.yaml` | cwd 配置错误 | 确认 cwd 指向 `ThirdSpace/thirdspace` |
| `Connection refused` | MCP Server 未启动 | 检查配置后重启 CodeBuddy |

---

## 五、Obsidian 配置

### 5.1 打开 Vault

1. 启动 Obsidian
2. 选择 **Open folder as vault**
3. 选择 `vault/space` 目录

### 5.2 推荐插件

在 **Settings → Community plugins** 中安装：

| 插件 | 用途 |
|------|------|
| **Remotely Save** | 多端同步（配合 COS） |
| **Dataview** | 数据查询视图 |
| **Calendar** | 日历视图 |
| **Templater** | 模板增强 |

---

## 六、腾讯云 COS 配置

### 6.1 为什么选择 COS

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Obsidian Sync** | 官方方案，最稳定 | 每月 $10，较贵 |
| **iCloud** | 免费 | 仅 Apple 设备，偶尔冲突 |
| **Git** | 免费，版本控制 | 移动端不友好 |
| **腾讯云 COS** | 免费额度足够，多端兼容 | 需要配置 |

**COS 成本参考**：

| 容量 | 月费 | 说明 |
|------|------|------|
| 1GB | ~0.12 元 | 个人知识库绰绰有余 |
| 50GB | 免费 | 新用户前 6 个月 |

### 6.2 创建存储桶

1. 访问 [腾讯云控制台](https://console.cloud.tencent.com/cos)
2. 点击 **创建存储桶**
3. 填写配置：

| 配置项 | 推荐值 |
|--------|--------|
| 名称 | `obsidian-vault-xxx`（xxx 为你的标识） |
| 地域 | 选择离你最近的（如：广州、上海） |
| 访问权限 | **私有读写** |
| 版本控制 | 开启（可选，防误删） |

### 6.3 获取 API 密钥

1. 访问 [API 密钥管理](https://console.cloud.tencent.com/cam/capi)
2. 点击 **新建密钥**
3. 记录 `SecretId` 和 `SecretKey`

> ⚠️ **安全提示**：密钥请妥善保管，不要提交到 Git 或分享给他人。

### 6.4 配置 Remotely Save

1. 打开 Obsidian → Settings → Community plugins
2. 搜索并安装 **Remotely Save**
3. 启用插件后，进入 Remotely Save 设置
4. 选择 **S3 or S3 Compatible** 作为同步方式
5. 填写配置：

| 配置项 | 值 |
|--------|-----|
| Endpoint | `cos.{region}.myqcloud.com`（如 `cos.ap-guangzhou.myqcloud.com`） |
| Region | 你创建存储桶时选择的地域代码（如 `ap-guangzhou`） |
| Access Key ID | 你的 SecretId |
| Secret Access Key | 你的 SecretKey |
| Bucket | 存储桶名称（如 `obsidian-vault-xxx-1234567890`） |

### 6.5 测试同步

1. 在 Remotely Save 设置中点击 **Check Connection**
2. 显示 `Connection successful` 即配置成功
3. 点击 **Start Sync** 进行首次同步

### 6.6 多端配置

在其他设备（手机、iPad、其他电脑）上：

1. 安装 Obsidian
2. 创建同名 Vault（或空 Vault）
3. 安装 Remotely Save 插件
4. 填写相同的 COS 配置
5. 同步即可拉取云端数据

---

## 七、快速验证

完成以上配置后，让我们验证整个系统是否正常工作：

### 7.1 测试 MCP 工具

在 CodeBuddy 中依次测试：

```
# 1. 列出所有主题
list_topics

# 2. 添加一条笔记
add_note(content="这是我的第一条测试笔记", topic="ideas", title="测试笔记")

# 3. 搜索内容
query_context(query="测试")
```

### 7.2 验证文件生成

```bash
# 检查 Obsidian Vault 中是否生成了笔记
ls vault/space/crafted/ideas/
# 应该能看到刚才创建的笔记文件
```

### 7.3 测试云端同步

1. 在 Obsidian 中触发 Remotely Save 同步
2. 在另一台设备上同步
3. 确认笔记已同步成功

---

## 八、日常使用流程

### 8.1 收藏文章

```
你：收藏 https://mp.weixin.qq.com/s/xxx
AI：[collect_content → 生成知识卡片 → save_knowledge_card]
    已保存到 found/reading/wechat/
```

### 8.2 记录想法

```
你：记录一下：今天发现 AI 生成代码时给明确的上下文比给模糊的指令效果好很多
AI：[add_note] 已添加到 ideas 主题
```

### 8.3 创建工作日志

```
你：创建今日工作日志
AI：[create_worklog] 已创建 2026-03-16 工作日志

你：补充：完成了 ThirdSpace 部署教程
AI：[append_worklog] 已追加到今日日志
```

### 8.4 生成周报

```
你：生成本周周报
AI：[weekly_review → 生成周报 → save_weekly_review]
    本周亮点：...
```

---

## 九、进阶配置

### 9.1 自定义主题

编辑 `config.yaml` 添加自定义主题：

```yaml
context:
  custom_topics:
    my_project:
      name: "我的项目"
      description: "个人项目相关记录"
      keywords: ["项目", "开发", "产品"]
    
    health:
      name: "健康管理"
      description: "运动、饮食、睡眠记录"
      keywords: ["运动", "饮食", "睡眠", "健康"]
```

### 9.2 Playwright 网页抓取（可选）

部分网站需要 Playwright 渲染才能抓取：

```bash
# 安装 Playwright
pip install playwright

# 安装浏览器
playwright install chromium
```

### 9.3 定时备份（可选）

使用 cron 或 launchd 设置定时同步：

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点执行 Git 备份
0 2 * * * cd /Users/xxx/workbase/vault && git add -A && git commit -m "Auto backup $(date +%Y-%m-%d)"
```

---

## 十、常见问题

### Q1: MCP 连接失败

**症状**：CodeBuddy 中输入命令无响应

**排查步骤**：

```bash
# 1. 手动测试 MCP Server 是否能启动
cd /path/to/ThirdSpace/thirdspace
/path/to/.venv/bin/python -m ts.mcp_server

# 2. 如果报错，检查：
#    - Python 路径是否正确
#    - 虚拟环境是否安装了依赖
#    - config.yaml 是否存在
```

### Q2: COS 同步失败

**症状**：Remotely Save 报 `Access Denied`

**解决方案**：
1. 检查 SecretId 和 SecretKey 是否正确
2. 检查 Bucket 名称是否包含 APPID 后缀
3. 检查 Endpoint 地域是否与 Bucket 一致

### Q3: 知识卡片没有生成

**症状**：`collect_content` 返回空内容

**可能原因**：
1. 网站需要 Playwright 渲染（安装 Playwright）
2. 网站有反爬机制（尝试其他文章）
3. URL 格式不正确
---

## 参考链接

- [ThirdSpace GitHub](https://github.com/youfangg/ThirdSpace)
- [MCP 协议文档](https://modelcontextprotocol.io/)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
- [Remotely Save 插件](https://github.com/remotely-save/remotely-save)

---

> 📝 **一句话总结**：
>
> ThirdSpace + Obsidian + COS = 本地优先、AI 驱动、云端备份的个人知识管理系统。工具干脏活，AI 干智能活，你专注于思考和决策。
