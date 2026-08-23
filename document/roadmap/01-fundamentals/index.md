---
title: "工具、语言与工程基础"
---

# 工具、语言与工程基础

这一部分解决三个不同深度的问题：先让工具可用，再围绕语言理解其背后的机制，最后把语言知识送进一个能够测试、安装、发布和被下游消费的工程。

## EmbedBox：先会使用

[EmbedBox](/projects/embedbox) 帮助学习者先跑通终端、Git、GCC、Make、CMake、GDB、交叉编译、串口、Docker 和 QEMU。这里的目标是获得足以继续学习和实践的基本操作能力，而不是穷尽每件工具的内部原理。

已经掌握这些能力的人可以直接跳过；进入后续仓库遇到环境问题时，也可以回来按需查阅。

## C-Journey 与 ModernCPP：为语言继续深入

[C-Journey](/projects/c-journey) 为 C 语言学习服务。编译单元、符号、链接、库、调试、测试和系统调用等内容，会在“怎样写好和理解 C 程序”的上下文中重新出现。

[Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp) 为 C++ 学习服务。名称修饰、模板实例化、ODR、ABI、资源管理、并发、性能和工程构建等内容，会围绕现代 C++ 的语言模型和领域实践继续深入。

因此，仓库之间存在内容交叉是正常的：同一个工具或机制，在“先会使用”“学懂 C”“学懂 C++”中承担的任务不同。

## 工程桥梁：完整做完一件事

[engineering_cpp](/projects/engineering-cpp) 负责讲共同工程方法，具体项目由独立仓库承载：

- [SimpleIniParser](/projects/tutorial-cpp-simple-ini-parser)：从明确的 INI 子集出发，建立错误模型、正反测试、安装、版本和真实消费。
- [anatomy_memory](/projects/anatomy-memory)：先用不变量、sanitizer 和并发检查证明正确，再严谨讨论性能。
- [bareline](/projects/bareline)：把无堆、无异常、静态分派、Host 测试和交叉编译带入 MCU。
- [CFBox](/projects/cfbox)：在 Linux userspace 中处理 POSIX 行为、差分测试、rootfs、QEMU 与真板交付。

这些项目不是所有人的统一必修课。它们提供从语言基础进入系统或嵌入式实践的不同桥梁。

## 按需补充的系统知识

- [PenguinLab](/projects/penguin-lab)：Linux 内核、系统编程和调试机制。
- [Tutorial_FreeRTOS](/projects/tutorial-freertos)：任务、队列、同步和调度等通用 RTOS 语义。
- [Tutorial_AwesomeHardware](/projects/tutorial-awesome-hardware)：电源、电路、器件、接口和板级调试知识。

它们既可以在进入平台前学习，也可以在 ST-Forge、imx-forge 或 rk-forge 中遇到真实问题后回补。

## 什么时候可以进入平台实践

不以“学完整座仓库”为标准，而以眼前任务能否独立完成为标准：

- 能使用基本命令行、Git、编译器、构建系统和调试工具；
- 能读写目标仓库需要的 C 或 C++；
- 知道遇到语言、系统或硬件缺口时去哪里补。

满足这些条件，就可以进入 [MCU 实践](/roadmap/02-mcu/) 或 [嵌入式 Linux 实践](/roadmap/03-linux/)。
