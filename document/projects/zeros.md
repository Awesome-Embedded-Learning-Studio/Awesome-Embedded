---
title: "ZerOS"
---

## 简介

用现代 C++23 从零编写的裸机 RTOS，面向 Cortex-M3：无堆、无 RTTI、无异常、无 C ABI。一套内核在桌面单测、Renode 与 QEMU 仿真以及真板环境上运行，同一套机制在三个环境里对照验证。

仓库以 MIT 许可发布，追求把每个运行时机制的代价讲清楚，适合想读懂一个 RTOS 而不是只会用一个 RTOS 的学习者。

## 与 AELS 的关系

属于教学线「系统基础」分组，是 RTOS 方向的造轮子专题：从 [Tutorial_FreeRTOS](/projects/tutorial-freertos) 的概念通识出发，在读源码与自己实现之间选后者。它与 [Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp) 建立了联动，教程侧提供 C++ 工程化知识，ZerOS 提供实时系统落点。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/ZerOS)
