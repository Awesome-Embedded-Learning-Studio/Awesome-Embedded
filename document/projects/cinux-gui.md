---
title: "Cinux-GUI"
---

## 简介

**Cinux-GUI** 是 Cinux 家族的 **host-neutral GUI 核心**——一套与具体宿主解耦的图形/输入 pump，今天驱动 [Cinux](/projects/cinux) 内核，明天换上 SDL / X11 / Wayland 宿主适配也能跑。核心思想是「一个 core，多个 host」：换掉宿主 ABI 表的填充，核心代码原样不动。

它的核心目录只依赖 `stdint` / `stddef`，**零宿主头文件**，因此既能被 Cinux 内核 vendor 进去，也能在 PC 上独立构建验证。目前核心已做到 host-neutral 并通过独立构建 + smoke 测试自证，真正的 PC 宿主适配与 widget/compositor 主体仍在开发中。

## 设计：唯一的硬接缝

整套 GUI 把「跨特权级稳定」压在一个函数指针表上：

- `cgui_host.h` —— **唯一的硬接缝**：一张 Host ABI 函数指针表。换宿主 = 换这张表的填充，核心不动。
- `cgui_event*.h` —— 定宽事件头 + 载荷，跨特权级稳定。
- `cgui_pump.*` —— `cinux::gui::pump()`：排空输入 → 渲染一帧 → 刷新脏矩形。
- `cgui_region.*` —— `Rect` + 有界 `Region`，脏矩形代数。
- `cgui_swraseter.*` —— 纯 CPU 整数绘图原语（Q8.8 混合、1-bpp glyph mask）。
- `cgui_abi_check` —— 编译期 ABI 自检（头尺寸 / packed-ness）。

宿主侧 `host/` 放适配器：`fake_host_main.cpp` 是零内核中性证明，也是 SDL / MCU 适配器的种子。

## 核心特性

- **Host-neutral 核心**：只用 `stdint`/`stddef`，零宿主 include，可被内核 vendor 或独立构建
- **单一接缝设计**：所有宿主差异收敛到一张函数指针表，核心不感知宿主
- **脏矩形刷新**：`pump()` 输入 → 渲染 → 只刷脏区
- **纯 CPU 软光栅**：Q8.8 定点混合 + 1-bpp glyph 掩膜，无浮点依赖
- **编译期 ABI 自检**：头尺寸 / packed-ness 在编译期断言

## 状态

核心已 host-neutral 并通过独立构建 + `cgui_host_smoke` 测试（null-host / idle-skip / dirty-flush / region）。**TODO**：真实的 PC 宿主适配（`host/sdl`、`host/x11`、`host/wayland`）与 widget / compositor 主体（M0–M9）。

## 快速开始

独立构建（CMake + ctest）：

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
ctest --test-dir build --output on-failure   # cgui_host_smoke
```

同一份 `CMakeLists.txt` 也能作为父项目（如 Cinux 内核）的子目录构建——由 `CMAKE_SOURCE_DIR` 守卫，此时只提供 `cgui_core` 静态库，不附带 harness。

## 与 AELS 的关系

Cinux-GUI 属于 **Linux / System Programming** 主线，是 Cinux 家族的 GUI 层。家族四件套分工：

- [Cinux](/projects/cinux) —— 前沿实验版（x86_64 OS，全链路到 GUI 桌面）
- [Cinux-Book](/projects/cinux-book) —— 手把手教学版
- [Cinux-Base](/projects/cinux-base) —— freestanding 基础类型库
- **Cinux-GUI**（本仓库）—— host-neutral GUI 核心

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Cinux-GUI)
