# 个人站替换与回滚

本文件记录替换根域名旧站的发布与回滚步骤。2026-09-28 用户已明确授权将 `aitongban.cloud` 切换至本候选站；遵循运维仓库 AGENTS.md。

## 切换前核对（2026-09-28）

- `moonlitclear.service` active/running。
- ExecStart `/usr/local/bin/node /opt/moonlitclear/server.js`。
- WorkingDirectory `/opt/moonlitclear`，切换前是约 721 MB 的普通目录。
- 运行 Node v20.18.0；端口按现有 runbook 为回环 3001。
- 保留 Nginx/DNS/证书与对外域名，不改其他站点。

## 本次执行顺序（已完成）

1. 本地运行 `npm run check && npm run test:content && npm run build && npm run pack`；`pack` 必须确认内容模式为 `public`，记录包的 SHA-256。
2. 将版本包放入独立 `/opt/moonlitclear-releases/<版本>/`，检查服务文件、文章清单与包校验值。
3. 以 Node 20 在回环 13001 端口短时运行候选，不绑定公网。检查首页、正文、项目、RSS、404、历史 308；进程完成后停止。
4. 在切换前复制当前 `/opt/moonlitclear` 到带时间戳的备份目录（不覆盖已有备份），连同 Nginx 配置与 systemd unit 一并备份。在隔离目录通过 PORT 13002 验证旧站可恢复。生产仅有 3.6 GB 内存，验证进程不并发运行。
5. 用户授权切换后，将当前普通目录保留为带时间戳的旧目录；将 `/opt/moonlitclear` 设为候选版本的软链接；只重启 `moonlitclear.service`。
6. 立即检查 systemd 与 `http://127.0.0.1:3001/healthz`，再通过 `https://aitongban.cloud/`、文章、项目、RSS 与旧链接检查用户入口，核对 HTML 含新版品牌内容与静态资源加载。
7. 如服务或核心路由失败，恢复原目录路径，重启同一服务，重复旧站公开入口检查。不删除任何旧目录、备份或版本包。
8. 完成后更新 inventory、moonlitclear runbook、BACKLOG，并写生产 changelog 和实际回滚路径。

## 影响与风险

整个个人站切换为静态 Astro + 标准库 Node 文件服务器；保留原服务入口、Nginx 的 `/media/` 路由与域名。重启期间可能有短暂不可用；缓存可能延迟显示新 HTML，需核对实际响应而非只看本机缓存。未改变其他产品服务或数据库。

## 内容差异

本轮公开构建收录 40 篇文章，另有 1 篇仅预览稿不会进入发布包。`/skills`、`/rss.xml` 等历史入口在 Node 服务器层实现真实 308。旧文的缺失源图按缺图提示保留正文，见 `missing-source-assets.json`。

## 本次发布结果

- 发布包 `moonlitclear-2026-09-28T00-33-44-462Z.tar.gz`，SHA-256 `718f66a77bb422bbdc357f37a5cebe0e025c5e1debf501cf95eadeed8241dd9a`；服务器复核通过，`build-info.json` 为 `public`。
- 旧站目录保留于 `/opt/moonlitclear-before-astro-20260928`；完整副本在 `/opt/moonlitclear-backups/20260928-pre-astro/site`，已从副本在回环 13002 验证首页和博客 200。
- 当前 `/opt/moonlitclear` 指向上述发布包解压目录。`moonlitclear.service` active、`/healthz` 200，公网首页、开源、产品、链接、文章、RSS、旧路径重定向、404、CSS、`www` 跳转和浏览器交互均验证。Nginx 配置与切换前备份一致，`/media/` 路由保留。
- 实际回滚命令见根仓库 [现网 runbook](../../../docs/runbooks/services/moonlitclear.md)。
