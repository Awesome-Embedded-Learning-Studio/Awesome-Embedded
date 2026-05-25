# Awesome-Embedded 改造方案探索报告

> 基于 `content/meta/2026-05-25.json` 数据分析，针对 Awesome-Embedded-Learning-Studio 中心仓库的改进方案。
> 生成日期：2026-05-25

---

## 1. 推荐定位

### 1.1 现状分析

当前 Awesome-Embedded 承担了以下角色（隐式）：

- **项目列表**：README 列出了模板和项目清单链接
- **路由入口**：roadmap.md 按分类列出了所有公开仓库
- **组织展示**：有贡献者、技术栈、WIP 计划等
- **工具集散地**：tools/ 下有 PowerShell 模板生成脚本
- **草稿箱**：drafts/ 存放了一些工作流草稿

但每个角色都做得不够深入。README 更像是一个"打招呼"页面，roadmap.md 是仓库列表而非路线图，缺乏 CONTRIBUTING、PROJECTS 等治理文件。

### 1.2 适合承担的角色

| 角色 | 适合度 | 理由 |
|------|--------|------|
| 项目导航仓库 | ★★★★★ | 核心职责，自然入口 |
| Roadmap 中心 | ★★★★☆ | 已有 roadmap.md 基础，升级即可 |
| 贡献者入口 | ★★★★☆ | 组织需要，且 CONTRIBUTING 成本低 |
| 组织公开入口 | ★★★☆☆ | 已有 .github profile 仓库，但中心仓库可以做更深度的引导 |
| Awesome List | ★★★☆☆ | 可以有 awesome 风格但不是传统 awesome-list |
| manifest 驱动的维护工作台 | ★★☆☆☆ | 有价值但属于第二阶段 |
| 仓库审计中心 | ★★☆☆☆ | 有价值但属于第三阶段 |

### 1.3 不应该承担的角色

- **CI/CD 中心**：各仓库自行管理 CI
- **文档站点**：GitHub Pages 已经在各自仓库部署
- **代码托管**：这不是 monorepo

### 1.4 一句话定位

> Awesome-Embedded 是 Awesome-Embedded-Learning-Studio 的导航中心：帮访客找到感兴趣的嵌入式项目，帮贡献者找到参与方式，帮维护者追踪组织健康度。

### 1.5 当前差距

| 维度 | 当前状态 | 理想状态 |
|------|----------|----------|
| README | 打招呼 + 模板链接 | 30 秒内回答"这是什么、我该去哪" |
| ROADMAP | 仓库分类列表 | 学习路线 + 项目建设路线 + 维护优先级 |
| PROJECTS | 不存在 | 项目矩阵表格 |
| CONTRIBUTING | 不存在 | 贡献指南 |
| manifest | 不存在 | 结构化仓库元数据 |
| 目录结构 | 扁平散乱 | 清晰分区 |
| .gitignore | 只忽略 CLAUDE.md 和 data/ | 完善 public/private 边界 |

---

## 2. 三种改造强度方案对比

### 方案 A：轻量导航型

**范围**：README.md + ROADMAP.md + PROJECTS.md，不引入工具链。

**优点**：
- 改动最小，1-2 天可完成
- 维护成本几乎为零
- 不引入任何复杂度
- 纯 Markdown 改造

**缺点**：
- 元数据全靠人工维护，容易过时
- 没有结构化数据源，改一处要改多处
- 维护者没有本地审计手段
- 长期不可持续，仓库多了手动维护会崩溃

**适合场景**：短期内不想投入工具开发，先把信息架构理顺。

### 方案 B：治理中心型（推荐）

**范围**：方案 A + CONTRIBUTING.md + manifest/repos.yaml + tools/clone_or_update.py + tools/audit_repos.py + reports/public-overview.md。

**优点**：
- 有结构化数据源（manifest），所有文档可以从同一个数据源生成
- 引入轻量工具链，但不过度
- 维护者可以本地扫描仓库健康度
- public/private 天然分离
- 渐进式引入，每个组件独立有用

**缺点**：
- 需要写 2-3 个 Python 脚本（但都很简单）
- manifest 初版需要人工填写（但之后维护成本低）
- 需要维护者理解 manifest 机制

**适合场景**：当前阶段最合适——组织已有 23 个仓库，纯人工已经开始吃力。

### 方案 C：审计工作台型

**范围**：方案 B + 完整 reports 体系 + 自动生成 PROJECTS.md/ROADMAP.md + CI 集成 + 定期扫描。

**优点**：
- 高度自动化
- 信息始终最新
- 可以在 CI 中运行

**缺点**：
- 初始工程量大
- CI 集成增加复杂度
- 可能在组织规模尚小时过度工程化
- 维护 CI 本身也需要时间

**适合场景**：组织达到 40+ 仓库时再考虑。

### 推荐方案：B（治理中心型）

理由：
1. 组织已有 23 个仓库（21 公开 + 2 私有），纯人工管理开始吃力
2. manifest 机制是后续一切自动化的基础，早引入早受益
3. Python + YAML + Markdown 技术栈完全在能力范围内
4. 改造可以分阶段进行，第一阶段只做文档，第二阶段才上脚本
5. 不会破坏 "Keep it small, make it fun" 的气质——manifest 本身就很小

---

## 3. 推荐目录结构

```
Awesome-Embedded/
├── README.md                          # 组织入口（面向访客）
├── ROADMAP.md                         # 组织路线图（面向关注者）
├── PROJECTS.md                        # 项目矩阵（面向导航）
├── CONTRIBUTING.md                    # 贡献指南（面向贡献者）
├── MAINTAINERS.md                     # 维护者列表（Phase 2）
├── .gitignore
│
├── manifest/                          # 结构化仓库元数据
│   ├── repos.yaml                     # 公开仓库描述（提交）
│   ├── repos.private.local.yaml      # 私有仓库描述（不提交）
│   └── categories.yaml               # 分类定义（Phase 2）
│
├── reports/                           # 自动生成的报告
│   ├── public-overview.md             # 公开仓库总览（Phase 2，可提交）
│   ├── repo-health.md                 # 仓库健康检查（Phase 2，可提交）
│   └── roadmap-input.md               # 路线图输入（Phase 3，可提交）
│
├── tools/                             # 维护工具
│   ├── README.md                      # 工具使用说明
│   ├── clone_or_update.py             # 克隆/更新仓库（Phase 2）
│   ├── audit_repos.py                 # 仓库审计（Phase 2）
│   ├── generate_projects_md.py        # 生成 PROJECTS.md（Phase 3）
│   └── generate_roadmap_input.py      # 生成路线图输入（Phase 3）
│
├── repo-template/                     # 项目模板（保留）
│   ├── repo-project-template/
│   └── repo-tutorial-template/
│
├── ProjectLists.todo/                 # 待做清单（保留，后续考虑迁移）
├── drafts/                            # 草稿（保留）
│
├── assets/                            # 图片资源（保留）
│   └── Awesome-Embedded.png
│
├── scripts/                           # 旧脚本（保留，逐步迁移到 tools/）
│   └── fetch-repos.sh
│
└── content/                           # 本地仓库克隆（不提交）
    └── (gitignored)
```

### 文件归属表

| Path | Purpose | Phase | Public or Local | Should Commit | Notes |
|------|---------|-------|-----------------|---------------|-------|
| README.md | 组织入口 | 1 | Public | Yes | 核心文件，必须重构 |
| ROADMAP.md | 组织路线图 | 1 | Public | Yes | 从仓库列表升级为路线图 |
| PROJECTS.md | 项目矩阵 | 1 | Public | Yes | 新增，按分类展示所有项目 |
| CONTRIBUTING.md | 贡献指南 | 1 | Public | Yes | 新增，降低贡献门槛 |
| MAINTAINERS.md | 维护者列表 | 2 | Public | Yes | 新增 |
| manifest/repos.yaml | 公开仓库元数据 | 2 | Public | Yes | 结构化数据源 |
| manifest/repos.private.local.yaml | 私有仓库元数据 | 2 | Local | **No** | 加入 .gitignore |
| manifest/categories.yaml | 分类定义 | 3 | Public | Yes | 可选 |
| reports/public-overview.md | 公开仓库总览 | 2 | Public | Yes | 自动生成但可提交 |
| reports/repo-health.md | 健康检查 | 2 | Public | Yes | 自动生成但可提交 |
| reports/roadmap-input.md | 路线图输入 | 3 | Public | Yes | 自动生成 |
| tools/README.md | 工具说明 | 2 | Public | Yes | |
| tools/clone_or_update.py | 克隆/更新 | 2 | Public | Yes | |
| tools/audit_repos.py | 仓库审计 | 2 | Public | Yes | |
| tools/generate_projects_md.py | 生成项目矩阵 | 3 | Public | Yes | |
| tools/generate_roadmap_input.py | 生成路线图输入 | 3 | Public | Yes | |
| content/ | 本地克隆目录 | 2 | Local | **No** | 加入 .gitignore |
| .gitignore | 忽略规则 | 1 | Public | Yes | 必须完善 |
| repo-template/ | 项目模板 | — | Public | Yes | 保留 |
| ProjectLists.todo/ | 待做清单 | — | Public | Yes | 保留，后续考虑迁移到 ROADMAP |
| drafts/ | 草稿 | — | Public | Yes | 保留 |
| assets/ | 图片 | — | Public | Yes | 保留 |

---

## 4. README.md 改造建议

### 4.1 推荐结构

```
1. 一句话定位 + badge
2. "我该从哪里开始"（30 秒引导）
3. 四条主航道
4. 核心项目展示
5. 项目矩阵入口
6. Roadmap 入口
7. 贡献入口
8. 社区讨论入口
9. 维护说明（简短）
10. 许可 & 联系方式
```

### 4.2 顶部一句话定位（3 个风格）

**风格 A：直接型**
> Awesome-Embedded-Learning-Studio 的导航中心 —— 嵌入式学习项目、教程和工具的统一入口。

**风格 B：对话型**
> 这里是 Awesome-Embedded-Learning-Studio 的大厅。不管你是想学嵌入式、找开源项目、还是想贡献代码，从这里出发就对了。

**风格 C：口号型**
> Keep it small, make it fun. 从 C++ 工程化到 Embedded Linux，从 MCU 裸机到 Qt 桌面 —— 一站式嵌入式学习导航。

**推荐风格 B**——友好、直接、不做作，符合"学习小屋"气质。

### 4.3 "我该从哪里开始"草稿

```markdown
## 我该从哪里开始？

| 你是谁 | 建议从这里 |
|--------|-----------|
| 想学 C++ 的嵌入式开发者 | [Tutorial_AwesomeModernCPP](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP) — 从 C++11 到 C++23 的系统教程 |
| 想学 Qt / GUI 开发 | [Tutorial_AwesomeQt](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt) — Qt 6 百科全书式教程 |
| 想玩 Embedded Linux | [imx-forge](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge) — i.MX6ULL BSP 快速部署 |
| 想做 MCU 裸机项目 | [BareMetal-Drivers](https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers) — 通用裸机驱动库 |
| 想参与贡献 | [CONTRIBUTING.md](CONTRIBUTING.md) — 贡献指南 |
| 只想随便看看 | [PROJECTS.md](PROJECTS.md) — 所有项目一览 |
```

### 4.4 "四条主航道"草稿

```markdown
## 四条主航道

我们的学习和建设围绕四条主线展开：

### 1. C++ 的入门学习与进一步工程化
从手搓 INI 解析器到现代 C++ 全栈教程，目标是让嵌入式开发者和任何C++初步入门的爱好者也能写出工程级的 C++ 代码。
核心仓库：Tutorial_AwesomeModernCPP、Tutorial_CXXBaseComponents、miniwget

### 2. Embedded Linux
从 i.MX6ull BSP 到 RK 芯片适配，从内核到用户空间的动手实验。
核心仓库：imx-forge、rk-forge、PenguinLab

### 3. MCU / 裸机 / FreeRTOS
STM32 HAL 驱动、裸机驱动库、FreeRTOS 教程，专注资源受限平台。
核心仓库：ST-Forge、BareMetal-Drivers、Project_MicroWatch

### 4. Qt / GUI / 产品化
从 Qt 教程到嵌入式桌面框架，把学习成果变成可以展示的产品。
核心仓库：Tutorial_AwesomeQt、CFDesktop、qt-compile-pipeline（但是这个是工具类的项目）
```

### 4.5 "核心项目"展示方式

```markdown
## 核心项目

| 项目 | Stars | 说明 |
|------|-------|------|
| [Tutorial_AwesomeModernCPP](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP) | ⭐ 82 | 现代 C++ 系统教程（C++11~C++23） |
| [imx-forge](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge) | ⭐ 56 | i.MX6ULL BSP 快速部署 |
| [Tutorial_AwesomeQt](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt) | ⭐ 27 | Qt 6 百科全书式教程 |
| [Project_MakeAMemroyPool](https://github.com/Awesome-Embedded-Learning-Studio/Project_MakeAMemroyPool) | ⭐ 7 | 配合视频的内存池实战 |
| [CFBox](https://github.com/Awesome-Embedded-Learning-Studio/CFBox) | ⭐ 5 | C++23 极简 BusyBox |
```

### 4.6 "如何贡献"草稿

```markdown
## 如何参与贡献

我们欢迎所有形式的贡献，不需要你是大神：

- **报告问题**：在对应仓库开 Issue
- **修复 Bug**：Fork → 修 → PR，我们会在 48 小时内 review
- **写教程/文档**：先看看 [CONTRIBUTING.md](CONTRIBUTING.md) 里的模板
- **提出想法**：到 [Discussions](https://github.com/Awesome-Embedded-Learning-Studio/community/discussions) 发帖讨论
- **做小玩具**：用我们的 [项目模板](repo-template/) 快速起步

详细指南见 [CONTRIBUTING.md](CONTRIBUTING.md)。
```

---

## 5. ROADMAP.md 改造建议

### 5.1 当前问题

当前 roadmap.md 本质上是一个"按分类排列的仓库列表"，缺少：
- 组织发展阶段信息
- 时间维度的规划
- 学习路线（给学习者看的路径）
- 维护优先级（给维护者看的待办）

### 5.2 推荐结构

```markdown
# ROADMAP.md

## 当前阶段
一句话说明组织当前处于什么阶段。

## 学习路线（Learning Roadmap）
面向学习者，按方向推荐学习路径。

## 项目建设路线（Project Roadmap）
面向贡献者和维护者，按季度/月份规划。

## 维护优先级（Maintenance Roadmap）
面向维护者，列出需要关注的仓库健康问题。

## 暂缓事项
明确说"现在不做"的事情。

## 已完成事项
历史记录。

## 未来候选方向
远期展望。
```

### 5.3 各章节写作意图

| 章节 | 写作意图 | 内容来源 |
|------|----------|----------|
| 当前阶段 | 让访客快速了解组织成熟度 | 新增 |
| 学习路线 | 让新手知道按什么顺序学习 | 从现有教程仓库信息提炼 |
| 项目建设路线 | 让贡献者知道接下来要做什么 | 从 WIP 计划和 manifest 提炼 |
| 维护优先级 | 让维护者知道哪些仓库需要关注 | 从 audit 结果提炼 |
| 暂缓事项 | 管理期望，避免无限膨胀 | 新增 |
| 已完成事项 | 展示进展，建立信心 | 从 README WIP 迁移 |
| 未来候选方向 | 长期愿景 | 新增 |

### 5.4 内容迁移建议

| 从 | 迁移到 | 理由 |
|----|--------|------|
| README "WIP 计划" | ROADMAP "已完成事项" + "项目建设路线" | WIP 本质是路线图 |
| roadmap.md 仓库列表 | PROJECTS.md | 仓库列表更适合放在项目矩阵 |
| ProjectLists.todo/ | ROADMAP "项目建设路线"（摘要） | 待做清单的精华部分 |

### 5.5 不适合放进 ROADMAP 的内容

- **仓库详细信息表格**：放入 PROJECTS.md
- **仓库健康数据**：放入 reports/repo-health.md
- **分类定义**：放入 manifest/categories.yaml
- **贡献者列表**：放入 MAINTAINERS.md 或 README

---

## 6. PROJECTS.md 设计

### 6.1 推荐目录

```markdown
# PROJECTS.md — 项目矩阵

## 分类说明
（简述分类体系）

## C++ 工程化
（表格）

## Embedded Linux
（表格）

## MCU / 裸机 / FreeRTOS
（表格）

## Qt / GUI / 产品化
（表格）

## Tools / Utilities
（表格）

## Labs / Experiments
（表格）

## Docs / Tutorials
（表格）

## 组织管理
（表格）

## 统计
（活跃度、语言分布等）
```

### 6.2 项目矩阵表格设计

```markdown
| 项目 | 说明 | 语言 | Level | 状态 | Stars | 适合新人 |
|------|------|------|-------|------|-------|----------|
| [Tutorial_AwesomeModernCPP](link) | 现代 C++ 系统教程 | C++ | Core | 🟢 活跃 | ⭐ 82 | ✓ |
```

### 6.3 字段含义

| 字段 | 含义 | 值域 |
|------|------|------|
| 项目 | 仓库名称 + 链接 | — |
| 说明 | 一句话中文描述 | — |
| 语言 | 主语言 | C, C++, Shell, TypeScript, PowerShell |
| Level | 项目等级 | Core / Active / Lab / Paused / Archived |
| 状态 | 活跃度 | 🟢活跃（30天内）/ 🟡维护中（30~180天）/ 🔴停滞（180天+） |
| Stars | GitHub stars | 数字 |
| 适合新人 | 是否适合第一次贡献 | ✓ / — |

### 6.4 项目等级定义

| Level | 含义 | 标准 |
|-------|------|------|
| Core | 组织核心项目 | Stars ≥ 20 或战略意义高 |
| Active | 活跃项目 | 近期有提交，有明确方向 |
| Lab | 实验项目 | 早期探索，不确定是否会继续 |
| Paused | 暂停项目 | 暂时不维护，但未归档 |
| Archived | 归档候选 | 建议归档 |

### 6.5 建议的仓库分级

**Core（核心）**：
- Tutorial_AwesomeModernCPP (82★)
- imx-forge (56★)
- Tutorial_AwesomeQt (27★)

**Active（活跃）**：
- CFDesktop (5★)
- CFBox (5★)
- Tutorial_cpp_SimpleIniParser (6★)
- Project_MakeAMemroyPool (7★)
- ST-Forge (2★)
- BareMetal-Drivers (3★)
- rk-forge (4★)
- qt-compile-pipeline (2★)
- PenguinLab (0★)

**Lab（实验）**：
- micro-forge (1★)
- edgecv (0★)
- Project_MicroWatch (1★)
- Project_CXXBaseComponents (1★)

**Paused（暂停候选）**：
- Tutorial_EmbeddedCommonTools (1★，最后提交 2025-12-24)
- Tutorial_FreeRTOS (1★，最后提交 2025-12-16)

### 6.6 自动生成 vs 人工维护

| 字段 | 自动生成 | 人工维护 |
|------|----------|----------|
| 项目名、链接 | ✓ (manifest) | |
| 说明 | | ✓ (manifest 中的 description) |
| 语言 | ✓ (GitHub API) | |
| Level | | ✓ (manifest 中的 level) |
| 状态 | ✓ (基于 last_commit_date 计算) | |
| Stars | ✓ (GitHub API) | |
| 适合新人 | | ✓ (manifest 中的 audience) |

### 6.7 public 版本防泄密

- 只包含 `publish_to_projects_md: true` 的仓库
- 私有仓库不在 public 版本中出现
- 生成脚本过滤 `visibility: private` 的条目
- Level/Status 只反映公开仓库

---

## 7. manifest 设计

### 7.1 字段说明

**基础字段（必须）**：

| 字段 | 类型 | 说明 | 公开 |
|------|------|------|------|
| name | string | 仓库名 | ✓ |
| repo | string | 组织内仓库名 | ✓ |
| url | string | GitHub URL | ✓ |
| description | string | 一句话中文描述 | ✓ |
| category | string | 分类 | ✓ |
| level | enum | Core/Active/Lab/Paused | ✓ |
| status | string | 活跃度（自动计算） | ✓ |
| priority | enum | P0/P1/P2/P3 | ✓ |
| publish_to_projects_md | bool | 是否出现在 PROJECTS.md | ✓ |

**扩展字段（推荐）**：

| 字段 | 类型 | 说明 | 公开 |
|------|------|------|------|
| homepage | string | GitHub Pages URL | ✓ |
| language | string | 主语言 | ✓ |
| topics | list | GitHub topics | ✓ |
| audience | string | 目标受众 | ✓ |
| maintainer | string | 维护者 GitHub ID | ✓ |
| publish_to_roadmap | bool | 是否出现在 ROADMAP | ✓ |

**审计字段（Phase 2）**：

| 字段 | 类型 | 说明 | 公开 |
|------|------|------|------|
| audit.enabled | bool | 是否参与审计 | ✓ |
| expected.has_readme | bool | 期望有 README | ✓ |
| expected.has_license | bool | 期望有 LICENSE | ✓ |
| expected.has_quickstart | bool | 期望有 Quick Start | ✓ |

**私有字段（仅 local）**：

| 字段 | 类型 | 说明 | 公开 |
|------|------|------|------|
| visibility | string | public/private | 仅 local |
| local_path | string | 本地克隆路径 | 仅 local |
| internal_notes | string | 内部备注 | 仅 local |
| privacy.redact | bool | 是否从 public report 中移除 | 仅 local |

**不建议现在做的字段**：
- `board` / `chip` / `framework` / `toolchain`：当前仓库类型差异大，统一这些字段成本高收益低
- `lifecycle`：和 level/status 重复
- `last_reviewed_at`：需要维护习惯，现阶段不现实
- `audit.scan_readme` / `audit.scan_docs` / `audit.scan_commits`：粒度太细，audit_repos.py 内部硬编码即可

### 7.2 推荐 repos.yaml 示例

```yaml
# manifest/repos.yaml — 公开仓库元数据
# 此文件提交到 Git，不包含私有仓库信息

repos:
  - name: Tutorial_AwesomeModernCPP
    repo: Tutorial_AwesomeModernCPP
    url: https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP
    homepage: https://awesome-embedded-learning-studio.github.io/Tutorial_AwesomeModernCPP/
    description: "现代 C++ 系统教程（C++11~C++23），涵盖 STL、并发、性能优化、嵌入式、网络和 GUI"
    category: cpp-engineering
    level: Core
    priority: P0
    language: C++
    audience: "C++ 开发者 / 嵌入式开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: true
      has_quickstart: true

  - name: imx-forge
    repo: imx-forge
    url: https://github.com/Awesome-Embedded-Learning-Studio/imx-forge
    homepage: https://awesome-embedded-learning-studio.github.io/imx-forge/
    description: "i.MX6ULL BSP 补丁快速部署，uboot/kernel/rootfs 一键应用"
    category: embedded-linux
    level: Core
    priority: P0
    language: Shell
    audience: "Embedded Linux 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: true
      has_quickstart: true

  - name: Tutorial_AwesomeQt
    repo: Tutorial_AwesomeQt
    url: https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt
    homepage: https://awesome-embedded-learning-studio.github.io/Tutorial_AwesomeQt/
    description: "Qt 6 百科全书式教程，从第一行代码到读懂 Qt 源码"
    category: qt-gui
    level: Core
    priority: P0
    language: TypeScript
    audience: "C++ / Qt 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: true
      has_quickstart: true

  - name: CFDesktop
    repo: CFDesktop
    url: https://github.com/Awesome-Embedded-Learning-Studio/CFDesktop
    homepage: https://awesome-embedded-learning-studio.github.io/CFDesktop/
    description: "嵌入式设备 Material Design 3 桌面框架"
    category: qt-gui
    level: Active
    priority: P1
    language: C++
    audience: "Qt / 嵌入式开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: true
      has_quickstart: false

  - name: CFBox
    repo: CFBox
    url: https://github.com/Awesome-Embedded-Learning-Studio/CFBox
    description: "C++23 极简 BusyBox 替代品"
    category: cpp-engineering
    level: Active
    priority: P1
    language: C++
    audience: "Linux / 嵌入式开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: true

  - name: Tutorial_cpp_SimpleIniParser
    repo: Tutorial_cpp_SimpleIniParser
    url: https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_cpp_SimpleIniParser
    homepage: https://awesome-embedded-learning-studio.github.io/Tutorial_cpp_SimpleIniParser/
    description: "手搓最简 INI 解析器，C++ 工程化入门"
    category: cpp-engineering
    level: Active
    priority: P1
    language: C++
    audience: "C++ 初学者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: Project_MakeAMemroyPool
    repo: Project_MakeAMemroyPool
    url: https://github.com/Awesome-Embedded-Learning-Studio/Project_MakeAMemroyPool
    description: "配合 B 站视频的简易内存池实战"
    category: cpp-engineering
    level: Active
    priority: P2
    language: C++
    audience: "C++ 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: ST-Forge
    repo: ST-Forge
    url: https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge
    description: "STM32 HAL 驱动框架，CMake 原生构建，不依赖 IDE"
    category: mcu-baremetal
    level: Active
    priority: P1
    language: C
    audience: "STM32 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: BareMetal-Drivers
    repo: BareMetal-Drivers
    url: https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers
    homepage: https://awesome-embedded-learning-studio.github.io/BareMetal-Drivers/
    description: "单片机裸机通用驱动库"
    category: mcu-baremetal
    level: Active
    priority: P1
    language: C
    audience: "MCU 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: rk-forge
    repo: rk-forge
    url: https://github.com/Awesome-Embedded-Learning-Studio/rk-forge
    description: "Rockchip 系列 BSP 补丁快速部署"
    category: embedded-linux
    level: Active
    priority: P2
    language: Shell
    audience: "Embedded Linux 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: qt-compile-pipeline
    repo: qt-compile-pipeline
    url: https://github.com/Awesome-Embedded-Learning-Studio/qt-compile-pipeline
    description: "Qt6 ARM 交叉编译自动化管道"
    category: qt-gui
    level: Active
    priority: P2
    language: Shell
    audience: "Qt / 嵌入式开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: PenguinLab
    repo: PenguinLab
    url: https://github.com/Awesome-Embedded-Learning-Studio/PenguinLab
    homepage: https://awesome-embedded-learning-studio.github.io/PenguinLab/
    description: "嵌入式 Linux 全栈动手实验，从内核到用户空间"
    category: embedded-linux
    level: Active
    priority: P1
    language: Shell
    audience: "Linux 爱好者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: Project_MicroWatch
    repo: Project_MicroWatch
    url: https://github.com/Awesome-Embedded-Learning-Studio/Project_MicroWatch
    homepage: https://awesome-embedded-learning-studio.github.io/Project_MicroWatch/
    description: "资源受限平台智能手表（Dino 游戏/计步/指南针）"
    category: mcu-baremetal
    level: Lab
    priority: P2
    language: C
    audience: "MCU 爱好者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false

  - name: Project_CXXBaseComponents
    repo: Project_CXXBaseComponents
    url: https://github.com/Awesome-Embedded-Learning-Studio/Project_CXXBaseComponents
    description: "B 站动画系列 C++ 基础组件源码"
    category: cpp-engineering
    level: Lab
    priority: P3
    language: C++
    audience: "C++ 学习者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false

  - name: micro-forge
    repo: micro-forge
    url: https://github.com/Awesome-Embedded-Learning-Studio/micro-forge
    description: "MCU 级快速部署框架，无硬件也能学 MCU"
    category: mcu-baremetal
    level: Lab
    priority: P2
    language: C++
    audience: "MCU 开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: edgecv
    repo: edgecv
    url: https://github.com/Awesome-Embedded-Learning-Studio/edgecv
    homepage: https://awesome-embedded-learning-studio.github.io/edgecv/
    description: "嵌入式边缘计算机视觉库，Header-Only"
    category: cpp-engineering
    level: Lab
    priority: P2
    language: C++
    audience: "CV / 嵌入式开发者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: true

  - name: Tutorial_EmbeddedCommonTools
    repo: Tutorial_EmbeddedCommonTools
    url: https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_EmbeddedCommonTools
    homepage: https://awesome-embedded-learning-studio.github.io/Tutorial_EmbeddedCommonTools/
    description: "嵌入式开发通用工具教程"
    category: docs-tutorials
    level: Paused
    priority: P3
    language: null
    audience: "嵌入式初学者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false

  - name: Tutorial_FreeRTOS
    repo: Tutorial_FreeRTOS
    url: https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS
    homepage: https://awesome-embedded-learning-studio.github.io/Tutorial_FreeRTOS/
    description: "FreeRTOS 系列开源教程"
    category: mcu-baremetal
    level: Paused
    priority: P3
    language: null
    audience: "RTOS 学习者"
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false

  # 组织管理仓库（不参与 audit）
  - name: Awesome-Embedded
    repo: Awesome-Embedded
    url: https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded
    description: "组织中心导航仓库（本仓库）"
    category: org
    level: Core
    priority: P0
    language: PowerShell
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false
    audit:
      enabled: false

  - name: ".github"
    repo: ".github"
    url: https://github.com/Awesome-Embedded-Learning-Studio/.github
    description: "组织 Profile 仓库"
    category: org
    level: Active
    priority: P1
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false
    audit:
      enabled: false

  - name: community
    repo: community
    url: https://github.com/Awesome-Embedded-Learning-Studio/community
    description: "组织级讨论、公告与问答"
    category: org
    level: Active
    priority: P1
    maintainer: Charliechen114514
    publish_to_projects_md: true
    publish_to_roadmap: false
    audit:
      enabled: false
```

### 7.3 repos.private.local.yaml 示例

```yaml
# manifest/repos.private.local.yaml — 私有仓库元数据
# 此文件不提交到 Git（在 .gitignore 中）

repos:
  - name: bareline
    repo: bareline
    url: https://github.com/Awesome-Embedded-Learning-Studio/bareline
    description: "轻量级裸机 CLI 交互框架"
    category: mcu-baremetal
    level: Lab
    priority: P2
    language: C++
    visibility: private
    local_path: content/private/bareline
    maintainer: Charliechen114514
    publish_to_projects_md: false
    publish_to_roadmap: false
    privacy:
      redact: true
    internal_notes: "早期开发中，暂不公开"
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: false

  - name: miniwget
    repo: miniwget
    url: https://github.com/Awesome-Embedded-Learning-Studio/miniwget
    description: "轻量级 HTTP/HTTPS 下载工具，C++ 工程化教学项目"
    category: cpp-engineering
    level: Lab
    priority: P2
    language: C++
    visibility: private
    local_path: content/private/miniwget
    maintainer: Charliechen114514
    publish_to_projects_md: false
    publish_to_roadmap: false
    privacy:
      redact: true
    internal_notes: "配合 B 站视频教程，开发中"
    audit:
      enabled: true
    expected:
      has_readme: true
      has_license: true
```

### 7.4 合并策略

1. `repos.yaml` 只包含公开仓库，不含任何私有字段
2. `repos.private.local.yaml` 只包含私有仓库
3. 工具脚本读取时先加载 `repos.yaml`，再可选加载 `repos.private.local.yaml`
4. 生成 public 报告时只使用 `repos.yaml`
5. 生成 local 报告时合并两个文件，但对私有仓库标记 `privacy.redact: true` 的条目只输出摘要

### 7.5 防泄密规则

1. `repos.yaml` 绝不出现 `visibility: private` 的条目
2. 生成报告时，过滤 `privacy.redact: true` 的条目
3. 公开报告不出现私有仓库名、路径、备注
4. 工具脚本的 `--public-only` 模式跳过所有私有仓库
5. `repos.private.local.yaml` 在 `.gitignore` 中

---

## 8. content/ 本地扫描方案

### 8.1 方案评估

**是否合理？** 合理。这是轻量级的 repo manifest 管理方式，比 submodule 更灵活。

**相比 git submodule 的优势**：
- 不锁定版本，始终获取最新
- 不污染主仓库的 git 历史
- 可以选择性克隆（shallow）
- 私有仓库不会暴露在 submodule 配置中
- 维护者可以完全控制扫描范围

**风险**：
- 需要手动运行 `clone_or_update.py` 保持 content/ 更新
- 多人协作时各自 content/ 状态可能不同步
- 磁盘空间占用（23 个仓库全量克隆可能需要几百 MB）

**缓解**：shallow clone 默认开启，显著减少磁盘和带宽。

### 8.2 目录组织建议

**推荐不分 public/private 子目录**：

```
content/
├── Tutorial_AwesomeModernCPP/
├── imx-forge/
├── Tutorial_AwesomeQt/
├── bareline/          # 私有，但混在一起
├── miniwget/          # 私有，但混在一起
└── ...
```

理由：
- 分 public/private 增加了脚本复杂度
- manifest 已经标记了 `visibility`，脚本靠 manifest 判断即可
- 目录结构简单 = 更不容易出错

**但如果需要严格隔离**（比如某些工具只扫描 public）：

```
content/
├── public/
│   ├── Tutorial_AwesomeModernCPP/
│   └── ...
└── private/
    ├── bareline/
    └── ...
```

**推荐第一种（不分）**，简单优先。

### 8.3 shallow clone

**推荐默认 shallow clone**（`--depth=1`），因为：
- 大幅减少磁盘和带宽
- 审计主要看 README/LICENSE/docs，不需要完整历史
- 需要 commit 历史时可以用 `--no-shallow` 选项

### 8.4 扫描范围

第一版只扫描：
- README.md 是否存在及大小
- LICENSE 是否存在
- CONTRIBUTING.md 是否存在
- docs/ 或 documentation/ 目录是否存在
- 是否有 Quick Start 段落（简单 grep）

不扫描源码。源码审计是第二阶段的事。

### 8.5 防止 AI 读取私有内容

1. 脚本提供 `--public-only` 模式，只扫描 manifest 中 `visibility != private` 的仓库
2. 生成公开报告时，对私有仓库只输出 "存在 N 个私有仓库" 的摘要
3. 不在公开报告中输出私有仓库名、描述、路径

### 8.6 第一版应该做到什么程度

- `clone_or_update.py`：能 shallow clone + pull，支持 --dry-run
- `audit_repos.py`：检查 README/LICENSE/CONTRIBUTING，输出 JSON
- 不需要 fancy 的报告格式，JSON 中间结果 + 简单 Markdown 即可

---

## 9. reports 体系设计

### 9.1 报告列表

| 报告 | 目标读者 | 数据来源 | 公开 | 自动生成 | 允许人工编辑 | 更新频率 | Phase |
|------|----------|----------|------|----------|------------|----------|-------|
| public-overview.md | 访客/维护者 | manifest + GitHub API | ✓ | ✓ | 允许但不建议 | 每月 | 2 |
| repo-health.md | 维护者 | audit_repos.py 输出 | ✓ | ✓ | 允许但不建议 | 每月 | 2 |
| roadmap-input.md | 维护者 | audit + manifest | ✓ | ✓ | 允许 | 每月 | 3 |
| stale-repos.md | 维护者 | audit | ✓ | ✓ | 否 | 每月 | 3 |
| internal-overview.md | 维护者（local） | manifest（含私有） | **No** | ✓ | 否 | 按需 | 3 |
| private-risk.md | 维护者（local） | audit（含私有） | **No** | ✓ | 否 | 按需 | 3 |

### 9.2 repo-health.md 设计

```markdown
# 仓库健康检查

> 自动生成，最后更新：YYYY-MM-DD

## 概览

| 指标 | 值 |
|------|-----|
| 总仓库数 | 21 |
| 有 README | 20/21 |
| 有 LICENSE | 19/21 |
| 有 CONTRIBUTING | 3/21 |
| 有 Quick Start | 8/21 |

## 逐仓库状态

| 仓库 | README | LICENSE | CONTRIBUTING | Quick Start | docs | 最近提交 | Open Issues | 建议动作 |
|------|--------|---------|-------------|-------------|------|----------|-------------|----------|
| Tutorial_AwesomeModernCPP | ✓ | ✓ | — | ✓ | ✓ | 2026-05-24 | 2 | — |
| Tutorial_FreeRTOS | ✓ | ✓ | — | — | — | 2025-12-16 | 0 | 考虑补充 Quick Start 或归档 |
```

### 9.3 roadmap-input.md 设计

```markdown
# 路线图输入

> 自动生成，最后更新：YYYY-MM-DD

## 近期优先处理（P0 仓库缺口）

| 仓库 | 缺口 | 建议动作 |
|------|------|----------|
| imx-forge | 无 CONTRIBUTING | 补充贡献指南 |

## 缺失基础文档的仓库

| 仓库 | 缺失 |
|------|------|
| rk-forge | LICENSE ✓ 但 README 内容较少 |

## 长期未更新仓库（>180天）

| 仓库 | 最后提交 | 建议 |
|------|----------|------|
| Tutorial_FreeRTOS | 2025-12-16 | 评估是否继续或归档 |
| Tutorial_EmbeddedCommonTools | 2025-12-24 | 同上 |

## 适合宣传的仓库

- Tutorial_AwesomeModernCPP (82★) — 可在社区推广
- imx-forge (56★) — 已有一定影响力

## 适合征集贡献的仓库

- PenguinLab — 内容框架好，适合多人贡献实验
- BareMetal-Drivers — 驱动库天然适合社区贡献

## 建议下月任务

1. 补充 imx-forge CONTRIBUTING
2. 评估 Tutorial_FreeRTOS 归档或激活
3. ...
```

---

## 10. tools 脚本设计

### 10.1 clone_or_update.py

**输入**：manifest/repos.yaml, manifest/repos.private.local.yaml（可选）
**输出**：content/ 下的仓库克隆
**参数**：

```
--manifest PATH         manifest 文件路径（默认 manifest/repos.yaml）
--private-manifest PATH 私有 manifest 路径
--content-dir PATH      克隆目标目录（默认 content/）
--dry-run               只输出要执行的操作，不实际执行
--public-only           只克隆公开仓库
--include-private       同时克隆私有仓库
--shallow               使用 shallow clone（默认开启）
--no-shallow            完整克隆
--repo NAME             只处理指定仓库
```

**主要流程**：
1. 解析 manifest YAML
2. 如有 --include-private，合并 private manifest
3. 遍历 repos：
   a. 检查 content/{repo_name} 是否存在
   b. 不存在 → git clone（shallow 默认）
   c. 存在 → git pull --ff-only
   d. 失败 → 打印错误，继续下一个
4. 输出汇总

**错误处理**：单个仓库失败不阻塞其他仓库，最终输出失败列表。

### 10.2 audit_repos.py

**输入**：content/ 下的仓库目录
**输出**：audit-result.json（或 audit-result.local.json 含私有数据）
**参数**：

```
--manifest PATH         manifest 文件路径
--private-manifest PATH 私有 manifest 路径
--content-dir PATH      仓库目录
--public-only           只审计公开仓库
--include-private       同时审计私有仓库
--output PATH           输出文件路径
--format json|markdown  输出格式
```

**检查项**：
- README.md 是否存在 + 大小
- LICENSE 是否存在
- CONTRIBUTING.md 是否存在
- 是否有 Quick Start 段落（grep "# Quick Start" / "# 快速开始" 等）
- docs/ 或 documentation/ 目录是否存在
- examples/ 目录是否存在
- 最近 commit 日期（git log -1 --format=%ci）
- open issues / PR 数量（可选，需 GitHub API）

**private 处理**：
- `--public-only` 时跳过 visibility=private 的仓库
- 输出 JSON 中私有仓库的条目可以设 `_private: true`
- 生成 markdown 报告时，私有仓库只输出摘要行

### 10.3 generate_projects_md.py

**输入**：manifest/repos.yaml + audit-result.json
**输出**：PROJECTS.md
**参数**：

```
--manifest PATH
--audit-result PATH
--output PATH           输出 PROJECTS.md 路径
--public-only           只包含公开仓库（默认）
```

**主要流程**：
1. 加载 manifest 和 audit 结果
2. 过滤 `publish_to_projects_md: true` 的条目
3. 按 category 分组
4. 按 level（Core > Active > Lab > Paused）和 priority 排序
5. 生成 Markdown 表格

### 10.4 generate_roadmap_input.py

**输入**：manifest/repos.yaml + audit-result.json
**输出**：reports/roadmap-input.md
**参数**：

```
--manifest PATH
--audit-result PATH
--output PATH
--public-only
```

**主要流程**：
1. 找出 P0/P1 仓库中缺失文档的
2. 找出 >180 天未更新的
3. 找出适合宣传的（Stars ≥ 20）
4. 找出适合征集贡献的（有 issues enabled + Lab 级别）
5. 生成建议任务列表

---

## 11. .gitignore 与安全边界

### 11.1 推荐 .gitignore

```gitignore
# 本地仓库克隆（绝对不能提交）
content/

# 私有 manifest（绝对不能提交）
manifest/*.local.yaml
manifest/*.local.*

# 私有报告（绝对不能提交）
reports/internal-*.md
reports/private-*.md

# 审计中间结果
audit-result.local.json
audit-output.local.json
*.local.json

# Python
__pycache__/
*.py[cod]
*.pyo
.venv/
venv/
*.egg-info/

# 缓存和临时文件
.cache/
.tmp/
*.tmp

# 密钥和敏感信息
.env
secrets/
*.key
*.pem
*.secret

# Claude Code
CLAUDE.md
.claude/

# 元数据
data/
```

### 11.2 安全边界说明

| 类别 | 文件 | 绝对不提交 | 可以提交 | 自动生成但可提交 |
|------|------|-----------|----------|-----------------|
| 忽略 | content/* | ✓ | | |
| 忽略 | manifest/*.local.yaml | ✓ | | |
| 忽略 | reports/internal-*.md | ✓ | | |
| 忽略 | reports/private-*.md | ✓ | | |
| 忽略 | .env, secrets/ | ✓ | | |
| 提交 | README.md | | ✓ | |
| 提交 | ROADMAP.md | | ✓ | |
| 提交 | PROJECTS.md | | ✓ | |
| 提交 | CONTRIBUTING.md | | ✓ | |
| 提交 | manifest/repos.yaml | | ✓ | |
| 自动 | reports/public-overview.md | | | ✓ |
| 自动 | reports/repo-health.md | | | ✓ |
| 自动 | reports/roadmap-input.md | | | ✓ |

### 11.3 防止 private 信息泄露的检查清单

1. `repos.yaml` 不包含任何 `visibility: private` 的条目
2. 公开报告不出现私有仓库名
3. 公开报告的仓库总数 = 公开仓库数（不含私有）
4. `publish_to_projects_md: false` 的仓库不出现在 PROJECTS.md
5. 生成脚本有 `--public-only` 模式用于生成公开版本
6. Git hook 或 CI 可以检查是否有 private 仓库名泄露（Phase 3）

---

## 12. 分阶段执行计划

### Phase 1：结构和文档（建议 1-2 天）

**目标**：理顺信息架构，让访客在 30 秒内了解组织。

**修改文件**：
- 新增 `PROJECTS.md`
- 重构 `README.md`
- 重构 `ROADMAP.md`（从 `roadmap.md` 重命名）
- 新增 `CONTRIBUTING.md`
- 更新 `.gitignore`
- 更新 `prompt/` 目录结构（可选）

**预期收益**：
- 访客能快速找到感兴趣的项目
- 贡献者有明确的参与指南
- 维护者有清晰的项目分类

**风险**：
- 低风险，纯文档变更
- 需要确保不遗漏现有信息

**推荐 commit messages**：
1. `feat: add PROJECTS.md — project matrix for navigation`
2. `docs: restructure README.md — clear entry point for visitors`
3. `docs: upgrade ROADMAP.md from repo list to org roadmap`
4. `docs: add CONTRIBUTING.md — contribution guide`
5. `chore: update .gitignore — add content/, manifest local, reports`

### Phase 2：本地审计工作区（建议 3-5 天）

**目标**：建立 manifest 驱动的仓库管理能力。

**修改文件**：
- 新增 `manifest/repos.yaml`
- 新增 `manifest/repos.private.local.yaml`（本地）
- 新增 `tools/clone_or_update.py`
- 新增 `tools/audit_repos.py`
- 更新 `tools/README.md`
- 新增 `reports/public-overview.md`（首次生成）

**预期收益**：
- 维护者可以一键克隆/更新所有仓库
- 可以快速审计仓库健康度
- manifest 成为唯一数据源

**风险**：
- 中等风险，引入 Python 脚本
- 需要确保脚本在 Linux/macOS/WSL 下都能运行
- 需要确保不会泄露私有仓库信息

**推荐 commit messages**：
1. `feat: add manifest/repos.yaml — structured repo metadata`
2. `feat: add tools/clone_or_update.py — clone/update repos from manifest`
3. `feat: add tools/audit_repos.py — repo health check`
4. `docs: update tools/README.md — usage guide`
5. `chore: add reports/public-overview.md — auto-generated repo overview`

### Phase 3：报告生成（建议 2-3 天）

**目标**：自动生成 PROJECTS.md 和 ROADMAP 输入。

**修改文件**：
- 新增 `tools/generate_projects_md.py`
- 新增 `tools/generate_roadmap_input.py`
- 新增 `reports/roadmap-input.md`
- 新增 `reports/repo-health.md`

**预期收益**：
- PROJECTS.md 可以从 manifest 自动生成
- 路线图有数据驱动的输入
- 维护决策不再凭记忆

**风险**：
- 低风险，生成脚本只读不改

**推荐 commit messages**：
1. `feat: add tools/generate_projects_md.py — auto-generate project matrix`
2. `feat: add tools/generate_roadmap_input.py — data-driven roadmap input`
3. `chore: regenerate PROJECTS.md and reports/`

### Phase 4：长期维护（持续）

**目标**：建立可持续的维护节奏。

**包含**：
- 每月更新 manifest 和报告
- Discussion 征集社区意见
- 给适合新人的仓库打 `good first issue` 标签
- 月度/季度路线图更新
- 贡献者鸣谢（在 README 或 MAINTAINERS.md 中）

---

## 13. 第一阶段最小可行改造

如果时间有限，Phase 1 可以进一步拆分为**最小可行改造**（半天完成）：

1. **新增 PROJECTS.md**：把 roadmap.md 中的仓库表格复制过来，按分类整理
2. **重构 README.md**：
   - 替换顶部为新的定位语
   - 添加"我该从哪里开始"表格
   - 添加四条主航道简介
   - 精简现有内容
3. **更新 .gitignore**：添加 content/, manifest local, reports local
4. **重命名 roadmap.md → ROADMAP.md**：统一文件名风格

这 4 步可以一步完成，用一个 commit：
`docs: phase 1 restructure — PROJECTS.md, README, ROADMAP`

---

## 14. 需要我人工确认的问题

1. **仓库分级是否同意？** 特别是 Core（3个）/ Active（9个）/ Lab（4个）/ Paused（2个）的划分

我不太建议按照这种方式分级，可以按照方向分级，活跃度分级的维护方式会很累。。。

2. **Paused 的两个仓库**（Tutorial_EmbeddedCommonTools、Tutorial_FreeRTOS）是否考虑激活还是归档？

马上就会重启，我现在已经在制定Roadmap和考虑放入部分文章和设计实验了。请写：正在规划激活中

3. **miniwget 和 bareline** 两个私有仓库的公开策略——是否有计划公开？当前在 roadmap.md 中已经以公开形式列出了

公开列出，但是标注敬请期待。然后您可以考虑读取下desp来知晓他在做什么

4. **CONTRIBUTING.md 的贡献流程**——是否需要 CLA（贡献者许可协议）？建议不需要

赞同

5. **ProjectLists.todo/** 目录是保留还是迁移到 ROADMAP？

合并，降低维护成本，或者咱们也可以ROADMAP轻量，引导不同的人关心不同的项目进入更加具体项目

6. **tools/ 下的 PowerShell 脚本**是保留还是逐步迁移为 Python？

还真考虑，这个咱们放到下一个阶段哈

7. **"四条主航道"的提法是否准确？** 是否需要调整？

8. **Reports 是否需要中文？** 建议中文为主，方便阅读（赞同）
9.  **MAINTAINERS.md 是否在 Phase 1 就做？** 建议是的，内容很少

我没意见！

10. 额外！

咱们Awesome-Embedded居然没有homepage!有点可惜，咱们要不要phase1加上，咱们把Roadmap等统一收敛到一个document文件夹，然后仿照其他成熟项目（imx-forge）构建一个文档站？我觉得这个很紧急！


---

## 15. 不建议现在做的事情

1. **CI 集成**：组织规模还小，本地脚本足够。等 Phase 4 再考虑 GitHub Actions 自动运行审计。
2. **categories.yaml**：Phase 1/2 直接在 repos.yaml 里硬编码 category 字符串即可，不需要单独的分类定义文件。
3. **GOVERNANCE.md**：两个维护者的组织不需要治理文档，太重了。
4. **自动发布 GitHub Pages**：各仓库已有自己的 Pages 部署，中心仓库不需要。
5. **仓库自动归档**：归档是不可逆操作，应该人工判断。
6. **复杂的权限控制**：manifest 的权限管理不需要，两个文件（public/private）足够。
7. **国际化（i18n）**：当前受众以中文为主，不需要多语言支持。
8. **统一 CODEOWNERS**：组织太小，不需要。
9. **报告邮件/通知**：本地运行即可，不需要自动化通知。
10. **micro-forge 在 roadmap.md 中的活跃度标注为"🔴 暂无提交"**——实际上它有提交，这可能是数据扫描时间的问题。建议人工确认。
