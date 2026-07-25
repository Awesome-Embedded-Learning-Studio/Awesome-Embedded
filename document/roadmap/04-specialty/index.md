---
title: "专题规划与 Cinux 独立线"
---

# 专题规划与 Cinux 独立线

纵向三支柱（[P0](/roadmap/01-fundamentals/) / [P1](/roadmap/02-mcu/) / [P2](/roadmap/03-linux/)）按深度走，专题按兴趣横切。当前建设策略已经收敛：**Cinux 家族作为独立路线积极建设，其余专题全部推迟到规划阶段。**

推迟不代表删除方向，也不代表已有公共库停止维护。BareMetal-Drivers、edgecv 等现有资产可以继续服务主线，但不因此启动新的专题课程或专题仓库。

## 独立活跃线：OS 实验室（Cinux）

x86_64 OS 造轮子：启动、内存、调度、用户态、文件系统和 GUI 桌面全链路。

- **Cinux**：前沿实验版，持续验证新的内核和用户态能力
- **Cinux-Book**：稳定教学版，保证路线连贯和实验可复现
- **Cinux-Base**：freestanding 基础类型与容器库
- **Cinux-GUI**：host-neutral GUI 核心

Cinux 直接承接 P0 的 C / C++ 与系统基础，不要求先经过 P1 或 P2，也不计入下面暂停建设的专题队列。

## 推迟建设的五条专题

下面只保存边界与未来接口，不承诺近期仓库、课程或交付时间。

### 嵌入式 GUI（规划）

小屏驱动、帧缓冲、图形原语、Widget 和动画菜单。`visor` 暂停建设；Cinux-GUI 只服务当前活跃的 Cinux 家族，不代表该专题恢复。

### 网络（规划）

协议栈分层、TCP/IP、socket、MQTT / CoAP 和 BLE GATT。`edgenet` 暂不创建，相关实操留在 ESP32-S3 与 Rockchip 平台主线内部。

### 驱动与协议（规划）

I2C / SPI / UART / CAN 的时序、帧与电气原理。BareMetal-Drivers 是已有公共库，可以继续维护和被 forge 复用；独立专题课程暂缓。

### 多媒体（规划）

V4L2 / DRM / ALSA 与 MPP / RGA 的视频、音频和图形管线。`edgemedia` 暂不创建，近期实验留在 rk-forge 内部。

### 边缘 AI（规划）

RKNN 模型转换、量化、部署与基础视觉流水线。`edgeai` 暂不创建；已有 edgecv 可以独立维护，但不作为启动专题建设的信号。

## 工程基建（不是专题，是组织级库）

这两条不属于专题排期，是组织级公共库，按自身维护节奏跨项目复用：

- **aex**：组织的 C++ base 库（expected、scope_guard、weak_ptr 这些 header-only 扩展），跨桌面 / CLI / 嵌入式 Linux / MCU。
- **bareline**：独立的工程库，现代 CLI / shell 交互框架，跨 MCU 加 PC。
