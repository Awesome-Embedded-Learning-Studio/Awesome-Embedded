---
title: "imx-forge 规划"
---

# imx-forge 规划

## 这个仓库是什么

imx-forge 是面向 NXP i.MX6ULL 的嵌入式 Linux 开发工坊。i.MX6ULL 是单核 Cortex-A7，没有大小核和 NPU 的干扰，适合在这里第一次打通完整的板级链路。仓库用 Docker 镜像一键搭好交叉编译环境，教程覆盖 U-Boot、内核、设备树、根文件系统（rootfs）与驱动开发，内核同时维护 NXP BSP 与主线两条轨道。2026 年 3 月建仓，v1.0.0 已在正点原子阿尔法开发板上完成 SD 卡与 eMMC 启动验证。它是[学习地图](/roadmap/)嵌入式 Linux 区的第一站，往后接 rk3588 与 h618 两个平台的横向对照。

## 现状

本节的数字与事实来自仓库 README、仓库内 todo 路线图、路线追踪 issue #47 与组织快照，查询日期不同的地方随文标注。

活跃度方面，2026-10-23 查询 GitHub 得 109 星、18 fork，开放 issue 与 PR 合并计数 11 条，最近一次推送在 2026-10-22，仓库仍在持续维护。9 月底这个合并计数是 9 条，两个月里保持增长。

开放条目里大半是使用者的优化建议与勘误。质量线上有 #116 作者标了高优先级的教程优化、#120 代码块无法折叠的 bug、#128 文档勘误、#118 与 #121 分别针对 kernel 章节的组织方式与站点美观和 PDF 导出、#127 侧栏布局建议、#103 全局优化总 issue。结构线上有 #54 驱动开发待做清单与 #94 七个零采购 demo 的提案。另有待评审的 PR #130，收录 WSL2 与 usbipd 两篇中文稿。

版本方面，tag 已发布到 v1.0.4，从 v1.0.0 到 v1.0.4 共五个。仓库 document/release/ 目录下只有 v1.0.0.md 与 versioning-strategy.md 两份文件，v1.0.1 到 v1.0.4 有没有对应的版本说明与镜像，待核实。

GitHub Releases 页面上最新一条是 2026-06-23 的整站 PDF 导出（pandoc 加 WeasyPrint 制作，见 #83），属于导出产物，不是版本说明。

以下产品信息来自仓库 README 与 versioning-strategy.md。

- Docker 镜像预装 ARM GNU Toolchain 15.2.rel1，镜像 tag 分 latest、preview、vX.Y.Z 三类。
- 内核双轨并行，NXP BSP 6.12.3 走稳定线，主线 7.1 跟上游，双轨之间有迁移指南与对比分析，厂商补丁对比主线是这份教程的特色线索。
- CI 每次提交验证 U-Boot、两条内核轨道与 rootfs 的构建，用 ccache 加速。
- 自制 rootfs 教程已于 2026-07-06 公告下架（提交 a61b828，见 #89），教程线转向 Buildroot，将来的轻量可运行镜像由组织内的 [lightroot](/projects/lightroot) 供给。
- buildmeter 已于 2026-07-08 接入（#90），本仓以固定版本消费它。examples/ 目录下有 qt 与 light-meter 两个示例，light-meter 子目录对应 Mock light-meters 示例（#98）。
- 文档站部署在 GitHub Pages，在线可用。许可证 MIT，主语言 C（2026-10-02 组织快照记录，当时 105 星、4 名贡献者）。

内容完成度方面，仓库内 todo 路线图（最后更新 2026-07-14）自报任务总量 130 项，其中 25 项工具、105 篇文档，按方向划分为 D1 环境 35、D2 工具 66、D3 示例 11、D4 生态 18，P0 档文档完成 23/29。已兑现的里程碑是 v0.5（2026-03，主线内核迁移加 QT6 交叉编译）与 v1.0.0（构建、烧录到启动的完整链路在板上验证）。

已交付的大块有 linux-basics 35 章、kernel/mainline 11 篇、Buildroot 12 章教程加三个构建脚本、参考索引 11 类。没动的大块同样明确，调试手册十篇与应用文档八篇对应的目录尚未建立，CMake 交叉编译相关五项也全部未做。

todo 状态滞后于仓库实况。2026-07-14 的记录把工作流文档标为"目录未建"，而到 2026 年 8 月上旬，document/tutorial/workflow/ 下已有 3 篇，分别是 WSL2 笔记、clangd 交叉编译配置与 tasks.json 模板。这两个月的产出，包括工作流 3 篇、buildmeter 接入、Mock light-meters、v1.0.1 到 v1.0.4 的 tag 与 PDF 导出，都没有更新进 todo 的勾选状态。

老路线图自己也记过偏差，旧规划路径 tutorial/ubuntu、tutorial/usage、tutorial/troubleshooting 已废弃，内容实际落在 linux-basics、flash、build、rootfs。这些记录说明 todo 需要一次校准才能继续当可信的进度来源用。

## 下一代方向

方向是只做维护与版本交接，不再新开深度内容主线。这个仓库按成熟仓库对待，精力放在版本信息、镜像可用性与使用者反馈上。

主线目标已经兑现，从构建、烧录到启动的链路在板上验证过，130 项清单的大头落在仓库里，剩余未做的集中在示例与应用两块，属于扩张而不是补缺。

仓库已过百星，有真实读者在照 README 动手。对这部分读者来说，每个版本能用什么、在哪些组合上验证过，这类信息比新增章节更稀缺。

主线内核与工具链都在跟上游前进，当前是主线 7.1 与工具链 15.2.rel1。上游一更新，版本说明与镜像策略就需要跟着核对，这是持续到来的维护工作量，躲不开。

下面这些事方向上还没定下来，登记为待定项，等示例线有人认领或条件成熟时再定。

- 示例线接不接。D3 下挂着 PROJ-001 环境监测站与 PROJ-002 图像分析仪两个大型示例项目，#94 另有七个零采购（只用板载资源）demo 的按难度分级提案，#111 提出把 level-tool 电子水平仪并入第一个项目。这几条怎么取舍，待定。
- D2 的调试手册与 CMake 交叉编译属于排在后面的内容，什么时候补，待定。
- #116 里提到按需录制视频的意向，将来与组织的视频项目 aels-prism（公开后补入口）怎么分工，待定。

## 近期要做的事

- 做一页版本交接对表。在 document/release/ 下补 v1.0.1 到 v1.0.4 的版本说明，或者做一页汇总表，每个 tag 对应版本说明、镜像与在板上验证过的组合。做完的标志是每个 tag 都查得到这三项，查不到的那一格如实写待核实。
- 校准 todo 状态。把 2026-07 之后的实况更新进 todo 的勾选状态，修掉"目录未建"这类过时标注。做完的标志是每条状态变更都能对应到一个提交号或文件路径。
- 消化 issue 队列。从 #116（高优先级教程优化）与 #120（代码块折叠 bug）开始，#128 勘误随行，不另立优先级清单。做完的标志是 issue 里可复现的步骤被关闭。
- 评审 PR #130，决定两篇中文稿（WSL2 与 usbipd）是否收录。做完的标志是 PR 合并或给出书面结论。

## 边界与不做的事

- imx、rk、h618 三个 forge 是三个独立产品，面向不同芯片与受众，不合并，也不抽公共模板。
- D3、D4 的待办是候选清单，不是对外承诺。清单在而没排期，不等于荒废。
- rootfs 不再造第二份自制方案。教程线以 Buildroot 为主，可运行镜像的轻量路线走 lightroot。
- 设备 AI 不在本仓开新章，硬件落点在 rk-forge 的 NPU 章。
- issue 的优先级跟提出者自己标的走，本规划不重新排序。
- 本页不承诺日历排期，"近期"指动手的先后，不指日期。

## 相关链接

- [项目目录 · imx-forge](/projects/imx-forge)
- [学习地图 · imx-forge](/roadmap/03-linux/imx-forge)
- [组织路线与进行中](/todo/)
- [imx-forge GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge)
- [imx-forge 文档站](https://awesome-embedded-learning-studio.github.io/imx-forge/)
- [路线追踪 issue #47](https://github.com/Awesome-Embedded-Learning-Studio/imx-forge/issues/47)
- 配套与相邻项目：[buildmeter](/projects/buildmeter)、[lightroot](/projects/lightroot)、[devtree-journey](/projects/devtree-journey)、[rk-forge](/projects/rk-forge)、[h618_forge](/projects/h618-forge)
