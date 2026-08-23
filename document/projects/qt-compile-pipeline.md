---
title: "qt-compile-pipeline"
---

## 简介

Qt6 ARM 交叉编译自动化管道：把从源码编译 Qt6 这个复杂过程收敛为「改配置文件 + 一键构建」，覆盖 Host / Target 双平台构建、自动打包与 SHA256 校验、幂等断点续传，并集成 tslib、PulseAudio、FFmpeg、OpenSSL 等常用第三方库。

当前定位是交叉构建实验：解释并实现 host Qt、target Qt、sysroot、toolchain 与 SDK bundle 的真实交付，不扩张成万能一键脚本；是否独立保留取决于与真实产品交付链的整合进度。

## 前置知识

- 交叉编译基本概念
- CMake 基础
- Linux 命令行操作

## 与 AELS 的关系

属于基建与验证线「构建与工具链」分组：目标是进入 [CFDesktop](/projects/cfdesktop) 与 Linux 平台仓的真实交付链，以固定版本被消费。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/qt-compile-pipeline)
