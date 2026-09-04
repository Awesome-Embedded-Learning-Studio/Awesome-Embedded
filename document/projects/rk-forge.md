---
title: "rk-forge"
---

## 简介

面向 Rockchip 平台的双架构开发者工作空间。主线覆盖 RK3506B、RK3568 和 RK3588：RK3506B 是 ARMv7-A / 32 位，RK3568 与 RK3588 是 ARMv8-A / 64 位。

仓库共享厂商 SDK 定制、内核补丁管理、驱动开发和 rootfs 部署方法，同时隔离 ARM32 / ARM64 的工具链、ABI、镜像和 CI 产物。

三板课程路线已经定稿；具体内容由 rk-forge 按自己的节奏建设。

## 路线重点

- RK3506B：32 位 BSP、工业接口和多核 Cortex-A7 实践
- RK3568：64 位 Linux 全链路与通用驱动
- RK3588：64 位高性能媒体、NPU、GPU 与 Android
- ARM32 / ARM64 分离的工具链、sysroot、镜像和 CI
- 脚本库（SDK 定制、补丁管理）
- 驱动参考实现
- rootfs 部署方案
- 按架构拆分的自动化与真板验证记录

## 前置知识

- Linux 内核开发经验
- 嵌入式 Linux BSP 基础
- Shell 脚本编程

## 与 AELS 的关系

属于教学线「嵌入式 Linux 实践」分组，是[学习地图](/roadmap/)第三支柱的平台深化：承接 [imx-forge](/projects/imx-forge) 之后按开发板与目标选择平台，不必依次学习全部板卡。[h618_forge](/projects/h618-forge) 提供主线化横向参考，固定版本消费 [buildmeter](/projects/buildmeter)。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/rk-forge)
- [在线文档站](https://awesome-embedded-learning-studio.github.io/rk-forge/)
