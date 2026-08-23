---
title: "QuarkWidgets"
---

## 简介

组织共享的 Qt6 / Material Design 3 组件库：用分层管线（数学工具 → 主题引擎 → 动画引擎 → Material 行为 → widget 适配）组织 UI，提供覆盖常见交互的 MD3 控件集，全部收在 `qw::` 命名空间下，配套完整 GoogleTest 测试套件。

依赖 [aex](/projects/aex) 作为 C++ 基座：独立构建时自动拉取，被 superproject 消费时复用宿主已提供的 aex，不重复 fetch。C++23 · CMake · Qt 6.8.x；控件数量与测试规模以仓库为准。

## 与 AELS 的关系

属于产品线「组件与库」分组，是组织 Qt 项目的 UI 基座：[CFDesktop](/projects/cfdesktop) 直接构筑其上，[CFDeskit](/projects/cfdeskit) 应用集消费它。教学线（如 [Tutorial_AwesomeQt](/projects/tutorial-awesome-qt)）可选取稳定组件做工程交接案例。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/QuarkWidgets)
