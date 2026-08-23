---
title: "CFDeskit"
---

## 简介

CFDesktop 生态的独立 Qt6 小应用集合。每个应用都是由 CFDesktop 或其他 launcher 通过 `QProcess` 启动的独立可执行程序，不链接进桌面 shell，因此单个应用崩溃或卡死不会拖垮桌面。

## 当前应用

- calculator：表达式计算器
- noter：纯文本记事本
- alarm_clock：闹钟
- calendar：带日期笔记的日历
- system_state：CPU 与内存状态监视

## 工程边界

- 使用 Qt6 与 QuarkWidgets
- 应用独立构建、部署和升级
- 自带 QuarkWidgets 运行库与 ABI 自检
- system_state vendoring 所需的 cfbase 探针，避免外部运行时依赖

## 与 AELS 的关系

属于产品线「CF 桌面生态」分组：消费 [QuarkWidgets](/projects/quark-widgets)，通过运行时契约接入 [CFDesktop](/projects/cfdesktop)，与 [CF-Gallery](/projects/cf-gallery) 共同构成桌面生态的应用与资源两侧。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/CFDeskit)
