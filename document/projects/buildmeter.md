---
title: "buildmeter"
---

## 简介

为 Linux Kernel、U-Boot 和 Buildroot 等 GNU make 构建提供实时进度显示。它解决长时间构建只有日志、无法判断阶段和剩余时间的问题。

buildmeter 已从 rk-forge 的进度脚本抽成独立 Python 包，也可被 imx-forge 等其他构建流程复用。

## 核心特性

- Kernel/U-Boot Kbuild 与 Buildroot 日志解析
- 当前阶段、完成量、速度和 ETA
- Rich 可选界面与零依赖 ANSI 后端
- 支持实时管道和历史日志回放
- 支持 dry-run 预扫描估算分母
- stdout 保持可用于管道，界面输出到 stderr

## 与 AELS 的关系

buildmeter 是 P2 的构建体验工具，不承担 BSP、rootfs 或板级路线本身。它服务 imx-forge、rk-forge、h618_forge 和其他长时间 GNU make 工程。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/buildmeter)
