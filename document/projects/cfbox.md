---
title: "CFBox"
---

## 简介

用 C++23 重新实现的 BusyBox 替代品——单个可执行文件通过符号链接分发 109 个 Unix 工具小程序。最终产物仅 446KB，体现了现代 C++ 在极致体积控制上的能力。

包含 331 个单元测试和 54 个集成测试，手写 DEFLATE 压缩实现，覆盖文本处理、文件操作、压缩归档、Shell 脚本辅助、系统信息和进程管理。

## 核心特性

- 109 个 Unix 工具小程序
- 446KB 极致体积
- 331 个 GTest 单元测试 + 54 个集成测试
- 手写 DEFLATE 压缩算法
- CMake 可配置构建
- GNU 风格长选项 + 彩色帮助输出
- QEMU 测试支持

## 前置知识

- 深入的 C++23 知识
- Unix/Linux 系统编程
- 理解 BusyBox 的工作原理

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/CFBox)
