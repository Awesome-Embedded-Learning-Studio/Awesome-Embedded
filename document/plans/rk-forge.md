---
title: "rk-forge 规划"
---

# rk-forge 规划

## 这个仓库是什么

rk-forge 是面向三块 Rockchip 开发板的教学工程仓，三块板组成一条递进路线：RK3506B（32 位 Cortex-A7）负责主线 bring-up 与可靠存储，RK3568（64 位）负责 AArch64 驱动与接口工程，RK3588（64 位）负责异构计算与产品工程。每块板一张路线图，写明要教什么、按什么顺序、怎么检验、进展到哪。全仓立场是主线优先，U-Boot、Linux 内核与设备树走主线，闭源部分收缩到最小化的 rkbin blob，来源与配对约束如实记录。它与 imx-forge、h618_forge 是三个独立产品，对应不同市场的芯片，关系止于互相引用与借鉴方法。

## 现状

本节事实来自仓库 README、仓库内三张路线图与组织快照（GitHub 查询，2026-10-22）。

- RK3506B 上已经跑通一条完整基线，主线 U-Boot 2026.07 与 Linux 7.1 在 AES-RK3506B 板上运行，证据在仓库的 logs/ 目录（RK3506B 路线图第 1 章）。这个结论只对 AES-RK3506B 一块板成立，其他 RK3506 板卡即使 SoC 相同，也要重新确认设备树、存储与启动配置。
- 带编号的真板日志共 36 篇（00 到 35 号），从 2026-06-14 排到 2026-07-12。覆盖 SPI-NAND 与 UBI/UBIFS 可靠性链（含坏块与 ECC 诊断）、SD 启动与自动引导、Buildroot 最小 rootfs、OpenWrt 集成（2026-07-11 与 07-12）、以太网与 MMC/SPI 等外设 bring-up，以及 RTL8733BU Wi-Fi 驱动移植。断电与冷重启场景验证到什么程度，待核实。
- 纯主线 boot 还做不到。启动链最前段的 DDR init 依赖闭源 rkbin，板卡没有引出 JTAG，极早期阶段的改动只能反复烧录观察串口输出。
- main 分支近八条提交的主题是 OpenWrt 集成（PR #14）与 buildroot from-source 构建（PR #17），HEAD 是 e9093d3。三张路线图与 planning 索引还在 plan/rk-forge-future 分支上，提交 bbc939b（提交信息原文 "inital: add Roadmaps"），尚未合入 main。
- 三张路线图合计 1901 行，状态自标如下。RK3506B 是 partial，R0 到 R6 共 17 章。RK3568 是 planned，A0 到 A5 共 20 章。RK3588 是 planned，公共必修 H0 到 H3 共 13 章，之后在 AI/NPU、媒体、Android 三条方向课里选一条主攻（各 5 到 6 章），另有 GPU 三章选修。索引还写了入口指引，新手从 RK3506B 进，做过 Linux BSP 的从 RK3568 进，做异构、媒体、AI、Android 的从 RK3588 进，RK3588 不收零基础。
- RK3568 与 RK3588 都还没有真板 target。硬件事实确认清单没有过，RK3568 列 8 项，RK3588 列 10 项，其中"三条方向课选哪条"一项一直未定，下一节把它定为 AI/NPU。三个路线图各 3 个候选毕业项目共 9 个，全部停留在候选。
- 状态分 verified、partial、planned、blocked 四档。verified 要求日志、产物、配置齐备，且第二个人能在板上复现，跑通一次或厂商 SDK 能跑都不算。RK3506B 要升档就得逐章补齐真板证据，仓库里还缺一张逐章状态表。
- 外部指标：star 53，fork 9，开放 issue 5，贡献者 2 人，最后推送 2026-09-21，homepage 指向 Pages 在线站。路线图引用的 tutorial/ 正文与 logs/ 的互链是否闭合，待核实。

## 下一代方向

设备端 AI 是工作室排队中的首个应用方向，与[路线与进行中](/todo/)的登记呼应，而它需要的第一块硬件就是 RK3588 的 NPU。因此 rk-forge 的下一段主线定为 RK3588 线，三条方向课先走 AI/NPU（NPU 章文本已写好，第 14N 到 18N 章）。RK3506B 转入补齐证据的低强度维护，RK3568 保持 planned 不动工，它在[学习地图](/roadmap/)SoC 顺序里的位置不变。

这么排有几件事撑着。

- NPU 章的课程文本已经写好，缺的只是真板 target、版本基线与证据。三条线里它的启动成本最低，RK3568 连板都还没有，RK3506B 的课程增量已经写完，剩下的都是补证据。
- 硬件事实确认清单里的硬项是真板数量与散热电源，维护者手里已经有 RK3588 板，其余各项是把事实查清填表的确认工作，不是新研发。
- RK3506B 的密集工程期在 2026 年 6 到 7 月已经完成，剩下的收尾工作按维护节奏做。继续把它当主攻会摊薄三条线的投入。

两个备选没有采纳。三板齐推会让哪条线都攒不出证据。只补 RK3506B 的证据、RK3588 继续搁置，则设备端 AI 启动时就没有硬件可跑，方向悬在纸面上。

没有板的读者也在服务范围内。rk-forge 已有的构建链、首次启动与救援流程能产出可运行镜像，把现有镜像整理成可分发的 Release，是 RK3588 线启动后的候选项。

RK3588 线算启动完成的标志是真板基线进了仓库，NPU 章从课程文本变成有证据的 partial。在那之前，rk-forge 按维护节奏流转。

待定项：

- 真板镜像是否整理成可分发的 Release，做不做与何时做，待定。
- RK3506B 补证据的节奏，随维护逐章补还是集中一次补齐，待定。

## 近期要做的事

三件按先后排。第一件是纯文档工作，后两件需要板子与配件到位，到位快的话可以并行做。

### 老规划重构后合入 main

改 planning 索引里状态与图例不匹配的地方，把 RK3588 的方向小节按上文改写（三条方向课改为 AI/NPU 先行），给 RK3506B 补一张逐章证据状态表，17 章每章标日志、产物、配置三样齐不齐，课程正文不动。这一件做完的标志是 plan 分支的内容以一个 PR 合进 main，合完后仓库里没有"三选一未定"这类悬空表述，逐章表与 logs/ 里实际存在的日志对得上。

### RK3588 硬件事实确认清单的答案表

对应 RK3588 路线图第 12 节的 10 项，覆盖板卡型号与 PCB、DRAM、启动存储、调试与烧录入口、接口、配套屏与摄像头 sensor 及 IQ 文件、SDK 与 MPP/RKNN 栈版本、散热电源、真板数量。这一件做完的标志是 10 项每项有确定答案或明确标未定，答案表写进仓库的 planning/ 目录，主攻方向一项填 AI/NPU。

### NPU 章的首个真板基线

内容包括 rkbin、U-Boot、Linux、RKNN 工具链的版本 pin 清单，一份从上电第一行到 login 提示符的完整 bootlog，RKNN 工具链与模型格式的版本配对记录，以及一次在板上跑通的模型推理日志。这一件做完的标志是 bootlog 里的版本号与 pin 清单一一对得上，推理日志与配对记录写进仓库存档。按四档状态口径，这份基线只是 partial 的起点，可复现证据齐了才升档。

## 边界与不做的事

- 三个 forge 互相独立，与 imx-forge、h618_forge 的关系止于互相引用与借鉴方法，不合并不抽公共模板。
- RK3568 本周期不排期不购板，planned 状态如实保留，它在学习地图里的位置不动。
- 不承诺纯主线 boot。DDR init 卡在没有 JTAG 的极早期，仓库只维护 blob 边界的诚实记录，不立自研时间表。
- 板卡事实确认之前，不写 RK3588 的 pinout、分区与镜像布局细节。
- 不做多平台抽象层或跨板框架，不为了抽象破坏现有基线。
- 三条路线边界互斥，SPI-NAND 与 UBIFS 主课只在 RK3506B，NPU、复杂 ISP/VPU 与 Android 只在 RK3588，三块板不默认共享固件、U-Boot、设备树、内核配置与镜像。
- GUI 框架线归 visor，桌面线归 vesper，两个仓库即将公开，公开后补入口，rk-forge 里不出现对应内容。
- 状态口径沿用四档，跑通一次不标 verified，厂商 SDK 跑通也不算。
- 中文先行，英文翻译后置。本页不承诺任何日期。

## 相关链接

- 项目目录：[rk-forge](/projects/rk-forge)
- 学习地图：[rk-forge · Rockchip 平台](/roadmap/03-linux/rk-forge)
- 排队中的应用方向：[路线与进行中](/todo/)
- 仓库：[GitHub · rk-forge](https://github.com/Awesome-Embedded-Learning-Studio/rk-forge)，[在线文档站](https://awesome-embedded-learning-studio.github.io/rk-forge/)
- 方向出处：仓库内三张路线图（RK3506B_ROADMAP.md、RK3568_ROADMAP.md、RK3588_ROADMAP.md，目前在 plan/rk-forge-future 分支）
- 姊妹仓：[imx-forge 规划](/plans/imx-forge)，[h618_forge 项目页](/projects/h618-forge)
- 全部规划：[项目规划](/plans/)
