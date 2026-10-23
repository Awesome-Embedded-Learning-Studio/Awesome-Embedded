// 中心站「路线与进行中」的公开数据源（单一真相源）。
// 只登记已拍板的方向级事项：跨仓方向与中心站自身。单一仓库的开发细节留在各仓
// 自己的 roadmap 与 todo 里，本文件不收，边界说明见 document/todo/index.md。
// 维护约定：只手写，不从 orgorg 自动导出（导出默认拒绝）。日期粒度到月，
// 不对外承诺任何节奏。状态海拔：queued 已拍板未领取 / active 进行中（封顶 4 条，
// 对齐总规划的并行容量）/ done 已完成。
export type TodoStatus = 'queued' | 'active' | 'done'
export type TodoTrack = 'central' | 'learning' | 'product' | 'infra'

export interface TodoItem {
  id: string
  title: string
  desc: string
  track: TodoTrack
  status: TodoStatus
  /** 站内路径，或组织内公开仓库的链接 */
  link?: string
  /** 引用项目目录里的仓库时填 slug，构建期与 project-data 核对 */
  projectSlug?: string
  /** 月份（YYYY-MM）：登记、完成与最近变动共用这一种粒度 */
  month: string
}

export const trackLabels: Record<TodoTrack, { title: string }> = {
  central: { title: '中心站' },
  learning: { title: '教学线' },
  product: { title: '产品线' },
  infra: { title: '基建' },
}

export const todoItems: TodoItem[] = [
  {
    id: 'blog-launch',
    title: '博客与周报机制上线',
    desc: '文章区带上日期、标签、自动列表与 RSS，周报收拢为博客的固定形式。',
    track: 'central',
    status: 'done',
    link: '/blog/',
    month: '2026-10',
  },
  {
    id: 'cfg-param',
    title: '站点配置参数化',
    desc: 'base 路径与线上域名不再写死，本地可换环境构建预览，非法配置构建即报错。',
    track: 'central',
    status: 'done',
    link: 'https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded',
    month: '2026-10',
  },
  {
    id: 'new-repos',
    title: '新仓上架',
    desc: 'ZerOS、libestdx、devtree-journey 进入项目目录与学习地图。',
    track: 'central',
    status: 'done',
    link: '/projects/',
    month: '2026-10',
  },
  {
    id: 'narrative-align',
    title: '学习地图口径对齐',
    desc: '学习地图的 GUI 叙事对齐新口径，清掉站内旧足迹。',
    track: 'central',
    status: 'done',
    link: '/roadmap/',
    month: '2026-10',
  },
  {
    id: 'bilingual-og',
    title: '双语骨架与全站 OG 标签',
    desc: '中英双语结构与每页的分享预览标签落成，英文内容等中文稳定后翻译。',
    track: 'central',
    status: 'done',
    link: '/en/',
    month: '2026-08',
  },
  {
    id: 'frontend-restyle',
    title: '中心站前端改版',
    desc: '阅读尺度、找路与组件语言的系统性改版，正文提到 16px，学习入口提前，窄屏换文字版学习树。',
    track: 'central',
    status: 'done',
    link: '/',
    month: '2026-10',
  },
  {
    id: 'weekly-return',
    title: '周报复刊',
    desc: '以博客文章的形式复刊，停刊期间的回顾随第一期一起发布。',
    track: 'central',
    status: 'active',
    link: '/blog/',
    month: '2026-10',
  },
  {
    id: 'st-forge-revive',
    title: 'ST-Forge 复活',
    desc: '在 STM32F103C8T6 上跑通第一个最小工程与配套正文。',
    track: 'learning',
    status: 'queued',
    projectSlug: 'st-forge',
    month: '2026-10',
  },
  {
    id: 'penguinlab-research',
    title: 'PenguinLab 研究板块',
    desc: '内核与操作系统研究板块重构，现有教程与笔记成为材料。',
    track: 'learning',
    status: 'queued',
    projectSlug: 'penguin-lab',
    month: '2026-10',
  },
  {
    id: 'lightroot-qemu',
    title: '无板可复现镜像',
    desc: 'lightroot 产出 QEMU 能跑的镜像样例，没板子的读者也能做实验。',
    track: 'infra',
    status: 'queued',
    projectSlug: 'lightroot',
    month: '2026-10',
  },
  {
    id: 'ai-on-device',
    title: '设备端 AI 首个应用',
    desc: '在 RK3588 或 STM32 上跑通第一个真正跑在设备上的 AI 应用。',
    track: 'learning',
    status: 'queued',
    projectSlug: 'rk-forge',
    month: '2026-10',
  },
  {
    id: 'joint-release',
    title: '联合发行',
    desc: '一条命令克隆全部相关仓库，本地门户串起全部文档站，三道门槛后推进。',
    track: 'infra',
    status: 'queued',
    month: '2026-10',
  },
  {
    id: 'en-translate',
    title: '英文站翻译',
    desc: '中文内容稳定后按同样结构整体翻译，当前维持骨架。',
    track: 'central',
    status: 'queued',
    link: '/en/',
    month: '2026-10',
  },
]
