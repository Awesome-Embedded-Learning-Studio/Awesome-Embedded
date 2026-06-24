你现在是我的本地网站内容工程助手。请先调研当前 GitHub 静态网站仓库，并和我一起设计 Awesome-Embedded-Learning-Studio / AELS 面向海外开发者的官网与内容优化方案。

请注意：AELS 不是一个需要隔离出来的新栏目。AELS 就是 Awesome-Embedded-Learning-Studio 这个组织本身，当前仓库就是组织的核心网站仓库。目标不是简单做一个 `/aels/` 子专区，而是把现有网站逐步升级成中英双语的组织官网、项目索引和工程笔记入口。

## 背景信息

- 作者身份：CharlieChen114514
- Organization / Publication name: Awesome Embedded Learning Studio
- 简称：AELS
- Hashnode subdomain: https://aels.hashnode.dev
- GitHub organization: https://github.com/Awesome-Embedded-Learning-Studio
- 网站部署目标：https://awesome-embedded-learning-studio.github.io/Awesome-Embedded/
- Publication description:
  Project-based engineering notes for embedded systems, modern C++, Linux, and operating systems.

主要方向：

- Embedded systems
- Modern C++
- Linux
- Operating systems
- Open-source learning projects
- Engineering notes from real projects

仓库下属项目可以参考 `content/repos/`，但不要伪造项目数据，也不要把早期项目包装成成熟产品。

## 请先做调研，不要直接改文件

请先扫描仓库，判断：

1. 当前网站技术栈是什么
2. 内容目录在哪里
3. 静态资源目录在哪里
4. 站点配置文件在哪里
5. 当前是否已有英文站点或英文内容区
6. 当前是否已有 SEO / OG image / social preview metadata
7. 当前导航、sidebar、locale 结构是否适合做中英双语
8. `content/repos/` 在当前项目中是构建输入还是参考数据

扫描后请先输出调研结论和设计方案，等我确认后再开始写文件。

## 我希望讨论出的最终方向

优先考虑把当前站点升级为双语结构：

- 中文默认站点：`/`
- 英文站点：`/en/`

不要把 AELS 做成孤立的 `/aels/` 子站，因为整个网站就是 AELS 的组织官网。

建议先做最小闭环：

1. 优化中文首页，让它更明确表达 AELS 的组织定位。
2. 新增或优化英文首页 `/en/`，面向海外开发者介绍 AELS。
3. 准备英文 About 页面，说明维护者、项目状态、贡献方式和内容边界。
4. 准备 Hashnode 可用的英文文章草稿，但先作为本地 Markdown。
5. 配置基础 SEO / OG / Twitter social preview metadata。
6. 根据现有框架能力决定是否引入英文导航和英文 sidebar。

## 英文首页核心文案要求

标题：

```text
Awesome Embedded Learning Studio
```

副标题：

```text
Project-based engineering notes for embedded systems, modern C++, Linux, and operating systems.
```

首页需要自然说明：

- AELS 是一个 project-based learning space
- 关注 embedded systems、modern C++、Linux、operating systems
- 内容来自真实项目、工程笔记、调试记录和设计取舍
- 作者 / 维护者身份使用 CharlieChen114514
- 放置 GitHub organization 链接：https://github.com/Awesome-Embedded-Learning-Studio
- 放置 Hashnode 链接：https://aels.hashnode.dev

语气要求：自然、可信、工程师风格。不要像营销官网。

避免使用这些夸张词：

- ultimate
- best
- revolutionary
- world-class
- industry-leading

## About 页面要求

英文 About 页面需要说明：

- AELS 由 CharlieChen114514 维护
- AELS 不是单纯的 awesome list
- 它更关注学习路径、工程实践、调试过程、项目经验和可复现笔记
- 内容仍在持续建设中
- 欢迎 issue、correction、feedback、contribution

语气要谦逊真实，不要装成大公司官网。

## 第一篇英文文章草稿

标题：

```text
Why I Started Awesome Embedded Learning Studio
```

要求：

- 800 到 1200 words
- 面向海外开发者
- 不要像广告
- 不要一开头就要 star
- 像真实工程师的公开构建记录

建议结构：

```markdown
# Why I Started Awesome Embedded Learning Studio

## The problem I kept running into

## Why project-based learning

## What AELS will cover

## How this connects to open source

## What I hope to improve over time
```

文章中自然提到：

- Embedded systems
- Modern C++
- Linux
- Operating systems
- Open-source learning projects
- Engineering notes
- Real project experience

结尾可以自然放 GitHub organization 链接，但不要强行营销。

## 第二篇文章只写大纲

标题：

```text
Why Another Awesome C++ List? Because Links Are Not Enough
```

这篇未来用于介绍 Tutorial_AwesomeModernCPP / TAMCPP。

大纲要体现：

- 尊重已有 awesome-cpp、awesome-modern-cpp 等传统资源
- AELS / TAMCPP 不是为了替代它们
- 核心差异不是收集更多链接，而是把 C++ 学习组织成学习路径、工程语境和项目实践
- 面向 beginner-to-intermediate learners
- 最后自然引出：https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP

## OG image / Metadata

我会提供一张 AELS 的 OG image。请先判断当前框架应该放在哪里，例如：

```text
site/.vitepress/public/images/og/aels-og.png
```

请检查是否支持页面级：

- title
- description
- og:title
- og:description
- og:image
- twitter:image

如果支持，请给中英文首页和文章草稿设计 metadata。若当前框架不方便做页面级 OG 配置，不要硬改，请给出最小可行方案。

## 重要限制

- 不要删除现有内容
- 不要大规模重构
- 不要引入重量级依赖
- 不要自动 push
- 不要自动发布到 Hashnode
- 不要伪造项目数据
- 不要把 AELS 写成已经非常成熟的大型组织
- 所有内容先作为本地 Markdown 草稿
- 如果不确定当前网站结构，先停下来问我，不要硬改

## 最终请先输出方案

请先输出：

1. 识别到的网站技术栈
2. 当前内容、资源、配置、导航、locale 结构
3. 推荐的中英双语站点结构
4. 准备修改或新增的文件列表
5. 每个文件的用途
6. SEO / OG metadata 最小可行方案
7. 本地预览命令
8. 构建命令
9. 风险点和需要我人工确认的地方

得到我确认后，再开始写文件和跑构建。
