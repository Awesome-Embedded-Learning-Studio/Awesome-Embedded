---
title: "micro-forge"
---

## 简介

ARM Cortex-M3 (STM32F103) 全系统模拟器——用 C++23 实现了完整的 CPU 执行引擎、内存总线和外设寄存器模拟。无需任何硬件，就能运行和调试真实的 STM32 固件。

支持完整的 Thumb-16/Thumb-32 指令集、ARMv7-M 异常处理，以及 NVIC、SCB、SysTick、RCC、GPIO、USART、TIM、AFIO、FLASH 等外设模拟。217 个测试用例保障正确性。

## 核心特性

- 完整 Thumb-16/Thumb-32 指令集模拟
- ARMv7-M 异常处理模型
- 外设模拟：NVIC、SCB、SysTick、RCC、GPIO、USART、TIM、AFIO、FLASH
- ELF / 原始二进制固件加载
- MMIO 追踪、内存转储、故障记录
- STM32F1 HAL 固件兼容
- 217 个测试用例

## 前置知识

- ARM Cortex-M 体系结构基础
- 现代 C++（C++20/23）
- 计算机组成原理

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/micro-forge)
