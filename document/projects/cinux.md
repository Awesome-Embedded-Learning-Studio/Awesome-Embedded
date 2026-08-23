---
title: "Cinux"
---

## 简介

x86_64 操作系统实验产品，用现代 C++17 从 Bootloader 一路实现到 GUI 桌面：内核、用户态、文件系统与图形栈全链路自研。它不是生产级操作系统，而是持续探索前沿操作系统能力的实验载体——内核、用户态、freestanding 基础组件与 GUI 代码统一收拢在本仓库维护。

已有 Host / QEMU 测试、版本发布与可运行系统能力；系统调用、文件系统等能力清单以仓库 README 与发布说明为准。

## 前置知识

- 扎实的 C++ 基础（C++17 特性）
- 操作系统原理（进程 / 内存 / 文件系统 / 中断）
- x86_64 汇编与体系结构基础
- QEMU 与 CMake 构建工具链

## 与 AELS 的关系

属于产品线「系统产品」分组，是[学习地图](/roadmap/)第四支柱的产品侧：稳定能力交给 [Cinux-Book](/projects/cinux-book) 教学重放。与 [CFBox](/projects/cfbox)（Unix 工具 + userspace）、[PenguinLab](/projects/penguin-lab)（内核 / 调试实验）互为补充——本仓是「造一个操作系统」，后两者是「在操作系统之上写系统软件」。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Cinux)
- [Cinux-Book（教学版）](/projects/cinux-book)
