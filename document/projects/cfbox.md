---
title: "CFBox"
---

## 简介

用 C++23 重新实现的 BusyBox 替代品——单个可执行文件通过符号链接分发 123 个 Unix 工具小程序。当前体积优化构建约 418 KB，体现了现代 C++ 在体积控制上的能力。

当前共有 399 项测试，包含手写 DEFLATE 压缩实现，覆盖文本处理、文件操作、压缩归档、Shell 脚本辅助、系统信息和进程管理；项目也已经在 i.MX6ULL 真板上作为 PID 1 运行。

## 核心特性

- 123 个 Unix 工具小程序
- 约 418 KB 的体积优化构建
- 399 项测试
- 手写 DEFLATE 压缩算法
- CMake 可配置构建
- GNU 风格长选项 + 彩色帮助输出
- QEMU 测试与 i.MX6ULL PID 1 真板验证

## 前置知识

- 深入的 C++23 知识
- Unix/Linux 系统编程
- 理解 BusyBox 的工作原理

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/CFBox)
