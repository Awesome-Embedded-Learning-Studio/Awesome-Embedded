---
title: "engineering_cpp 规划"
---

# engineering_cpp 规划

## 这个仓库是什么

B 站《现代 C++ 工程实践》系列视频的配套代码仓，用 C++23 与统一的 CMake 工程，把需求、设计、测试、构建、交付这些工程方法放进可以构建和测试的小项目里讲。仓库结构是一个中心仓带若干专题仓：中心仓（hub）管横向的工程方法，ArgParser、FileCopier、DirScanner 三个小项目就在本仓 src/ 里。SimpleIniParser 与 anatomy_memory 两个专题仓（spoke）各自深入一个主题，通过 submodule 挂进本仓。

语言与原理的教学归 Tutorial_AwesomeModernCPP，本仓管从会写 C++ 到会做工程这一段。第一季课程已完结。仓库原名 Project_CXXBaseComponents，2026-07-04 确定改名并重启第二季路线，现名 engineering_cpp。

## 现状

以下事实的证据来自仓库 README、提交记录、2026-10-02 的组织快照，以及维护者 2026-10-22 对仓库代码的核对。核对不到的如实标注待核实。

- 组织快照（2026-10-02）：3 star、0 fork、MIT 许可、公开。最后提交 2026-07-05，homepage 指向 B 站播放列表，topics 已填 7 个。此前记录过的 topics 为空与 description 语病两项已经不在。

- 已知 bug 三项的处理情况：ArgParser 双源问题与 DirScanner 测试恒真断言两项，已经在 2026-07-05 的重构里修复，根 CMakeLists 与测试文件的注释写明了这两处（提交 d18bf63 一带）。`get<T>()` 吞异常一项没有逐行核实，是否已随重构修复，待核实。

- 文档链：documentation/tutorial/ 下五套文档都在，主题分别是 ArgParser、FileCopier、IniParser、内存池与 mimalloc。README 的 hub 表已经链上前三套，spoke 表没有文档列，iniparser、memory_pool、mimalloc 三套文档在 README 里没有入口。

- 口径不一致：README 写「第二季 miniwget 更新中（15 期，合计 61 期）」，仓库里也有 reference/miniwget 目录。第二季主题目前待定，miniwget 是否算第二季主线没有定，见下文待定项。

## 下一代方向

主推方向是第一季收尾，让 README 与仓库的实际产物一致。收尾件体量小，收益直接。三套 spoke 文档已经写完放在 documentation/tutorial/ 里，差的只是 README 表格里的入口，改表格就能补齐。`get<T>()` 一项即使已经修复，逐行核实一遍并留下说明，三项已知 bug 的处理记录才算完整。

收尾做完后，新来的学习者从 README 出发能点进每一套文档，不出现断链。第二季主题待定，主题确定后按新主题出视频配套代码。miniwget 是现有线索，是否以它作为第二季主线，确定后再动工。

### 待定项

- 第二季主题，含 miniwget 是否作为第二季主线。主题确定时，README 的第二季描述一并改成一致的说法。

- 与 Tutorial_AwesomeModernCPP 的互相引流入口。两边 README 各自指向对方的时间未定，等 ModernCPP 侧的内容曝光安排确定后再加。

## 近期要做的事

- README 的 spoke 表补文档链，或者在表里指向各专题仓自己的文档位置。验收口径是五套文档从 README 都有入口可点，spoke 表与 documentation/tutorial/ 目录内容一致。

- 核实 `get<T>()` 吞异常是否已随 2026-07-05 的重构修复，没修就修。验收口径是这一项有明确判定，修复或确认已修的说明写进仓库。

## 边界与不做的事

- 本页只写方向与边界，不承诺更新节奏。第二季主题不设时间表，确定之前不排第二季的工作量。

- 不做与 Tutorial_AwesomeModernCPP 的合并或搬迁，两边各守定位：那边讲语言与原理，这边动手做工程。

- 第二季主题确定之前，只做第一季收尾件。miniwget 相关内容停留在 reference/ 目录，等主题确定后再决定去向。

## 相关链接

- [项目页](/projects/engineering-cpp)
- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/engineering_cpp)
- [B 站播放列表](https://space.bilibili.com/294645890/lists/7045956)
- [Tutorial_AwesomeModernCPP 规划](/plans/tutorial-awesome-modern-cpp)
- [Tutorial_cpp_SimpleIniParser 项目页](/projects/tutorial-cpp-simple-ini-parser)
- [anatomy_memory 项目页](/projects/anatomy-memory)
- [学习地图 · 语言基础](/roadmap/01-fundamentals/)
- [项目规划](/plans/)
- [路线与进行中](/todo/)
```
