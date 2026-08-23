---
title: "我该从哪里开始？"
---

# 我该从哪里开始？

AELS 没有一场必须全部通过的入学考试。先找到眼下缺少的能力，从能够运行和验证的最小内容开始；进入真实项目后，随时可以回来补更深的语言、系统和硬件知识。

完整关系见 [学习地图](/roadmap/)，所有仓库及其当前边界见 [仓库目录](/projects/)。

## 我还不熟悉开发工具

从 [EmbedBox](/projects/embedbox) 开始。目标不是一次弄懂 GCC、ELF、CMake 或 QEMU 的全部原理，而是先会使用终端、Git、编译器、调试器和基本构建工具，能够独立运行后续示例。

当工具已经够用，就进入与你当前语言方向相符的内容：

- 学 C：进入 [C-Journey](/projects/c-journey)。
- 学 C++：进入 [Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp)。
- 已经会用相关工具：直接从语言或平台仓库开始，遇到缺口再回补 EmbedBox。

## 我想把语言学深，而不只是会写语法

`C-Journey` 围绕 C 语言继续讲编译、链接、调试、测试和系统编程；`Tutorial_AwesomeModernCPP` 围绕 C++ 的类型系统、资源管理、模板、并发、性能和工程实践继续深入。

它们会与 EmbedBox 出现合理交叉：EmbedBox 解决“先会使用”，语言仓库解决“为了写好这门语言，需要理解到什么程度”。

如果希望完整经历一次小型工程交付，可以从 [engineering_cpp](/projects/engineering-cpp) 及其工程项目进入。

## 我想学习系统和操作系统基本功

- Linux 内核、系统调用、驱动和调试机制：按需进入 [PenguinLab](/projects/penguin-lab)。
- RTOS 任务、队列、同步和调度语义：进入 [Tutorial_FreeRTOS](/projects/tutorial-freertos)，再到 MCU 观察平台差异。
- 用现代 C++ 从零理解一个操作系统：进入 [Cinux-Book](/projects/cinux-book)；希望查看前沿代码则进入 [Cinux](/projects/cinux)。

这些内容可以先学，也可以在平台实践中遇到问题后回来补，不是统一门禁。

## 我想进入真实嵌入式平台

- STM32：具备基本工具能力和足够的 C 语言能力后进入 [ST-Forge](/roadmap/02-mcu/)。仓库正在逐步建设课程、模拟与真板验证，不预设统一结课产品。
- 嵌入式 Linux 入门：从 [imx-forge](/roadmap/03-linux/imx-forge) 打通较完整的板级链路。
- 已有 Linux BSP 经验或目标明确：直接按平台进入 [rk-forge](/roadmap/03-linux/rk-forge)；不要求依次购买全部 Rockchip 开发板。

## 我想看真实产品或参与建设

产品仓库不在学习地图中排成“毕业下一站”。可以在 [仓库目录](/projects/) 切换到“产品线”，查看 Cinux、CFDesktop、QuarkWidgets、aex 等真实代码；想参与内容、验证或工程建设，则查看 [贡献指南](/contributing/)。

> Keep it small, make it fun.
