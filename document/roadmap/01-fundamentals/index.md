---
title: "工具、语言与工程基础"
---

# 工具、语言与工程基础

我们把工具一件件配到能用，接着围绕语言看它背后的机制，最后把语言知识送进一个能测试、安装、发布、交给下游消费的工程。

## EmbedBox：会用为止

[EmbedBox](/projects/embedbox) 帮助学习者在 EmbedBox 里跑通终端、Git、GCC、Make、CMake、GDB、交叉编译、串口、Docker 和 QEMU。我们希望学习者在这里拿到的是足以继续学习和实践的基本操作能力，至于每件工具的内部原理，这一部分不去穷尽。

这些能力你已经具备的话，可以直接跳过，后面在仓库里被环境问题卡住，再回来按需查阅就行。

## C-Journey 与 ModernCPP：为语言继续深入

[C-Journey](/projects/c-journey) 为 C 语言学习服务。编译单元、符号、链接、库、调试、测试和系统调用这些内容，我们会在“怎样写好和理解 C 程序”的上下文里重新遇到。

[Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp) 为 C++ 学习服务。名称修饰、模板实例化、ODR、ABI、资源管理、并发、性能和工程构建，我们沿着现代 C++ 的语言模型和领域实践继续往深走。

所以仓库之间存在内容交叉是正常的。同一个工具，在三个仓库里干的活不一样：EmbedBox 里会用就行，C-Journey 里要懂它和链接的关系，ModernCPP 里要懂它和构建的关系。

## 工程桥梁：完整做完一件事

共同工程方法由 [engineering_cpp](/projects/engineering-cpp) 来讲，具体的项目我们放在独立仓库里：

- [SimpleIniParser](/projects/tutorial-cpp-simple-ini-parser)：从明确的 INI 子集出发，建立错误模型、正反测试、安装、版本和真实消费。
- [anatomy_memory](/projects/anatomy-memory)：从不变量、sanitizer 和并发检查入手，证明正确，再严谨讨论性能。
- [bareline](/projects/bareline)：把无堆、无异常、静态分派、Host 测试和交叉编译带入 MCU。
- [CFBox](/projects/cfbox)：在 Linux userspace 中处理 POSIX 行为、差分测试、rootfs、QEMU 与真板交付。

这些项目不是所有人的统一必修课。我们把它们搭成从语言基础进入系统或嵌入式实践的不同桥梁。

## 按需补充的基础知识

- [PenguinLab](/projects/penguin-lab)：Linux 内核、系统编程和调试机制。
- [Tutorial_FreeRTOS](/projects/tutorial-freertos)：任务、队列、同步和调度等通用 RTOS 语义。
- [Tutorial_AwesomeHardware](/projects/tutorial-awesome-hardware)：电源、电路、器件、接口和板级调试知识。
- [Tutorial_AwesomeQt](/projects/tutorial-awesome-qt)：Qt 6 与 GUI 应用开发。
- [ZerOS](/projects/zeros)：用 C++23 在 Cortex-M3 上从零实现一个裸机 RTOS 的教学专题。

这些内容你可以在进入平台前学，也可以在 ST-Forge、imx-forge 或 rk-forge 中遇到真实问题后再回来补。

## 什么时候可以进入平台实践

我们不拿“学完整座仓库”当标准，看的是眼前的任务你能不能独立完成：

- 能使用基本命令行、Git、编译器、构建系统和调试工具。
- 能读写目标仓库需要的 C 或 C++。
- 知道遇到语言、系统或硬件缺口时去哪里补。

这几条能满足，你就可以进入 [MCU 实践](/roadmap/02-mcu/) 或 [嵌入式 Linux 实践](/roadmap/03-linux/)。
