---
title: "BareMetal-Drivers"
---

## 简介

单片机裸机通用驱动库，提供 GPIO、I2C、OLED 显示（SSD1306/SSD1309）、图形基元（点/线/圆/矩形）、UI 组件（文字/动画/菜单）以及系统组件（应用引导/时钟/配置）等模块。直接操作寄存器，不依赖复杂框架。

以 STM32 平台为主要实现，硬件抽象层设计方便移植到其他 MCU。

## 核心特性

- GPIO / I2C / OLED 驱动（SSD1306/SSD1309）
- 图形基元：点、线、圆、矩形
- UI 组件：文字渲染、动画、菜单
- 系统组件：应用引导、系统时钟、配置管理
- 硬件抽象层，便于跨平台移植
- STM32 平台实现

## 前置知识

- C 语言编程
- 基本数字电路知识
- 单片机架构基础（寄存器、中断）

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers)
