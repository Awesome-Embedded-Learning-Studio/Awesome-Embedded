---
title: "项目一览"
---

Awesome-Embedded-Learning-Studio 旗下所有开源项目和教程，按**五条主线**分类。一个仓库可能同时属于两条线，但这里只给出它的主位置，避免重复刷屏。

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
<ProjectCard name="Project_MakeAMemroyPool" link="/projects/project-make-a-memory-pool"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Project_MakeAMemroyPool"
  lang="C++" status="active" :beginner="true">
配合 B 站视频的内存池实战，从 FreeList 到 ThreadLocal 逐步实现
</ProjectCard>
<ProjectCard name="CFBox" link="/projects/cfbox"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/CFBox"
  lang="C++" status="active">
C++23 实现的现代 BusyBox 替代品，109 个 Unix 工具小程序，446KB 极致体积；同时是 Linux / System Programming 线的 userspace 实验载体
</ProjectCard>
<ProjectCard name="Project_CXXBaseComponents" link="/projects/project-cxx-base-components"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Project_CXXBaseComponents"
  lang="C++" status="active" :beginner="true">
B 站动画系列配套源码，含 ArgParser、FileCopier、IniParser 等渐进式实战项目
</ProjectCard>
<ProjectCard name="edgecv" link="/projects/edgecv"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/edgecv"
  lang="C++" status="developing">
C++20 编译期类型安全计算机视觉库，零拷贝视图 + Pipeline 组合
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
<ProjectCard name="rk-forge" link="/projects/rk-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/rk-forge"
  status="active">
Rockchip 平台开发者工作空间，脚本库 + 驱动参考 + 结构化补丁管理
</ProjectCard>
<ProjectCard name="rtl8733bu-linux-driver" link="https://github.com/Awesome-Embedded-Learning-Studio/rtl8733bu-linux-driver"
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
</ProjectGrid>

> 这条线还交叉了 [CFBox](/projects/cfbox)（Unix 工具 + userspace，见 Modern C++）与 [PenguinLab](/projects/penguin-lab)（内核与调试，见 Embedded Linux）。Cinux 家族三件套：[Cinux](/projects/cinux)（前沿实验版）/ [Cinux-Book](/projects/cinux-book)（手把手教学版）/ [Cinux-Base](/projects/cinux-base)（freestanding 基础库）。

## MCU / 裸机 / FreeRTOS

裸机、FreeRTOS、MCU 模拟、资源受限平台。

<ProjectGrid>
<ProjectCard name="ST-Forge" link="/projects/st-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge"
  lang="C" status="developing">
STM32 HAL 驱动框架，CMake 原生构建，不依赖 IDE
</ProjectCard>
<ProjectCard name="BareMetal-Drivers" link="/projects/baremetal-drivers"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers"
  lang="C" status="active">
单片机裸机通用驱动库，涵盖 GPIO、I2C、OLED、图形渲染、UI 组件
</ProjectCard>
<ProjectCard name="Project_MicroWatch" link="/projects/project-micro-watch"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Project_MicroWatch"
  lang="C" status="developing">
资源受限平台智能手表原型，规划了 DinoGame / 计步 / 指南针
</ProjectCard>
<ProjectCard name="micro-forge" link="/projects/micro-forge"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/micro-forge"
  lang="C++" status="active">
ARM Cortex-M3 (STM32F103) 全系统模拟器，无需硬件即可运行和调试固件
</ProjectCard>
<ProjectCard name="Tutorial_FreeRTOS" link="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS"
  lang="—" status="planned">
FreeRTOS 系列开源教程
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
基于 Qt6 的嵌入式 Material Design 3 桌面框架，性能自适应 ARM 到 RK3588
</ProjectCard>
<ProjectCard name="qt-compile-pipeline" link="/projects/qt-compile-pipeline"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/qt-compile-pipeline"
  lang="Shell" status="active">
Qt6 ARM 交叉编译自动化管道，配置极简、一键构建、幂等设计
</ProjectCard>
</ProjectGrid>

> `visor` 是规划中的跨平台 C++ GUI framework / 平台抽象实验，目标覆盖桌面、嵌入式 Linux 与实验 OS 环境，目前处于早期探索，尚未公开文档。

## 通用工具与教程

<ProjectGrid>
<ProjectCard name="EmbedBox" link="https://github.com/Awesome-Embedded-Learning-Studio/EmbedBox"
  repo="https://github.com/Awesome-Embedded-Learning-Studio/EmbedBox"
  lang="—" status="active">
嵌入式开发通用工具教程，覆盖嵌入式开发常用工具的使用
</ProjectCard>
</ProjectGrid>

## 敬请期待

以下项目正在开发中，暂未公开：

<ProjectGrid>
<ProjectCard name="miniwget" status="developing">
手把手迭代实现 miniwget，C++ 网络编程教学项目
</ProjectCard>
<ProjectCard name="bareline" status="developing">
Modern C++23 shell framework，零开销可移植
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
