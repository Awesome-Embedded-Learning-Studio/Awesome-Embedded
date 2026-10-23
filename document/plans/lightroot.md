---
title: "lightroot 规划"
---

## 这个仓库是什么

lightroot 是组织公开的嵌入式 rootfs 构建器。rootfs 指根文件系统，内核启动后挂载的用户态环境都在里面。README 自述 A more usable Buildroot-style embedded rootfs builder，GitHub 仓库描述写 expected to be a modern version of BuildRoot。

它用 C++ 加声明式配置描述包、依赖、工具链与镜像布局，由工具解析出构建计划并生成镜像。现阶段处在 Stage 1，类型化 IR、项目配置、包清单解析与包注册表在推进，依赖解析、执行器与完整 BusyBox rootfs 闭环排在后面（来源：仓库 README 与[项目页](/projects/lightroot)）。

在组织里它有两个身份。rootfs 镜像的制作向这里集中，其他发行版的 rootfs 试做也排在这里，不再另开仓库。它同时是无板路线的镜像产出方，无板指不依赖开发板也能复现，受众因此从有开发板的人扩到所有人。imx-forge 的自制 rootfs 教程已在 2026-07-06 下架（提交 a61b828，issue #89），教程线转 Buildroot，轻量可运行镜像的供给指向本仓（来源：[imx-forge 规划](/plans/imx-forge)）。

## 现状

以下数字与事实来自仓库 README、GitHub 查询与组织快照，查询日期 2026-10-22。

- 2026-06-17 建仓，star 1，最后一次推送在 2026-06-26，内容是合并 PR #1（feat/lightroot-imx6ull-build，i.MX6ULL 构建线），homepage 字段为空。

- 约 30 万字节 C++ 实质代码，能在 i.MX6ULL 上产出可启动的 SD 卡镜像。工程化基础齐备：CPM.cmake 管依赖，Ninja 驱动构建，GoogleTest 做测试。

- 仓库内规划文档在 document/planning/，已定的设计决策集中在 document/planning/11-design-decisions.md。

- 2026-06-26 之后无新推送，仓库内也没有更新的进度记录。Stage 1 各项实际推进到哪一步，待核实。

## 下一代方向

主推一条线：承接其他发行版的 rootfs 制作，加上无板可复现的 QEMU 镜像。两个方向共用同一个验收口径，不碰开发板的人按文档能复现出可启动镜像。

推这条线的理由是需求现成。组织教学线里嵌入式 Linux 的动手环节默认要有一块开发板，没有板的人进不了实验，QEMU 镜像让一台普通电脑就能完成复现。[Tutorial_AwesomeQt 规划](/plans/tutorial-awesome-qt)的 embedded 线明说在等本仓产出 QEMU 可复现的镜像样例，imx-forge 也已把轻量镜像的供给指到这里。镜像产出后，各教程仓的验证环节也能少依赖实体板。

下一份可见产物在两个候选里出：

- 无板可复现的 QEMU 镜像样例。

- 其他发行版 rootfs 的最小试做。

先做哪个、镜像样例先覆盖哪个发行版，都是待定项，定了再开工。

## 近期要做的事

- 更新 README 的 Status 段。验收口径是 Status 段与仓库实况一致，读者据此知道当前能用什么、还没兑现什么。

- 核对并补齐开源许可。验收口径是仓库带 MIT 许可文件，与组织对公开仓的统一做法一致。

两件都是不动代码主体的小活，做完即收。镜像制作等教学线或实验需要时再启动，平时不为改而改。

## 边界与不做的事

- 不替代 imx-forge、rk-forge、h618_forge 的板级内容，平台仓提供真实 BSP 与硬件事实，本仓只做构建机制，两边配合（口径见[项目页](/projects/lightroot)）。

- rootfs 构建在组织内只保留本仓一个入口，不再为其他发行版另开仓库。

- 无板复现以 QEMU 为准，不承诺模拟所有开发板型号。

- 近期两件小活之外不动代码主体，需求出现前不制造改动。

- 本页只写方向与边界，不承诺任何更新节奏。

## 相关链接

- [项目页 · lightroot](/projects/lightroot)

- [imx-forge 规划](/plans/imx-forge)，轻量镜像供给关系的另一端

- [Tutorial_AwesomeQt 规划](/plans/tutorial-awesome-qt)，embedded 线在等本仓的 QEMU 镜像样例

- [中心站建设规划](/plans/central-station)，联合发行与无板路线的编排侧

- [组织路线与进行中](/todo/)

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/lightroot)
