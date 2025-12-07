# 嵌入式软硬协作规范与流程（简明版）

明白，你给了完整文档，现在你需要的是——**这整份文档的可跳转 Markdown 目录（TOC）**。

下面已经为你自动生成，完全可直接粘贴使用：

------

# 📚 **可跳转目录（TOC）**

- [嵌入式软硬协作规范与流程（简明版）](#嵌入式软硬协作规范与流程简明版)
  - [TL;DR](#tldr)
    - [Part：确定开发](#part确定开发)
      - [Step1](#step1)
    - [Part：硬件](#part硬件)
      - [Step2. 硬件原理图设计 & 外设接口定义](#step2-硬件原理图设计--外设接口定义)
      - [Step3. PCB 设计与样板制作（EVT Sample）](#step3-pcb-设计与样板制作evt-sample)
      - [Step4. BSP / Bootloader Bring-up](#step4-bsp--bootloader-bring-up)
    - [Part：软件](#part软件)
      - [Step2. 驱动开发与调试（Driver Development）](#step2-驱动开发与调试driver-development)
      - [Step3. 高层业务逻辑开发（Application / Service Layer）](#step3-高层业务逻辑开发application--service-layer)
      - [Step4. Mock出硬件无关的软件逻辑测试](#step4-mock出硬件无关的软件逻辑测试)
    - [Part：联调与 PreRelease 阶段](#part联调与-prerelease-阶段)
      - [Step5. 系统集成测试（含实机联调）](#step5-系统集成测试含实机联调)
      - [Step6. 回归测试 & 长稳测试（DVT 阶段）](#step6-回归测试--长稳测试dvt-阶段)
      - [Step7. 小批量试产（PVT Sample）](#step7-小批量试产pvt-sample)
    - [Part：Release 阶段](#partrelease-阶段)
      - [Step8. 量产（MP） & 全生命周期维护](#step8-量产mp--全生命周期维护)
  - [1. 目标与角色](#1-目标与角色)
  - [2. 软件分层与仓库/目录建议](#2-软件分层与仓库目录建议)
  - [3. Git 协作与分支策略（推荐）](#3-git-协作与分支策略推荐)
  - [4. PR / Code review 模板](#4-pr--code-review-模板)
  - [5. CI / 构建 / 实机测试（必备）](#5-ci--构建--实机测试必备)
  - [6. 硬件对接与约束（必须有书面接口协议）](#6-硬件对接与约束必须有书面接口协议)
  - [7. 集成与 Bring-up 流程](#7-集成与-bring-up-流程)
  - [8. 硬件测试夹具与现场测试建议](#8-硬件测试夹具与现场测试建议)
  - [9. 文档与交付物（最小集）](#9-文档与交付物最小集)
  - [10. 测试用例模板（简化）](#10-测试用例模板简化)
  - [11. 质量控制与回退策略](#11-质量控制与回退策略)
  - [12. 日常协作与沟通](#12-日常协作与沟通)

## TL;DR

### Part：确定开发

#### Step1: 

产品产品，需要明确好要做什么，我们要把产品做的怎么样，所以核心步骤如下

- 明确产品功能、性能指标、外观尺寸、供电方式等
- 软件/硬件同步确认接口与依赖

这个步骤要产出CheckList清单。

------

### Part：硬件

> Todo: HNHKHNH准备对下面的步骤进行细化和矫正，记得发Merge Request就好

#### **Step2. 硬件原理图设计 & 外设接口定义**

- 完成电气架构设计
- 定义 MCU/SoC 引脚、通讯接口、传感器/外设连接
- 评审接口文档（软件与硬件共同确认）

------

#### **Step3. PCB 设计与样板制作（EVT Sample）**

- 根据原理图进行 PCB layout
- 制作小批量样板（EVT 阶段）
- 进行基础电气测试

------

#### **Step4. BSP / Bootloader Bring-up**

- 上电验证
- Bootloader 调试（U-Boot、裸机Boot、自研Boot等）
- DDR/PMIC/Clock 初始化验证
- 基础外设点亮（GPIO、UART、I2C、SPI 等）

------

### Part：软件

软件开发主要做的是开发基本所用到的业务库，上层具体的APP逻辑，分离出业务层，驱动层和对接的HAL层

#### **Step2. 驱动开发与调试（Driver Development）**

- 编写并调试各外设驱动（屏幕、触摸、传感器、通信模块等）
- 进行中断、DMA、时序验证
- 输出驱动级测试报告

------

#### **Step3. 高层业务逻辑开发（Application / Service Layer）**

- 软件架构实现（库/业务分层、CTRL/API 层）
- UI/协议/业务功能实现
- 单元测试与模块功能测试

---

#### Step4. Mock出硬件无关的软件逻辑测试

- 要求对硬件无关的逻辑代码编写Mock测试确保上层代码的可靠性
- 抽象和组合高可复用低开销的库组件后续进行复用（可从BetterATK中迁出分发）

### Part:联调与PreRelease阶段

------

#### **Step5. 系统集成测试（含实机联调）**

- 将驱动与业务层集成
- 在真实硬件上进行全链路测试
- 功能性、稳定性、性能测试
- 软件与硬件同步修复问题

------

#### **Step6. 回归测试 & 长稳测试（DVT 阶段）**

- 大量重复测试确保更新不引入新 Bug
- 压测 / 老化测试（Burn-in）
- 温度、震动、电磁等稳定性验证（如需）

------

#### **Step7. 小批量试产（PVT Sample）**

- 小规模生产验证工艺
- 改善良率、生产流程、测试夹具
- 收集现场问题并修复

------

### Part: Release阶段

#### **Step8. 量产（MP） & 全生命周期维护**

- 量产监控（良率、返修率）
- 软件 OTA 升级与维护
- 后续版本迭代、成本优化、Bug 修复

# Details Documents

## 1. 目标与角色

- 目标：在保证代码分层清晰、可复用的前提下，建立稳定的软硬协作流程，支持频繁的实机验证与交付。
- 角色：
  - 软件负责人：负责软件架构、驱动/中间件、应用、CI、刷写与测试用例。
  - 硬件负责人：负责原理图、PCB、器件选型、测试夹具与硬件验证。
  - 联合责任：接口规范、集成测试、回归验证、版本发布。

## 2. 软件分层与仓库/目录建议

- 分层（自底向上）：

  1. BSP / Boot（引导、启动代码）
  2. HAL / 驱动层（GPIO, UART, I2C, SPI, ADC, PWM 等）
  3. 中间件（RTOS 抽象、文件系统、网络栈、协议库）
  4. 业务库（和具体硬件无关的业务逻辑、算法）
  5. 应用层（UI/CLI、具体产品逻辑）
  6. tests（单元/集成/硬件回归）

- 仓库策略：

  - 单仓库 monorepo（推荐小团队）或多仓（驱动/固件/工具分仓）。

  - 示例目录（monorepo）：

    ```
    /project
      /bsp
      /hal
      /middleware
      /libs
      /app
      /tests
      /tools (flasher, scripts)
      /docs (HW-SW-interface.md, release-notes)
    ```

## 3. Git 协作与分支策略（推荐）

- 采用：`main`（始终可发布） + `develop`（日常集成） + feature 分支 (`feature/<name>`) + `hotfix/<version>`

- 轻量方案（若偏短周期）：`main` + feature 分支 + 强制通过 PR 与 CI 才能合并到 `main`。

- PR 要求：

  - 最少 1 次代码审核（prefer 2），自动通过 CI（编译 + 单元测试）。
  - PR 标题：`[feature|fix|chore] scope: short-description`

- 常用命令示例：

  ```bash
  git checkout -b feature/uart-driver
  git commit -m "feat(hal/uart): initial uart driver"
  git push origin feature/uart-driver
  ```

## 4. PR / Code review 模板（放在 `.gitlab/merge_request_template.md` 或 PR 描述）

- 标题：`feat/bugfix: 简短说明`
- 描述：
  - 变更概述（2-3 行）
  - 影响范围（哪些模块/接口）
  - 回归风险（高/中/低）与已做测试（列举）
  - 需要硬件支持或夹具说明（若有）
  - 测试命令 / 如何验证
- Review checklist（审查者勾选）：
  -  编译通过（本地/CI）
  -  单元/集成测试通过
  -  遵守编码规范（命名/注释）
  -  接口文档更新（若改变）
  -  有明确回退方案

## 5. CI / 构建 / 实机测试（必备）

- CI 做什么：
  - Cross-compile（目标平台）并保存 artifact。
  - 静态检查（clang-tidy, cppcheck）与格式化检查。
  - 单元测试（Host 模拟 + 硬件抽象层 mock）。
- 实机测试（Hardware-in-the-loop, HIL）：
  - 在 CI 中保留“刷写 + 自动回归”任务，若 CI 环境连接到测试工位（可用）：
    - 步骤：CI 下载固件 -> 将固件刷写到指定测试板 -> 通过串口/网络触发测试脚本 -> 收集测试日志并上报。
  - 若无法自动化，建立半自动流程：自动构建 artifact + 手动刷写并运行标准测试脚本（并上传日志）。
- Artifact 管理：按语义版本 `vMAJOR.MINOR.PATCH`，文件名例如 `product-v1.2.0-20251207.bin`。

## 6. 硬件对接与约束（必须有书面接口协议）

- 每次接口变更必须有 `HW-SW Interface Spec`（单文件）并放 `docs/`，内容至少包含：
  - 接口名称（例如：SENSOR_A_UART）
  - 物理层：引脚、接口类型（UART/I2C/SPI/GPIO）、电压域、速率、pull 配置
  - 时序：复位/唤醒/握手时序（简图或表格）
  - 协议：帧格式、校验、最大数据长度、错误处理
  - 电源与功耗约束（工作/睡眠电流）
  - 传感器/模块型号与固件要求（若有）
  - 测试点与测量方法（示例：如何测 Vcc、I2C 波形）
- 对接流程：
  1. SW/ HW 共同制定 Interface Spec（在 issue 中审阅并审批）。
  2. 硬件负责人提供早期原理图/PCB /接口检测点截图。
  3. 软件负责人给出 HAL 接口 stub 与模拟器（若可行）。
  4. 首次样板 bring-up 前，软件提供最小可运行镜像（串口日志能看见启动）。
- 接口版本化：对重要接口采用 `IF-v1.0` 标记，变更需增加次版本号并通知对方。

## 7. 集成与 Bring-up 流程（建议步骤）

1. 需求确认（功能 + 量产约束 + 功耗/成本）
2. 硬件选型与原理图（硬件负责人）
3. 初版 PCB 与样板（1st prototype）
4. BSP + Boot bring-up（软件创建最小镜像并确认串口日志能启动）
5. 驱动开发（HAL -> 驱动 -> 中间件）
6. 单元测试 + 模拟器测试（先在 Host 上跑可替代逻辑）
7. 硬件接口验证（使用示波器/逻辑分析仪/测试夹具）
8. 功能集成测试（整机）
9. 回归测试与稳定性测试（压力测试、长时间运行）
10. 版本冻结与 release note
11. 小批量试产（验证制造链与测试夹具）
12. 量产交付与维护

## 8. 硬件测试夹具与现场测试建议

- 每个关键板型准备一个“测试夹具”（JIG）或带 USB/串口的编程端口，方便快速刷写/给电/测量。夹具应支持自动复位与电流测量（便于功耗验证）。
- 保留 PCB 上的多个测试点（电源、时钟、I2C/SPI 核心信号），并在 `docs` 中标注。
- 制定“开机验证清单”（Boot checklist），例如：串口输出包含 `BSP: init ok`、I2C 能扫描到传感器、外设复位脚电平正确等。

## 9. 文档与交付物（最小集）

- 必须文档：
  - `HW-SW Interface Spec`（详见上）
  - `Bring-up Guide`（如何刷写、如何获取串口日志、常见问题）
  - `Release Notes`（变更、已知问题）
  - `Test Cases`（每个功能的验证步骤）
- 交付物格式：Markdown + 二进制 artifact（固件） + 测试日志（按日期存档）。

## 10. 测试用例模板（简化）

- 用例名：`UART_loopback`
- 前置条件：板上已连接串口转 USB 模块
- 步骤：
  1. 刷写固件 `product-v1.2.0.bin`
  2. 打开串口（115200,n,8,1）
  3. 发送 `ping\n`
  4. 期待 `pong\n` 返回
- 结果：PASS/FAIL + 日志片段

## 11. 质量控制与回退策略

- 每次合并到 `main` 都必须有 CI artifact 与 release note。
- 在硬件出现问题时保留上一个良好版本的固件和 PCB 版本（例如 `hw-v1.0`），以便快速回退。
- 对关键 flash 分区做双镜像或引导回滚机制（if possible）。

## 12. 日常协作与沟通节奏

- 每周短会（15分）：同步进度、阻塞与下周计划。
- 每次接口变更发起 issue + tag `hw-sw-interface`，并在 48 小时内评审（若紧急可加催促）。
- 所有关键决定写入 `docs/decision_log.md` 便于追踪。

