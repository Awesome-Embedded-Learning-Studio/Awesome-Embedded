---
title: "Tutorial_FreeRTOS"
---

## 简介

不依赖真 MCU、在 PC 上跑通 FreeRTOS 内核机制的教程：章节顺序对齐《Mastering the FreeRTOS Kernel》，用一个多任务传感器仪表盘作为渐进式贯穿项目，POSIX（Linux / macOS / WSL2）与 Windows MSVC 双轨可跑。

它解决的是 FreeRTOS 学习的硬件门槛：任务、队列、信号量、通知这些内核机制先在主机上完整跑起来，再通过「仿真 vs 真实 MCU 坑点」专章与 RT-Thread 对比轨，补上从模拟到真机的认知落差。主机模拟结论不冒充真板时序结论。

## 与 AELS 的关系

属于教学线「系统与硬件基础」分组，为 [ST-Forge](/projects/st-forge) 的 FreeRTOS 内容提供概念补充。与 [micro-forge](/projects/micro-forge) 理念相通——都在 PC 上消除硬件门槛，但 Host 模拟不替代真板验收。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS)
