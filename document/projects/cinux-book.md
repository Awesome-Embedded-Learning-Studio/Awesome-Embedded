---
title: "Cinux-Book"
---

## 简介

Cinux 的手把手教学版：一份从零开始写 x86_64 操作系统的中文教程，用现代 C++17 实现，从 MBR / Bootloader 一路讲到 GUI 桌面环境。

它的定位是稳定、连贯的教学参考实现：按 Cinux 的稳定版本或 SHA 重放能力，代码经过阶段性排查与验证，保证读者能跟着教程一步步走完整条操作系统开发链路。配套在线教程站，Ubuntu 24.04 默认编译器即可构建。

## 它和 Cinux 的关系

Cinux 这条线在组织里分成两个仓库，分工明确：

| 仓库 | 角色 | 特性节奏 |
|------|------|----------|
| [Cinux](/projects/cinux) | 前沿实验版 | 持续活跃开发，冲刺更激进的特性 |
| **Cinux-Book**（本仓库） | 稳定教学版 | 保证教程连贯、代码可复现 |

想跟教程从零造一个 OS，看 Cinux-Book；想看更前沿的特性探索，看 Cinux。两者共享同一套 x86_64 内核设计，只是稳定性与教学性取舍不同；能力细节、前置知识与构建入口见 [Cinux](/projects/cinux) 页面与两仓 README。

## 你将学到什么

教程按十个阶段层层递进，完成整条链路：

| 阶段 | 内容 | 关键技术 |
|:---:|------|---------|
| Phase 1 | Bootloader | 实模式 → 保护模式 → 长模式、ELF 加载、VESA 图形、E820 内存探测 |
| Phase 2 | 小内核（Bootstrap） | 串口 / kprintf、PMM、IDT / 异常处理、ATA PIO 磁盘、ELF 加载 |
| Phase 3 | 大内核基础设施 | GDT / IDT / 256 向量中断、PIC 重映射、PIT 时钟 |
| Phase 4 | 驱动三件套 | VGA Framebuffer + PSF2 字体、PS/2 键盘、串口完善 |
| Phase 5 | 内存管理 | PMM bitmap、VMM 4 级页表、内核堆（first-fit + coalesce）、独立地址空间 |
| Phase 6 | 进程与调度 | context_switch、Round-Robin 调度器、Spinlock / Mutex / Semaphore |
| Phase 7 | 用户态与系统调用 | Ring 3 切换、syscall / sysret、用户态 Shell |
| Phase 8 | 文件系统 | AHCI SATA、VFS 抽象、Ext2 读写 + 目录操作、ramdisk |
| Phase 9 | GUI 桌面环境 | Canvas 双缓冲、窗口管理器、PS/2 鼠标、拖动 / Z-order、桌面图标 |
| Phase 10 | 多进程与高级特性 | fork / execve / CoW / waitpid、Pipe IPC、多终端并发 |

## 与 AELS 的关系

属于教学线「系统与硬件基础」分组，是[学习地图](/roadmap/)第四支柱「Cinux：产品与教学重放」的教学入口。它与 [CFBox](/projects/cfbox)（Unix 工具与 userspace）、[PenguinLab](/projects/penguin-lab)（真实 Linux 内核实验）互为参照。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Book)
- [在线教程站](https://awesome-embedded-learning-studio.github.io/Cinux-Book/)
