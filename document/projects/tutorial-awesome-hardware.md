---
title: "Tutorial_AwesomeHardware"
---

## 简介

**Tutorial_AwesomeHardware** 是面向嵌入式学习者的**硬件学习笔记站**——一句标语说清定位：「把抽象概念砸进脑子，而不是把公式塞满屏幕」。

它不是教材搬运工，而是一个「补课型」技术博主把补短板时学懂的东西，用**重新理解后的话**再讲一遍：大量原创比喻、踩坑直觉、「为什么这么设计」的来龙去脉。目前已上线电源与功率变换板块（23 章），其余硬件基础板块规划中。

## 内容板块

| 板块 | 状态 | 说明 |
|------|:----:|------|
| ⚡ 电源与功率变换 | ✅ | 稳态分析、开关实现、建模、磁元件、闭环控制、谐波、整流、谐振与软开关（23 章） |
| 🔌 电路基础 | 🚧 | 规划中 |
| 📈 模拟电子 | 🚧 | 规划中 |
| 🔢 数字电子 | 🚧 | 规划中 |
| 🟩 PCB 入门 | 🚧 | 规划中 |
| 🌡️ 传感器 | 🚧 | 规划中 |
| 🔁 接口协议 | 🚧 | 规划中 |
| 🛠️ 板级调试 | 🚧 | 规划中 |

## 技术栈

- [VitePress](https://vitepress.dev) 1.6 · [Vue 3](https://vuejs.org)
- [markdown-it-mathjax3](https://www.npmjs.com/package/markdown-it-mathjax3) + [MathJax](https://www.mathjax.org) 渲染 LaTeX 公式
- pnpm 包管理 · 分段构建脚本（规避 mathjax 内存泄漏）

## 与 AELS 的关系

属于**通用工具与教程**范畴的**硬件基础**学习资源，是嵌入式学习的地基：在进入具体航线（[Modern C++](/projects/tutorial-awesome-modern-cpp)、[AwesomeQt](/projects/tutorial-awesome-qt)、各 forge）之前，先把电路、模拟/数字电子、PCB、传感器这些硬件基本功补齐。它是 `Tutorial_Awesome*` 系列的硬件分支。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeHardware)
- [在线站点](https://awesome-embedded-learning-studio.github.io/Tutorial_AwesomeHardware/)
