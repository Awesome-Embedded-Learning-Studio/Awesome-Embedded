// 浏览器直连 GitHub 公开接口取 issue。没有构建期快照，打开页面就是最近的。
// 口径：只收 open issue，子任务按需加载（点父卡片才发请求），省接口额度。
//
// 额度（2026 年实测）：
//   - 搜索接口：每 IP 每分钟 10 次，一次请求能拿全组织所有 open issue。
//   - 子任务接口走 core 额度：每 IP 每小时 60 次，一次一个父 issue。
// 匿名访问按 IP 算，同一个出口的人共用额度，所以两边都要能优雅失败。

const API = 'https://api.github.com'
export const ORG = 'Awesome-Embedded-Learning-Studio'
export const ORG_URL = `https://github.com/orgs/${ORG}/repositories`

export interface IssueRecord {
  /** 全局键 owner/repo#number */
  key: string
  /** owner/repo，接口路径用这个 */
  repoFull: string
  /** 只留仓库名，界面上显示这个 */
  repo: string
  number: number
  title: string
  state: 'open' | 'closed'
  /** closed 的子任务压成一行灰条，不带正文 */
  closed: boolean
  /** 正文前 500 字（去掉了 markdown 链接和图片记号） */
  excerpt: string
  /** 正文首图的可加载地址，没有就 null */
  excerptImage: string | null
  author: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
  labels: string[]
  url: string
  /** GitHub 报的子任务总数 */
  childTotal: number
  /** 其中已完成的数量 */
  completedChildren: number
  comments: number
}

/** 带状态码和额度恢复时间的错误，界面据此说话 */
export class GitHubError extends Error {
  status: number
  resetAt: number | null
  constructor(message: string, status: number, resetAt: number | null) {
    super(message)
    this.name = 'GitHubError'
    this.status = status
    this.resetAt = resetAt
  }
}

export function isRateLimited(e: unknown): boolean {
  return e instanceof GitHubError && (e.status === 403 || e.status === 429)
}

async function ghFetch(url: string): Promise<Response> {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) {
    const reset = res.headers.get('x-ratelimit-reset')
    throw new GitHubError(
      res.status === 403 || res.status === 429 ? 'rate limit' : `HTTP ${res.status}`,
      res.status,
      reset ? Number(reset) * 1000 : null,
    )
  }
  return res
}

// ---- 正文清洗：与原来 Python 采集口径一致，够用即可 ----

const IMG_MD = /!\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g
const IMG_HTML = /<img[^>]+src=["']([^"']+)["']/gi
const HTML_TAG =
  /<\/?(?:br|hr|p|div|span|details|summary|sub|sup|b|i|em|strong|u|s|code|pre|table|thead|tbody|tr|td|th|ul|ol|li|a|blockquote|kbd|h[1-6]|video|source)(?:\s[^>]*)?\/?>/gi
const GITHUB_BLOB = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/blob\/([^/]+)\/(.+)$/

/** 正文图片换成浏览器能直接加载的地址 */
export function resolveImage(url: string, repo: string): string {
  const raw = url.trim()
  const blob = GITHUB_BLOB.exec(raw)
  if (blob) {
    return `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}/${blob[4]}`
  }
  if (/^(https?:|data:)/.test(raw)) return raw
  const path = raw.replace(/^\.\//, '').replace(/^\//, '')
  return `https://raw.githubusercontent.com/${repo}/HEAD/${path}`
}

/** 正文 -> (前 500 字纯文本, 首图地址) */
export function parseBody(body: string, repo: string): { excerpt: string; image: string | null } {
  if (!body) return { excerpt: '', image: null }
  const first =
    [...body.matchAll(IMG_MD)].map((m) => m[1])[0] ??
    [...body.matchAll(IMG_HTML)].map((m) => m[1])[0] ??
    null
  let t = body.replace(IMG_MD, '').replace(/<img\b[^>]*>/gi, '')
  t = t.replace(HTML_TAG, '')
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  t = t.replace(/`/g, '')
  t = t.replace(/^#{1,6}\s*/gm, '')
  t = t.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  return { excerpt: t.slice(0, 500), image: first ? resolveImage(first, repo) : null }
}

// ---- 归一化 ----

function repoFullOf(raw: Record<string, any>): string | null {
  const m = /repos\/([^/]+)\/([^/]+)$/.exec(raw.repository_url ?? '')
  return m ? `${m[1]}/${m[2]}` : null
}

function normalize(raw: Record<string, any>, fallbackRepo?: string): IssueRecord {
  const repoFull = repoFullOf(raw) ?? fallbackRepo ?? 'unknown/unknown'
  const repo = repoFull.split('/')[1] ?? repoFull
  const closed = raw.state !== 'open'
  const summary = raw.sub_issues_summary ?? {}
  const { excerpt, image } = closed
    ? { excerpt: '', image: null }
    : parseBody(raw.body ?? '', repo)
  return {
    key: `${repoFull}#${raw.number}`,
    repoFull,
    repo,
    number: raw.number,
    title: raw.title,
    state: closed ? 'closed' : 'open',
    closed,
    excerpt,
    excerptImage: image,
    author: raw.user?.login ?? null,
    avatarUrl: raw.user?.avatar_url ?? null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    labels: (raw.labels ?? []).map((l: any) => (typeof l === 'string' ? l : l.name)),
    url: raw.html_url,
    childTotal: summary.total ?? 0,
    completedChildren: summary.completed ?? 0,
    comments: raw.comments ?? 0,
  }
}

// ---- 组织级 open issue：一次搜索请求全拿 ----

export async function fetchOrgIssues(): Promise<IssueRecord[]> {
  const out: IssueRecord[] = []
  const q = encodeURIComponent(`org:${ORG} is:issue is:open`)
  for (let page = 1; page <= 10; page++) {
    const res = await ghFetch(`${API}/search/issues?q=${q}&per_page=100&page=${page}`)
    const data = await res.json()
    const items: Record<string, any>[] = data.items ?? []
    out.push(...items.map((i) => normalize(i)))
    if (items.length < 100 || out.length >= (data.total_count ?? 0)) break
  }
  return out
}

// ---- 子任务：点开才取，按父缓存 ----

const kidsCache = new Map<string, IssueRecord[]>()

export function cachedChildren(key: string): IssueRecord[] | undefined {
  return kidsCache.get(key)
}

export async function fetchChildren(repoFull: string, number: number): Promise<IssueRecord[]> {
  const key = `${repoFull}#${number}`
  const hit = kidsCache.get(key)
  if (hit) return hit
  const res = await ghFetch(`${API}/repos/${repoFull}/issues/${number}/sub_issues?per_page=100`)
  const data = await res.json()
  const list = (Array.isArray(data) ? data : []).map((x: Record<string, any>) =>
    normalize(x, repoFull),
  )
  kidsCache.set(key, list)
  return list
}

// ---- 会话级缓存：5 分钟内重复打开不再请求 ----

const CACHE_KEY = 'aels-issues:v1'
const TTL = 5 * 60 * 1000

export interface IssuesPayload {
  items: IssueRecord[]
  at: number
  cached: boolean
}

export async function loadOrgIssues(force = false): Promise<IssuesPayload> {
  if (!force) {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const p = JSON.parse(raw) as { at: number; items: IssueRecord[] }
        if (p?.items?.length && Date.now() - p.at < TTL) {
          return { items: p.items, at: p.at, cached: true }
        }
      }
    } catch {
      // sessionStorage 被禁用时照常走网络
    }
  }
  const items = await fetchOrgIssues()
  const at = Date.now()
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at, items }))
  } catch {
    // 存不下就算了，下次再取
  }
  return { items, at, cached: false }
}
