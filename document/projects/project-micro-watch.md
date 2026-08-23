---
title: "Project_MicroWatch"
---

## 简介

面向资源受限 ARM Cortex-M 平台的智能手表原型工程，当前状态是 **WIP / 硬件与功能规划中**。

仓库已经建立软件、硬件和教程目录，也完成了第一代硬件清单评估与部分 OLED 基础资产，但主控、传感器、交互器件和完整产品闭环尚未定型。它不是已经完成的教学项目，也不代表 MCU 路线的统一 Capstone。

## 规划方向

- 分层软件架构（HAL / 驱动 / 库 / 服务 / 应用 / UI）
- OLED 显示驱动
- RTC 时钟 / 闹钟
- Dino 小游戏
- 计步器（陀螺仪）
- 指南针（磁力计）
- 旋转编码器交互

上述功能是仓库规划，不等于当前全部已经实现。

## 前置知识

- ARM Cortex-M 开发基础
- C 语言编程
- 基本电子学知识

## 与 AELS 的关系

属于教学线「MCU 实践」分组的独立综合工程：与 MCU 教学共享部分知识和资产（如 [BareMetal-Drivers](/projects/baremetal-drivers) 的驱动），但不承担 ST-Forge 或整个 MCU 路线的统一 Capstone，建设节奏以仓库为准。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Project_MicroWatch)
