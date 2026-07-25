---
title: "rk-forge · Rockchip 平台"
---

# rk-forge · Rockchip 平台

> 仓库状态：公开，三板课程路线已经定稿。workspace 已有，具体内容由 rk-forge 按自己的节奏建设。

rk-forge 是 Rockchip 平台对位 imx-forge 的工作区，但它不是一条单一架构的线性升级链。仓库同时覆盖 **RK3506B 的 ARMv7-A / 32 位路线**，以及 **RK3568、RK3588 的 ARMv8-A / 64 位路线**。三块板共享 Linux BSP、驱动与产品化方法，但工具链、ABI、启动架构和 rootfs 产物必须分开管理。

目标是在 RK3506B 上保留清晰的 32 位工业平台入口，在 RK3568 上打磨通用 64 位驱动，在 RK3588 上继续进入 NPU、GPU、媒体和 Android。

## 定位

- **真板闭环**：组织已有 RK3506B、RK3568、RK3588，课程按目标板保存构建配置、启动日志和验证记录；“计划在真板验收”不等于“当前每节都已经验过”。
- **双架构工作区**：RK3506B 走 32 位路线；RK3568 / RK3588 走 64 位路线。共享方法，不混用二进制产物。
- **三板分工**：3506B 负责 32 位平台与工业外设，3568 负责 64 位通用驱动，3588 负责高性能子系统和产品门户。
- **Linux 加 Android 双系统**：RK3588 跑 Android 是 imx 给不了的差异化。
- **门户**：不只是学习，通向产品（CFDesktop / AI 盒 / 智能屏）。

## 三板怎么分工

| 板子 | 架构边界 | 主角色 |
|---|---|---|
| RK3506B（3x Cortex-A7） | ARMv7-A / 32 位 | 32 位 BSP、工业接口和多核 A7 实践 |
| RK3568（4x Cortex-A55） | ARMv8-A / 64 位 | 64 位 Linux 全链路与通用驱动主战场 |
| RK3588（4x Cortex-A76 + 4x Cortex-A55） | ARMv8-A / 64 位 | NPU / GPU / VPU / ISP、Android 与产品门户 |

RK3528 不属于当前三板主线，不在课程矩阵中占位；以后即使增加支持，也应作为独立目标配置出现。

## 双架构边界

三块板可以共享 U-Boot、Linux、设备树、Buildroot、驱动模型和调试方法，但下面这些内容不能假装兼容：

- **工具链**：RK3506B 使用 ARM 32 位交叉工具链；RK3568 / RK3588 使用 AArch64 交叉工具链。
- **ABI 与产物**：内核、模块、bootloader、rootfs 包、sysroot 和应用二进制按 `arm32` / `arm64` 分目录、分缓存、分 CI job。
- **启动与异常模型**：RK3506B 讲 ARMv7-A 的异常模式和 32 位启动；EL0–EL3、AArch64 异常级与对应 ATF 流程只放在 RK3568 / RK3588 分支。
- **板级配置**：每块板拥有独立 defconfig、设备树、镜像布局、烧录配置和验证日志，不能用“同仓库”替代兼容性验证。

## 一、基础对齐层（对齐 imx） · 载体 RK3506B / RK3568

**入门与环境**

- 为 RK3506B、RK3568、RK3588 建立明确的 board profile，不用泛化的板卡名代替实际硬件
- 开发环境：Linux / Docker 为主，WSL2 作为 Windows 入口
- 双工具链：ARM 32 位与 AArch64 编译、链接、ELF 检查和 sysroot 隔离
- 第一次启动：串口、烧录、bootlog 读法，以及构建产物到目标板的可追溯记录

**启动链**

- 共同骨架：BootROM → SPL / TPL → U-Boot → Linux，逐板标出实际经过的阶段
- RK3506B 分支：ARMv7-A 32 位启动、异常模式和设备树交接
- RK3568 / RK3588 分支：AArch64 的 EL0–EL3、ATF、可选 OP-TEE 与 Linux 交接
- boot 源按板卡能力讲：eMMC / SD / 网络 TFTP；NVMe 只放在实际支持并完成验证的板卡
- U-Boot 环境变量、bootcmd、bootargs

**内核与设备树**

- 内核编译：defconfig、厂商 BSP 对比 mainline
- 设备树：.dtsi 结构、改节点、overlay
- 内核模块：编译、加载、depmod

**Rootfs**

- Buildroot（教学载体）：配置、自定义包、overlay
- init：busybox init / systemd
- 网络配置、fstab、mdev
- 应用部署：overlay / NFS
- 32 位和 64 位 rootfs、软件源、sysroot 与第三方依赖的隔离和复现

**调试**

- 串口日志、dmesg、kernel panic 排查
- GDB 远程调试、KGDB
- ftrace / perf 性能分析

## 二、横跨驱动教程（差异化招牌，深度超 imx） · 载体 RK3568 为主，RK3588 验证

**驱动地基**

- 字符设备：cdev、file_operations、ioctl
- 设备模型：bus / device / driver、kobj
- platform 虚拟总线
- 设备树绑定：DT compatible、probe

**核心子系统（逐个吃透）**

- pinctrl / GPIO：RK 引脚复用
- I2C / SPI / UART
- 中断：RK3506B 与 RK3568 / RK3588 分别确认中断控制器版本，再进入 irqchip 和 GIC 驱动
- DMA：DMAengine
- 时钟子系统：Common Clock Framework、RK 时钟树驱动
- regulator：电源调节器
- input：按键、触摸

**音视频驱动（重点）**

- DRM / KMS：显示管线（HDMI / DSI / eDP），plane / CRTC / encoder / connector，Rockchip DRM 驱动
- V4L2：ISP / CSI 摄像头采集，rkisp 驱动
- ALSA / ASoC：声卡、machine / platform / codec、HDMI 音频
- RGA：2D 图形加速、格式转换、缩放

**网络与无线（重点）**

- 网卡：GMAC、PHY 驱动
- WiFi：RTL8733bu / ap6xxx / PCIe WiFi，cfg80211 / mac80211 框架（对位组织里的 rtl8733bu 仓）
- Bluetooth：HCI、UART / USB BT
- 网络协议栈：TCP / IP、socket

**高速总线**

- USB 3.1：dwc3、host / device / OTG
- PCIe 3.0：驱动、NVMe

## 三、Rockchip 官方文档索引与原创解读

Rockchip 官方文档多、散、术语密、中英夹杂，新手很难啃。rk-forge 建立版本化索引并提供原创解读：

- **TRM（技术参考手册）**：记录适用 SoC 和文档版本，挑时钟、GPIO、DRAM 等关键章节解读
- **RKNN 文档**：整理成“模型转换、量化、部署、性能验证”的步骤教程
- **MPP / RGA 文档**：转化成可以复现的媒体与图形实验
- **BSP / SDK release notes**：维护版本、patch 与已知限制的对应关系
- **官方与社区资料**：索引来源，不复制不明授权的原文

原则：不照搬原文，补背景、标版本、给可跑例子，并把“厂商 BSP 结论”和“主线内核结论”明确分开。

## 四、超越层（RK3588 独有） · 载体 RK3588

**多核 SoC**

- 8 核异构 big.LITTLE：大小核调度、CPU freq、hotplug
- ATF：EL3、安全启动、optee
- SMMU（IOMMU）：地址翻译、设备隔离
- 电源与热：suspend / resume、thermal、DVFS

**NPU / AI**

- RKNN-Toolkit2：模型转换（ONNX / PyTorch → RKNN）、量化（INT8）
- RKNPU 驱动加 runtime
- 推理部署：YOLO 检测、分类、性能调优
- RKLLM 端侧大模型

**媒体（VPU）**

- MPP：硬件编解码、8K / 4K
- 解码：H.265 / H.264 / AV1
- 编码
- 摄像头全链路：CSI → ISP → 编码 / 显示

**GPU**

- Mali-G610：厂商闭源栈对比开源内核 Panthor 与 Mesa Panfrost / PanVK
- OpenGL ES / Vulkan
- GPU 计算

## 五、Android 轨 · 载体 RK3588

RK3588 跑 Android，是 imx 给不了的差异化。很多人买 RK3588 就是冲着跑 Android 去的。

- AOSP 源码加 Rockchip Android SDK
- Android bring-up：烧录、adb、fastboot
- Android 和通用 Linux 发行版的差异：Linux 内核驱动、HAL / AIDL、init、binder、ART
- 定制 ROM、系统应用（进阶）

## 六、门户终点（产品） · 载体 RK3588

- AI 盒子：RKNN 推理加 CFDesktop 界面
- 智能屏：CFDesktop 启动器加摄像头 / 语音
- 媒体播放器：MPP 硬解加 DRM 显示
- 边缘服务器：多模型推理服务

## 统一工作区需要提供

- 多板管理：RK3506B / RK3568 / RK3588 同仓管理，架构和板级产物严格隔离
- 发行版移植：Buildroot（教学）、Debian / Ubuntu（社区）、openEuler
- 工具：buildmeter、patch 管理、sdk-diff
- 自动化：按 SoC 和架构拆分的 CI、镜像构建、烧录脚本和真板验证记录

## 链接

- [rk-forge 仓库](https://github.com/Awesome-Embedded-Learning-Studio/rk-forge)
