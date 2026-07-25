---
title: "P0 · 基础"
---

# P0 · 基础

碰板子之前，先准备最低限度的工具和语言基础。这一层不绑具体芯片，但也不要求所有人先学完同一组大课程。

## 最低共同入口：工具加 C

**工具链** · EmbedBox。终端、Git、GCC、CMake、GDB、交叉编译、串口、Docker、QEMU。听着是一长串，其实就是"搭环境"那一关。这关过不了后面什么都做不了，所以放最前。

**C** · C-Journey。ST、ESP、Linux BSP、驱动和 RTOS 都需要读写 C；学习者不必先完成全部内容，只需具备函数、指针、结构体、位操作和基本构建能力即可进入平台路线。

EmbedBox 和 C-Journey 构成最低共同入口。已经具备这些能力的学习者可以直接进入 P1 或 P2。

## ModernCPP：贯穿主线，不做统一前置考试

现代 C++ 不是只服务 Cinux、Qt 或桌面项目的选修方向，而是 AELS 区分于常规嵌入式教程的核心方法：用类型、资源所有权、零成本抽象、测试与现代构建方式改善 MCU、嵌入式 Linux 和系统软件。

它不被设计成碰板子前必须完成的统一前置考试。学习者具备最低 C 与工具能力后即可进入平台仓库，再沿真实问题持续学习和应用现代 C++：

- **STM32F1**：先理解寄存器、启动与 C 接口，再在合适边界引入类型安全、RAII、静态多态和可测试结构。
- **ESP32-S3**：保留 ESP-IDF 的 C 接口边界，用 C++ 管理资源、任务生命周期、组件和应用结构。
- **嵌入式 Linux**：读写 C ABI 与内核接口，同时使用现代 C++ 建设 userspace、工具和产品工程。
- **Cinux**：把 freestanding C++ 直接用于操作系统实验，验证语言与运行时边界。

## 按方向选择增强课

这些课程都可以先学，也可以在进入平台仓库后按需要回补：

- 想理解**通用 RTOS 概念**：Tutorial_FreeRTOS 在 POSIX / WSL2 和 Windows MSVC 主机上讲任务、队列、同步与常见仿真边界。st-forge 到后期再做 STM32F103 单核移植，esp-forge 在 ESP-IDF 语境下进入双核 SMP。
- 想理解**Linux 内核与驱动机制**：PenguinLab 使用 QEMU 和多架构实验建立知识图谱；它是 P2 的强力旁路，不是进入 i.MX6ULL 的强制前置。
- 想补**硬件理论**：AwesomeHardware 提供电路、模拟/数字电子、电源、PCB、传感器和接口知识，可随板级实验逐项回补。
- 想做**GUI 或桌面产品**：AwesomeQt 进入 QuarkWidgets、CFDeskit 与 CFDesktop。
- 想造**操作系统或 C++ 系统软件**：ModernCPP 之后可直接进入 Cinux 独立线。

FreeRTOS 和 PenguinLab 的共同价值是先在 Host/QEMU 中观察通用机制，再到 P1/P2 处理真实平台差异；它们是桥梁，不是门禁。

## 模拟与真板

micro-forge 当前已经具备 Cortex-M3 Thumb-2、异常处理、MSP/PSP、NVIC、SysTick 和一组 STM32F103 外设模型，也能运行真实 HAL 固件。是否支持某个完整 FreeRTOS 或外设课程，以其当前支持矩阵和实际回归为准，不能从 CPU 能力直接推导。

Host、QEMU 和模拟器用于降低入门门槛与观察软件机制；电气、时序、功耗、射频和板级兼容仍回到对应真板。

## 最小启动路径

```text
EmbedBox + C-Journey 最小基础
            ├── P1 单片机
            ├── P2 嵌入式 Linux
            ├── Cinux 独立线
            └── ModernCPP 工程方法贯穿；其余增强课按方向回补
```

P1 与 P2 平行，不存在必须先后。想造 OS 可以在补足 C++ 与系统基础后直接进入积极建设的 [Cinux 独立线](/roadmap/04-specialty/)；GUI、网络、驱动专题、多媒体和边缘 AI 暂时只保留规划。
