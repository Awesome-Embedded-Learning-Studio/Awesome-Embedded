---
title: "micro-forge"
---

## 简介

ARM Cortex-M3（STM32F103）全系统模拟器，用 C++23 实现 CPU 执行引擎、内存总线与外设寄存器模拟：无需任何硬件，就能运行和调试受支持的真实 STM32 固件（含 STM32F1 HAL）。

支持完整 Thumb-16/32 指令集与 ARMv7-M 异常模型，模拟 NVIC、SCB、SysTick、RCC、GPIO、USART、TIM 等外设，提供 ELF 固件加载、MMIO 追踪、内存转储与故障记录，可选 Qt 调试 GUI。具备自动测试、CI 与端到端回归；测试规模以仓库与 CI 为准。

## 前置知识

- ARM Cortex-M 体系结构基础
- 现代 C++（C++20/23）
- 计算机组成原理

## 与 AELS 的关系

属于基建与验证线「验证设施」分组：为 [ST-Forge](/projects/st-forge) 的部分实验提供确定性模拟与 CI 入口，也可作高级工程研究对象。模拟结果不替代电气、功耗与真板时序。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/micro-forge)
