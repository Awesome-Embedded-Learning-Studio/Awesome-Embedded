---
title: "BareMetal-Drivers"
---

## 简介

单片机裸机通用驱动与器件资产库：GPIO、I2C、OLED 显示、图形基元、UI 组件与系统组件等模块直接操作寄存器，不依赖复杂框架，以 STM32 为主要实现并通过硬件抽象层支持向其他 MCU 移植。

它接收经过验证的成熟驱动资产，但不是 ST-Forge 之后的固定学习阶段；统一构建、测试与 CI 状态以仓库为准。

## 前置知识

- C 语言编程
- 基本数字电路知识
- 单片机架构基础（寄存器、中断）

## 与 AELS 的关系

属于教学线「MCU 实践」分组，与 [ST-Forge](/projects/st-forge) 平台工坊配套：工坊里验证成熟的可复用资产沉淀到这里，[Project_MicroWatch](/projects/project-micro-watch) 等工程也可消费这些驱动。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers)
