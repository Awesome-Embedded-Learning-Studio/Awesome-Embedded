export type ProjectLane = 'learning' | 'product' | 'infrastructure'

export type ProjectStage = 'building' | 'verifiable' | 'delivered' | 'maintained'

export type LearningGroup =
  | 'tools-language'
  | 'cpp-engineering'
  | 'systems-fundamentals'
  | 'mcu-practice'
  | 'linux-practice'
  | 'gui-topics'

export type ProductGroup = 'os-product' | 'components' | 'cf-desktop'

export type InfrastructureGroup = 'verification' | 'build-toolchain'

export type ProjectGroup<L extends ProjectLane = ProjectLane> = L extends 'learning'
  ? LearningGroup
  : L extends 'product'
    ? ProductGroup
    : InfrastructureGroup

export interface AelsProject<L extends ProjectLane = ProjectLane> {
  name: string
  slug: string
  repo: string
  lane: L
  group: ProjectGroup<L>
  kind: string
  domains: string[]
  stage: ProjectStage
  position: string
  description: string
  evidence: string
  relations: string[]
}

export interface LaneGroup<L extends ProjectLane = ProjectLane> {
  id: ProjectGroup<L>
  title: string
  description?: string
}

const github = (name: string) => `https://github.com/Awesome-Embedded-Learning-Studio/${name}`

export const laneLabels: Record<ProjectLane, { title: string; description: string }> = {
  learning: {
    title: '教学线',
    description: '围绕学习深度组织的教程、平台工坊和工程实践。仓库之间允许交叉，并不构成统一的强制前置链。',
  },
  product: {
    title: '产品线',
    description: '持续演进的真实产品与公共组件。教学线只在稳定版本上解释和重放能力，不复制整座产品仓库。',
  },
  infrastructure: {
    title: '基建与验证',
    description: '为课程、构建和真实交付提供验证能力；它们支撑学习路线，但不自动成为学习者的下一站。',
  },
}

export const laneGroups: { [L in ProjectLane]: LaneGroup<L>[] } = {
  learning: [
    {
      id: 'tools-language',
      title: '工具与语言基础',
      description: '终端工具链与 C / Modern C++ 语言承重墙，为一切实践准备基础能力。',
    },
    {
      id: 'cpp-engineering',
      title: 'C++ 工程实践',
      description: '从语言能力走进真实工程交付：规格、测试、安装、版本与下游消费。',
    },
    {
      id: 'systems-fundamentals',
      title: '系统与硬件基础',
      description: '内核、RTOS、硬件与 OS 教学重放等通用系统知识，按需穿插学习。',
    },
    {
      id: 'mcu-practice',
      title: 'MCU 实践',
      description: '从 STM32 裸机寄存器到 FreeRTOS 综合工程的 MCU 建设主线。',
    },
    {
      id: 'linux-practice',
      title: '嵌入式 Linux 实践',
      description: '打通 U-Boot、内核、设备树、rootfs 与板端调试的平台工坊与高阶工程。',
    },
    {
      id: 'gui-topics',
      title: 'GUI 与专题',
      description: 'Qt 技术教程与独立工程专题，与产品组件形成工程交接关系。',
    },
  ],
  product: [
    {
      id: 'os-product',
      title: '系统产品',
      description: '持续演进的前沿操作系统产品，稳定能力交给教学重放。',
    },
    {
      id: 'components',
      title: '组件与库',
      description: '被真实产品消费的公共基础库与 Qt 组件。',
    },
    {
      id: 'cf-desktop',
      title: 'CF 桌面生态',
      description: 'CFDesktop 桌面产品及其应用集与资源供应链。',
    },
  ],
  infrastructure: [
    {
      id: 'verification',
      title: '验证设施',
      description: '为课程和固件提供确定性模拟、故障观察与 CI 验证入口。',
    },
    {
      id: 'build-toolchain',
      title: '构建与工具链',
      description: '服务真实构建链的构建观测、构建系统与交叉工具链实验。',
    },
  ],
}

export const projects: AelsProject[] = [
  {
    name: 'EmbedBox',
    slug: 'embedbox',
    repo: github('EmbedBox'),
    lane: 'learning',
    group: 'tools-language',
    kind: '入门教程',
    domains: ['工具', '嵌入式'],
    stage: 'verifiable',
    position: '先学会使用终端、Git、GCC、CMake、GDB、交叉编译和常用开发环境。',
    description: 'AELS 的初步入门层：建立足够开始实践的工具能力，不垄断这些工具背后的深入知识。',
    evidence: '教程站可构建；具体工具细节可在后续语言与系统仓库中继续深化。',
    relations: ['可继续进入 C-Journey 或 Tutorial_AwesomeModernCPP', '也可在具备所需语言能力后进入平台工坊'],
  },
  {
    name: 'C-Journey',
    slug: 'c-journey',
    repo: github('C-Journey'),
    lane: 'learning',
    group: 'tools-language',
    kind: '语言教程',
    domains: ['C', '系统编程'],
    stage: 'delivered',
    position: '围绕 C 语言逐步深入编译、链接、调试、测试和系统编程。',
    description: 'C 语言承重墙；学习者达到具体平台所需程度后即可进入实践，不要求一次学完整仓库。',
    evidence: '主体课程、示例和持续集成已经形成。',
    relations: ['为 ST-Forge 和嵌入式 Linux 实践提供 C 能力', '与 EmbedBox 是深度递进而非内容互斥'],
  },
  {
    name: 'Tutorial_AwesomeModernCPP',
    slug: 'tutorial-awesome-modern-cpp',
    repo: github('Tutorial_AwesomeModernCPP'),
    lane: 'learning',
    group: 'tools-language',
    kind: '语言教程',
    domains: ['C++', '工程方法'],
    stage: 'delivered',
    position: '系统学习现代 C++，并把语言能力带入系统软件、MCU、Linux 和产品工程。',
    description: 'C++ 语言承重墙，侧重语言深度、工程方法与领域实践。',
    evidence: '课程主体、可编译示例、CI 和版本发布已经形成。',
    relations: ['为 C++ 工程实践和产品组件提供语言基础', '与 EmbedBox 的工具内容按学习目的继续深化'],
  },
  {
    name: 'engineering_cpp',
    slug: 'engineering-cpp',
    repo: github('engineering_cpp'),
    lane: 'learning',
    group: 'cpp-engineering',
    kind: '工程方法 Hub',
    domains: ['C++', '工程交付'],
    stage: 'delivered',
    position: '在语言基础与真实系统实践之间，讲共同的需求、设计、测试、构建和交付方法。',
    description: '现代 C++ 工程实践的入口与组织者；具体项目放在独立 spoke 中完成。',
    evidence: '第一季课程已经交付，并通过 submodule 连接现有工程项目。',
    relations: ['组织 SimpleIniParser 与 anatomy_memory', '不扩张为另一套百科式语言教程'],
  },
  {
    name: 'Tutorial_cpp_SimpleIniParser',
    slug: 'tutorial-cpp-simple-ini-parser',
    repo: github('Tutorial_cpp_SimpleIniParser'),
    lane: 'learning',
    group: 'cpp-engineering',
    kind: '工程实践',
    domains: ['C++', '库设计'],
    stage: 'building',
    position: '用一个边界明确的小型库完整经历规格、错误模型、测试、安装、版本和下游消费。',
    description: '演示“小工程怎样做对”，不追求成为功能最强的 INI 库。',
    evidence: '已有课程与代码基础；新的工程闭环正在小步重构。',
    relations: ['由 engineering_cpp 组织', '计划交付库、ini-check 工具与真实消费者'],
  },
  {
    name: 'anatomy_memory',
    slug: 'anatomy-memory',
    repo: github('anatomy_memory'),
    lane: 'learning',
    group: 'cpp-engineering',
    kind: '高阶工程实验',
    domains: ['C++', '内存管理'],
    stage: 'building',
    position: '先证明内存池正确，再严谨讨论性能、缓存和 benchmark。',
    description: '以所有权、不变量、对齐、并发检查和测量方法为核心的高阶工程实验。',
    evidence: '已有实现和测试；完整 sanitizer、CI 与严格基准仍需补齐。',
    relations: ['由 engineering_cpp 组织', '不预设“必然比 malloc 快”的结论'],
  },
  {
    name: 'PenguinLab',
    slug: 'penguin-lab',
    repo: github('PenguinLab'),
    lane: 'learning',
    group: 'systems-fundamentals',
    kind: '系统实验室',
    domains: ['Linux', '内核'],
    stage: 'building',
    position: '用 QEMU 观察 Linux 内核、系统编程与调试机制，可先学也可在板级实践中按需回补。',
    description: '系统基本功承重墙，目标是把知识陈述变成可运行、可观察的实验。',
    evidence: '已有多层知识图谱、笔记与实验资产；下一阶段需要加强执行验证与路线清晰度。',
    relations: ['为 imx-forge 与 rk-forge 提供通用 Linux 深度', '不是进入具体开发板的强制门禁'],
  },
  {
    name: 'Tutorial_FreeRTOS',
    slug: 'tutorial-freertos',
    repo: github('Tutorial_FreeRTOS'),
    lane: 'learning',
    group: 'systems-fundamentals',
    kind: '系统教程',
    domains: ['RTOS', 'C'],
    stage: 'building',
    position: '在 Host 上学习任务、队列、同步等 RTOS 语义，再到具体 MCU 处理平台差异。',
    description: '通用 RTOS 知识补充，不把主机模拟结论冒充真板时序结论。',
    evidence: '已有 Host 可运行示例；代码级 CI 验证仍需加强。',
    relations: ['为 ST-Forge 的 FreeRTOS 内容提供概念补充', 'Host 模拟不替代真板验收'],
  },
  {
    name: 'Tutorial_AwesomeHardware',
    slug: 'tutorial-awesome-hardware',
    repo: github('Tutorial_AwesomeHardware'),
    lane: 'learning',
    group: 'systems-fundamentals',
    kind: '硬件教程',
    domains: ['硬件', '板级调试'],
    stage: 'building',
    position: '在真实板级问题出现时补充电源、电路、器件、接口和读手册能力。',
    description: '嵌入式硬件知识补充；现有内容以电源电子为主，MCU 硬件部分仍在生长。',
    evidence: '电源与功率变换内容已经形成；MCU 方向目前只建立了初步入口。',
    relations: ['可伴随 ST-Forge 和 Linux 开发板实践按需学习'],
  },
  {
    name: 'ST-Forge',
    slug: 'st-forge',
    repo: github('ST-Forge'),
    lane: 'learning',
    group: 'mcu-practice',
    kind: 'MCU 工坊',
    domains: ['STM32', '裸机'],
    stage: 'building',
    position: '具备基本工具能力和足够的 C 语言能力后，进入 STM32F1 的启动、寄存器、外设和调试实践。',
    description: '当前 MCU 教学建设主线；围绕课程、代码、模拟和真板逐步建立验证闭环。',
    evidence: '课程设计已经形成，仓库实现仍处早期建设阶段。',
    relations: ['micro-forge 提供部分确定性模拟能力', 'Tutorial_FreeRTOS 提供概念补充', '不预设统一结课产品'],
  },
  {
    name: 'BareMetal-Drivers',
    slug: 'baremetal-drivers',
    repo: github('BareMetal-Drivers'),
    lane: 'learning',
    group: 'mcu-practice',
    kind: '代码资产',
    domains: ['MCU', '驱动'],
    stage: 'building',
    position: '保存和整理可复用的裸机驱动与器件资产。',
    description: '它可以接收经过验证的成熟驱动，但不是 ST-Forge 之后的固定学习阶段。',
    evidence: '已有 STM32 与 OLED/I2C 等代码；统一构建、测试和 CI 仍需加强。',
    relations: ['可承接平台工坊中成熟的可复用资产'],
  },
  {
    name: 'Project_MicroWatch',
    slug: 'project-micro-watch',
    repo: github('Project_MicroWatch'),
    lane: 'learning',
    group: 'mcu-practice',
    kind: '综合工程',
    domains: ['MCU', 'FreeRTOS'],
    stage: 'building',
    position: '独立发展的 STM32G431 / FreeRTOS 工程，用于观察资源受限产品的综合问题。',
    description: '现有 MCU 项目，不代表 ST-Forge 或整个 MCU 路线的预定终点。',
    evidence: '项目仍在建设，硬件与完整产品闭环尚未稳定。',
    relations: ['与 MCU 教学共享部分知识和资产，但不承担统一 Capstone'],
  },
  {
    name: 'bareline',
    slug: 'bareline',
    repo: github('bareline'),
    lane: 'learning',
    group: 'mcu-practice',
    kind: '工程桥梁',
    domains: ['C++', 'MCU'],
    stage: 'verifiable',
    position: '从现代 C++ 进入无堆、无异常、静态分派与交叉编译的 MCU 工程。',
    description: '资源受限环境中的现代 C++ shell 库和工程示例。',
    evidence: '具备 Host 测试、交叉构建与 STM32F103 真板示例。',
    relations: ['可在 ST-Forge 的真实 UART 工程中形成稳定消费关系'],
  },
  {
    name: 'imx-forge',
    slug: 'imx-forge',
    repo: github('imx-forge'),
    lane: 'learning',
    group: 'linux-practice',
    kind: 'Linux 平台工坊',
    domains: ['i.MX6ULL', 'Embedded Linux'],
    stage: 'delivered',
    position: '用较简单的 i.MX6ULL 打通 U-Boot、内核、设备树、rootfs、驱动和板端调试。',
    description: '嵌入式 Linux 的成熟入门工坊，兼顾教学解释与真实 BSP 交付。',
    evidence: '已有版本发布、可复现构建和真板验证记录。',
    relations: ['可继续进入 rk-forge 的不同 Rockchip 平台', '固定版本消费 buildmeter', '为 CFBox 提供真板验收环境'],
  },
  {
    name: 'rk-forge',
    slug: 'rk-forge',
    repo: github('rk-forge'),
    lane: 'learning',
    group: 'linux-practice',
    kind: 'Linux 平台工坊',
    domains: ['Rockchip', 'Embedded Linux'],
    stage: 'building',
    position: '根据已有经验和目标平台进入 RK3506B、RK3568 或 RK3588，不要求依次购买和学习全部开发板。',
    description: '横跨 32/64 位 Rockchip 平台的板级工作区，各平台保持工具链、ABI 与产物边界。',
    evidence: '三板定位和工作区已经形成，平台课程与真板证据仍在持续建设。',
    relations: ['可承接 imx-forge 之后的平台深化', '固定版本消费 buildmeter', 'h618_forge 提供主线化横向参考'],
  },
  {
    name: 'h618_forge',
    slug: 'h618-forge',
    repo: github('h618_forge'),
    lane: 'learning',
    group: 'linux-practice',
    kind: '横向参考',
    domains: ['Allwinner', 'Mainline Linux'],
    stage: 'verifiable',
    position: '对照主线 U-Boot、TF-A、Linux 与自建 rootfs 的实践路径。',
    description: 'Allwinner H618 主线化研究工作区，不是 i.MX6ULL 或 Rockchip 的固定后继。',
    evidence: '已有完整主线链路和真板验证日志。',
    relations: ['为 imx-forge 与 rk-forge 提供横向方法参考'],
  },
  {
    name: 'CFBox',
    slug: 'cfbox',
    repo: github('CFBox'),
    lane: 'learning',
    group: 'linux-practice',
    kind: '高阶工程',
    domains: ['C++', 'Linux userspace'],
    stage: 'verifiable',
    position: '作为 Linux userspace 高阶工程，研究 POSIX 行为、差分测试、rootfs、PID 1 与板端交付。',
    description: '真实 C++23 系统软件项目，不逐个把大量 applet 重新讲成知识文章。',
    evidence: '具有系统测试，并已在 i.MX6ULL 上作为 PID 1 运行。',
    relations: ['通过 imx-forge 完成板端验证', '可作为 Linux userspace 工程交接案例'],
  },
  {
    name: 'Tutorial_AwesomeQt',
    slug: 'tutorial-awesome-qt',
    repo: github('Tutorial_AwesomeQt'),
    lane: 'learning',
    group: 'gui-topics',
    kind: '技术教程',
    domains: ['Qt', 'GUI'],
    stage: 'building',
    position: '系统学习 Qt 6；稳定能力可由产品组件提供真实消费和升级案例。',
    description: 'Qt 学习仓库，不把整个 CF 产品线复制为教程。',
    evidence: '已有大规模教程内容；需要继续加强精细化与工程验证。',
    relations: ['可选取 QuarkWidgets 或 CF 产品中的稳定组件做工程交接'],
  },
  {
    name: 'edgecv',
    slug: 'edgecv',
    repo: github('edgecv'),
    lane: 'learning',
    group: 'gui-topics',
    kind: '工程专题',
    domains: ['C++', 'OpenCV'],
    stage: 'building',
    position: '研究如何为动态 OpenCV 接口建立类型安全的现代 C++ facade。',
    description: '独立工程专题；在出现真实板端或产品消费者前，不进入核心学习主路。',
    evidence: '已有 C++20 库设计与示例，真实消费者尚未建立。',
    relations: ['与主学习路线保持相邻，不预设为下一阶段'],
  },
  {
    name: 'Cinux',
    slug: 'cinux',
    repo: github('Cinux'),
    lane: 'product',
    group: 'os-product',
    kind: '前沿系统产品',
    domains: ['OS', 'C++'],
    stage: 'verifiable',
    position: '持续探索 x86_64 内核、用户态、文件系统和 GUI，并把稳定能力交给教学重放。',
    description: '现代 C++ 操作系统实验产品；基础组件和 GUI 代码统一收拢在本仓库维护。',
    evidence: '已有 Host/QEMU 测试、版本发布与可运行系统能力。',
    relations: ['稳定能力由 Cinux-Book 负责教学重放'],
  },
  {
    name: 'Cinux-Book',
    slug: 'cinux-book',
    repo: github('Cinux-Book'),
    lane: 'learning',
    group: 'systems-fundamentals',
    kind: '系统教程',
    domains: ['OS', 'C++'],
    stage: 'verifiable',
    position: '按稳定切片重放 Cinux 的操作系统能力，保证课程连续和实验可复现。',
    description: 'Cinux 的教学入口，不追逐产品仓库中的每个前沿变更。',
    evidence: '已有分阶段教程和可构建、可运行的实验路径。',
    relations: ['消费 Cinux 的稳定版本或 SHA'],
  },
  {
    name: 'aex',
    slug: 'aex',
    repo: github('aex'),
    lane: 'product',
    group: 'components',
    kind: '公共组件',
    domains: ['C++', '基础库'],
    stage: 'building',
    position: '为真实 C++ 产品提供轻量通用组件。',
    description: '保持公共基础库身份；教学只抽取代表性 API、兼容和升级案例。',
    evidence: '已有跨项目使用的 header-only 组件，接口仍在演进。',
    relations: ['被 QuarkWidgets 等产品组件消费'],
  },
  {
    name: 'QuarkWidgets',
    slug: 'quark-widgets',
    repo: github('QuarkWidgets'),
    lane: 'product',
    group: 'components',
    kind: '产品组件',
    domains: ['Qt', 'GUI'],
    stage: 'building',
    position: '维护可被桌面产品和工具复用的 Qt 组件。',
    description: '真实 Qt 组件库，不强行改造成百科式教程仓。',
    evidence: '已有组件、测试与真实消费者；依赖交接仍需继续收敛。',
    relations: ['构筑在 aex 之上', '被 CFDesktop、CFDeskit 等产品消费'],
  },
  {
    name: 'CFDesktop',
    slug: 'cfdesktop',
    repo: github('CFDesktop'),
    lane: 'product',
    group: 'cf-desktop',
    kind: '桌面产品',
    domains: ['Qt', 'Embedded Linux'],
    stage: 'building',
    position: '持续建设嵌入式桌面产品，并通过 Linux 平台完成部署和真板验收。',
    description: '产品线主体；不为教学重新复制一座 CF 教程大仓。',
    evidence: '桌面框架与主机侧能力持续建设，嵌入式交付链仍需闭环。',
    relations: ['消费 QuarkWidgets 与 aex', '与 CFDeskit 通过应用契约协作', '由 imx/rk 提供部署环境'],
  },
  {
    name: 'CFDeskit',
    slug: 'cfdeskit',
    repo: github('CFDeskit'),
    lane: 'product',
    group: 'cf-desktop',
    kind: '产品应用集',
    domains: ['Qt', 'Desktop'],
    stage: 'building',
    position: '维护可独立安装、运行和卸载的 CFDesktop 应用。',
    description: 'CFDesktop 生态中的独立应用集合。',
    evidence: '已有进程隔离与运行时安装/发现方向，契约仍在持续建设。',
    relations: ['消费 QuarkWidgets', '通过运行时契约接入 CFDesktop'],
  },
  {
    name: 'CF-Gallery',
    slug: 'cf-gallery',
    repo: github('CF-Gallery'),
    lane: 'product',
    group: 'cf-desktop',
    kind: '资源供应链',
    domains: ['资源', 'Desktop'],
    stage: 'building',
    position: '维护 CFDesktop 可安装资源包及其来源、版权和清单契约。',
    description: '不进入技术学习主线，作为真实资源供应链的一部分存在。',
    evidence: '已有资源站和运行时安装方式，来源与生命周期契约需要持续治理。',
    relations: ['通过资源安装契约服务 CFDesktop'],
  },
  {
    name: 'micro-forge',
    slug: 'micro-forge',
    repo: github('micro-forge'),
    lane: 'infrastructure',
    group: 'verification',
    kind: '验证设施',
    domains: ['STM32', '模拟器'],
    stage: 'verifiable',
    position: '为受支持的 STM32F103 固件提供确定性模拟、故障观察和 CI 入口。',
    description: 'Cortex-M3 全系统模拟器；既可作为高级工程研究，也主要承担 MCU 验证职责。',
    evidence: '具备自动测试、CI、端到端回归，并能运行受支持的真实 HAL 固件。',
    relations: ['为 ST-Forge 的部分实验提供验证', '模拟结果不替代电气、功耗和真板时序'],
  },
  {
    name: 'buildmeter',
    slug: 'buildmeter',
    repo: github('buildmeter'),
    lane: 'infrastructure',
    group: 'build-toolchain',
    kind: '构建基建',
    domains: ['Build', 'Observability'],
    stage: 'verifiable',
    position: '为长时间 GNU make 工程提供流式解析、阶段、进度和 ETA。',
    description: '纯粹的 AELS 基建线，不作为嵌入式 Linux 学习步骤。',
    evidence: '已被 imx-forge 和 rk-forge 以固定版本消费。',
    relations: ['服务 imx-forge 与 rk-forge 的真实构建链'],
  },
  {
    name: 'lightroot',
    slug: 'lightroot',
    repo: github('lightroot'),
    lane: 'infrastructure',
    group: 'build-toolchain',
    kind: '构建系统实验',
    domains: ['Rootfs', 'Build'],
    stage: 'building',
    position: '实验 typed IR、依赖解析、lockfile、执行器与最小 rootfs。',
    description: '当前只按构建系统实验定位，不宣称替代 Buildroot。',
    evidence: '已有 i.MX 配置和镜像方向，执行与 rootfs 闭环仍未完整。',
    relations: ['需要在 QEMU 或真实平台完成最小 rootfs 闭环后再扩大定位'],
  },
  {
    name: 'qt-compile-pipeline',
    slug: 'qt-compile-pipeline',
    repo: github('qt-compile-pipeline'),
    lane: 'infrastructure',
    group: 'build-toolchain',
    kind: '交叉构建实验',
    domains: ['Qt', 'Toolchain'],
    stage: 'building',
    position: '解释并实现 host Qt、target Qt、sysroot、toolchain 与 SDK bundle 的真实交付。',
    description: '不继续扩张成万能一键脚本；是否独立保留取决于真实产品交付链。',
    evidence: '已有 Qt ARM 交叉构建脚本，尚未与 CFDesktop/BSP 建立完整固定版本交接。',
    relations: ['需要进入 CFDesktop 与 Linux BSP 的真实交付链'],
  },
]

// fail loud：数据不一致时在 import 即刻暴露（dev / build / 侧边栏生成都会经过这里）
{
  const groupIds: Record<ProjectLane, Set<string>> = {
    learning: new Set(laneGroups.learning.map((group) => group.id)),
    product: new Set(laneGroups.product.map((group) => group.id)),
    infrastructure: new Set(laneGroups.infrastructure.map((group) => group.id)),
  }
  const seenSlugs = new Set<string>()
  for (const project of projects) {
    if (!groupIds[project.lane].has(project.group)) {
      throw new Error(`project-data: 项目 ${project.name} 的 group "${project.group}" 不属于 lane "${project.lane}"`)
    }
    if (seenSlugs.has(project.slug)) {
      throw new Error(`project-data: slug "${project.slug}" 重复（${project.name}）`)
    }
    seenSlugs.add(project.slug)
  }
}

export const publicProjectNames = projects.map((project) => project.name)
