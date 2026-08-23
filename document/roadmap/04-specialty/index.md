---
title: "Cinux：产品与教学重放"
---

# Cinux：产品与教学重放

Cinux 方向只保留两个对外角色：前沿产品代码与稳定教学重放。它可以从 C/C++、汇编、体系结构和操作系统基础直接进入，不要求先完成 MCU 或嵌入式 Linux 路线。

## Cinux：继续探索前沿代码

[Cinux](/projects/cinux) 使用现代 C++17 探索 x86_64 操作系统，从启动、内存、中断和调度进入用户态、文件系统与 GUI。它可以快速验证新的设计和系统能力，不要求每次变更都同步展开成教学章节。

freestanding 基础类型、容器与 GUI 核心作为 Cinux 内部代码维护，减少跨仓库同步、版本对齐和重复测试压力。

## Cinux-Book：稳定教学重放

[Cinux-Book](/projects/cinux-book) 不追逐 Cinux 的每次前沿变化，而是选择已经稳定的能力切片进行教学：

- 固定可复现的版本或 SHA；
- 说明所需的 C++、汇编和体系结构知识；
- 给出最小代码映射、构建测试命令和预期结果；
- 记录当前限制，以及升级到新切片时需要处理的变化。

这让产品可以继续前进，教程仍能保持连续、清晰和可验证。

## 与其他系统仓库的关系

- [PenguinLab](/projects/penguin-lab) 观察真实 Linux 内核和通用系统机制；Cinux 从零实现一个可运行的实验操作系统。
- [CFBox](/projects/cfbox) 研究 Linux userspace 与 Unix 工具；Cinux 同时面对内核 ABI 与自己的用户态。
- [Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp) 提供现代 C++ 深度；未来 ASM 内容补充多架构汇编与 C ABI 能力。

这些仓库互相提供知识和工程参照，不合并成一条强制顺序。
