---
title: "CFDesktop"
---

## 简介

基于 Qt 6 的嵌入式 Material Design 3 桌面框架，目标是在同一套架构上覆盖桌面开发环境和 ARM 嵌入式设备。当前开发重点是打通“桌面 → 点击图标 → 启动应用”的最小闭环，不把目标平台等同于已经完成的适配。

当前 `base` 与硬件分级（HWTier）已经就绪，UI / desktop 核心处于最小闭环建设中。Windows 与 WSL X11 后端已经可用；Wayland、EGLFS / LinuxFB、输入抽象和独立模拟器仍待建设。19 个 Material Design 3 控件由 [QuarkWidgets](/projects/quark-widgets) 提供，不重复计作 CFDesktop 已完成模块。

## 核心特性

- Material Design 3 设计语言
- `base` 基础层与硬件检测 / HWTier 分级
- QuarkWidgets 提供 19 个可复用 UI 控件
- Windows 与 WSL X11 开发后端
- UI / desktop 最小启动闭环正在建设
- Wayland、EGLFS / LinuxFB、输入抽象与模拟器仍在规划中

## 前置知识

- 扎实的 C++ 功底
- Qt 框架使用经验
- 嵌入式 Linux 基础

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/CFDesktop)
