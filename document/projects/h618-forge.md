---
title: "h618_forge"
---

## 简介

面向野火 LubanCat-A1 / Allwinner H618 的 pure-mainline 嵌入式 Linux 工作空间。从主线 U-Boot、开源 TF-A、主线 Linux 到自建 Buildroot rootfs，保留真实板上日志和完整的 0→1 移植过程。

h618_forge 是嵌入式 Linux 实践中的横向参考，不是 RK3588 的后继路线。它展示与厂商 BSP 不同的主线化路径。

## 已有能力

- 主线 U-Boot SPL 与 DRAM 初始化
- 自编 TF-A BL31
- 主线 Linux SMP 启动
- 自建 Buildroot rootfs 与 SD 镜像
- AXP313a PMIC、DVFS、Mali/Panfrost
- HDMI 到 fbcon 的板上验证
- WSL2 构建路径与结构化串口日志

具体版本和仍在打磨的硬件能力以仓库 README 与板上记录为准。

## 前置知识

- Linux 命令行与 Shell
- U-Boot、Linux、设备树和 rootfs 基础
- ARM64 交叉编译基础

## 与 AELS 的关系

属于教学线「嵌入式 Linux 实践」分组的横向参考：为 [imx-forge](/projects/imx-forge) 与 [rk-forge](/projects/rk-forge) 展示与厂商 BSP 不同的主线化路径，不是谁的固定后继。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/h618_forge)
