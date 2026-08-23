---
title: "aex"
---

## 简介

组织的轻量 C++ 基础库：Qt-free、header-only、刻意只依赖 C++ 标准库。因此可以丢进任何目标——桌面应用、CLI 工具、嵌入式 Linux，甚至资源受限的 MCU（直接拷头文件），而不必拖进 Qt 或重型运行时。

模块覆盖错误处理（`expected`）、RAII 退出清理（`scope_guard`）、非拥有弱引用（`weak_ptr`）、无锁 MPSC 队列、编译期哈希、span 视图等，全部收在 `aex::` 命名空间下；完整模块清单以仓库文档为准。C++23，支持 CMake 子项目与 header drop-in 两种消费方式。

## 与 AELS 的关系

属于产品线「组件与库」分组，是组织 C++ 生态的地基库：[QuarkWidgets](/projects/quark-widgets) 直接依赖它做错误处理与弱引用，其它 C++ 产品按需复用。教学只抽取代表性 API、兼容与升级案例，不复制整库教程。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/aex)
