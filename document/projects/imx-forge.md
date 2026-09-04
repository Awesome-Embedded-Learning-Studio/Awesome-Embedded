---
title: "imx-forge"
---

## 简介

面向 NXP i.MX6ULL 的嵌入式 Linux 开发工坊，也是第一次打通完整板级链路的推荐入口：Docker 一键搭建开发环境，BSP 与主线双内核轨道并行，覆盖从交叉编译工具链到 U-Boot、内核、设备树、根文件系统与驱动开发的完整学习路径。

v1.0.0 已在正点原子阿尔法开发板完成 SD 卡与 eMMC 启动验证，进入成熟维护阶段；当前内核版本、工具链与教程覆盖范围以仓库 README 为准。

## 路线重点

- Docker 一键环境，WSL2 原生支持
- BSP 与主线双内核轨道对照
- 驱动教程覆盖 GPIO、I2C、SPI、Input 等常见外设
- 完整 CI 流水线与真板（SD / eMMC 启动）验证

## 前置知识

- C 语言编程基础
- Linux 基本命令操作
- 对嵌入式硬件有基本了解

## 与 AELS 的关系

属于教学线「嵌入式 Linux 实践」分组，是[学习地图](/roadmap/)第三支柱的第一站。可继续进入 [rk-forge](/projects/rk-forge) 的 Rockchip 平台深化，[h618_forge](/projects/h618-forge) 提供主线化横向参考；固定版本消费 [buildmeter](/projects/buildmeter)，并为 [CFBox](/projects/cfbox) 提供真板验收环境。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge)
- [在线文档站](https://awesome-embedded-learning-studio.github.io/imx-forge/)