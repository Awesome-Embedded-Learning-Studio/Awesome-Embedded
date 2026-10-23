---
title: "Tutorial_AwesomeQt 规划"
---

## 这个仓库是什么

中文 Qt 教程仓，组织里星数第二的教程线（85 星，2026-10-23 读取仓库页）。三层结构：入门层 137 篇、进阶层 134 篇都已满额收官，专家层在写 QtBase 源码剖析。配套实例库按 widget、app、model、industrial 四栏放量，13 个可复用控件放在 src/widget/ 的 AwesomeQt:: 命名空间下。代码 MIT 许可，教程文档 CC BY-SA 4.0。

## 现状

以下事实来自仓库 README 进度段、todo 目录与教程站本身。

- 三层进度：入门 137/137、进阶 134/134 满额。专家层 19 篇写完并已全审结，QtBase 卷还差信号槽深水区与事件循环深水区两篇收官。
- 实例库：widget 栏 13 件收齐，app 栏 7 件，model 栏 6 件（首波 5 件加 undo-redo-framework），industrial 栏 1 件骨架。
- 在途一条线：进阶层的文风优化线，推进到 widget 篇目中段，仓库里还有未合入的增量。
- 站点在线，支持在线阅读全部教程。
- 待清存量：若干篇目待作者复审，model 首波 5 件的 CMake 范式待统一（两个方案：根 CMake 统一管配置，或每个实例自包含构建）。

## 下一代方向

主推先收尾、清存量。把进阶层文风线收干净，把散在 todo 里的待审项汇成清单逐项销，然后再开两条放量线。理由有两条：待审存量是当前最实际的负担，范式不先统一，后续十二件 model 复刻会带着两种口径继续分叉。收尾产物本身就是可见交付。

放量线排在收尾之后。model 栏按剩余清单复刻，复用 widget 栏跑通的发布流程。专家层补齐两篇深水区，QtBase 整卷完结。

Qt embedded 线是规划里自认"中文 Qt 教程真空地带"的方向：工具链与 sysroot 公共基础，加 i.MX6ULL、RK3568、RK3588、Allwinner 四类板的板级差异篇。它等无板复现的前置就绪后开工，前置有两个来源：lightroot 产出 QEMU 可复现的镜像样例，或中心站的联合构建落地。

## 近期要做的事

- 文风线收尾。验收口径：进阶层剩余篇目按既定流程过完，未合入增量归零，todo 进度数字与实际一致。
- 待审清单。验收口径：散落的待审项汇成勾选清单进仓，销一项短一项。
- 口径对齐。验收口径：model 待复刻数量在两处文档里统一，写清计数口径。

## 边界与不做的事

- 实例库不按登记全量的愿景数字倒排产能，由实际主题触发。industrial 栏等 widget 链复用就位再接。
- embedded 线的前置未就绪不开工，板级范围维持四类板不扩容。
- 教程不编造错误记录，真实错误段落等写到再补。
- 英文版等中文线收官后再定。
- 本页不承诺任何更新节奏。

## 相关链接

- [项目页](/projects/tutorial-awesome-qt)
- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt)
- [在线教程站](https://awesome-embedded-learning-studio.github.io/Tutorial_AwesomeQt/)
- [中心站建设规划](/plans/central-station)，联合发行与无板路线的相关条目
