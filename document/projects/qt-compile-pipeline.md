---
title: "qt-compile-pipeline"
---

## 简介

Qt6 ARM 交叉编译自动化管道。把从源码编译 Qt6 这个复杂过程简化为"只改配置文件 + 一键构建"——支持多平台（Host/Target）构建、自动打包 SHA256 校验、幂等设计（中断后可续传）。

集成 tslib、PulseAudio、FFmpeg、OpenSSL 等常用第三方库。

## 核心特性

- 配置驱动，只需修改 config 文件
- 一键构建 Host + Target Qt
- 幂等设计，支持断点续传
- 自动打包 + SHA256 校验
- 第三方库集成（tslib / PulseAudio / FFmpeg / OpenSSL）
- 多平台支持（Ubuntu 20.04+）

## 前置知识

- 基本了解交叉编译概念
- CMake 基础
- Linux 命令行操作

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/qt-compile-pipeline)
