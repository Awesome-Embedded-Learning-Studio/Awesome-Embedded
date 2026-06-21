---
title: "Cinux-Base"
---

## 简介

**Cinux-Base** 是一个**零 OS 耦合的 C++17 freestanding 基础类型库**，为 [Cinux](/projects/cinux) / [Cinux-Book](/projects/cinux-book) 内核提供 `constexpr`、无堆分配的核心组件。它只依赖自由头文件（`<cstdint>` `<cstddef>` `<type_traits>` `<utility>` `<new>` `<cstring>` `<array>` `<atomic>` 等），因此既能用在 OS 内核的 freestanding 环境，也能直接拿来当宿主机 C++ 工具库——内核和用户态共用同一套类型与容器。

设计上极端克制：**零堆分配、零异常、零 RTTI**，所有容器固定容量，错误用 `ErrorOr<T>` 传播。

## 设计原则

- **C++17** — 不使用 C++20 特性，最大兼容性（GCC 7+ / Clang 5+）
- **Freestanding** — 仅依赖自由头文件，可在无 OS 的内核环境编译
- **零堆分配** — 禁止 `new` / `malloc` / `::operator new`，所有容器固定容量
- **零异常** — 禁止 `throw` / `try` / `catch`，通过 `ErrorOr<T>` 传播错误
- **零 RTTI** — 禁止 `dynamic_cast` / `typeid`
- **constexpr-first** — 所有可在编译期计算的函数标记 `constexpr`
- **严格编译** — `-Wall -Wextra -Wpedantic -Werror`，无警告通过

## 组件一览

| 类别 | 组件数 | 示例 |
|------|--------|------|
| 错误处理 | 1 | `ErrorOr<T>` |
| 数值 / 位运算 | 3 | `Numeric`、`BitOps`、`Endian` |
| 字符串 / 视图 | 3 | `StringView`、`Span<T>`、`StaticString<N>` |
| 容器 | 4 | `StaticBuffer<N>`、`RingBuffer<T,N>`、`IntrusiveList<T>`、`StaticHashMap<K,V,N>` |
| 工具 | 4 | `Optional<T>`、`BitMap<N>`、`Function<Sig>`、`ScopeGuard` |
| 校验 | 2 | `CRC32`、`Checksum` |
| 高层 | 3 | `Logger`、`StaticRandomSource`、`Algorithm` |
| **总计** | **20** | |

## 快速构建

```bash
# 配置 + 编译 + 测试（三步）
cmake -B build
cmake --build build
ctest --test-dir build --output-on-failure
```

> 需要 CMake 3.16+ 及支持 C++17 的编译器（GCC 7+ / Clang 5+）。

## 集成到你的项目

```cmake
# 方式一：add_subdirectory
add_subdirectory(cinux-base)
target_link_libraries(your_target PRIVATE cinux_base)

# 方式二：FetchContent
include(FetchContent)
FetchContent_Declare(cinux_base
  GIT_REPOSITORY https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Base.git)
FetchContent_MakeAvailable(cinux_base)
target_link_libraries(your_target PRIVATE cinux_base)
```

## 与 Cinux 的关系

Cinux-Base 是 Cinux 内核的「地基」——把内核反复要用到的类型、容器、错误处理从内核里抽出来，做成一个零耦合的独立库。于是内核代码能专注于 OS 逻辑，而这套基础组件也可以被 [Cinux-Book](/projects/cinux-book) 教程、乃至任何 freestanding C++ 项目复用。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Base)
