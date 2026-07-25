---
title: "imx-forge · i.MX6ULL"
---

# imx-forge · i.MX6ULL

已发布，进入成熟晚期。这页做规划凝练和定位，深度内容在 imx-forge 自己的文档站和 issue 里，中心站链出去，不复制。

## 定位

P2 的入门主线。i.MX6ULL 是单核 Cortex-A7，最简单，没有大小核和 NPU 干扰，资料最厚（正点原子、韦东山、野火三家），适合在这里打透嵌入式 Linux 全链路。

几个关键定位点：

- **全链路打透**：U-Boot、Kernel、设备树、Rootfs、驱动、Buildroot 一条龙。
- **双轨内核是招牌**：NXP BSP 6.12.3 对比 Mainline 7.1，带迁移指南和对比分析。业界少有 forge 把“厂商 patch 对比主线”做成显式教学线索，这是 imx-forge 的头号卖点。
- **Buildroot**：学习路线用 Buildroot 当载体，不碰 Yocto。
- **Docker 加 WSL2**：开发环境开箱即用，Windows 用户走 WSL2（Linux 开发在 Windows 上的正路，不用双系统）。

## 工作规划（凝练自 #47）

imx-forge 的路线在 [issue #47](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47) 里拆成了 checklist，常青藤持续更新。凝练下来四块：

- **P0 系统工程主线闭环**：板子上手、首次启动、启动介质选择、安全烧录、从空仓库到完整构建、BSP 加主线双轨构建、patch 工作流、常见构建失败排查。
- **P0 rootfs 与用户空间**：BusyBox rootfs 扩展、init 流程、mdev 和 fstab 和网络、rootfs overlay、内核模块部署和开机加载、NFS 开发流、挂载失败排查。
- **P1 应用开发与部署**：C / CMake 交叉编译、Qt 最小应用、Qt 触摸屏配置、字体和输入设备、应用部署规范、rootfs overlay 和 NFS 两种部署、板端调试。
- **P1 系统调试手册**：U-Boot 常见问题、串口无输出、网络启动、kernel panic、DTB 不匹配、rootfs 和 init 失败、NFS / TFTP、模块加载失败、串口日志阅读、提交有效调试日志。

完整 checklist 和进度见 #47。

## 可做项目（待做）

接 [issue #94](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/94) 的草案：7 个板载零采购 demo，梯度是 system → 闭环 → Qt 触摸。

- **system 阶段**：首次启动、build 跑通、rootfs 定制。
- **闭环阶段**：SD / eMMC 启动、NFS 开发流、内核模块加载。
- **应用阶段**：Qt 触摸屏应用。

7 个项目的具体清单待 #94 补全（现在还是草案），这节标待做。

从老 planning 收的候选项目点子（供 #94 参考）：工业网关（Modbus RTU 转 TCP）、音频采集（ALSA）、完整 OTA（差分 / 回滚）、摄像头加 OpenCV 本地视觉。

## 链接

- [imx-forge 文档站](https://awesome-embedded-learning-studio.github.io/imx-forge/)
- [issue #47 路线追踪](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47)
- [issue #94 项目梯度草案](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/94)
- [Discussion：长期规划与社区需求](https://github.com/orgs/Awesome-Embedded-Learning-Studio/discussions/1)
