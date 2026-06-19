# 组织路线图

> 最后更新：2026-06-20

## 当前阶段

Awesome-Embedded-Learning-Studio 目前处于**成长期**：已建立五条主线的项目骨架，核心教程（C++、Qt、Embedded Linux）与系统软件实验（Cinux、CFBox）持续迭代中，部分实验项目正在孵化。

## 学习路线（Learning Roadmap）

面向学习者的推荐学习路径：

### 快速路径

| 路径 | 方向 | 推荐顺序 |
|------|------|----------|
| A | 嵌入式 Linux | Tutorial_EmbeddedCommonTools → imx-forge → PenguinLab → 驱动开发 |
| B | MCU 裸机 | Tutorial_EmbeddedCommonTools → ST-Forge → BareMetal-Drivers → Project_MicroWatch |
| C | C++ 工程化 | Tutorial_cpp_SimpleIniParser → Tutorial_AwesomeModernCPP → miniwget → CFBox |
| D | Qt / GUI | Tutorial_AwesomeQt → CFDesktop → qt-compile-pipeline |
| E | Linux / 系统编程 | CFBox → PenguinLab → Cinux（造一个操作系统） |

### 详细学习路线

- [STM32 + ESP32 全栈学习路线](/roadmap/stm32-esp32-roadmap) — 1 年计划，从基础到 Capstone 项目
- [RK3588 学习计划](/roadmap/rk3588-roadmap) — 12 个月计划，从工具链到 AI 推理部署

## 项目建设路线（Project Roadmap）

面向贡献者和维护者的近期规划：

### 2026 Q2（当前）

- [x] 完成组织初始化（中心仓库、Profile、repo template）
- [x] 初步建立协作框架（audit 脚本、community Discussions、roadmap）
- [x] 核心教程持续迭代（ModernCPP、Qt、imx-forge）
- [ ] 中心仓库文档站上线（VitePress）
- [ ] 完成 manifest/repos.yaml 初版
- [ ] 为 P0 仓库补充 CONTRIBUTING.md
- [ ] 激活 Tutorial_FreeRTOS 和 Tutorial_EmbeddedCommonTools

### 2026 Q3（计划）

- [ ] miniwget 公开发布 + B 站配套视频
- [ ] bareline 公开发布
- [ ] PenguinLab 增加更多实验
- [ ] edgecv 完成 Header-Only 核心功能
- [ ] micro-forge 完善 MCU 模拟器基础功能
- [ ] 建立月度维护节奏

## 维护优先级（Maintenance Roadmap）

| 优先级 | 仓库 | 待办 |
|--------|------|------|
| P0 | Tutorial_AwesomeModernCPP | 持续更新教程内容 |
| P0 | imx-forge | 补充 CONTRIBUTING.md |
| P0 | Tutorial_AwesomeQt | 持续更新教程内容 |
| P1 | CFDesktop | 完善 Quick Start |
| P1 | ST-Forge | 增加更多外设驱动示例 |
| P1 | BareMetal-Drivers | 增加驱动类型 |
| P1 | PenguinLab | 增加实验内容 |
| P2 | miniwget | 完善后公开发布 |
| P2 | bareline | 完善后公开发布 |
| P2 | edgecv | 完成核心功能 |
| P2 | micro-forge | 完善模拟器基础 |

## 暂缓事项

以下事项明确当前不推进：

- CI 集成（组织规模尚小，本地脚本足够）
- 国际化（受众以中文为主）
- GOVERNANCE.md（两人组织不需要）
- 统一 CODEOWNERS

## 已完成事项

- [x] 组织初始化（2025-12）
- [x] 中心仓库 + Profile 建立（2025-12）
- [x] repo template 创建（2025-12）
- [x] 协作框架完善（audit 脚本、Discussions）（2026-04）
- [x] 中心仓库 README 美化（2026-04）
- [x] imx-forge 文档站上线（2026-05）

## 未来候选方向

- RISC-V 相关教程和 BSP
- 更多 STM32 系列支持（F4/F7/H7）
- RT-Thread 教程
- 嵌入式安全（TrustZone、安全启动）
- OTA 升级框架
- 更多配套视频教程

## 项目规划文档

从 `ProjectLists.todo` 迁移而来的详细规划：

- [单片机项目规划](/planning/microchips) — 按难度分组的 MCU 实战项目清单
- [i.MX6ULL 项目规划](/planning/simple-embedded) — 基于 i.MX6ULL 的入门级 Linux 项目
- [复杂嵌入式 Linux 项目规划](/planning/embedded-linux) — 基于 RK3506B 的进阶 Linux 项目
- [库工程规划](/planning/libraries) — 驱动库、中间件、GUI 框架的详细规划
