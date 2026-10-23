---
title: "libestdx"
---

## 简介

C++23 编写的嵌入式器件驱动库（EmbededStdExtension），面向 STM32F103C8T6 等单片机目标。构建走 arm-none-eabi-gcc 加 CMake 加 Ninja，仿真验证依赖 Renode。仓库从教程主线解耦出来，需要的人浅克隆取用即可，不必拉下整座教程仓。

## 与 AELS 的关系

属于教学线「MCU 实践」分组，是 [Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp) 的联动仓库：教程讲现代 C++ 的写法，这里把写法沉淀成能烧到板上的驱动资产，供 [ST-Forge](/projects/st-forge) 与其他裸机工程复用。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/libestdx)
