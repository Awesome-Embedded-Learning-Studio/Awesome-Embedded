# Meta Check Prompt

> 这个脚本是笔者开源的，扫描自己仓库现状的脚本，如果您Fork了本仓库，并且也想扫描组织现状，可以直接使用这个脚本

你现在要作为一个开源组织治理顾问、技术仓库审计助手，帮我从零分析 GitHub 组织：

https://github.com/Awesome-Embedded-Learning-Studio

以及核心入口仓库：

https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded

请不要先假设我的判断一定正确。你需要基于组织和仓库的实际信息，独立完成一次观察、审计、归纳和建议。

我的背景：
我正在维护一个面向嵌入式学习与工程实践的 GitHub 组织，方向包括但不限于：

- 现代 C++
- Qt / GUI / 桌面系统
- Embedded Linux
- BSP / Board Support Package
- STM32 / MCU
- FreeRTOS
- 裸机驱动
- 工具链
- 小产品项目
- 教程文档
- 实验性工程仓库

我现在希望判断：

1. 这个组织当前整体状态如何；
2. Awesome-Embedded 这个核心仓库是否适合作为组织入口；
3. 是否有必要将 Awesome-Embedded 改造成：
   - 组织入口；
   - 项目矩阵；
   - ROADMAP；
   - 仓库治理中心；
   - manifest 驱动的审计中心；
4. 如何设计 public/private 混合仓库的审计机制；
5. 是否应该使用 content/ 本地克隆目录 + manifest/repos.yaml + tools 脚本 + reports 报告，而不是全量 git submodule。

请你按下面步骤执行。

---

## 第一部分：读取组织元信息

请先读取 GitHub 组织 Awesome-Embedded-Learning-Studio 的公开信息，包括：

1. 组织 README / profile；
2. 组织下公开仓库列表；
3. 每个公开仓库的：
   - 仓库名；
   - 简介；
   - star 数；
   - fork 数；
   - language；
   - 最近更新时间；
   - 是否 archived；
   - 是否有 README；
   - 是否有 license；
   - 是否有 issue / PR 活跃迹象；
   - 是否适合放入核心路线图。

如果无法通过联网读取，请提醒我提供：
- `gh repo list` 输出；
- `gh api orgs/Awesome-Embedded-Learning-Studio/repos` 输出；
- 或者本地 clone 后的目录结构。

---

## 第二部分：读取 Awesome-Embedded 仓库

请重点分析：

https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded

读取并判断：

1. README.md 当前承担什么角色；
2. ROADMAP.md 是否已经存在，结构如何；
3. 是否已经有 repo-template、tools、drafts、scripts、docs 等目录；
4. 当前仓库更像：
   - 项目清单；
   - 组织入口；
   - Roadmap；
   - 审计中心；
   - 还是混合状态；
5. 当前结构是否清晰；
6. 对新访客是否友好；
7. 对贡献者是否友好；
8. 对维护者审计是否友好。

---

## 第三部分：对组织项目进行分类

请不要简单按仓库名排序，而是按“组织发展价值”分类。

建议尝试分成以下几类：

### 1. Core / 核心仓库

判断标准：
- 代表组织主要方向；
- star / 关注度较高；
- 内容较完整；
- 适合长期维护；
- 适合作为门面项目；
- 未来应该重点打磨。

### 2. Active / 活跃成长仓库

判断标准：
- 有潜力；
- 方向明确；
- 但还未完全成熟；
- 可以继续推进；
- 适合放入 Roadmap。

### 3. Lab / 实验仓库

判断标准：
- 偏探索；
- 规模较小；
- 不一定稳定；
- 可以公开，但不要作为主门面。

### 4. Archive Candidate / 可考虑归档或降级仓库

判断标准：
- 长期不更新；
- 定位不清；
- 和组织主线关系弱；
- README 不完整；
- 暂时不适合作为 Roadmap 重点。

请给出一个项目矩阵，例如：

| Repository | Category | Level | Status | Why | Suggested Action |
|---|---|---|---|---|---|

---

## 第四部分：判断组织主航道

请基于实际仓库情况，判断组织是否适合收束成几条主航道。

我目前倾向于四条：

1. C++ 工程化；
2. Embedded Linux；
3. MCU / 裸机 / FreeRTOS；
4. Qt / GUI / 产品化。

请你独立判断：

1. 这四条是否合理；
2. 是否应该合并或拆分；
3. 是否有仓库无法归入这些路线；
4. 哪条路线目前最成熟；
5. 哪条路线最需要补文档；
6. 哪条路线最适合近期宣传；
7. 哪条路线最适合吸引贡献者。

---

## 第五部分：判断 Awesome-Embedded 的目标定位

请判断 Awesome-Embedded 最适合成为哪种仓库：

1. Awesome List；
2. 组织官网入口；
3. Roadmap 仓库；
4. 项目治理仓库；
5. 审计中心；
6. 上述几种的组合。

请给出你的推荐定位，并说明理由。

我倾向的方向是：

> Awesome-Embedded 不直接保存各项目代码，而是保存组织的 README、ROADMAP、PROJECTS、CONTRIBUTING、manifest、tools 和 reports。真实仓库代码克隆到本地 content/，由脚本或 AI 根据 manifest 扫描，生成项目状态、路线图输入和维护建议。

请你判断这个方向是否合理，并指出风险。

---

## 第六部分：判断是否使用 submodule

请专门分析：

是否应该使用 git submodule 管理组织下所有仓库？

请从以下角度判断：

1. public/private 混合仓库是否适合 submodule；
2. submodule 是否适合组织审计；
3. submodule 是否适合统计 star / issue / PR；
4. submodule 是否适合固定快照；
5. submodule 对新贡献者是否友好；
6. submodule 是否会增加维护成本。

请给出明确建议：

- 全量 submodule？
- 少量核心仓库 submodule？
- 完全不用 submodule？
- manifest + local clone 替代？
- GitHub API + manifest 替代？

---

## 第七部分：设计 manifest + content 审计方案

请评估并完善下面这个方案：

仓库结构设想：

Awesome-Embedded/
├── README.md
├── ROADMAP.md
├── PROJECTS.md
├── CONTRIBUTING.md
├── GOVERNANCE.md
├── MAINTAINERS.md
├── manifest/
│   ├── repos.yaml
│   ├── categories.yaml
│   └── audit-rules.yaml
├── reports/
│   ├── public-overview.md
│   ├── repo-health.md
│   ├── roadmap-input.md
│   └── stale-repos.md
├── tools/
│   ├── clone_or_update.py
│   ├── audit_repos.py
│   ├── generate_projects_md.py
│   └── generate_roadmap_input.py
├── content/
│   └── 本地克隆的仓库，不提交
└── .gitignore

请判断：

1. 这个结构是否合理；
2. 是否过度设计；
3. 哪些文件第一阶段必须有；
4. 哪些文件可以后置；
5. content/ 是否应该被 .gitignore；
6. reports/internal-*.md 是否应该被 .gitignore；
7. private manifest 是否应该独立为 repos.private.local.yaml；
8. public report 和 internal report 应如何分离。

---

## 第八部分：设计 manifest 字段

请设计 manifest/repos.yaml 字段结构。

至少包含：

- name
- repo
- url
- local_path
- visibility
- category
- level
- status
- priority
- audience
- description
- maintainer
- audit.enabled
- audit.scan_readme
- audit.scan_docs
- audit.scan_commits
- expected.has_readme
- expected.has_license
- expected.has_contributing
- expected.has_roadmap
- expected.has_quickstart
- notes

请额外考虑是否需要：

- homepage
- topics
- language
- board
- chip
- framework
- toolchain
- publish_to_projects_md
- publish_to_roadmap
- public_summary
- internal_notes
- privacy.redact
- lifecycle
- last_reviewed_at

请给出一个推荐 YAML 示例。

---

## 第九部分：设计审计指标

请设计仓库健康度检查指标。

至少考虑：

### 文档完整性

- README 是否存在；
- README 是否有 Quick Start；
- 是否有目录；
- 是否有项目定位；
- 是否有适合新人的入口；
- 是否有贡献说明；
- 是否有 LICENSE；
- 是否有 ROADMAP；
- 是否有 examples；
- 是否有 docs；
- 是否有截图或演示。

### 活跃度

- 最近 commit 时间；
- 最近 issue 时间；
- 最近 PR 时间；
- contributors 数量；
- open issue 数；
- open PR 数。

### 组织治理

- 是否有明确 status；
- 是否有 owner / maintainer；
- 是否有 label；
- 是否有 good first issue；
- 是否有 help wanted；
- 是否有 release；
- 是否有 milestone。

### 风险

- 是否长期未更新；
- 是否 README 过旧；
- 是否缺少 license；
- 是否和组织主线关系弱；
- 是否存在 private 信息泄露风险。

请给出 health score 的一种简单计算方式，最好不要太复杂。

---

## 第十部分：生成改造建议

请最终输出一份建议，至少包括：

1. 当前组织状态判断；
2. 当前 Awesome-Embedded 仓库定位判断；
3. 是否值得认真经营；
4. 是否应该做 ROADMAP；
5. 是否应该做 PROJECTS.md；
6. 是否应该做 CONTRIBUTING.md；
7. 是否应该做 manifest；
8. 是否应该使用 content/ 本地克隆；
9. 是否应该使用 submodule；
10. 第一阶段最小可行改造方案；
11. 第二阶段增强方案；
12. 长期维护建议。

---

## 第十一部分：输出格式要求

请最终按照这个结构输出：

# Awesome-Embedded-Learning-Studio 组织审计报告

## 1. 总体判断

## 2. 组织当前项目地图

## 3. 核心仓库候选

## 4. 四条主航道判断

## 5. Awesome-Embedded 仓库定位建议

## 6. submodule vs manifest + content 判断

## 7. 推荐目录结构

## 8. manifest/repos.yaml 推荐设计

## 9. 审计指标与报告设计

## 10. 第一阶段改造计划

## 11. 后续 Roadmap 建议

## 12. 风险与注意事项

---

## 重要要求

1. 请基于实际仓库信息判断，不要只复述我的设想。
2. 如果你无法访问 GitHub，请明确告诉我需要哪些命令输出。
3. 如果某些仓库信息不足，请标记为“需要进一步确认”。
4. 不要把所有项目都强行放进核心路线。
5. 不要建议过度工程化。
6. 优先保证结构可维护。
7. private 仓库相关内容必须脱敏。
8. public 报告不能泄露 private repo 名称、路径、业务细节。
9. 建议风格专业，但不要公司化太重。
10. 保留组织当前偏学习、开源、轻量、好玩的气质。