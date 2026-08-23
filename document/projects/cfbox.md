---
title: "CFBox"
---

## 简介

用 C++23 实现的 Unix 工具集：单个可执行文件通过符号链接分发 applet，覆盖文本处理、文件操作、压缩归档、Shell 脚本辅助、系统信息与进程管理，包含手写 DEFLATE 压缩实现。

作为 Linux userspace 高阶工程，它研究 POSIX 行为、差分测试、rootfs、PID 1 与板端交付；已有系统测试，并在 i.MX6ULL 真板上作为 PID 1 运行。applet 数量、体积与测试规模持续变化，以仓库 README 与 CI 为准。

## 前置知识

- 深入的 C++23 知识
- Unix / Linux 系统编程
- 理解 BusyBox 的工作方式

## 与 AELS 的关系

属于教学线「嵌入式 Linux 实践」分组的高阶工程：通过 [imx-forge](/projects/imx-forge) 完成板端验证，可作为从学习路线走向 Linux userspace 工程的交接案例。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/CFBox)
