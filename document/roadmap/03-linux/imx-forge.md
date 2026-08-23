---
title: "imx-forge · i.MX6ULL"
---

# imx-forge · i.MX6ULL

已发布，进入成熟晚期。这页做规划凝练和定位，深度内容在 imx-forge 自己的文档站和 issue 里，中心站链出去，不复制。

## 定位

嵌入式 Linux 的成熟入门工坊。i.MX6ULL 是单核 Cortex-A7，没有大小核和 NPU 干扰，资料充足，适合在这里第一次打通完整板级链路。

几个关键定位点：

- **全链路打透**：U-Boot、Kernel、设备树、Rootfs、驱动、Buildroot 一条龙。
- **双轨内核是招牌**：NXP BSP 6.12.3 对比 Mainline 7.1，带迁移指南和对比分析。业界少有 forge 把“厂商 patch 对比主线”做成显式教学线索，这是 imx-forge 的头号卖点。
- **Buildroot**：学习路线用 Buildroot 当载体，不碰 Yocto。
- **Docker 加 WSL2**：开发环境开箱即用，Windows 用户走 WSL2（Linux 开发在 Windows 上的正路，不用双系统）。

## 当前交付范围

imx-forge 的路线在 [issue #47](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47) 里持续维护。当前主要覆盖四块：

- **系统工程闭环**：板子上手、首次启动、启动介质选择、安全烧录、从空仓库到完整构建、BSP 加主线双轨构建、patch 工作流、常见构建失败排查。
- **rootfs 与用户空间**：BusyBox rootfs 扩展、init 流程、设备管理、网络、overlay、内核模块部署和 NFS 开发流。
- **应用开发与部署**：C / CMake 交叉编译、应用部署规范、rootfs overlay 与 NFS 两种部署、板端调试。
- **系统调试**：U-Boot、串口、网络启动、kernel panic、DTB、rootfs、NFS/TFTP 与模块加载问题。

完整 checklist 和进度见 #47。

## 链接

- [imx-forge 文档站](https://awesome-embedded-learning-studio.github.io/imx-forge/)
- [issue #47 路线追踪](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47)
- [Discussion：长期规划与社区需求](https://github.com/orgs/Awesome-Embedded-Learning-Studio/discussions/1)
