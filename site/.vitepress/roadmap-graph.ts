/**
 * 学习路线图（PCB 树）种子数据。
 *
 * 数据语义来源：组织 Discussion #7（2026-08-23）与 document/roadmap/index.md 的 mermaid。
 * 种子 stars 为 2026-08-23 GitHub org API 实拉值（SSG 直出/断网兜底），运行时由 useStars() 现拉刷新。
 * 种子坐标/尺寸照已批准的首页活稿（/tmp/aels-redesign/homepage-mockup.html）逐值移植。
 */

export type RoadmapNodeType = 'root' | 'proj' | 'sup' | 'ghost'
export type RoadmapEdgeKind = 'solid' | 'dash' | 'dot'

export interface RoadmapNode {
  /** 节点短 id（边的 from/to 用它） */
  id: string
  name: string
  sub: string
  /** 种子坐标（中心点）与尺寸 */
  x: number
  y: number
  w: number
  h: number
  type: RoadmapNodeType
  /** 站点四区角标 '01'~'04' */
  badge: string
  /** 种子 star 数（2026-08-23 API 实拉）；null = 无（ghost / 不显示） */
  seedStar: number | null
  /** GitHub 仓库地址（useStars 取数用）；ghost 无 */
  repo: string | null
  /** 可点节点的跳转地址：优先站内项目页（/projects/<slug>/），由组件 withBase 补全 */
  href: string | null
}

export interface RoadmapEdge {
  from: string
  to: string
  /** solid = 建议继续；dash = 按需深化；dot = 支撑 */
  kind: RoadmapEdgeKind
}

export interface RoadmapBand {
  label: string
  top: number
  bottom: number
}

const github = (name: string) => `https://github.com/Awesome-Embedded-Learning-Studio/${name}`

export const ROADMAP_BANDS: RoadmapBand[] = [
  { label: 'L0 · 共同工作台', top: 20, bottom: 108 },
  { label: 'L1 · 语言承重墙', top: 152, bottom: 262 },
  { label: 'L2 · 系统基本功', top: 296, bottom: 406 },
  { label: 'L3 · 嵌入式实践', top: 452, bottom: 574 },
  { label: 'L4 · 完整工程 · 结课与产品', top: 624, bottom: 880 },
]

export const roadmapNodes: RoadmapNode[] = [
  { id: 'E',    name: 'EmbedBox',   sub: '共同工作台 · 入口',  x: 640,  y: 58,  w: 176, h: 66, type: 'root',  badge: '01', seedStar: 4,   repo: github('EmbedBox'),   href: '/projects/embedbox/' },
  { id: 'CJ',   name: 'C-Journey',  sub: 'C 语言承重墙',       x: 370,  y: 192, w: 152, h: 58, type: 'proj',  badge: '01', seedStar: 7,   repo: github('C-Journey'),  href: '/projects/c-journey/' },
  { id: 'TCPP', name: 'TAMCPP',     sub: '现代 C++ 承重墙',    x: 748,  y: 192, w: 160, h: 58, type: 'proj',  badge: '01', seedStar: 235, repo: github('Tutorial_AwesomeModernCPP'), href: '/projects/tutorial-awesome-modern-cpp/' },
  { id: 'ASM',  name: 'ASM',        sub: '三轨 · 规划中',      x: 1042, y: 192, w: 148, h: 58, type: 'ghost', badge: '01', seedStar: null, repo: null, href: null },
  { id: 'PL',   name: 'PenguinLab', sub: 'Linux 内核实验',     x: 148,  y: 338, w: 152, h: 58, type: 'proj',  badge: '03', seedStar: 4,   repo: github('PenguinLab'), href: '/projects/penguin-lab/' },
  { id: 'FRT',  name: 'FreeRTOS',   sub: 'RTOS · Win+Linux',   x: 402,  y: 338, w: 158, h: 58, type: 'proj',  badge: '02', seedStar: 7,   repo: github('Tutorial_FreeRTOS'), href: '/projects/tutorial-freertos/' },
  { id: 'HW',   name: 'AweHardware', sub: '硬件基础轨',        x: 652,  y: 338, w: 152, h: 58, type: 'proj',  badge: '02', seedStar: 4,   repo: github('Tutorial_AwesomeHardware'), href: '/projects/tutorial-awesome-hardware/' },
  { id: 'STF',  name: 'ST-Forge',   sub: 'STM32 主教学线',     x: 402,  y: 496, w: 150, h: 58, type: 'proj',  badge: '02', seedStar: 2,   repo: github('ST-Forge'),   href: '/projects/st-forge/' },
  { id: 'IMX',  name: 'imx-forge',  sub: '嵌入式工程大入口',   x: 726,  y: 496, w: 154, h: 58, type: 'proj',  badge: '03', seedStar: 91,  repo: github('imx-forge'),  href: '/projects/imx-forge/' },
  { id: 'RK',   name: 'rk-forge',   sub: '主线化进阶',         x: 872,  y: 496, w: 142, h: 58, type: 'proj',  badge: '03', seedStar: 46,  repo: github('rk-forge'),   href: '/projects/rk-forge/' },
  { id: 'H618', name: 'h618_forge', sub: 'Allwinner 研究',     x: 1006, y: 496, w: 152, h: 58, type: 'proj',  badge: '03', seedStar: 2,   repo: github('h618_forge'), href: '/projects/h618-forge/' },
  { id: 'AQT',  name: 'AwesomeQt',  sub: 'Qt 旗舰 · 上位机',   x: 1170, y: 496, w: 148, h: 58, type: 'proj',  badge: '01', seedStar: 69,  repo: github('Tutorial_AwesomeQt'), href: '/projects/tutorial-awesome-qt/' },
  { id: 'MF',   name: 'micro-forge', sub: 'MCU 验证底座',      x: 232,  y: 452, w: 140, h: 46, type: 'sup',   badge: '02', seedStar: 6,   repo: github('micro-forge'), href: '/projects/micro-forge/' },
  { id: 'BM',   name: 'buildmeter', sub: '构建基建',           x: 580,  y: 582, w: 126, h: 46, type: 'sup',   badge: '03', seedStar: 0,   repo: github('buildmeter'), href: '/projects/buildmeter/' },
  { id: 'MW',   name: 'MicroWatch', sub: 'MCU 结课工程',       x: 402,  y: 664, w: 150, h: 58, type: 'proj',  badge: '02', seedStar: 1,   repo: github('Project_MicroWatch'), href: '/projects/project-micro-watch/' },
  { id: 'CFB',  name: 'CFBox',      sub: 'userspace 结课',     x: 700,  y: 664, w: 146, h: 58, type: 'proj',  badge: '03', seedStar: 13,  repo: github('CFBox'),      href: '/projects/cfbox/' },
  { id: 'ECP',  name: 'eng. cpp',   sub: '工程方法 hub',       x: 902,  y: 664, w: 142, h: 58, type: 'proj',  badge: '01', seedStar: 2,   repo: github('engineering_cpp'), href: '/projects/engineering-cpp/' },
  { id: 'SIP',  name: 'IniParser',  sub: '首个小工程 spoke',   x: 1064, y: 664, w: 148, h: 58, type: 'proj',  badge: '01', seedStar: 10,  repo: github('Tutorial_cpp_SimpleIniParser'), href: '/projects/tutorial-cpp-simple-ini-parser/' },
  { id: 'CBK',  name: 'Cinux-Book', sub: 'OS 教学重放',        x: 748,  y: 816, w: 148, h: 58, type: 'proj',  badge: '04', seedStar: 50,  repo: github('Cinux-Book'), href: '/projects/cinux-book/' },
  { id: 'CIN',  name: 'Cinux',      sub: 'OS 产品线',          x: 928,  y: 816, w: 132, h: 58, type: 'proj',  badge: '04', seedStar: 38,  repo: github('Cinux'),     href: '/projects/cinux/' },
]

export const roadmapEdges: RoadmapEdge[] = [
  { from: 'E',    to: 'CJ',   kind: 'solid' },
  { from: 'E',    to: 'TCPP', kind: 'solid' },
  { from: 'CJ',   to: 'PL',   kind: 'solid' },
  { from: 'CJ',   to: 'FRT',  kind: 'solid' },
  { from: 'CJ',   to: 'HW',   kind: 'solid' },
  { from: 'CJ',   to: 'IMX',  kind: 'solid' },
  { from: 'TCPP', to: 'ECP',  kind: 'solid' },
  { from: 'TCPP', to: 'CBK',  kind: 'solid' },
  { from: 'TCPP', to: 'AQT',  kind: 'solid' },
  { from: 'FRT',  to: 'STF',  kind: 'solid' },
  { from: 'IMX',  to: 'RK',   kind: 'solid' },
  { from: 'RK',   to: 'H618', kind: 'solid' },
  { from: 'IMX',  to: 'CFB',  kind: 'solid' },
  { from: 'STF',  to: 'MW',   kind: 'solid' },
  { from: 'ECP',  to: 'SIP',  kind: 'solid' },
  { from: 'PL',   to: 'IMX',  kind: 'dash' },
  { from: 'HW',   to: 'STF',  kind: 'dash' },
  { from: 'ASM',  to: 'CBK',  kind: 'dash' },
  { from: 'ASM',  to: 'STF',  kind: 'dash' },
  { from: 'MF',   to: 'STF',  kind: 'dot' },
  { from: 'BM',   to: 'IMX',  kind: 'dot' },
  { from: 'CIN',  to: 'CBK',  kind: 'dot' },
]
