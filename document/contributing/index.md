---
title: "贡献指南"
---

感谢你对 Awesome-Embedded-Learning-Studio 的关注！这里介绍如何参与贡献。

## 快速开始

我们欢迎所有形式的贡献，不需要你是大神：

- **报告问题**：在对应仓库开 Issue
- **修复 Bug**：Fork → 修 → PR，我们会在 48 小时内 review
- **写教程/文档**：使用下面的模板快速起步
- **提出想法**：到 [Discussions](https://github.com/Awesome-Embedded-Learning-Studio/community/discussions) 发帖讨论
- **做小玩具**：用我们的项目模板快速起步

## 项目模板

我们提供了两类仓库模板，帮助快速创建新项目：

### 项目模板

适用于嵌入式小产品项目，包含以下目录结构：

```
├── software_codes/    # 固件/软件代码
├── documents/         # 项目文档
├── hardware_asset/    # 硬件相关（PCB 设计等）
├── tutorial/          # 教程文档
└── README.md
```

### 教程模板

适用于教程仓库，包含以下目录结构：

```
├── codes_and_assets/  # 示例代码和资源
├── tutorial/          # 教程文档
└── README.md
```

模板位于本仓库的 [repo-template/](https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded/tree/main/repo-template) 目录，也可以使用 `tools/create-project.ps1` 或 `tools/create-tutorial.ps1` 脚本自动生成。

## Issue 规范

### 报告 Bug

1. 在对应仓库点击 Issues → New Issue
2. 标题格式：`[Bug] 简短描述`
3. 内容包含：
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息（开发板、工具链版本等）

### 功能建议

1. 标题格式：`[Feature] 简短描述`
2. 说明想要的功能和使用场景

## PR 规范

1. Fork 目标仓库
2. 创建功能分支（`feat/xxx` 或 `fix/xxx`）
3. 提交 PR，描述改动内容和动机
4. 等待 review

### Commit Message 风格

```
type(scope): description

- type: feat / fix / docs / refactor / chore
- scope: 可选，影响的模块
- description: 简短中文或英文描述
```

示例：
```
feat(driver): add SPI DMA transfer support
docs(tutorial): update getting-started guide
fix(build): fix CMake cross-compile config
```

## 代码风格

- C 项目：遵循 Linux 内核风格（大致）
- C++ 项目：Modern C++ 风格，CMake 构建
- Shell 脚本：ShellCheck 通过

## 许可

所有贡献遵循 MIT 许可。提交 PR 即表示同意你的代码以 MIT 许可发布。
