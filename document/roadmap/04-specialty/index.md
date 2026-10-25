---
title: "Cinux：产品与教学重放"
---

# Cinux：产品与教学重放

我们对 Cinux 方向只保留两个对外角色：前沿产品代码与稳定教学重放。你可以从 C/C++、汇编、体系结构和操作系统基础直接进入，MCU 或嵌入式 Linux 路线不是前置条件。

## Cinux：继续探索前沿代码

[Cinux](/projects/cinux) 用现代 C++17 探索 x86_64 操作系统，从启动、内存、中断和调度一路走进用户态、文件系统与 GUI。我们拿它快速验证新的设计和系统能力，不要求每次变更都同步展开成教学章节。

freestanding（不依赖宿主标准库、裸环境可用的实现）基础类型与容器，我们当作 Cinux 的内部代码来维护。GUI 框架线由 visor 承接（跨宿主，Cinux 是宿主之一），桌面线由 vesper 承接，两仓尚未公开，公开后我们会在本页补上入口。

## Cinux-Book：稳定教学重放

我们不要求 [Cinux-Book](/projects/cinux-book) 追逐 Cinux 的每次前沿变化，它教的是已经稳定的能力切片：

- 固定可复现的版本或 SHA。
- 说明所需的 C++、汇编和体系结构知识。
- 给出最小代码映射、构建测试命令和预期结果。
- 记录当前限制，以及升级到新切片时需要处理的变化。

这样我们既能让产品继续前进，又能让教程保持连续、清晰和可验证。

## 与其他系统仓库的关系

- [PenguinLab](/projects/penguin-lab) 观察真实 Linux 内核和通用系统机制，Cinux 从零实现一个可运行的实验操作系统。
- [CFBox](/projects/cfbox) 研究 Linux userspace 与 Unix 工具，Cinux 同时面对内核 ABI 与自己的用户态。
- [Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp) 提供现代 C++ 深度。

这些仓库互相提供知识和工程参照，我们不把它们合并成一条强制顺序。
