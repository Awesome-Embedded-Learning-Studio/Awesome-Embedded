---
title: "aex"
---

## 简介

**aex** 是 Awesome Embedded Studio 的轻量、**Qt-free、header-only** C++ 扩展库——组织内每个 C++ 项目共享的可复用基座工具集。

它**刻意只依赖 C++ 标准库**，因此可以丢进任何目标：桌面应用、CLI 工具、嵌入式 Linux，甚至资源受限的 MCU（直接拷头文件），而不必拖进 Qt 或重型运行时。

## 提供什么

| 模块 | 头文件 | 提供 |
|------|--------|------|
| `expected` | `aex/expected/expected.hpp` | `aex::expected<T,E>` / `aex::unexpected` —— 函数式错误处理 |
| `scope_guard` | `aex/scope_guard/scope_guard.hpp` | `aex::ScopeGuard` —— RAII 退出清理 |
| `weak_ptr` | `aex/weak_ptr/weak_ptr.h` | `aex::WeakPtr` / `aex::WeakPtrFactory` —— 非拥有弱引用 |
| `singleton` | `aex/singleton/*.hpp` | `aex::Singleton` / `aex::SimpleSingleton` |
| `factory` | `aex/factory/*.hpp` | 通用工厂模式（plain / registered / smart-ptr） |
| `lockfree` | `aex/lockfree/mpsc_queue.hpp` | 无锁 MPSC 队列 |
| `hash` | `aex/hash/constexpr_fnv1a.hpp` | 编译期 FNV-1a 哈希（`aex::hash`） |
| `policy_chain` | `aex/policy_chain/policy_chain.hpp` | `aex::PolicyChain` 策略链 |
| `indexed_vector` | `aex/indexed_vector/indexed_vector.hpp` | `aex::indexed_vector` + `aex::IndexingMode` |
| `span` | `aex/span/span.h` | `aex::span` —— 非拥有视图 |
| `helpers` | `aex/helpers/once_init.hpp` | `aex::CallOnceInit` —— 线程安全惰性初始化 |
| `macro` | `aex/macro/*.h` + `aex/macros.h` | 平台 / 架构检测宏 |

全部收在 `aex::` 命名空间下。

## 依赖与使用

- C++23 · CMake ≥ 3.16（仅当用 CMake 消费时）· 无第三方依赖（GoogleTest 仅用于可选测试套件）

三种消费方式：

```cmake
# 1. CMake 子项目 / submodule（组织内推荐）
add_subdirectory(third_party/aex)
target_link_libraries(my_target PRIVATE aex::aex)

# 2. 已安装包 —— find_package
find_package(aex 0.1 REQUIRED)
target_link_libraries(my_target PRIVATE aex::aex)
```

或 **3. Header drop-in**：把 `include/aex/` 拷进你的 include path 即可。

## 与 AELS 的关系

属于 **Modern C++** 主线（库设计方向），是组织 C++ 生态的**地基库**——[QuarkWidgets](/projects/quark-widgets)（Qt6 组件库）直接依赖它做错误处理与弱引用，其它 C++ 项目也按需复用。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/aex)
