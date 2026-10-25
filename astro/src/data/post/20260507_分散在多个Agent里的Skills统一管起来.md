---
title: 分散在 30 多个 Agent 里的 Skills，我用一个工具统一管起来了
publish_slug: unified-skills-management
publishDate: 2026-05-07T19:00:00.000Z
excerpt: 分散在 Claude Code、Cursor、Hermes 等 30 多个 Agent 里的 skills 难以统一管理，用软链接加 Git 版本管理把它们收拢成一套共享技能库，越早沉淀越值钱。
category: AI工具
tags:
  - AI工具
  - Skill
author: 月明水清深
---


你有没有被分散在不同地方的 skills 困扰过？

比如 Claude Code、Cursor、Copilot，它们都各自有自己的 skills 目录。想安装一个 skill，得在每个软件里单独装一遍。更麻烦的是，skills 一多，你根本不知道哪些装了、哪些没装。最地狱的是——如果想做 AB 测试，对不同版本的 skill 做对比，成本非常高。

所以今天分享一个我在用的开源项目——Skills Manager。它能帮你统一管理多个 AI 编程工具的 skills，通过软链接的形式让所有工具共享同一套 skills 库，并且支持基于 Git 做版本管理。安装也简单，把项目地址给你的 Agent，让它帮你安装并启动就行。

## 一键扫描，把分散的技能收拢到一起

它支持扫描你电脑上安装的 30 多个 Agent，自动找到它们各自的 skills 目录并统一管理起来。

我自己在用 Claude Code、Codex、CodeBuddy、Hermes、OpenClaw、TRAE 等一堆 Agent，它们的 skills 分散在不同目录。通过一键扫描，能全部整理到一个地方。

## 整理、标注、场景切换

收拢之后，你可以给这些 skills 打标签、分类，比如按用途、按项目类型，方便后续查找；也可以统一禁用一些用不到的，或者批量删除。

更实用的是基于「场景」自定义 skills 集合。在不同的工作流里，选择性加载不同的 skills，避免全量加载导致的混乱。而且支持 per-skill、per-agent 的细粒度控制——同一个场景里，A Agent 用 skill 1 和 skill 2，B Agent 用 skill 3 和 skill 4，完全可以自定义，不是全量同步。

除了全局场景，还支持按项目管理 skills。前端工程和后端工程的配置不同，做设计和做产品需要的 skills 也不同，按项目分析各自场景、按需加载。

## Skills 市场与 Git 版本管理

它还支持从 Skills 市场安装 skills，快速找到、装上、管理起来。

最后是 Git 备份，把整个 skills 目录备份到私有 Git 仓库，每次同步自动 pull、commit、push，而且每次同步打一个版本标签，随时可以回滚。

## 为什么这是个刚需

skills 就像知识库一样，越早管理、越早沉淀，价值越大。当你的 Agent 和 skill 越来越多，「统一管理 + 版本可回滚 + 场景可切换」会从「锦上添花」变成「不可或缺」。如果你也在被分散的 skills 折磨，值得试一试。
