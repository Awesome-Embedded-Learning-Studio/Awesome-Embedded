---
title: "Tutorial_FreeRTOS"
---

## 简介

**Tutorial_FreeRTOS** 是一套**不依赖真 MCU、在 PC 上就能跑通全部 FreeRTOS 内核示例**的教程——章节顺序对齐《Mastering the FreeRTOS Kernel》13 章，用一个多任务传感器仪表盘作为渐进式贯穿项目。

它解决的是 FreeRTOS 学习的「硬件门槛」：没有开发板也能把内核机制（任务、队列、信号量、通知）在 PC 上完整跑起来，并通过独立的「仿真 vs 真实 MCU 坑点」章 + RT-Thread 对比轨，补上从模拟到真机的认知落差。

## 核心特性

- **双轨主机模拟**：POSIX（Linux / macOS / WSL2）+ Windows MSVC，两套都能跑
- **Mock HAL + bridge-task 架构**：安全模拟外设，绕开 POSIX port 的 FromISR-hang 陷阱
- **章节对齐官方书**：15 章核心教程，顺序对齐《Mastering the FreeRTOS Kernel》
- **渐进式贯穿项目**：多任务传感器仪表盘，从单任务逐步长成完整系统
- **仿真 vs 真机坑点专章**：独立讲解模拟器与真实 MCU 的行为差异
- **RT-Thread 对比轨**：横向对比另一款 RTOS，建立参照系

## 仓库结构

```
Tutorial_FreeRTOS/
├── document/          # 文档源（VitePress，Markdown）
│   ├── tutorial/      # 核心教程（15 章，对齐官方书）
│   ├── pitfalls/      # 仿真 vs 真实 MCU 坑点
│   └── rt-thread/     # RT-Thread 对比轨
├── codes_and_assets/  # 代码、硬件电路图、PCB 等资产
├── site/              # VitePress 工程目录
└── project.config.ts  # 单一配置真相源
```

## 本地预览

需要 Node.js 22+ 与 [pnpm](https://pnpm.io)：

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器
pnpm build          # 构建静态站点
```

## 与 AELS 的关系

属于 **MCU / 裸机 / FreeRTOS** 主线，是 RTOS 入门到实战的教学载体。它与 [micro-forge](/projects/micro-forge)（无硬件跑 STM32 固件的模拟器）理念相通——都用「在 PC 上消除硬件门槛」降低嵌入式学习曲线。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS)
