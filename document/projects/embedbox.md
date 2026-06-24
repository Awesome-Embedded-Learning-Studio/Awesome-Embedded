---
title: "EmbedBox"
---

## 简介

**EmbedBox** 是面向嵌入式开发者的「公共语言」入门坡道——不管走哪条嵌入式航线，都要先会用的通用工具：**终端 / Git / Markdown / GCC / Make / CMake / GDB / 交叉编译 / 串口 / Docker / QEMU**。

它只负责把工具教透，不替中心站 [Awesome-Embedded](https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded) 做导航。定位是进入 AwesomeQt / ModernCPP / PenguinLab / 各 forge 之前的**工具链前置知识**打底。

## 适合谁

- 刚起步的嵌入式自学者
- 只会一点 PowerShell / 命令行的硬件朋友
- 想补齐「工具链前置知识」再啃具体航线的开发者

## 覆盖工具

终端 · Git · Markdown · GCC · Make · CMake · GDB · 交叉编译 · 串口 · Docker · QEMU——嵌入式开发里横贯各航线的通用工具链。

## 项目结构

| 目录 / 文件 | 内容 |
|---|---|
| [`tutorial/`](https://github.com/Awesome-Embedded-Learning-Studio/EmbedBox) | 教程正文 Markdown（WSL / Markdown / Git 等） |
| `site/` | VitePress 站点配置、主题、插件（`.vitepress/`） |
| `examples/` | 配套示例代码 / 硬件电路图 / PCB 等资产 |
| `project.config.ts` | 站点元信息（名称、导航、侧栏 volume 等） |

## 本地预览 / 构建

站点引擎为 [VitePress](https://vitepress.dev)，需要 Node 22 + pnpm 10：

```bash
pnpm install        # 安装依赖
pnpm dev            # 本地预览
pnpm build          # 构建到 site/.vitepress/dist
pnpm preview        # 预览构建产物
```

## 与 AELS 的关系

属于**通用工具与教程**主线，是整个组织学习路径的**第一站**——先把工具链学会，再进入 [Tutorial_AwesomeModernCPP](/projects/tutorial-awesome-modern-cpp)、[Tutorial_AwesomeQt](/projects/tutorial-awesome-qt)、[PenguinLab](/projects/penguin-lab) 与各 forge 的具体内容。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/EmbedBox)
- [在线文档站](https://awesome-embedded-learning-studio.github.io/EmbedBox/)
