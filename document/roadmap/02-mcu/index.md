---
title: "P1 · 单片机"
---

# P1 · 单片机

单片机是最接近原生硬件的那一层，软硬件在这里碰头。从这往后，你面对的是具体的板子和它周围的生态，不再是抽象概念。

两条对等入口，按平台生态切：

- **st-forge（公开，路线已定稿）**：STM32F1 / Cortex-M3。从启动、寄存器和裸机外设出发，读 ST 手册，以 C 语言理解驱动与 HAL 抽象。
- **esp-forge（私有，路线已定稿）**：ESP32-S3 / 双核 Xtensa LX7。从 ESP-IDF 应用出发，拆解 RTOS、内存、无线、USB、OTA 与安全；公开前只作为路线规划，不进入公开项目目录。

深度页：[st-forge](/roadmap/02-mcu/st-forge) 和 [esp-forge](/roadmap/02-mcu/esp-forge)。

## 共用的工具

两个 forge 不要求共享芯片级 HAL，但复用能真正跨平台的部分：

- **BareMetal-Drivers**：C 写的共享驱动与器件库。STM32F1 复用寄存器级实现；ESP32-S3 只复用协议、器件和平台无关逻辑，通过 ESP-IDF 后端接入。
- **micro-forge**：只服务 st-forge 的 STM32F103 / Cortex-M3 模拟。无硬件时可以跑受支持固件、观察 NVIC 和 trace 引脚。
- **Host 测试接口**：两个平台都应把协议解析、状态机和业务逻辑从硬件中分离，在 PC 上做单元测试。

## 模拟机制：哪些可能先仿，哪些必须上板

边界要划清。下表描述适合由模拟环境承担的内容类型，不代表 micro-forge、QEMU 或 Wokwi 当前已经实现表中所有模型。

| 模型支持时可先验证 | 必须真硬件的 |
|---|---|
| GPIO、LED、按键、中断时序 | PCB 布线、阻抗、信号完整性 |
| UART、I2C、SPI 协议帧 | 电源（LDO / DC-DC、纹波、上电时序）|
| ADC 数值、PWM | 无线射频实测（蓝牙、WiFi 空中包）|
| RTOS 调度、信号量、优先级翻转 | 模拟信号调理（运放、抗混叠）|

能否采用纯仿、半仿半真或真板验证，由每个实验引用的具体版本和支持矩阵决定。

一句话钉死：仿真过了不等于硬件对了。这条每个模拟章节都要讲。

## 模拟器分工

不对称，但各自站得住：

- **st-forge 用 micro-forge**：目标锁定 STM32F103；当前已经覆盖 Cortex-M3、NVIC、SCB、SysTick、RCC、GPIO、USART、TIM、AFIO 和 FLASH 等能力，具体课程引用当前支持矩阵。
- **esp-forge 用 QEMU 加 Wokwi**：只使用选定版本实际验证过的 ESP32-S3 能力，最终回到 S3 真板验证无线、USB、电气、功耗与产品稳定性。

综合项目由两个自治仓库分别决定。MicroWatch 是已有但仍处于 WIP/硬件规划状态的 Cortex-M 项目，可作为 st-forge 方向的远期候选，不代表整个 P1 的统一终点。

## 往下走

走到六成左右，可以查看 [专题区](/roadmap/04-specialty/) 的后续方向，但除 Cinux 独立路线外，其余专题当前都处于规划状态，P1 仍以两条 forge 主线为先。RTOS 概念在 [P0](/roadmap/01-fundamentals/) 学过了，这里结合 STM32F1 单核移植和 ESP32-S3 双核 SMP 重新验证，不把主机模拟等同于真机行为。
