---
title: "edgecv"
---

## 简介

C++20 编译期类型安全的计算机视觉库。提供 Image/ImageView 容器（强类型）、Expected 错误处理、Pipeline 组合（`operator|`），以及颜色转换、滤波、边缘检测等算法封装。Header-Only 设计，嵌入式友好（支持 `-fno-exceptions` / `-fno-rtti`，ARM 交叉编译）。

同时提供 OpenCV 的 cv::Mat / QImage 互转桥接。

## 核心特性

- 编译期类型安全的 Image / ImageView 容器
- Expected 错误处理（零异常开销）
- Pipeline 组合 API（`operator|`）
- 颜色转换、滤波、边缘检测算法
- Qt 桥接（cv::Mat / QImage 互转）
- Header-Only
- 嵌入式友好（无异常 / 无 RTTI / ARM 交叉编译）

## 前置知识

- C++20（concepts、模板元编程）
- OpenCV 基础概念
- 计算机视觉入门

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/edgecv)
