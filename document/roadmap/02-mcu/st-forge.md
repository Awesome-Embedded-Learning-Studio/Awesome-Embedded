---
title: "st-forge · STM32F1 / ARM Cortex-M3"
---

# st-forge · STM32F1 / ARM Cortex-M3

> 仓库状态：公开。课程路线已经定稿，具体内容由 st-forge 按自己的节奏建设。

st-forge 是锁定 **STM32F1 / ARM Cortex-M3** 的单片机学习工坊，当前统一使用 **STM32F103C8T6 Blue Pill** 作为课程基准。

它从 CPU、内存、总线、寄存器和电气信号出发，解释程序如何启动、外设如何运行、抽象层为何出现，最后进入调试、升级和单核 FreeRTOS。课程不以“会调用 HAL”为终点，也不扩展成泛 STM32 系列大全。

## 固定边界

- **芯片与板卡**：STM32F1，基准为 STM32F103C8T6 Blue Pill
- **语言**：C 是唯一主线
- **工具链**：CMake、ARM GCC、OpenOCD、GDB、ST-Link
- **生态对照**：STM32CubeMX、MDK 和其他商业工具只用于说明生态差异
- **教学顺序**：先理解寄存器与硬件机制，再用 HAL 完成同一现象并阅读其实现
- **验证原则**：Host、micro-forge 和 STM32F103 真板各自证明不同层面的结论

现代 C++ 外设抽象只保留为远期独立选修，不与 C 主线并行维护。STM32F4、F7、H7 等系列也不进入当前路线。

## 教学方法

同一主题从三个尺度解释：

1. **宏观**：STM32F103 是一台由 CPU、存储器、总线、时钟和外设组成的计算机。
2. **中观**：外设是地址空间中的一组内存映射寄存器。
3. **微观**：寄存器操作最终对应真实电平、边沿和通信时序。

适用的外设按照“轮询 → 中断 → DMA”递进，但不机械地要求每个外设实现三遍。HAL 用于理解产业抽象和工程落地，不替代硬件机制教学。

## 课程路线

| 阶段 | 主题 | 学习结果 |
|---|---|---|
| P0 | 课程准备与硬件心智模型 | 会查芯片资料、参考手册和原理图，理解供电、BOOT、SWD 与基本地址空间 |
| P1 | 工具链与最小工程 | 跑通源码、编译、链接、ELF/BIN、烧录和 GDB 调试闭环 |
| P2 | 启动、链接、内存与时钟 | 理解复位到 `main`、向量表、链接脚本、Flash/SRAM 和 RCC |
| P3 | GPIO、通信、中断与时间 | 掌握 GPIO、EXTI/NVIC、USART、SysTick、看门狗和定时器 |
| P4 | ADC、DMA、I2C、SPI 与 Flash | 建立采样、数据搬运、总线事务和片内持久化能力 |
| P5 | 异常、低功耗与启动升级 | 能分析 HardFault，理解 RTC、低功耗和串口 IAP |
| P6 | FreeRTOS 单核移植与调度观察 | 从任务栈、SysTick、PendSV 和 SVC 解释一次上下文切换 |
| P7 | 课程综合与收束 | 组合已学能力完成一个规模受控、可调试、可验证的课程项目 |

## 验证边界

| 环境 | 负责内容 | 不能替代 |
|---|---|---|
| Host | 消抖、环形缓冲区、命令与协议解析、CRC、状态机 | Cortex-M3 启动、外设和板级行为 |
| micro-forge | 已实现范围内的 Cortex-M3、NVIC/SCB/SysTick、RCC、GPIO、USART、TIM、AFIO/EXTI、FLASH | 尚未建模的 ADC、DMA、I2C、SPI，仍需深化的 FLASH 行为，以及真实电气行为 |
| STM32F103 真板 | SWD、实际电平与波形、外设请求、Flash、低功耗、IAP 和 FreeRTOS 板上调度 | 无 |

模拟通过不等于硬件通过；没有真板记录的板级能力不能写成“已验证”。

## 与其他仓库的关系

| 仓库 | 职责 |
|---|---|
| st-forge | 课程、最小实验、Blue Pill 工程、HAL 对照与真板验证 |
| micro-forge | 已支持 STM32F103 能力的模拟、追踪和可观测性 |
| BareMetal-Drivers | 成熟、可复用的器件、协议和生产型驱动资产 |
| Tutorial_FreeRTOS | FreeRTOS 通识、Host 模拟和内核原语教学 |

st-forge 中的寄存器实现服务于教学，可以故意直接和低效；成熟的可复用驱动进入 BareMetal-Drivers，避免双份维护。

## 远期选修与不做事项

OLED、RTC 完整实验、红外、单一传感器、CAN、RS485、SD/FATFS、USB Device、其他 STM32F1 容量与封装，以及现代 C++ 寄存器抽象，只在主线稳定后评估。

Blue Pill 不具备或不适合作为主线的 DAC、FSMC LCD、触摸屏、摄像头、外部 SRAM 和手写识别等内容，不纳入当前课程。

## 链接

- [st-forge 仓库](https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge)
