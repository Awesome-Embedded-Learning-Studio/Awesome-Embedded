---
title: "嵌入式 Linux 实践"
---

# 嵌入式 Linux 实践

在这一方向里，我们把工具、C/C++ 和 Linux 基本功带上真实 ARM 板，构建并启动 U-Boot、内核和 rootfs，修改设备树与驱动，部署用户空间程序，最后留下可复查的板端证据。

## 怎样选择平台

```mermaid
flowchart TD
    accTitle: 嵌入式 Linux 学习路径
    accDescr: 从第一块板级 Linux 出发，在 imx-forge 与 rk-forge 之间按目标平台选择路径。
    START["第一次完整学习板级 Linux"] --> IMX["imx-forge · i.MX6ULL<br/>打通较简单的完整链路"]
    IMX -. 建议继续而非强制 .-> RK["rk-forge · Rockchip 工作区"]
    DIRECT["已有 BSP 经验或目标板明确"] --> RK
    RK --> RK32["RK3506B<br/>32 位工业平台"]
    RK --> RK64["RK3568<br/>64 位通用平台"]
    RK --> RK8["RK3588<br/>高性能异构平台"]
    REF["h618_forge · H618 主线化实践"] -. 横向参考 .-> IMX
    REF -. 横向参考 .-> RK
```

图在窄屏可以左右滑动，点右下角的按钮放大。

- [imx-forge](/roadmap/03-linux/imx-forge) 适合第一次打通完整链路。i.MX6ULL 平台较简单，资料充足，仓库已经形成版本发布、可复现构建和真板验收。
- [rk-forge](/roadmap/03-linux/rk-forge) 面向 RK3506B、RK3568 和 RK3588。三块板共享工作区和方法，但不共享未经区分的 ABI、工具链和构建产物。学习者按背景和目标选择，不要求依次购买全部开发板。
- [h618_forge](/projects/h618-forge) 提供 Allwinner H618 的主线 U-Boot、TF-A（ARM Trusted Firmware，启动链中的可信固件）、Linux 与 rootfs 横向参考，不是固定后继路线。它定位为支线，内容延后更新，适合手头有板的学习者作横向对照。

## 系统知识与平台实践允许交叉

[PenguinLab](/projects/penguin-lab) 用 QEMU 解释通用 Linux 内核、系统编程和调试机制。不买板也能开工，拿它把内核机制过一遍，等 BSP（板级支持包，厂商为具体板卡提供的内核、bootloader 与板级软件包）实践里被中断、内存、驱动或调试的问题卡住了，再回来深化。

[devtree-journey](/projects/devtree-journey) 用讲义加可跟跑实验讲 Linux 与 U-Boot 的设备树，每个实验自带命令与验收条件。你可以在进入平台前拿它练手，也可以等改设备树改出问题时回来查。

平台 forge（imx-forge、rk-forge、h618_forge 这类围绕具体 SoC 平台组织的教学仓库）仍然会把必要的内容放回具体上下文里重新解释。我们会在 QEMU 里观察内核机制，但这不等于已经理解某块 SoC 的启动链、厂商补丁、设备树和电气事实。

## 工程项目与基建

| 仓库 | 职责 | 与平台 forge 的关系 |
|---|---|---|
| [CFBox](/projects/cfbox) | Linux userspace 高阶工程 | 已通过 imx-forge 在真板上作为 PID 1 验证 |
| [buildmeter](/projects/buildmeter) | 长时间构建的进度与可观测性基建 | 被 imx-forge 和 rk-forge 以固定版本消费，不是学习节点 |
| [lightroot](/projects/lightroot) | typed IR、依赖和 rootfs 的构建系统实验 | 最小 QEMU/真板 rootfs 闭环完成前，不宣称替代 Buildroot |

我们的产品项目会拿这些平台做部署和验收，但我们不会把它们说成嵌入式 Linux 课程的统一终点。

## 验收证据

我们希望平台仓库尽量留下可以复查的交付证据：源码版本、工具链和配置、构建命令、产物 hash、串口或测试日志、目标板信息、已知限制和迁移说明。QEMU 能把学习门槛降下来，但启动介质、外设、电气和平台兼容，最后还是要靠真板验证。
