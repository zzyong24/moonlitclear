# v6 首期实施验收记录

范围：P0 基础（tokens、字体、Header/Footer、关闭 WebGL 背景）+ 首页全部模块。子页面仅继承新 Header/Footer、底色与宋体标题，版式未改（P2 待做）。

本地预览数据：37 篇旧文章（创作者文章需 `MOONLIT_CREATOR_ROOT`，线上约 48 篇），封面图使用线上 `/content-assets` 与少量占位图。

| 检查项                                                          | 结果 |
| --------------------------------------------------------------- | ---- |
| 360 / 768 / 1024 / 1280 / 1440 无横向滚动                       | 通过 |
| 首页仅 1 个 h1，宋体 900                                        | 通过 |
| 所有 section 有 aria-label / 标题                               | 通过 |
| 图片均有 alt                                                    | 通过 |
| 无 JS 时数据带显示最终数字                                      | 通过 |
| 移动端菜单：打开、Esc 关闭、焦点回到按钮、锁滚动                | 通过 |
| prefers-reduced-motion 下无待显现元素                           | 通过 |
| 首页 JS ≈ 25KB                                                  | 通过 |
| 首页字体 ≤ 250KB（宋体 900 子集 + 数字字体，16 个文件约 216KB） | 通过 |
| `npm run check`                                                 | 通过 |
| Lighthouse / 真机 Safari / 屏幕阅读器                           | 未测 |
| 线上部署                                                        | 未做 |

## 第二轮：细节打磨（2026-10-25）

对照 lizheng.ai 逐项测量后调整：按钮 10px 圆角、数字改用 Source Serif、暗色段落颗粒质感、首屏书法「月明」与入场动画、首屏底部「方向」色带、卡片描边加长投影、文章列表改为日期 / 标题 / 摘要三栏、页头与内容同宽。详见 `docs/redesign-v6/02-ui-spec.md` 末尾附录。上表各项复测仍然通过。

## 待用户补充

- 「我的路径」时间轴：`src/data/timeline.ts` 目前全部为 draft，模块自动隐藏。填入真实节点并去掉 `draft` 即显示。
- 公开复盘：`src/data/reviews.ts` 为空，未上首页。
- 「聊一聊」按钮目前跳转 `/links#offers`，尚未做直接弹窗。
- 首页头像为抠图版 `src/assets/moonlit/portrait-cutout-v1.png`，可替换为专门拍摄的透明底照片。

截图：`home-1440.webp`、`home-390.webp`。
