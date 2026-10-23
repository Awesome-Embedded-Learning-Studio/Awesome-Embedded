---
title: "ST-Forge 规划"
---

# ST-Forge 规划

## 这个仓库是什么

ST-Forge 是面向 STM32 学习者的开源课程仓，做的是成体系的课程，不是例程合集。第一阶段聚焦 STM32F103C8T6 Blue Pill 板（一块常见的低成本入门板），用 C、CMake、ARM GCC、OpenOCD、GDB 和 VS Code 搭一条可复现、可调试的学习路线，这些定位写在仓库 README 里。C 是唯一主线语言，全课程不换线。

课程路线已经定稿，分 P0 到 P7 八个阶段，从课程准备与硬件心智模型（对板子各部件先建立整体认识）起步，到 FreeRTOS 单核移植与调度观察，最后综合收束。课程矩阵在仓库的 documentations/planning/curriculum.md，提交 5b28d81，2026-07-25。

配套的模拟验证由 [micro-forge](/plans/micro-forge) 承担。它负责 STM32F103 已支持能力的仿真与追踪，包括 Cortex-M3 启动、NVIC、SysTick、RCC、GPIO 的 A/B/C 端口、USART1、TIM2、AFIO 和 EXTI。分工写在 curriculum.md 的分层验证一节，纯逻辑先在 Host 上测，受支持的功能在模拟器里验，电气、时序、功耗和板级兼容留给真板，每个实验要写清自己实际通过了哪一层。

## 现状

本节的数字与事实来自仓库 README、仓库内规划文档与组织快照，查询日期随文标注。

2026-10-02 的组织快照记录 2 星、1 fork、MIT 许可，贡献者 3 人，仓库开源未归档，最后提交 2026-07-25。

仓库自带 VitePress 文档站，GitHub Pages 站在线（README 与组织快照的 homepage 记录）。

规划文档已提交三份，都在 documentations/planning/，同属提交 5b28d81。curriculum.md 是 P0 到 P7 的课程矩阵，roadmap.md 是从 M1 起的行动路线，index.md 是规划目录。roadmap.md 的 M2 定义了黄金模板 examples/00_blink_cmake，后续章节都从它复制起步。

实现阶段还在早期。仓库顶层没有 examples/ 目录，firmware/ 公共底座（各章节共用的构建与启动代码）也没建，2026-10-22 清点仓库内容时如此，对应 roadmap.md 的 M2 各项都还是待办。

维护者的工作副本上还有两处未提交改动，一处是 documentations/index.md 的修改，一处是 documentations/tutorial/0_env_setup 改名为 1_env_setup，清点日期 2026-10-22。这两处改动公开渠道查不到，以仓库提交历史为准。

本站的项目目录里已经放了课程矩阵，具体放在哪个页面待核实。

## 下一代方向

方向是复活这个仓库，把定稿的 P0 到 P7 课程做出来，这一轮就动手。复活不重开课程规划，矩阵已经定稿，缺的是实现。

第一件事是最小工程，也就是跑通一个最小工程并写对应的课程正文，证据链是编译、烧录、观察，每一步写明所用板子与工具版本。落到仓库里，它就是 roadmap.md M2 的 examples/00_blink_cmake 黄金模板。

最小工程先做，是因为八个阶段的章节都从它复制起步。它没跑通之前，后续章节没有可复现的起点，先写章节正文没有意义。

模拟配套不需要新写。micro-forge 已经支持课程当前要验证的那批外设，直接拿来用。

下面的事还没定下来，登记为待定项。

- P1 起各章节的具体顺序与节奏，等最小工程跑通后再排。
- firmware/ 公共底座什么时候立起来，随第一门正式课程确定。

## 近期要做的事

- 把工作副本上两处未提交改动提交收尾，让目录改名不再停在未提交状态。做完的标志是这两处改动出现在仓库提交历史里。
- 跑通 examples/00_blink_cmake 黄金模板并配正文，编译、烧录、观察各步写明板子与工具版本。做完的标志是 examples/ 目录出现在仓库里，正文随文档站发布。
- 最小工程跑通后，排定 P1 起的章节顺序。做完的标志是 roadmap.md 上后续章节有了明确的先后。

## 边界与不做的事

- 模拟通过不写成硬件通过。micro-forge 还没实现的外设（ADC、DMA、I2C、SPI、真实 Flash 擦写）不能标记成仿真通过，这些留给真板。
- C 是唯一主线，不引入 C++ 或其他语言主线。
- 复活按已定稿的课程矩阵做，课程内容可以打磨，课程结构不重开。
- 本页不承诺日历排期，"近期"指动手的先后，不指日期。

## 相关链接

- [项目目录 · ST-Forge](/projects/st-forge)
- [micro-forge 规划](/plans/micro-forge)，模拟验证配套
- [学习地图 · MCU 实践](/roadmap/02-mcu/)
- [组织路线与进行中](/todo/)
- [ST-Forge GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge)
