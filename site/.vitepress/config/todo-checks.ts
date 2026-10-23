// 「路线与进行中」数据源的构建期核对，fail loud：import 即校验，dev 与 build 都会经过。
// 本文件只在 config（Node 环境）里运行，可以读仓库根的清单与 content/ 下的私有名单，
// 永远不会被引进浏览器包，名单内容不进产物。
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { todoItems } from '../todo-data'
import { publicProjectNames, projectSlugs } from '../project-data'

const CWD = process.cwd()

{
  const ids = new Set<string>()
  const slugs = new Set(projectSlugs)
  const publicRepos = new Set([...publicProjectNames, 'Awesome-Embedded'])
  for (const item of todoItems) {
    if (ids.has(item.id)) throw new Error(`todo-data: id "${item.id}" 重复`)
    ids.add(item.id)

    if (!/^\d{4}-\d{2}$/.test(item.month)) {
      throw new Error(`todo-data: ${item.id} 的 month 必须是 YYYY-MM，当前是 "${item.month}"`)
    }

    if (item.projectSlug && !slugs.has(item.projectSlug)) {
      throw new Error(`todo-data: ${item.id} 的 projectSlug "${item.projectSlug}" 不在 project-data 里`)
    }

    if (item.link && /^https:\/\/github\.com\//.test(item.link)) {
      const repo = item.link.split('/').pop() || ''
      if (!publicRepos.has(repo)) {
        throw new Error(`todo-data: ${item.id} 外链的仓库 ${repo} 未在公开清单里，公开板不链私有仓`)
      }
    }

    if (item.status === 'done' && !item.link) {
      throw new Error(`todo-data: 已完成的 ${item.id} 必须带证据链接`)
    }
  }

  const active = todoItems.filter((item) => item.status === 'active')
  if (active.length > 4) {
    throw new Error(`todo-data: 进行中条目 ${active.length} 条，超过并行容量上限 4`)
  }

  // 停滞即失败（不留 warning 档）：进行中条目三个月没动静，构建直接停。
  const limit = new Date()
  limit.setMonth(limit.getMonth() - 3)
  const stale = active.filter((item) => new Date(`${item.month}-01`) < limit)
  if (stale.length > 0) {
    throw new Error(
      `todo-data: 进行中条目 ${stale.map((s) => s.id).join('、')} 超过三个月没有动静，` +
        `要么挪回排队中，要么更新 month 说明现状`,
    )
  }

  // 私有仓名名单：content/ 整个目录被 gitignore，名单不进公开历史。
  // 因此 CI 和全新克隆上没有这个文件：名单核对只在本地构建时生效，缺文件不算异常。
  const listPath = resolve(CWD, 'content/todo-private-names.txt')
  const privateNames = existsSync(listPath)
    ? readFileSync(listPath, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
    : []
  if (privateNames.length === 0) {
    console.warn('[todo-checks] 私有仓名名单缺失（CI/全新克隆属预期），仓名核对跳过')
  }

  const banned = /(Q|J|A)\d|待拍|未拍|候选|预算|\d+\s*小时/
  for (const item of todoItems) {
    const text = `${item.title} ${item.desc}`
    const hit = privateNames.find((name) => name && text.toLowerCase().includes(name.toLowerCase()))
    if (hit) throw new Error(`todo-data: ${item.id} 的文案出现私有仓 ${hit}，公开板不写未公开的仓名`)
    if (banned.test(text)) {
      throw new Error(`todo-data: ${item.id} 的文案带内部语言（编号、候选或预算类词），按公开口径重写`)
    }
  }
}
