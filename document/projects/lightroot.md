---
title: "lightroot"
---

## 简介

一个更易用的 Buildroot 风格嵌入式 rootfs 构建器，使用 C++、CMake 和声明式配置组织包、依赖、工具链、构建计划与镜像布局。

仓库已经公开，目前处于 **Stage 1 开发中**。现阶段重点是类型化 IR、项目配置、包清单解析和包注册表；依赖解析、执行器和完整 BusyBox rootfs 闭环仍按仓库路线推进。

## 当前方向

- 包索引、依赖与 provider 解析
- Host 与交叉工具链诊断
- 声明式构建计划和 rootfs 镜像
- 板卡无关的镜像布局描述
- 与 imx-forge 配合生成 i.MX6ULL 的 U-Boot、Linux、rootfs 和 SD 镜像

## 与 AELS 的关系

属于基建与验证线「构建与工具链」分组的构建系统实验：不替代 [imx-forge](/projects/imx-forge)、[rk-forge](/projects/rk-forge) 或 [h618_forge](/projects/h618-forge) 的板级内容——平台仓提供真实 BSP 与硬件事实，lightroot 先验证 typed IR、依赖解析、lockfile、执行器与最小 rootfs。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/lightroot)
