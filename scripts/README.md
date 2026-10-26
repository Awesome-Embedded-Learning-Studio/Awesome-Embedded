# 迭代 issue 推送操作手册

`scripts/push-iteration-issues.py` 把一份 markdown 迭代计划发成 GitHub 原生父子 issue。父子用官方 sub-issue 关系挂接，与 `scripts/collect-issues.py`（issue 看板的数据源）读的是同一个关系，发完刷新看板就能看到树。

## 计划文件格式

- 文件放 `content/meta/iterations/<repo>-<波次或日期>.md`（gitignored 私有区，规划不进公开仓库）。
- 一级标题一行是迭代声明，仓库地址 `owner/repo` 从这一行读，脚本不为它建 issue。一个文件只允许一个一级标题。注意仓库地址要写全并事先核实（`gh repo view`），写错会在 apply 时才报错。
- 二级标题 `##` 是父 issue，三级 `###` 是子，依此类推到六级。标题文本即 issue 标题。
- 每个标题下面的正文，直到下一个标题为止，原样进该 issue 的正文，所以父和子的正文天然分区。
- 标题末尾的 `<!--#N-->` 是脚本写回的 issue 编号，手写时不带。建成功的条目立即写回存盘，重跑自动跳过，中断续跑不发重。

## 工作流（AI 会话按此执行）

1. 起草计划文件。内容依据 `.claude/mcu-with-ai/` 下的规划草案（四仓线）或用户当场的指示，不要虚构内容充数。
2. 预演：`python scripts/push-iteration-issues.py <plan.md>`，不联网不创建，把打印出的树和条目内容给用户过目。
3. 等用户明确点头。AI 起草的内容一律是候选，用户不点头绝不加 `--apply`（仓库约定的"AI 不自动确认"同样适用于发 issue）。
4. 真发：`--apply`，标签按 issue-tracking-plan.md 的约定用 `wave-1/2/3`，需要时 `--milestone "标题"` 建同名里程碑。
5. 发完提醒用户可以跑 `python scripts/collect-issues.py` 刷新看板，用户同意再跑。

## 原则（来自 .claude/mcu-with-ai/issue-tracking-plan.md，2026-10-24 拍板）

- 只建到交付件级，章节 issue 懒建：某段真正开写时才立项，预建章节会变僵尸。
- 子 issue 必须与父同仓，跨仓关系用正文引用表达，不硬挂。
- 中心站仓另设总览置顶 issue 做跨仓地图，三层架构见 issue-tracking-plan.md。

## 边界与善后

- GitHub 没有删除 issue 的 API。用户要求删除时，给出各条 issue 的网页链接，由有管理员权限的人手动点 Delete issue（建议先删子再删父）。
- 手动删除或作废后，清掉计划文件里对应的 `<!--#N-->` 写回编号，否则重跑会跳过这些条目，永远不会重发。
- 脚本 fail loud：任何 gh 错误、解析错误、结构错误都会立即中断，修好重跑即可，已建条目不会重发。
- 全链路（创建、label、sub-issue 挂接、编号写回）2026-10-26 在 eai 仓实测通过。
