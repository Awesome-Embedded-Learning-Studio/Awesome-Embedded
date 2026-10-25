---
title: "st-forge · STM32F1 / ARM Cortex-M3"
---

# st-forge · STM32F1 / ARM Cortex-M3

> 仓库定位与验证入口见 [项目目录 · ST-Forge](/projects/st-forge)。

> 仓库状态：公开。课程矩阵已定稿，章节建设中。课程主轴 2026-10-24 起定为 Cortex-M3 处理器架构（P0 到 P9 十段），已验证资产（环境教程、黄金模板、micro-forge 支持）直接继承，具体章节由 st-forge 按自己的节奏建设。

st-forge 是我们锁定在 **STM32F1 / ARM Cortex-M3** 上的单片机学习工坊，当前统一使用 **STM32F103C8T6 Blue Pill** 作为课程基准。

我们问的问题是“这颗处理器为什么这样工作”。课程从处理器本体、内存系统、异常与中断一路讲到链接、运行时和调试，外设从课程主体降级为架构的应用案例。学完带走的是换一颗 Cortex-M 芯片也成立的知识，课程也不扩展成泛 STM32 系列大全。

## 固定边界

- **芯片与板卡**：STM32F1，基准为 STM32F103C8T6 Blue Pill
- **语言**：C 是课程主线，运行时机制带 C++ 对照，C++ 本身不是主线
- **工具链**：CMake、ARM GCC、OpenOCD、GDB、ST-Link
- **生态对照**：STM32CubeMX、MDK 和其他商业工具只用于说明生态差异
- **外设边界**：外设不养生产驱动，成熟可复用的驱动进入 BareMetal-Drivers
- **验证原则**：Host、micro-forge 和 STM32F103 真板各自证明一个层面的行为

STM32F4、F7、H7 等系列不进入当前路线。现代 C++ 外设抽象我们只保留为远期独立选修，不与 C 主线并行维护。

## 教学方法

同一主题，我们会从三个尺度解释：

1. **宏观**：STM32F103 是一台由 CPU、存储器、总线、时钟和外设组成的计算机。
2. **中观**：外设是地址空间中的一组内存映射寄存器。
3. **微观**：寄存器操作最终对应真实电平、边沿和通信时序。

## 课程路线

| 阶段 | 主题 |
|---|---|
| P0 | 序章与工具链 |
| P1 | 处理器本体：寄存器组、流水线、指令集 |
| P2 | 内存系统：内存映射、总线矩阵、位带 |
| P3 | 异常与中断：硬件压栈、尾链、NVIC |
| P4 | 启动与时钟：启动文件逐行、时钟树 |
| P5 | 链接与运行时：链接脚本、程序的内存形象 |
| P6 | 调试系统：SWD、断点的实现、周期计数器 |
| P7 | 外设即架构案例 |
| P8 | RTOS 的架构视角：PendSV 与上下文切换 |
| P9 | 收官项目 |

ARM 汇编的读与写织在架构线里，我们给自己定的目标是读得懂反汇编与启动文件、写得出小段函数，不用汇编写程序。

## 验证边界

| 环境 | 负责内容 | 不能替代 |
|---|---|---|
| Host | 消抖、环形缓冲区、命令与协议解析、CRC、状态机 | Cortex-M3 启动、外设和板级行为 |
| micro-forge | 已实现范围内的 Cortex-M3 启动、NVIC、SysTick、RCC、GPIO、USART1、TIM2、AFIO、EXTI，以及仍需深化的 FLASH 行为 | 尚未建模的 ADC、DMA、I2C、SPI 和真实 Flash 擦写，以及真实电气行为 |
| STM32F103 真板 | SWD、实际电平与波形、外设请求、Flash、低功耗、IAP 和 FreeRTOS 板上调度 | 无 |

模拟通过不等于硬件通过。没有真板记录的板级能力，我们不能把它写成“已验证”。

## 与其他仓库的关系

| 仓库 | 职责 |
|---|---|
| st-forge | 课程、最小实验、Blue Pill 工程与真板验证 |
| micro-forge | 已支持 STM32F103 能力的模拟、追踪和可观测性 |
| BareMetal-Drivers | 成熟、可复用的器件、协议和生产型驱动资产 |
| Tutorial_FreeRTOS | FreeRTOS 通识、Host 模拟和内核原语教学 |

st-forge 里的寄存器实现服务于教学，我们会故意写得直接和低效。成熟、可复用的驱动进入 BareMetal-Drivers，避免双份维护。

## 远期选修与不做事项

OLED、RTC 完整实验、红外、单一传感器、CAN、RS485、SD/FATFS、USB Device、其他 STM32F1 容量与封装，以及现代 C++ 寄存器抽象，我们只在主线稳定后评估。

Blue Pill 不具备或不适合作为主线的 DAC、FSMC LCD、触摸屏、摄像头、外部 SRAM 和手写识别等内容，我们不把它们纳入当前课程。

## 链接

- [st-forge 仓库](https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge)
