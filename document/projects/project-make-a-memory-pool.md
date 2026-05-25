---
title: "Project_MakeAMemroyPool"
---

## 简介

配合 B 站 9 集视频的内存池实战教程。从分析 `malloc` 的局限性开始，逐步实现 FreeList、CentralPool 和 ThreadLocal 组件，最终构建一个比系统 `malloc` 快 3-7 倍的高性能内存分配器。

涉及线程本地存储、Size Class 设计、基准测试和标准库对接等进阶主题。

## 核心特性

- 9 集配套视频教程
- 从 FreeList 到 ThreadLocal 的渐进式实现
- 性能基准测试：3-7 倍于系统 malloc
- 线程本地存储与 Size Class 设计
- 标准库 allocator 接口对接

## 前置知识

- C++ 基础（类、指针、模板）
- 对内存管理有基本概念（栈 vs 堆）

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Project_MakeAMemroyPool)
