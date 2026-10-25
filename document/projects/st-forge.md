---
title: "ST-Forge"
---

# ST-Forge

> 完整课程路线见 [学习地图 · ST-Forge](/roadmap/02-mcu/st-forge)。

## 简介

面向 STM32F1 / Cortex-M3 的教学工坊，基准平台为 STM32F103C8T6 Blue Pill，使用 C、CMake、ARM GCC、OpenOCD 和 GDB。课程主轴 2026-10-24 起定为 Cortex-M3 处理器架构，问的是“这颗处理器为什么这样工作”，外设从课程主体降级为架构的应用案例，ARM 汇编的读与写织在架构线里。

仓库已经公开，课程矩阵（P0 到 P9 十段）已定稿，章节建设中，具体内容由 ST-Forge 按自己的节奏建设。

## 路线重点

- CMake 原生构建系统
- 不依赖 IDE
- 处理器本体、内存系统、异常与中断的架构主线
- Host、micro-forge 与 STM32F103 真板分层验证

## 前置知识

- C 语言
- CMake 基本用法

## 与 AELS 的关系

属于教学线「MCU 实践」分组，是[学习地图](/roadmap/)第二支柱的建设主线。[micro-forge](/projects/micro-forge) 为部分实验提供确定性模拟，[Tutorial_FreeRTOS](/projects/tutorial-freertos) 提供 RTOS 概念补充，[bareline](/projects/bareline) 可在真实 UART 工程中形成消费关系。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge)
- [在线文档站](https://awesome-embedded-learning-studio.github.io/ST-Forge/)
