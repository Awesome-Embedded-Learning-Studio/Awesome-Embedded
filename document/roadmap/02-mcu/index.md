---
title: "MCU 实践"
---

# MCU 实践

当前 MCU 教学集中建设 STM32 路线。学习者先具备基本工具能力和足够的 C 语言能力，再进入 [ST-Forge](/roadmap/02-mcu/st-forge)；课程终点由实际建设和验证逐步形成，不提前指定某个综合产品。

## 当前主线：ST-Forge

ST-Forge 以 STM32F1 / Cortex-M3 为主要教学平台，从查阅芯片资料、工具链和最小工程开始，逐步进入启动、链接、内存、时钟、GPIO、通信、中断、定时器、ADC、DMA、总线、故障、低功耗和 FreeRTOS 板端观察。

仓库已有细致的课程设计，但实际实现仍处在早期建设阶段。中心站只按已经存在的代码和验证证据描述进度，不把课程目录当作全部完成。

## 周围的支持仓库

这些关系不是学习顺序：

| 仓库 | 对 ST-Forge 的作用 | 边界 |
|---|---|---|
| [micro-forge](/projects/micro-forge) | 为受支持的 STM32F103 固件提供确定性模拟、故障注入和 CI 入口 | 只覆盖已经实现和回归的 CPU/外设行为，不替代真板 |
| [Tutorial_FreeRTOS](/projects/tutorial-freertos) | 在 Host 上解释任务、队列、同步和调度语义 | 不证明 STM32 上的实时性、移植和外设行为 |
| [Tutorial_AwesomeHardware](/projects/tutorial-awesome-hardware) | 补充读手册、电源、电路、接口和板级调试知识 | 当前 MCU 硬件内容仍在逐步建设 |
| [BareMetal-Drivers](/projects/baremetal-drivers) | 保存可复用的驱动和器件资产 | 可以接收成熟成果，但不是固定下一阶段 |
| [bareline](/projects/bareline) | 展示现代 C++ 如何进入无堆、无异常的 MCU 工程 | 只有形成真实 ST 工程消费后，才算完成课程交接 |

## 验证怎样逐步晋升

```text
纯逻辑 Host 测试
    → micro-forge 中验证受支持的功能语义与故障
    → STM32F103 真板实验
    → 成熟、可复用的代码资产
```

这是一条验证与资产晋升方式，不是仓库学习顺序，也不承诺所有实验都必须经过完全相同的层次。

模拟器适合证明指令、寄存器、异常、协议状态机和确定性外设语义；真板负责电气、时序、功耗、模拟信号和板级兼容。每个实验应明确自己实际通过了哪一层。

## 关于综合项目

[Project_MicroWatch](/projects/project-micro-watch) 是正在发展的 STM32G431 / FreeRTOS 工程，可以与 MCU 教学共享知识和资产，但它不是 ST-Forge 的预定终点。ST-Forge 是否以及怎样形成综合课程项目，以后由已经完成的内容、验证能力和真实需求决定。
