---
title: "bootflint 规划"
---

# bootflint 规划

## 这个仓库是什么

bootflint 是组织的手搓 bootloader 教学仓，当前为私有仓库，准备公开，公开后补入口。仓库名定于 2026-10-16，此前用名 aboot，因与高通安卓生态的 bootloader 重名而弃用。

它的定位是故事化教学的玩具 bootloader，最终形态是一个启动菜单，能拉起四类负载：裸机与 RTOS 镜像、自研内核（以 [Cinux](/projects/cinux) 为例）、嵌入式 Linux、经标准接口（Multiboot2 与 EFI）接管的现成引导器。接手位置是厂商固件移交控制权之后的那一级，BootROM、DDR 训练 blob、TF-A（ARM Trusted Firmware）的 BL31 都不在范围内。这一定位来自仓库内规划文档 document/outline.md。

与 forge 线的分工：[imx-forge](/projects/imx-forge)、[rk-forge](/projects/rk-forge) 与 [h618_forge](/projects/h618-forge) 在 Cortex-A 板上把 U-Boot 这类现成引导器当基础设施，教学重心在 Linux 侧的板级链路（内核、设备树、根文件系统、驱动）。bootflint 教的是引导器本身，从亲手写出来开始。v1 从 Cortex-M 起步，目标板 STM32F103C8T6（Blue Pill 开发板），第一档主线是串口 IAP，即运行中的固件经串口接收并写入新镜像的更新方式。起步于 Cortex-M 不是终点固定在这一级，四档路线里更高级的档位排在后面。

四档路线来自 outline.md 与 README 的第一档速览：第一档 Cortex-M 串口 IAP，第二档 x86 BIOS 线（引导 Cinux），第三档 64 位 DTB 世界（RISC-V 打头），第四档工业收口。大纲头部自标“建议，未立项，未圈选（2026-10-16）”，是方向建议，不是排期承诺。

## 现状

本节的数字与事实来自仓库 README、仓库内 document/ 目录与仓库工作区状态，查询日期为 2026-10-22。

仓库 2026-10-21 建立，当前为私有，star 为 0。远端 main 只有一个提交 a58973f（feat: initial commit），本地 main 与远端同步。

README 的现状段写明已就位的地基：镜像格式 v1 定稿（document/image-format.md），主机侧（PC 端）工具 bootflint v0.1.0，带 keygen、sign、dump 三个子命令，是 tools/ 下基于 uv（Python 的包与工具链管理器）的工程，另有 QEMU mps2-an385 测试床，CMake 构建，首次运行已跑通。

教程第一章（复位与串口）成文，落在 document/journey/01-reset-and-uart/，第二章（镜像格式）写作中。顶层已有 src/、include/、cmake/、tools/、document/ 的工程骨架。

工作区截至 2026-10-22 有一批未提交改动，包括 README 修改、image-format-draft.md 改名为 image-format.md（镜像格式从草稿转正）、主机侧工具与测试共五个文件修改，以及新增的 magic-bflt-collision-check.md。

仓库内另有两份底料。document/outline.md 是四档大纲。document/research-digest.md 是 9 路生态扫描加逐路对抗核查（对每一路结论反向找证据复核），逐条给出出处，其中厂商引导链一路未完成对抗核查，引用处已标明。

## 下一代方向

主推把第一档走通，从 QEMU 测试床走到 Blue Pill 开发板，跑通含镜像校验的串口更新全流程。镜像格式、主机侧工具与测试床都已就位，第一档是这些地基的第一个完整使用者，走通它，教学主线才有从工具到板上的完整证据链。

首个最小工程在两个候选里二选一，候选是最小应用跳转与含镜像校验的串口更新。README 的第一档定位是串口 IAP，镜像格式又带签名能力（keygen 与 sign），实践已偏向后者，正式范围登记为待定项。

方向上还没定下来的，登记为待定项。

- 首个最小工程的正式范围。两个候选里仓库实况偏向含镜像校验的串口更新，最终怎么定，待定。
- [micro-forge](/projects/micro-forge) 补 FLASH 模型做配套。这要等模拟器仓库重写收官后按需求排，是否做、何时做，待定。
- 四档大纲第二档（x86 BIOS 线）及以后的圈选与排期。大纲自标为建议稿，待定。

## 近期要做的事

- 把工作区未提交改动收尾成提交，内容是镜像格式转正与主机侧工具修改。做完的标志是 main 上出现对应提交，README 现状段随之更新。
- 教程第二章（镜像格式）成文。做完的标志是 document/journey/ 下的第二章与 image-format.md 的内容对得上。
- 第一档主线的第一次开发板验证，在 Blue Pill 上跑通串口更新流程。做完的标志是编译、烧录与板上观察的记录都对应具体板型与版本，模拟通过不写成硬件通过。

## 边界与不做的事

- 不碰厂商固件之前的部分。BootROM、DDR 训练 blob、TF-A 的 BL31 都不在范围内，接手位置是厂商固件移交控制权之后的那一级。
- v1 不扩 OTA 等范围。生产级 bootloader 是远景，不作为 v1 的要求，v1 的验收以教学闭环为准。
- 第一档引导的下一个镜像用 [ZerOS](/projects/zeros) 的长期个人 fork，不动 ZerOS 上游。
- 四档大纲是建议稿，本页不因它承诺任何一档的启动时间。
- 本页不承诺日历排期，“近期”指动手的先后，不指日期。

## 相关链接

- [学习地图 · MCU 实践](/roadmap/02-mcu/)
- [组织路线与进行中](/todo/)
- bootflint 仓库：当前私有，公开后补入口
- 相邻项目：[micro-forge](/projects/micro-forge)（FLASH 模型联动候选）、[ZerOS](/projects/zeros)（第一档引导目标的上游）、[Cinux](/projects/cinux)（第二档 x86 线的引导对象）、[imx-forge](/projects/imx-forge)、[rk-forge](/projects/rk-forge)、[h618_forge](/projects/h618-forge)（forge 线，分工见上）
