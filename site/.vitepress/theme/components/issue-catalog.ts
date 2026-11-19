import type { IssueRecord } from './issue-live'

// 看板按技术主题浏览，项目目录仍按教学、产品和基建组织。
// 这里只登记已公开的仓库。新仓未归类前仍能从「其他仓库」进入。
export const issueGroups = [
  ['basics', '基础', 'Fundamentals', ['EmbedBox', 'C-Journey', 'Tutorial_AwesomeModernCPP', 'engineering_cpp', 'Tutorial_cpp_SimpleIniParser', 'anatomy_memory', 'Tutorial_AwesomeHardware']],
  ['os', '操作系统', 'Operating systems', ['Cinux', 'Cinux-Book', 'ZerOS', 'Tutorial_FreeRTOS']],
  ['architecture', '体系结构与启动', 'Architecture & boot', ['micro-forge']],
  ['mcu', '嵌入式单片机', 'Microcontrollers', ['ST-Forge', 'BareMetal-Drivers', 'bareline', 'libestdx']],
  ['linux', 'Linux', 'Linux', ['imx-forge', 'rk-forge', 'h618_forge', 'devtree-journey', 'PenguinLab', 'CFBox', 'lightroot']],
  ['desktop', 'Qt 与桌面', 'Qt & desktop', ['Tutorial_AwesomeQt', 'QuarkWidgets', 'CFDesktop', 'CFDeskit', 'CF-Gallery', 'qt-compile-pipeline', 'visor', 'vesper']],
  ['vision', '视觉与嵌入式 AI', 'Vision & embedded AI', ['edgecv']],
  ['org', '站点、社区与工程工具', 'Site, community & tools', ['Awesome-Embedded', 'loupe', 'aels-prism', 'community', '.github', 'buildmeter', 'aex']],
  ['other', '其他仓库', 'Other repositories', []],
] as const

export type IssueGroup = (typeof issueGroups)[number][0]

const groupByRepo = new Map<string, IssueGroup>()
for (const [group, , , repos] of issueGroups) {
  for (const repo of repos) {
    const key = repo.toLowerCase()
    if (groupByRepo.has(key)) throw new Error(`Issue board: duplicate repository ${repo}`)
    groupByRepo.set(key, group)
  }
}

export function issueGroupOf(repo: string): IssueGroup {
  return groupByRepo.get(repo.toLowerCase()) ?? 'other'
}

export function selectIssueCards(
  scope: IssueRecord[],
  query: string,
  loadedParents: ReadonlyMap<string, string>,
): IssueRecord[] {
  const q = query.trim().toLowerCase()
  // A child belongs under its parent only if that parent is visible and expandable
  // in this scope. Search always starts from all open issues in the scope.
  const expandable = new Set(scope.filter((issue) => issue.childTotal > 0).map((issue) => issue.key))
  return scope.filter((issue) => {
    if (q) {
      return [issue.title, issue.author ?? '', `${issue.repo}#${issue.number}`]
        .some((text) => text.toLowerCase().includes(q))
    }
    const parent = issue.parentKey ?? loadedParents.get(issue.key)
    return !parent || parent === issue.key || !expandable.has(parent)
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.key.localeCompare(b.key))
}
