import { shallowRef } from 'vue'

const ORG = 'Awesome-Embedded-Learning-Studio'
const CACHE_KEY = 'ae-repo-stats'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export interface RepoStats {
  stars: number
  forks: number
}

const statsMap = shallowRef<Map<string, RepoStats>>(new Map())
let fetchPromise: Promise<void> | null = null

interface CacheEntry {
  ts: number
  data: Record<string, RepoStats>
}

function loadCache(): Map<string, RepoStats> | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.ts > CACHE_TTL) return null
    return new Map(Object.entries(entry.data))
  } catch {
    return null
  }
}

function saveCache(map: Map<string, RepoStats>) {
  const entry: CacheEntry = { ts: Date.now(), data: Object.fromEntries(map) }
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry))
}

// 组织公开仓库清单（GitHub org API 不可用时的 shields.io fallback 用）。
// 与 OrgStats.vue / RankingTable.vue 的白名单保持一致；排除私有仓库（lightroot/estdx/visor/miniwget）
// 与 meta 仓库（.github / community）。
const REPO_NAMES = [
  // Modern C++
  'Tutorial_AwesomeModernCPP',
  'Tutorial_cpp_SimpleIniParser',
  'Project_MakeAMemroyPool',
  'CFBox',
  'Project_CXXBaseComponents',
  'edgecv',
  // Embedded Linux
  'imx-forge',
  'rk-forge',
  'rtl8733bu-linux-driver',
  'PenguinLab',
  // Linux / System Programming（Cinux 家族）
  'Cinux',
  'Cinux-Book',
  'Cinux-Base',
  'Cinux-GUI',
  // MCU / 裸机 / FreeRTOS
  'ST-Forge',
  'BareMetal-Drivers',
  'Project_MicroWatch',
  'micro-forge',
  'Tutorial_FreeRTOS',
  // Qt / GUI
  'Tutorial_AwesomeQt',
  'CFDesktop',
  'qt-compile-pipeline',
  'QuarkWidgets',
  // 工具与教程
  'Tutorial_AwesomeHardware',
  'EmbedBox',
  'C-Journey',
  // 库
  'aex',
  'bareline',
  // 中心
  'Awesome-Embedded',
]

async function fetchViaGitHubApi(): Promise<Map<string, RepoStats> | null> {
  try {
    const res = await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=100`)
    if (!res.ok) return null
    const repos = await res.json() as Array<{
      full_name: string
      stargazers_count: number
      forks_count: number
    }>
    return new Map(repos.map((r) => [r.full_name, { stars: r.stargazers_count, forks: r.forks_count }]))
  } catch {
    return null
  }
}

async function fetchViaShieldsIo(repoNames: string[]): Promise<Map<string, RepoStats>> {
  const results = await Promise.allSettled(
    repoNames.map(async (name) => {
      const [starsRes, forksRes] = await Promise.all([
        fetch(`https://img.shields.io/github/stars/${ORG}/${name}.json`),
        fetch(`https://img.shields.io/github/forks/${ORG}/${name}.json`),
      ])
      const stars = starsRes.ok ? (parseInt((await starsRes.json() as { message: string }).message, 10) || 0) : 0
      const forks = forksRes.ok ? (parseInt((await forksRes.json() as { message: string }).message, 10) || 0) : 0
      return [`${ORG}/${name}`, { stars, forks }] as const
    })
  )
  const map = new Map<string, RepoStats>()
  for (const r of results) {
    if (r.status === 'fulfilled') map.set(r.value[0], r.value[1])
  }
  return map
}

function ensureFetch(): Promise<void> {
  if (fetchPromise) return fetchPromise

  const cached = loadCache()
  if (cached) {
    statsMap.value = cached
    return Promise.resolve()
  }

  fetchPromise = (async () => {
    let map = await fetchViaGitHubApi()
    if (!map) {
      map = await fetchViaShieldsIo(REPO_NAMES)
    }
    statsMap.value = map
    saveCache(map)
  })()
    .catch(() => {})
    .finally(() => {
      fetchPromise = null
    })

  return fetchPromise
}

function repoNameFromUrl(repoUrl: string): string | null {
  try {
    return new URL(repoUrl).pathname.slice(1)
  } catch {
    return null
  }
}

export function useStars() {
  ensureFetch()

  function getStars(repoUrl: string): number | null {
    const name = repoNameFromUrl(repoUrl)
    if (!name) return null
    const val = statsMap.value.get(name)
    return val ? val.stars : null
  }

  return { getStars }
}

export function useRepoStats() {
  ensureFetch()

  function getStats(repoUrl: string): RepoStats | null {
    const name = repoNameFromUrl(repoUrl)
    if (!name) return null
    return statsMap.value.get(name) ?? null
  }

  function getAllStats(): Map<string, RepoStats> {
    return statsMap.value
  }

  return { getStats, getAllStats }
}
