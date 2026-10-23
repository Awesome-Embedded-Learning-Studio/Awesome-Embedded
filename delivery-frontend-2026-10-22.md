# 前端优化交付说明（2026-10-22）

分支 `feat/frontend-restyle`，工作树 `.worktrees/frontend`，基线提交 `d53c1ef`。
所有改动都停在工作树里，没有提交，也没有碰主 checkout 上别人正在改的文件。

## 一、四批改动做了什么

### 第一批：正文阅读

正文从 0.82rem（约 13.12px）改成 1rem（16px），行高从写死的 28px 改成 1.75。段落和列表单独写了一条行高，因为 VitePress 给 `.vp-doc p` 写死了 28px，字号一变它不跟。

每行汉字从 48 个降到 39 个，读起来不再横向拉得太长。

代码块从 12px 改成 14px，行高 1.7，外面加了一圈 1px 边框，和纸底分开。

行内代码从 10.23px 改成 14px（0.875em），颜色换成品牌绿，浅色模式下的实测对比度是 5.2:1。原来它是 4.00:1，低于 AA。

表格的表头和单元格统一固定为 14px。原来声明 0.78rem（12.48px），实际被 VitePress 的 14px 覆盖，声明和结果对不上。同时去掉了 `overflow: hidden`，宽表现在可以在容器里横向滑动。用 342px 宽的容器塞 830px 的内容试过，`scrollWidth` 大于 `clientWidth`，滑得动。

正文链接从 4.28:1 提到 5.73:1，侧栏当前项从 4.19:1 提到 5.33:1。

首页“关于”段从 1.1rem 改回 1rem，和全站正文一致。

### 第二批：入口与目录

首页首屏顺序改成 hero、数据带、四张学习卡、学习树、方法论卡、长文、QQ 群。学习卡从原来的 y=2009 提到 y=468，1440×900 的首屏里能完整看到四张卡。

hero 主按钮改成“从这里开始学”，指向 `/guide/`，次按钮是“浏览项目目录”，指向 `/projects/`。QQ 群的入口降到页尾，群里的人仍然找得到。

项目目录页去掉了右侧大纲栏，正文列从 624px 放宽到 880px，卡片排成三列，720px 宽时两列，390px 时单列。

目录新增状态筛选，分“建设中、可验证、已交付”三档，和开发线筛选并排。两个按钮组都用 `aria-pressed` 标记当前选中，计数行用 `aria-live` 报出“当前显示 N 个项目”，筛选条件写进地址栏的 `?lane=&stage=`。分享链接或刷新以后还能回到同一组筛选。没有结果时会显示提示文字，分区一起隐藏。

mermaid 图在 899px 以下给 svg 设了 720px 的最小宽度，容器横向滚动，图下面加了一行“图在窄屏可以左右滑动”的提示。两张图都补了 `accTitle` 和 `accDescr`，渲染出来的 svg 里能读到标题。

三对页面之间加了互链：ST-Forge、imx-forge、rk-forge 的项目页和路线页互相指向。

42 个没有 h1 的页面补上了一级标题，标题取 frontmatter 里的 `title`。补完以后除首页外每个页面都有唯一的一级标题。

### 第三批：状态与一致性

项目状态的颜色收进 `--aels-status-*` 变量。浅色模式下可验证 5.61:1，已交付 5.65:1，建设中 5.29:1。可验证用虚线描边，已交付用实线描边，建设中用琥珀色，三个状态不再共用同一种绿。

星数读取改成五个状态：idle、loading、ready、degraded、error。GitHub 组织接口失败时退到 shields 逐仓查询，这种降级状态不写缓存。彻底失败时记 error，也不再写一小时的空缓存。卡片上的星数位置留了固定宽度，读不到时显示破折号，数字到达时不会把整行挤动。

圆角统一到 6px、8px、12px、999px 四档。卡片和面板用 12px，标签和筛选按钮用 999px。

加了一条全局 `:focus-visible`，2px 品牌色描边加 2px 偏移。删掉了两处 `outline: none`，键盘走到按钮和链接上能看见焦点框。

排行榜在手机上不再隐藏描述，改成两行截断。每一行加了 `aria-label`，读屏能一次读出仓库名、星数和 fork 数。

删掉了没有被任何页面使用的 `ProjectGrid.vue`，同时移除它的注册。

### 第四批：窄屏与可达性

768px 以下隐藏 SVG 学习树，改成按层带分组的文字列表，18 个节点分在 5 个层带里，链接和图上一致。这样手机上不用把 1330 宽的图缩到 342 宽去看 7px 的字。

“减少动态效果”的规则覆盖到卡片位移、统计项、排行榜行、放大按钮和筛选按钮。

`--vp-c-text-3` 从 3.09:1 压到 6.7:1 左右，数据带和统计标签这类小字不再发灰。

mermaid 的放大按钮从 28×28 改成 44×44，符合触摸目标的下限。

## 二、数字对照

| 项目 | 改前 | 改后 |
|---|---|---|
| 正文字号 | 13.12px | 16px |
| 正文行高倍数 | 2.13 | 1.75 |
| 每行汉字 | 48 | 39 |
| 代码字号 | 12px | 14px |
| 行内代码字号 | 10.23px | 14px |
| 行内代码对比度 | 4.00:1 | 5.2:1 |
| 正文链接对比度 | 4.28:1 | 5.73:1 |
| 侧栏当前项对比度 | 4.19:1 | 5.33:1 |
| 可验证标签对比度 | 2.92:1 | 5.61:1 |
| 已交付标签对比度 | 2.93:1 | 5.65:1 |
| 数据带小字对比度 | 3.09:1 | 6.77:1 |
| 首页学习卡位置 | y=2009 | y=468 |
| 项目目录页高度 | 10559px | 8729px |
| 项目卡片列数（1440） | 1 | 3 |
| 缺 h1 的页面 | 42 | 0 |

## 三、动到的文件

样式与主题：

- `site/.vitepress/theme/custom.css`
- `site/.vitepress/theme/index.ts`

组件：

- `ProjectCatalog.vue` 重写筛选与布局
- `ProjectCard.vue` 状态标签、星数占位、圆角与字号
- `RoadmapGraph.vue` 窄屏文字列表
- `RankingTable.vue` 状态文案、手机端描述、逐行 aria-label
- `OrgStats.vue`、`DataStrip.vue` 读取状态与小字颜色
- `HomeAbout.vue` 字号
- `HomeTerminal.vue` 圆角
- 删除 `ProjectGrid.vue`

内容：

- `document/index.md` 首屏按钮
- `document/projects/index.md` 关闭大纲栏、page class
- `document/projects/*.md` 与 `document/workflow/*.md`、`document/weekly/*.md`、`document/ranking/index.md`、`document/contributing/index.md`、`document/maintainers/index.md` 补 h1
- `document/roadmap/` 下四个页面：互链、mermaid 提示、accTitle

## 四、四处越出样式层的改动

这四处原来在诊断报告里标了“需要单独点头”，实现时一并做了。它们都在分支上，回退只需要删掉对应的几行。

第一处是 `document/index.md` 的 hero 按钮文案和链接，从 QQ 群改成了开始学习与目录。

第二处是 `document/projects/index.md` 的 `aside: false` 和 `pageClass`，目录页因此不再显示右侧大纲。

第三处是 42 个页面的 h1。

第四处是两张 mermaid 图的 `accTitle` 和 `accDescr`。

`site/project.config.ts`、`site/.vitepress/project-data.ts`、`site/.vitepress/config/index.ts` 一行没动，`/guide/` 的侧栏配置仍然留在原来的待办里。

## 五、怎么验收

在工作树里起开发服务器：

```bash
cd /home/charliechen/Awesome-Embedded/.worktrees/frontend
pnpm dev --port 5198 --host 127.0.0.1
```

然后打开 `http://127.0.0.1:5198/Awesome-Embedded/`。我这边昨晚的服务器已经停了，需要重新起。

构建已经跑过，`pnpm build` 通过，SSR 渲染没有报错。

截图在 `preview-frontend-2026-10-22/` 里，覆盖首页、项目目录、学习关系页、带代码和表格的路线页，各有桌面浅色、桌面深色、窄屏三种。这个目录已经写进 `.git/info/exclude`，不会被提交。

复查用的脚本在 `node_modules/.diag/` 下，`final.mjs` 输出各页面的字号、对比度、横向溢出和首屏位置，`matrix.mjs` 跑完九种筛选组合，`empty.mjs` 验空结果提示。

## 六、没做和限制

我看不到图片，所有视觉判断来自计算样式和元素几何数据。截图留给你用眼睛过一遍，尤其是深色模式和首页首屏的疏密。

排行榜仍然是 `div` 结构，只是补了 `aria-label`，没有改成真正的 `table` 元素。

GitHub 接口失败时的 shields 兜底仍然是逐个仓库查询，请求数没有降。改的只是失败不再缓存一小时。

字号档位没有完全收到八种以内，正文、代码、标签之外还有十来种字号散在各组件里。

按仓库约定，没有自动提交。你 review 完再决定怎么切分提交。
