---
type: "article"
topic: "tools"
created: "2026-04-03 14:10:54"
modified: "2026-04-03 14:10:54"
tags: ["article", "tools", "vault_place", "Obsidian", "知识管理", "AI协作", "frontmatter", "MCP", "系统设计", "ThirdSpace", "crafted"]
origin: "crafted"
source: "mcp"
status: "active"
sources:
  - "[[20260323_工具做脏活_AI做智能_一个人如何用_40_个_MCP_工具搭出知识操作系统]]"
---

# 让 AI 知道文件该放哪：我用一个函数解决了 Obsidian 知识库的混乱问题

---

你有没有过这种经历：

让 AI 帮你写了一篇笔记，结果它存到了一个莫名其妙的位置。或者更常见的——它根本不知道该存哪，干脆问你，"请问这个文件要放在哪个目录？"

**每次都要手动指定路径和格式，这件事本身就说明系统设计有问题。**

我的 Obsidian 知识库有 300 多个 Markdown 文件，27 个目录，16 种内容类型。如果每次让 AI 写文件都要我告诉它"存到 `space/crafted/writing/` 下面，文件名用 `YYYYMMDD_标题.md`，frontmatter 里 type 填 article、topic 填 writing、origin 填 crafted"——那我还用 AI 干嘛？

所以我写了一个函数，叫 `vault_place`。

它只做一件事：**你告诉我"内容类型"，我告诉你"完整路径 + 规范化的 frontmatter"。**

---

## 问题在哪

Obsidian 的优点是纯文件系统，灵活，不锁定。但纯文件系统的代价是：**没有人替你维护秩序。**

当你的知识库从 10 个文件长到 300 个文件，问题就开始暴露：

1. **目录混乱**：新文件不知道该放哪个目录。`crafted/dev/` 和 `crafted/tools/` 有什么区别？`crafted/product/` 和 `crafted/business/` 的边界在哪？
2. **命名不统一**：有的文件叫 `2026-03-23_xxx.md`，有的叫 `xxx_20260323.md`，有的干脆没日期。
3. **Frontmatter 残缺**：有的文件有 `type` 没 `topic`，有的有 `tags` 但漏了 `origin`。Dataview 查询一跑，一堆漏网之鱼。
4. **AI 每次都要问**：Claude 写完内容后，总要确认"放哪？格式？"——重复劳动。

这些问题有一个共同的根源：**文件系统没有 schema。**

数据库有 schema，API 有 schema，但 Markdown 文件系统没有。所以每次写入都是一次"人肉决策"——这个决策应该被自动化。

---

## vault_place 的设计

核心思路极简：**一张类型映射表 + 一个路径生成器。**

### 类型映射表（TYPE_MAP）

```python
TYPE_MAP = {
    "article":     { "dir": "crafted/writing",      "type": "article",    "topic": "writing"     },
    "reflection":  { "dir": "crafted/reflections",   "type": "reflection", "topic": "reflections" },
    "voiceover":   { "dir": "crafted/voiceover",     "type": "article",    "topic": "voiceover"   },
    "dev-note":    { "dir": "crafted/dev",           "type": "note",       "topic": "dev"         },
    "prompt":      { "dir": "crafted/prompts",       "type": "prompt",     "topic": "prompts"     },
    "event":       { "dir": "crafted/lifeos/events", "type": "event",      "topic": "lifeos"      },
    "tracker":     { "dir": "crafted/tracker",       "type": "tracker",    "topic": "tracker"     },
    "roadmap":     { "dir": "crafted/roadmap",       "type": "roadmap",    "topic": "roadmap"     },
    # ... 共 16 种
}
```

每种内容类型映射到：
- **dir**：该放哪个目录
- **type**：frontmatter 的 type 字段
- **topic**：frontmatter 的 topic 字段（知识库的唯一分类轴）
- **extra_fields**：额外字段（比如 marketing 类型需要 `product` 和 `platform`）

### 路径生成逻辑

```
输入: content_type="article", title="我的新文章"
输出:
  path: space/crafted/writing/article_20260403_我的新文章.md
  frontmatter:
    ---
    type: "article"
    topic: "writing"
    created: "2026-04-03 20:00:00"
    modified: "2026-04-03 20:00:00"
    tags: ["writing", "article", "crafted"]
    origin: "crafted"
    source: "mcp"
    status: "active"
    ---
```

就这么简单。没有 AI 参与，没有 LLM 推理，纯粹的确定性映射。

---

## 为什么不用 AI 来决定文件放哪

这是一个很容易踩的坑。

直觉告诉你：让 AI 读内容，判断这是"技术笔记"还是"产品文档"还是"反思日记"，然后自动分类到对应目录。多智能啊。

**别这么做。**

原因很简单：

1. **分类是主观的**。一篇关于"灵犀插件架构重构"的笔记，是 dev-note 还是 product-spec？AI 的判断可能每次都不一样。
2. **一旦分错，很难发现**。文件已经写进去了，你不会每天检查每个文件是不是在正确的目录里。
3. **分类决策应该在创建时由人确定**，不是事后由 AI 猜。

所以 vault_place 的设计哲学是：**人决定"是什么"，系统决定"放哪里"。**

你说"我要写一篇文章"（content_type="article"），系统就知道它该去 `crafted/writing/`，文件名前缀是 `article_`，frontmatter 的 type 是 `article`。没有歧义，没有概率，没有"大概应该放这里"。

---

## 7 个必填字段的铁律

vault_place 生成的 frontmatter 有 7 个必填字段，一个都不能少：

| 字段 | 含义 | 为什么必填 |
|------|------|-----------|
| `type` | 内容类型（article/note/reflection/...） | Dataview 查询的第一过滤条件 |
| `topic` | 归属主题（writing/dev/business/...） | 知识库的**唯一分类轴**，决定内容归属 |
| `created` | 创建时间 | 时间线排序、回溯 |
| `modified` | 修改时间 | 检测活跃度 |
| `tags` | 标签数组 | 交叉检索（至少包含 topic + type + origin） |
| `origin` | 来源属性（crafted/found） | 区分"我写的"和"我收集的" |
| `source` | 创建方式（mcp/manual/web/...） | 追踪内容来源渠道 |

**为什么这么严格？**

因为知识库的价值不在于"有多少文件"，而在于"能不能被查到"。

一个没有 frontmatter 的 Markdown 文件，在 Obsidian 里只是一个文本。有了规范化的 frontmatter，它才变成一个**可查询、可聚合、可统计的数据点**。

```dataview
TABLE type, topic, created
FROM "space/crafted"
WHERE type = "article" AND topic = "writing"
SORT created DESC
LIMIT 10
```

这条 Dataview 查询能精确工作的前提，是每个文件的 frontmatter 都规范。vault_place 就是那个保证规范的守门人。

---

## 实际使用场景

### 场景 1：Claude Code 写完代码，存开发笔记

```
Claude: vault_place(content_type="dev-note", product="lingxi", title="ESLint配置修复")
系统返回:
  path: space/crafted/dev/dev_20260403_ESLint配置修复.md
  frontmatter: (完整 7 字段，含 product: "lingxi")

Claude: 直接用 Write 工具写入文件
```

从写完代码到存笔记，全程不需要人指定路径。

### 场景 2：收藏一篇文章，生成知识卡片

```
1. collect_content(url="xxx")  → 抓取正文，返回给 AI
2. AI 生成摘要和思考问题
3. save_knowledge_card(title=..., summary=..., key_points=...)
   内部调用 vault_place 确定存放路径
```

### 场景 3：写周报

```
1. weekly_review()  → 聚合本周数据
2. AI 生成周报内容
3. save_weekly_review(week_label="2026-W14", ...)
   vault_place 自动生成: crafted/reviews/weekly_2026-W14.md
```

每种场景，vault_place 都在背后默默工作：**确定路径、生成 frontmatter、保证规范。**

---

## 这个设计解决了什么

回头看最初的四个问题：

| 问题 | 解决方式 |
|------|---------|
| 目录混乱 | TYPE_MAP 硬编码 16 种类型到固定目录，消除歧义 |
| 命名不统一 | `{prefix}_{YYYYMMDD}_{safe_title}.md` 统一格式 |
| Frontmatter 残缺 | 7 必填字段自动生成，不可能遗漏 |
| AI 每次要问 | 只需传 content_type，系统自动决定其余一切 |

**本质上，vault_place 是给纯文件系统加了一层 schema。**

它把 27 个目录、16 种类型、7 个必填字段的复杂规则，压缩成了一次函数调用。任何 AI（不管是 Claude、GPT、还是本地模型）接入知识库时，只需要知道 content_type 是什么，剩下的全自动。

---

## 适用场景和局限

**适合谁**：
- 用 Obsidian 做知识管理，文件数超过 100 个
- 让 AI（Claude Code / Cursor / ChatGPT）帮忙写入知识库
- 对 Dataview 查询有依赖，需要 frontmatter 规范

**不适合谁**：
- 知识库很小（< 50 个文件），手动管理足够
- 不用 AI 写入，纯手动操作
- 不在乎 frontmatter 规范

**局限**：
- TYPE_MAP 是硬编码的，新增内容类型需要改代码
- 不处理文件内容，只处理"放哪里"和"元数据格式"
- 依赖调用者正确传入 content_type——如果传错了，文件会被放到错误的目录

---

## 一句话总结

**文件系统没有 schema，所以你得自己造一个。vault_place 就是那个 schema——人决定内容是什么，系统决定放哪里、怎么标注。**

这不是什么高深的架构设计。它就是一张表和一个函数。但它解决了一个真实的问题：当你的知识库从"随手记"长成"正经系统"的时候，混乱是默认状态，秩序需要被工程化地保证。

vault_place 就是那个保证秩序的最小单元。
