---
title: "bareline"
---

## 简介

**bareline** 是一个**零开销、header-only** 的 C++23 嵌入式 shell 库，面向裸机目标（Cortex-M 级 MCU）：**无堆分配、无异常、命令在编译期注册**。

它已经在 **STM32F103C8（Blue Pill）真机**上跑通，通过 USART1 提供 `help` / `ledon` / `ledoff` / `version` / `stat` 等命令。同样的 shell 也能在 host PC 的 stdin/stdout 上运行，做到「一份代码，MCU 与 PC 通吃」。

## 核心特性

- **行输入**：归一化 `\n` / `\r\n` / `\r` 三种行尾（lone-CR 感知，跨行字节正确进入下一行）
- **空白分词**：零拷贝 `string_view` token，UTF-8 安全
- **编译期命令注册**：`command<Name, Func, Help>`
- **双分派**：fold-expression（小列表）或 constexpr FNV-1a 哈希（大列表）自动选择，二次 name 校验防碰撞
- **内置命令**：`help` / `version` / `stat`；`stat` 关闭时零开销
- **后端抽象**：`io::backend::IOAble` concept —— 自带 `read`/`write`；附 `zeros_io`（回调适配器）与 `mocked_io`（测试用）
- **错误上报**：`base::expected<T, error::Error>` —— shell 自身不打印，由调用者决定如何呈现

## 快速开始

```cpp
#include <bareline/bareline.hpp>

int cmd_led(std::span<std::string_view> args) {
    // args[0] 是命令名（argc/argv 约定）
    return 0;
}

using namespace bareline::cmd;
using MyCmds = command_list<command<"led", cmd_led, "toggle the LED">>;

int main() {
    YourBackend backend;  // 任何满足 bareline::io::backend::IOAble 的类型
    bareline::shell::shell<decltype(backend), MyCmds> shell(backend);
    for (;;) shell.run_once();
}
```

仓库附 STM32 真机示例（`example/stm32/`）与 host PC 示例（`example/main.cpp`）。

## 与 AELS 的关系

属于 **MCU / 裸机 / FreeRTOS** 主线，是裸机项目的基础设施——给 [ST-Forge](/projects/st-forge)、[BareMetal-Drivers](/projects/baremetal-drivers) 这类 MCU 项目提供可复用的命令行交互层。零堆 / 零异常的设计使它能安全跑在最小资源的 Cortex-M 上。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/bareline)
