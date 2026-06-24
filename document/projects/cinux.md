---
title: "Cinux"
---

## 简介

Cinux 是 Awesome-Embedded-Learning-Studio 旗下的 **x86_64 操作系统实验项目**，采用现代 C++17 实现——从 Bootloader 到 GUI 桌面环境全链路打通。它不是生产级操作系统，而是一个用于探索内核、用户态、文件系统与图形栈的硬核学习载体，目标是“用 C/C++ 重新走一遍 Linux 的核心路径”。

迁移自 [Charliechen114514/Cinux](https://github.com/Charliechen114514/Cinux) 教程项目。

## 核心特性

- **完整 x86_64 内核链路**：Bootloader → Mini Kernel → Big Kernel → User Space → GUI 桌面
- **Ext2 文件系统读写**：VFS 抽象层 + AHCI SATA 驱动，支持 touch / mkdir / rm / cat / ls / cd / stat
- **GUI 桌面环境**：Canvas 双缓冲 + 窗口管理器 + PS/2 鼠标驱动，支持拖动 / Z-order / 桌面图标
- **多进程与多终端**：fork / execve / CoW 页表复制 + Pipe IPC，每个终端绑定独立 shell 进程
- **Ring 3 用户态 Shell**：22 个系统调用，内置 echo / help / clear / ls / cat / cd / pwd / stat / mkdir / rm / touch
- **测试驱动**：自研轻量测试框架，Host 端 mock 测试 + QEMU 内核测试双轨并行（约 660 项）
- **现代 C++17**：`constexpr` 编译期生成 GDT/IDT、RAII 锁管理、`enum class` 驱动接口

## 前置知识

- 扎实的 C++ 基础（C++17 特性）
- 操作系统原理（进程 / 内存 / 文件系统 / 中断）
- x86_64 汇编与体系结构基础
- QEMU 与 CMake 构建工具链

## 快速开始

仓库 README 提供 CMake 一键构建与 QEMU 运行，支持 GUI / CLI 两种模式，以及 GDB 和 VSCode 调试入口。

## 与 AELS 的关系

Cinux 属于 **Linux / System Programming** 主线，与 [CFBox](/projects/cfbox)（Unix 工具 + userspace）、[PenguinLab](/projects/penguin-lab)（内核 / 调试实验）互为补充：前者是“造一个操作系统”，后两者是“在操作系统之上写系统软件”。

## Cinux 家族

Cinux 在组织里是一个四件套，各有分工：

- **[Cinux](/projects/cinux)**（本仓库）— 前沿实验版，持续冲刺更激进的特性
- **[Cinux-Book](/projects/cinux-book)** — 稳定教学版，手把手从零写 x86_64 OS 的中文教程
- **[Cinux-Base](/projects/cinux-base)** — 零 OS 耦合的 freestanding 基础类型库，是 Cinux 内核的地基
- **[Cinux-GUI](/projects/cinux-gui)** — host-neutral GUI 核心，宿主差异收敛到一张函数指针表，今天驱动 Cinux 内核

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Cinux)
- [Cinux-Book（教学版）](/projects/cinux-book)
- [Cinux-Base（基础库）](/projects/cinux-base)
- [Cinux-GUI（GUI 核心）](/projects/cinux-gui)
