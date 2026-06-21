---
title: "Cinux-Book"
---

## 简介

**Cinux-Book** 是 [Cinux](/projects/cinux) 的**手把手教学版**——一份从零开始写 x86_64 操作系统的中文教程，用现代 C++17 实现，从 MBR / Bootloader 一路讲到 GUI 桌面环境，全链路打通。

它的定位是**稳定、连贯的教学参考实现**：代码经过阶段性的排查与验证，保证读者能跟着教程一步步走完整个操作系统开发链路。配套有在线文档站（见下方链接），Ubuntu 24.04 默认编译器即可构建，无需额外安装 GCC。

## 它和 Cinux 的关系

Cinux 这条线在组织里分成两个仓库，分工明确：

| 仓库 | 角色 | 特性节奏 |
|------|------|----------|
| [Cinux](/projects/cinux) | 前沿实验版 | 持续活跃开发，冲刺更激进的特性（计划做到浏览器、跑应用等大里程碑） |
| **Cinux-Book**（本仓库） | 稳定教学版 | 保证教程连贯、代码可复现，作为操作系统爱好者的参考实现 |

简单说：**想跟教程从零造一个 OS，看 Cinux-Book；想看更前沿的特性探索，看 Cinux。** 两者共享同一套 x86_64 内核设计（Bootloader → 内核 → 用户态 → GUI），只是稳定性与教学性取舍不同。

## 你将学到什么

教程按 **10 个阶段**层层递进，完成整条链路：

| 阶段 | 内容 | 关键技术 |
|:---:|------|---------|
| Phase 1 | Bootloader | 实模式 → 保护模式 → 长模式、ELF 加载、VESA 图形、E820 内存探测 |
| Phase 2 | 小内核（Bootstrap） | 串口 / kprintf、PMM、IDT / 异常处理、ATA PIO 磁盘、ELF 加载 |
| Phase 3 | 大内核基础设施 | GDT / IDT / 256 向量中断、PIC 重映射、PIT 时钟 |
| Phase 4 | 驱动三件套 | VGA Framebuffer + PSF2 字体、PS/2 键盘、串口完善 |
| Phase 5 | 内存管理 | PMM bitmap、VMM 4 级页表、内核堆（first-fit + coalesce）、独立地址空间 |
| Phase 6 | 进程与调度 | context_switch、Round-Robin 调度器、Spinlock / Mutex / Semaphore |
| Phase 7 | 用户态与系统调用 | Ring 3 切换、syscall / sysret、22 个系统调用、用户态 Shell |
| Phase 8 | 文件系统 | AHCI SATA、VFS 抽象、Ext2 读写 + 目录操作 + stat、ramdisk |
| Phase 9 | GUI 桌面环境 | Canvas 双缓冲、窗口管理器、PS/2 鼠标、拖动 / Z-order、桌面图标 |
| Phase 10 | 多进程与高级特性 | fork / execve / CoW / waitpid、Pipe IPC、多终端并发 |

## 核心特性

- **完整 x86_64 内核链路**：Bootloader → Mini Kernel → Big Kernel → User Space → GUI 桌面
- **Ext2 文件系统读写**：VFS 抽象层 + AHCI SATA 驱动，支持 touch / mkdir / rm / cat / ls / cd / stat
- **GUI 桌面环境**：Canvas 双缓冲 + 窗口管理器 + PS/2 鼠标，支持拖动 / Z-order / 桌面图标
- **多进程与多终端**：fork / execve / CoW 页表复制 + Pipe IPC，每个终端绑定独立 shell 进程
- **Ring 3 用户态 Shell**：22 个系统调用，内置 echo / help / clear / ls / cat / cd / pwd / stat / mkdir / rm / touch
- **测试驱动开发**：自研轻量测试框架，Host 端 mock 测试 + QEMU 内核测试双轨并行
- **现代 C++17 实现**：`constexpr` 编译期生成 GDT/IDT、RAII 锁管理、`enum class` 驱动接口

## 前置知识

- 扎实的 C++ 基础（C++17 特性）
- 操作系统原理（进程 / 内存 / 文件系统 / 中断）
- x86_64 汇编与体系结构基础
- QEMU 与 CMake 构建工具链

## 快速开始

仓库 README 提供 CMake 一键构建与 QEMU 运行，支持 GUI / CLI 两种模式，以及 GDB 和 VSCode 调试入口。Ubuntu 24.04 默认工具链即可上手。

## 与 AELS 的关系

Cinux-Book 属于 **Linux / System Programming** 主线，是「造一个操作系统」的核心教学载体。它与 [Cinux](/projects/cinux)（前沿实验版）、[Cinux-Base](/projects/cinux-base)（Cinux 的 freestanding 基础类型库）同属 Cinux 家族，并与 [CFBox](/projects/cfbox)（Unix 工具 + userspace）、[PenguinLab](/projects/penguin-lab)（内核 / 调试实验）互为补充。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Book)
- [在线教程站](https://awesome-embedded-learning-studio.github.io/Cinux-Book/)
