---
title: "项目一览"
---

Awesome-Embedded-Learning-Studio 当前公开的项目和教程，按**六个主要方向**分类。一个仓库可能同时属于多个方向，但这里只给出它的主位置；组织管理仓库单列在末尾。

> 状态基线：2026-07-25。这里用于导航，不复制各仓完整进度；版本、测试数量和硬件验收以后者当前 README 与记录为准。私有的 `esp-forge` 只出现在路线图中。

## Modern C++

C++ 学习、工程化、库设计与系统软件基础。

<ProjectGrid>
<ProjectCard name="Tutorial_AwesomeModernCPP" link="/projects/tutorial-awesome-modern-cpp"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP"
  lang="C++" status="active" :beginner="true">
10 卷体系现代 C++ 系统教程（C++11~C++23），涵盖 STL、并发、性能、嵌入式实战与开源项目研读
</ProjectCard>
<ProjectCard name="Tutorial_cpp_SimpleIniParser" link="/projects/tutorial-cpp-simple-ini-parser"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_cpp_SimpleIniParser"
  lang="C++" status="active" :beginner="true">
手搓 INI 解析器，配套 B 站 12 集视频的 C++ 工程化入门实战
</ProjectCard>
<ProjectCard name="anatomy_memory" link="/projects/anatomy-memory"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/anatomy_memory"
  lang="C++" status="active" :beginner="true">
内存池实战教程，从 FreeList 到 ThreadCache、CentralPool 逐层拆解内存分配器
</ProjectCard>
<ProjectCard name="CFBox" link="/projects/cfbox"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/CFBox"
  lang="C++" status="active">
C++23 实现的现代 BusyBox 替代品，123 个 Unix 工具小程序、399 项测试，体积优化构建约 418 KB；已在 i.MX6ULL 上作为 PID 1 运行
</ProjectCard>
<ProjectCard name="engineering_cpp" link="/projects/engineering-cpp"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/engineering_cpp"
  lang="C++" status="active" :beginner="true">
《现代 C++ 工程实践》配套 hub：ArgParser、FileCopier、DirScanner 等项目统一构建，并以 submodule 串联 IniParser 与 anatomy_memory
</ProjectCard>
<ProjectCard name="edgecv" link="/projects/edgecv"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/edgecv"
  lang="C++" status="developing">
C++20 编译期类型安全计算机视觉库，零拷贝视图 + Pipeline 组合
</ProjectCard>
<ProjectCard name="aex" link="/projects/aex"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/aex"
  lang="C++" status="developing">
组织级 header-only C++ 基座库（expected / scope_guard / weak_ptr / lockfree …），只依赖标准库，桌面到 MCU 通吃
</ProjectCard>
<ProjectCard name="C-Journey" link="/projects/c-journey"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/C-Journey"
  lang="C" status="active">
C 进阶学习日志 + 社区枢纽，8 阶段从语法基础走到系统编程与嵌入式 C，提供可落地的 C 工程路线图
</ProjectCard>
</ProjectGrid>

## Embedded Linux

板级 Linux、BSP、驱动、构建与移植。

<ProjectGrid>
<ProjectCard name="imx-forge" link="/projects/imx-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/imx-forge"
  lang="Shell" status="active">
面向 i.MX6ULL 的嵌入式 Linux 开发工坊，Docker 一键环境，双轨内核（BSP + Mainline）
</ProjectCard>
<ProjectCard name="h618_forge" link="/projects/h618-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/h618_forge"
  lang="Shell" status="active">
面向 LubanCat-A1 / Allwinner H618 的 pure-mainline 工作空间：主线 U-Boot、Linux、自建 Buildroot rootfs 与 HDMI 板上验证
</ProjectCard>
<ProjectCard name="rk-forge" link="/projects/rk-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/rk-forge"
  status="active">
Rockchip 双架构工作空间：32 位 RK3506B 加 64 位 RK3568 / RK3588，脚本、驱动、补丁与 rootfs 分板管理
</ProjectCard>
<ProjectCard name="lightroot" link="/projects/lightroot"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/lightroot"
  lang="C++" status="developing">
更易用的 Buildroot 风格 rootfs 构建器；当前处于 Stage 1，已具备配置、包索引与 i.MX6ULL 镜像路线
</ProjectCard>
<ProjectCard name="buildmeter" link="/projects/buildmeter"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/buildmeter"
  lang="Python" status="active">
为 Linux Kernel、U-Boot 与 Buildroot 的 GNU make 构建提供实时进度、阶段与 ETA
</ProjectCard>
<ProjectCard name="rtl8733bu-linux-driver" link="/projects/rtl8733bu-linux-driver"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/rtl8733bu-linux-driver"
  lang="C" status="developing">
Realtek RTL8733BU USB WiFi+BT 驱动的 Linux 7.1 out-of-tree 移植（fork 自 wirenboard，GPL-2.0），填补该芯片无主线驱动的空白
</ProjectCard>
<ProjectCard name="PenguinLab" link="/projects/penguin-lab"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/PenguinLab"
  lang="Shell" status="active">
基于 QEMU 的 Linux 内核学习站，6 层知识图谱 89 节点，多架构支持；也覆盖 System Programming 线的内核与调试实验
</ProjectCard>
</ProjectGrid>

## Linux / System Programming

Linux 用户态、内核理解、OS 实验与 Unix 工具——把“系统软件”这条线讲清楚。

<ProjectGrid>
<ProjectCard name="Cinux" link="/projects/cinux"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Cinux"
  lang="C++" status="developing">
现代 C++17 实现的 x86_64 操作系统实验项目，从 Bootloader 到 GUI 桌面全链路，含 Ext2 文件系统、多进程多终端与 Ring 3 用户态；Cinux 家族的前沿实验版
</ProjectCard>
<ProjectCard name="Cinux-Book" link="/projects/cinux-book"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Book"
  lang="C++" status="active" :beginner="true">
Cinux 的手把手教学版：从零写 x86_64 操作系统的中文教程，10 阶段从 Bootloader 走到 GUI 桌面，Ubuntu 24.04 默认工具链即可构建
</ProjectCard>
<ProjectCard name="Cinux-Base" link="/projects/cinux-base"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Base"
  lang="C++" status="active">
Cinux 的 freestanding 基础类型库：C++17、零堆 / 零异常 / 零 RTTI，20 个 constexpr 核心组件，内核与用户态共用
</ProjectCard>
<ProjectCard name="Cinux-GUI" link="/projects/cinux-gui"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Cinux-GUI"
  lang="C++" status="developing">
Cinux 家族的 host-neutral GUI 核心：宿主差异收敛到一张函数指针表，今天驱动 Cinux 内核，明天可换 SDL/X11/Wayland 适配，核心零宿主依赖
</ProjectCard>
</ProjectGrid>

> 这条线还交叉了 [CFBox](/projects/cfbox)（Unix 工具 + userspace，见 Modern C++）与 [PenguinLab](/projects/penguin-lab)（内核与调试，见 Embedded Linux）。Cinux 家族四件套：[Cinux](/projects/cinux)（前沿实验版）/ [Cinux-Book](/projects/cinux-book)（手把手教学版）/ [Cinux-Base](/projects/cinux-base)（freestanding 基础库）/ [Cinux-GUI](/projects/cinux-gui)（host-neutral GUI 核心）。

## MCU / 裸机 / FreeRTOS

裸机、FreeRTOS、MCU 模拟、资源受限平台。

<ProjectGrid>
<ProjectCard name="ST-Forge" link="/projects/st-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge"
  lang="C" status="developing">
STM32F1 / Cortex-M3 教学工坊，从启动和寄存器到 HAL 对照，CMake 原生构建
</ProjectCard>
<ProjectCard name="BareMetal-Drivers" link="/projects/baremetal-drivers"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers"
  lang="C" status="active">
单片机裸机通用驱动库，涵盖 GPIO、I2C、OLED、图形渲染、UI 组件
</ProjectCard>
<ProjectCard name="Project_MicroWatch" link="/projects/project-micro-watch"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Project_MicroWatch"
  lang="C" status="planned">
资源受限 Cortex-M 智能手表 WIP；硬件与主要功能仍在规划，作为 st-forge 方向的远期项目候选
</ProjectCard>
<ProjectCard name="micro-forge" link="/projects/micro-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/micro-forge"
  lang="C++" status="active">
ARM Cortex-M3 (STM32F103) 全系统模拟器，支持真实 HAL 固件、可选 Qt6 GUI 与 hooks，当前有 353 个 GoogleTest 用例
</ProjectCard>
<ProjectCard name="Tutorial_FreeRTOS" link="/projects/tutorial-freertos"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS"
  lang="C" status="active">
无硬件主机的 FreeRTOS 教程：PC 上跑通《Mastering the FreeRTOS Kernel》全部内核示例，双轨 POSIX/MSVC 模拟 + Mock HAL
</ProjectCard>
<ProjectCard name="bareline" link="/projects/bareline"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/bareline"
  lang="C++" status="active">
零开销 header-only C++23 裸机 shell 库，命令编译期注册、无堆无异常，已在 STM32F103 真机跑通
</ProjectCard>
</ProjectGrid>

## Qt / GUI / 产品化

Qt、跨平台 GUI、嵌入式桌面、产品化界面。

<ProjectGrid>
<ProjectCard name="Tutorial_AwesomeQt" link="/projects/tutorial-awesome-qt"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt"
  lang="TypeScript" status="active" :beginner="true">
Qt 6 百科全书式教程，三层分级（入门/进阶/专家），从第一行代码到读懂 Qt 源码
</ProjectCard>
<ProjectCard name="CFDesktop" link="/projects/cfdesktop"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/CFDesktop"
  lang="C++" status="developing">
Qt6 嵌入式桌面框架；base / HWTier 已就绪，当前在打通桌面点击图标启动应用的最小闭环，嵌入式后端仍待建设
</ProjectCard>
<ProjectCard name="CFDeskit" link="/projects/cfdeskit"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/CFDeskit"
  lang="C++" status="developing">
CFDesktop 生态的独立 Qt6 小应用集合，通过进程隔离运行，复用 QuarkWidgets
</ProjectCard>
<ProjectCard name="CF-Gallery" link="/projects/cf-gallery"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/CF-Gallery"
  lang="TypeScript" status="active">
CFDesktop 的独立摄影与壁纸资源站；运行时安装资源包，不与桌面形成编译期耦合
</ProjectCard>
<ProjectCard name="QuarkWidgets" link="/projects/quark-widgets"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/QuarkWidgets"
  lang="C++" status="developing">
组织级统一 Qt6 / Material Design 3 组件库，5 层管线 + 19 个 MD3 widget，500 测试，构筑在 aex 之上
</ProjectCard>
<ProjectCard name="qt-compile-pipeline" link="/projects/qt-compile-pipeline"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/qt-compile-pipeline"
  lang="Shell" status="active">
Qt6 ARM 交叉编译自动化管道，配置极简、一键构建、幂等设计
</ProjectCard>
</ProjectGrid>

> `visor` 是推迟建设的跨平台 C++ GUI framework / 平台抽象规划。当前不作为活跃项目投入；相关想法保留在专题规划中。

## 通用工具与教程

<ProjectGrid>
<ProjectCard name="EmbedBox" link="/projects/embedbox"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/EmbedBox"
  lang="TypeScript" status="active">
嵌入式开发通用工具教程：终端 / Git / Markdown / GCC / Make / CMake / GDB / 交叉编译 / 串口 / Docker / QEMU，进具体航线前的工具链前置课
</ProjectCard>
<ProjectCard name="Tutorial_AwesomeHardware" link="/projects/tutorial-awesome-hardware"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeHardware"
  lang="TypeScript" status="active">
面向嵌入式学习者的硬件学习笔记站，电源与功率变换（23 章）已上线，电路/模拟/数字/PCB/传感器/接口/板级调试规划中
</ProjectCard>
</ProjectGrid>

## 组织管理

| 项目 | 简介 |
|------|------|
| [Awesome-Embedded](https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded) | 组织中心导航仓库（本仓库） |
| [.github](https://github.com/Awesome-Embedded-Learning-Studio/.github) | 组织 Profile 仓库 |
| [community](https://github.com/Awesome-Embedded-Learning-Studio/community) | 组织级讨论、公告与问答 |

## 统计

<OrgStats />
