---
title: "QuarkWidgets"
---

## 简介

**QuarkWidgets** 是 Awesome Embedded Studio 的可复用 **Qt6 / Material Design 3** 组件库——组织内所有 Qt 项目（[CFDesktop](/projects/cfdesktop) 及更多）共享的统一 UI 基座。

它用一条 5 层管线组织 UI：数学/工具 → 主题引擎 → 动画引擎 → Material 行为 → widget 适配，提供 19 个 MD3 widget（Button、TextField、Slider、ComboBox、TreeView……），全部收在 `qw::` 命名空间下。

## 五层管线

```
base/         CFColor, GeometryHelper, Easing, DevicePixel（数学/工具）
core/         ThemeManager, MaterialFactory, token 系统
components/   动画引擎（CFMaterialAnimationFactory + 策略）
widget/       MD3 widget + application 支持
models/       SDK 风格 model
```

## 核心特性

- **19 个 MD3 widget**：Button、TextField、Slider、ComboBox、TreeView 等，覆盖常见交互控件
- **主题引擎 + token 系统**：ThemeManager + MaterialFactory 驱动一致的 Material Design 3 视觉
- **动画引擎**：CFMaterialAnimationFactory + 多策略，行为可组合
- **500 个 GoogleTest**：`test/ui/` 下完整测试套件保障质量
- **aex 复用**：依赖 [aex](/projects/aex)（header-only 基座：`weak_ptr`、`expected`…），独立构建时自动拉取；被 superproject 消费时复用宿主已提供的 `aex::aex`，不重复 fetch

## 依赖与使用

- C++23 · CMake ≥ 3.16 · Qt 6.8.x（Core / Gui / Widgets）

作为 CMake 子项目（组织内推荐）：

```cmake
add_subdirectory(third_party/QuarkWidgets)
target_link_libraries(my_target PRIVATE QuarkWidgets::quarkwidgets)
```

独立构建（带测试与示例）：

```bash
cmake -S . -B build -DQW_BUILD_TESTS=ON -DQW_BUILD_EXAMPLES=ON
cmake --build build
ctest --test-dir build
```

消费方保持既有 include 风格（`"core/theme_manager.h"`、`"widget/material/..."`），因为 QuarkWidgets 把源目录暴露为 PUBLIC include path。

## 与 AELS 的关系

属于 **Qt / GUI / 产品化** 主线，是组织 Qt 项目的 UI 基座。[CFDesktop](/projects/cfdesktop)（嵌入式 Material Design 3 桌面框架）直接构筑其上，依赖 [aex](/projects/aex) 作为 C++ 基座库。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/QuarkWidgets)
