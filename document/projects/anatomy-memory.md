---
title: "anatomy_memory"
---

## 简介

内存池实战教程：从分析 `malloc` 的局限性开始，逐步实现 FreeList、ThreadCache 与 CentralPool，完成一个可测试、可分析的多层内存分配器，并涉及线程本地存储、Size Class 设计、基准测试与标准库 allocator 对接等进阶主题，配套系列视频教程。

它的态度是先证明正确、再谈性能：不预设「必然比 malloc 快」的结论，性能讨论建立在严谨的测量方法之上。

## 前置知识

- C++ 基础（类、指针、模板）
- 对内存管理有基本概念（栈 vs 堆）

## 与 AELS 的关系

属于教学线「C++ 工程实践」分组，由 [engineering_cpp](/projects/engineering-cpp) 组织，与 [Tutorial_cpp_SimpleIniParser](/projects/tutorial-cpp-simple-ini-parser) 同为 hub 的 spoke：一个做小库的工程闭环，一个做内存管理的高阶工程实验。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/anatomy_memory)
