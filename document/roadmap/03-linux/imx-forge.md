---
title: "imx-forge · i.MX6ULL"
---

# imx-forge · i.MX6ULL

> 仓库定位与验证入口见 [项目目录 · imx-forge](/projects/imx-forge)。

仓库已发布，进入成熟晚期。我们在这页只把规划收短、把定位说清，深度内容留在 imx-forge 自己的文档站和 issue 里，本站链出去，不复制。

## 定位

我们把它定位为嵌入式 Linux 的成熟入门工坊。i.MX6ULL 是单核 Cortex-A7，没有大小核和 NPU 干扰，资料充足，适合在这里第一次打通完整板级链路。

几个关键定位点：

- **全链路打透**：U-Boot、Kernel、设备树、Rootfs、驱动、Buildroot 一条龙。
- **内核轨的收敛**：我们曾以 NXP BSP 6.12.3 对比 Mainline 的双轨构建为招牌，2026 年 9 月起内核全面切到上游主线，收敛为 Mainline 单轨（当前 v7.2.9，2026-10-13 升级并真板实测），NXP 的 vendor 内核轨正式退役，仓库不再构建维护它，旧 vendor 内核内容只留参考引用，迁移经验仍作为教学内容保留。我们在别家 forge 里没见到把厂商 BSP 与主线的差异做成显式教学线索的，迁移指南和对比分析仍然在，这是 imx-forge 主打的差异。
- **Buildroot**：学习路线用 Buildroot 当载体，不碰 Yocto。
- **Docker 加 WSL2**：开发环境开箱即用，Windows 用户走 WSL2（Linux 开发在 Windows 上的正路，不用双系统）。

## 当前交付范围

我们把路线的完整 checklist 持续维护在 [issue #47](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47)，当前主要覆盖四块：

- **系统工程闭环**：板子上手、首次启动、启动介质选择、安全烧录、从空仓库到完整构建、主线内核构建、patch 工作流、常见构建失败排查。
- **rootfs 与用户空间**：BusyBox rootfs 扩展、init 流程、设备管理、网络、overlay、内核模块部署和 NFS 开发流。
- **应用开发与部署**：C / CMake 交叉编译、应用部署规范、rootfs overlay 与 NFS 两种部署、板端调试。
- **系统调试**：U-Boot、串口、网络启动、kernel panic、DTB、rootfs、NFS/TFTP 与模块加载问题。

## 链接

- [imx-forge 文档站](https://awesome-embedded-learning-studio.github.io/imx-forge/)
- [issue #47 路线追踪](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47)
- [Discussion：长期规划与社区需求](https://github.com/orgs/Awesome-Embedded-Learning-Studio/discussions/1)
