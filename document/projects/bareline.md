---
title: "bareline"
---

## 简介

零开销、header-only 的 C++23 嵌入式 shell 库，面向裸机目标（Cortex-M 级 MCU）：无堆分配、无异常、命令在编译期注册。

同一份 shell 代码既能在 STM32F103 真机的 USART 上运行，也能在 host PC 的 stdin/stdout 上运行。能力上覆盖行输入归一化（`\n` / `\r\n` / lone-CR）、零拷贝分词、编译期命令注册与双分派（小列表 fold-expression / 大列表 constexpr 哈希）、后端 IO 抽象与 expected 错误上报；接口细节与示例以仓库文档为准。

## 与 AELS 的关系

属于教学线「MCU 实践」分组，是裸机工程的基础设施：给 [ST-Forge](/projects/st-forge)、[BareMetal-Drivers](/projects/baremetal-drivers) 这类 MCU 项目提供可复用的命令行交互层。零堆 / 零异常的设计让它能安全跑在最小资源的 Cortex-M 上。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/bareline)
