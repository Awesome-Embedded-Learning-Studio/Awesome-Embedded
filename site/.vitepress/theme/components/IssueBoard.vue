<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useData } from 'vitepress'
import type { IssueRecord } from './issue-live'
import { GitHubError, ORG_URL, fetchChildren, isRateLimited, loadOrgIssues } from './issue-live'
import IssueGrid from './IssueGrid.vue'
import { DAY } from './issue-utils'

// Issue 看板：数据在浏览器里直接向 GitHub 公开接口取，没有构建期快照。
// 打开页面 = 1 次搜索请求，拿全组织 open issue；子任务点开父卡片才发请求。
// 匿名接口按 IP 计额度，失败要能说清为什么，并且随时可重试。

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const MONTH = 30 * DAY

const state = ref<'loading' | 'ready' | 'error'>('loading')
const items = ref<IssueRecord[]>([])
const fetchedAt = ref(0)
const fromCache = ref(false)
const refreshing = ref(false)
const errMsg = ref('')
const errResetAt = ref<number | null>(null)
const rateLimited = ref(false)
const nowMs = ref(Date.now())

const repoFilter = ref<string | null>(null)
const query = ref('')
const view = ref<'repo' | 'time'>('repo')
const expanded = ref(new Set<string>())
const collapsedGroups = ref(new Set<string>())
const zoom = ref<string | null>(null)

// 子任务按父缓存，收起再展开不再发请求
const children = reactive(new Map<string, IssueRecord[]>())
const loadingKids = reactive(new Set<string>())
const kidErrors = reactive(new Map<string, string>())
// 取回来的子 issue 不再在顶层重复出现
const nested = reactive(new Set<string>())

// ---- 错误说明 ----
function describeError(e: unknown): string {
  if (isRateLimited(e)) return en.value ? 'GitHub API quota exhausted.' : 'GitHub 接口额度用完了。'
  if (e instanceof GitHubError) {
    return en.value ? `GitHub API error (HTTP ${e.status})` : `GitHub 接口出错（HTTP ${e.status}）`
  }
  return en.value ? 'Network request failed.' : '网络请求失败。'
}

function timeOf(ms: number): string {
  return new Date(ms).toLocaleTimeString(en.value ? 'en-US' : 'zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function resetLineOf(at: number | null): string {
  if (!at) return ''
  return en.value ? `Resets around ${timeOf(at)}.` : `大约 ${timeOf(at)} 恢复。`
}

function resetText(e: unknown): string {
  if (!isRateLimited(e)) return ''
  return resetLineOf((e as GitHubError).resetAt)
}

// ---- 取数 ----
async function load(force = false) {
  if (items.value.length) refreshing.value = true
  else state.value = 'loading'
  errMsg.value = ''
  errResetAt.value = null
  try {
    const payload = await loadOrgIssues(force)
    items.value = payload.items
    fetchedAt.value = payload.at
    fromCache.value = payload.cached
    nowMs.value = Date.now()
    state.value = 'ready'
  } catch (e) {
    errMsg.value = describeError(e)
    rateLimited.value = isRateLimited(e)
    errResetAt.value = isRateLimited(e) ? (e as GitHubError).resetAt : null
    if (!items.value.length) state.value = 'error'
  } finally {
    refreshing.value = false
  }
}

// ---- 子任务 ----
async function ensureKids(i: IssueRecord) {
  if (children.has(i.key) || loadingKids.has(i.key)) return
  loadingKids.add(i.key)
  kidErrors.delete(i.key)
  try {
    const list = await fetchChildren(i.repoFull, i.number)
    children.set(i.key, list)
    for (const k of list) nested.add(k.key)
    if (!list.length) {
      kidErrors.set(i.key, en.value ? 'No sub-issues came back.' : '没有取到子 issue。')
    }
  } catch (e) {
    const hint = resetText(e)
    kidErrors.set(i.key, `${describeError(e)}${hint ? ` ${hint}` : ''}`)
  } finally {
    loadingKids.delete(i.key)
  }
}

async function toggle(i: IssueRecord) {
  if (i.childTotal === 0) return
  const s = new Set(expanded.value)
  if (s.has(i.key)) {
    s.delete(i.key)
    expanded.value = s
    return
  }
  s.add(i.key)
  expanded.value = s
  await ensureKids(i)
}

function retryKids(i: IssueRecord) {
  children.delete(i.key)
  kidErrors.delete(i.key)
  void ensureKids(i)
}

// ---- 筛选与分组 ----
const repoCount = computed(() => {
  const m = new Map<string, number>()
  for (const i of items.value) m.set(i.repo, (m.get(i.repo) ?? 0) + 1)
  return m
})

const repoOrder = computed(() =>
  [...repoCount.value.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([r]) => r),
)

const repoHue = computed(() => {
  const m = new Map<string, number>()
  repoOrder.value.forEach((r, idx) => m.set(r, idx % 6))
  return m
})
const hueOf = (repo: string) => repoHue.value.get(repo) ?? 0

const filtered = computed(() => {
  let list = items.value.filter((i) => !nested.has(i.key))
  if (repoFilter.value) list = list.filter((i) => i.repo === repoFilter.value)
  const q = query.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.author ?? '').toLowerCase().includes(q) ||
        `${i.repo}#${i.number}`.toLowerCase().includes(q),
    )
  }
  return list
})

const sortedRoots = (list: IssueRecord[]) =>
  [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

const repoGroups = computed(() => {
  const byRepo = new Map<string, IssueRecord[]>()
  for (const i of filtered.value) {
    const arr = byRepo.get(i.repo)
    if (arr) arr.push(i)
    else byRepo.set(i.repo, [i])
  }
  return repoOrder.value
    .filter((repo) => byRepo.has(repo))
    .map((repo) => {
      const list = byRepo.get(repo) as IssueRecord[]
      // 组头报仓库的 open 总数，展开子任务后不跟着缩水
      return {
        repo,
        hue: hueOf(repo),
        open: repoCount.value.get(repo) ?? list.length,
        nodes: sortedRoots(list),
      }
    })
})

const timeRoots = computed(() => sortedRoots(filtered.value))

// ---- 其它交互 ----
function toggleGroup(repo: string) {
  const s = new Set(collapsedGroups.value)
  if (s.has(repo)) s.delete(repo)
  else s.add(repo)
  collapsedGroups.value = s
}

function collapseAll() {
  expanded.value = new Set()
}

function pickRepo(repo: string | null) {
  repoFilter.value = repoFilter.value === repo ? null : repo
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') zoom.value = null
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  void load()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const syncLabel = computed(() => {
  if (!fetchedAt.value) return ''
  if (fromCache.value) {
    const min = Math.max(0, Math.round((Date.now() - fetchedAt.value) / 60000))
    return en.value ? `cached · ${min} min ago` : `缓存 · ${min} 分钟前取的`
  }
  return en.value ? `live · synced ${timeOf(fetchedAt.value)}` : `实时 · ${timeOf(fetchedAt.value)} 同步`
})

const resetLine = computed(() => resetLineOf(errResetAt.value))
</script>

<template>
  <div class="issue-board">
    <!-- 首屏：正在取数 -->
    <div v-if="state === 'loading'" class="live-loading">
      <p class="live-note">
        {{ en ? 'Fetching open issues from GitHub…' : '正在从 GitHub 取开放 issue…' }}
      </p>
      <div v-for="n in 3" :key="n" class="ghost" />
    </div>

    <!-- 一条都没取到 -->
    <div v-else-if="state === 'error'" class="live-error">
      <p class="err-title">{{ errMsg }}</p>
      <p v-if="resetLine" class="err-sub">{{ resetLine }}</p>
      <p v-if="rateLimited" class="err-sub">
        {{
          en
            ? 'Anonymous GitHub API calls are counted per IP, so everyone behind the same network shares the quota.'
            : '匿名接口按 IP 计数，同一个出口网络里的人共用这份额度。'
        }}
      </p>
      <div class="err-actions">
        <button class="fold-btn" :disabled="refreshing" @click="load(true)">
          {{ refreshing ? (en ? 'Retrying…' : '重试中…') : en ? 'Retry' : '重试' }}
        </button>
        <a class="err-link" :href="ORG_URL" target="_blank" rel="noopener">
          {{ en ? 'Browse on GitHub' : '去 GitHub 看' }} ↗
        </a>
      </div>
    </div>

    <template v-else>
      <p v-if="errMsg" class="live-warn">
        {{ errMsg }} <span v-if="resetLine">{{ resetLine }}</span>
        <button class="fold-btn" @click="load(true)">{{ en ? 'Retry' : '重试' }}</button>
      </p>

      <div class="toolbar">
        <div class="seg" role="tablist">
          <button :class="{ on: view === 'repo' }" @click="view = 'repo'">
            {{ en ? 'By repo' : '按仓库' }}
          </button>
          <button :class="{ on: view === 'time' }" @click="view = 'time'">
            {{ en ? 'By time' : '按时间' }}
          </button>
        </div>
        <input
          v-model="query"
          class="issue-search"
          type="search"
          :placeholder="en ? 'Search title / author / repo#no' : '搜标题、作者、仓库#编号'"
        />
        <button class="fold-btn" :disabled="refreshing" @click="load(true)">
          {{ refreshing ? (en ? 'Syncing…' : '同步中…') : en ? 'Refresh' : '刷新' }}
        </button>
        <button class="fold-btn" :disabled="!expanded.size" @click="collapseAll">
          {{ en ? 'Collapse' : '全部收起' }}
        </button>
      </div>

      <div class="chips">
        <button :class="{ on: !repoFilter }" @click="repoFilter = null">
          {{ en ? 'All repos' : '全部仓库' }} <b>{{ items.length }}</b>
        </button>
        <button
          v-for="r in repoOrder"
          :key="r"
          :class="{ on: repoFilter === r }"
          @click="pickRepo(r)"
        >
          {{ r }} <b>{{ repoCount.get(r) }}</b>
        </button>
      </div>

      <p v-if="!filtered.length" class="empty">
        {{ en ? 'No issues match the filter.' : '没有匹配的 issue。' }}
      </p>

      <template v-else-if="view === 'repo'">
        <section v-for="g in repoGroups" :key="g.repo" class="group">
          <button class="group-head" @click="toggleGroup(g.repo)">
            <span class="group-dot" :class="`aels-hue-${g.hue}`" />
            <span class="group-name">{{ g.repo }}</span>
            <span class="group-count">{{ g.open }} {{ en ? '' : '条' }}</span>
            <span class="group-chev">{{ collapsedGroups.has(g.repo) ? '▸' : '▾' }}</span>
          </button>
          <div v-show="!collapsedGroups.has(g.repo)" class="group-body">
            <IssueGrid
              :nodes="g.nodes"
              :depth="0"
              :hue-of="hueOf"
              :show-repo="false"
              :expanded="expanded"
              :kids="children"
              :loading="loadingKids"
              :errors="kidErrors"
              :now-ms="nowMs"
              :en="en"
              @toggle="toggle"
              @retry="retryKids"
              @zoom="zoom = $event"
            />
          </div>
        </section>
      </template>

      <IssueGrid
        v-else
        :nodes="timeRoots"
        :depth="0"
        :hue-of="hueOf"
        :show-repo="true"
        :expanded="expanded"
        :kids="children"
        :loading="loadingKids"
        :errors="kidErrors"
        :now-ms="nowMs"
        :en="en"
        @toggle="toggle"
        @retry="retryKids"
        @zoom="zoom = $event"
      />

      <p class="issue-foot">
        {{ syncLabel }} ·
        {{
          en
            ? 'open issues only · sub-issues load on demand · browser calls api.github.com directly'
            : '只收 open issue · 子任务点开才取 · 浏览器直连 api.github.com'
        }}
      </p>
    </template>

    <Teleport to="body">
      <div v-if="zoom" class="zoom-layer" @click="zoom = null">
        <img :src="zoom" alt="" @click.stop />
        <button class="zoom-close" type="button" @click="zoom = null">✕</button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.issue-board {
  margin: 8px 0 24px;
}

/* ---- 首屏加载 ---- */
.live-loading {
  margin-top: 4px;
}
.live-note {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  font-family: var(--aels-font-mono);
  margin-bottom: 10px;
}
.ghost {
  height: 74px;
  margin-bottom: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--aels-radius-md);
  background: linear-gradient(
    100deg,
    var(--vp-c-bg-elv) 30%,
    var(--vp-c-bg-mute) 50%,
    var(--vp-c-bg-elv) 70%
  );
  background-size: 220% 100%;
  animation: ghost-sweep 1.4s var(--aels-ease) infinite;
}
@keyframes ghost-sweep {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -20% 0;
  }
}

/* ---- 出错 ---- */
.live-error {
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--aels-copper) 40%, var(--vp-c-divider));
  border-radius: var(--aels-radius-md);
  background: color-mix(in srgb, var(--aels-copper) 6%, transparent);
}
.err-title {
  margin: 0 0 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.err-sub {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.err-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
}
.err-link {
  font-size: 12px;
  color: var(--vp-c-brand-2);
}
.live-warn {
  margin: 0 0 10px;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--aels-copper) 40%, var(--vp-c-divider));
  border-radius: var(--aels-radius-sm);
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: color-mix(in srgb, var(--aels-copper) 6%, transparent);
}
.live-warn .fold-btn {
  margin-left: 8px;
  padding: 1px 8px;
  font-size: 11.5px;
}

/* ---- 工具条 ---- */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.seg {
  display: inline-flex;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--aels-radius-sm);
  overflow: hidden;
  background: var(--vp-c-bg-elv);
}
.seg button {
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  padding: 4px 11px;
  cursor: pointer;
}
.seg button.on {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-2);
}
.issue-search {
  flex: 1 1 180px;
  min-width: 140px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--aels-radius-sm);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  padding: 5px 10px;
}
.fold-btn {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--aels-radius-sm);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
}
.fold-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.group-body {
  padding-top: 10px;
}
.chips button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  padding: 2px 10px;
  cursor: pointer;
  transition:
    border-color var(--aels-dur) var(--aels-ease),
    color var(--aels-dur) var(--aels-ease),
    background var(--aels-dur) var(--aels-ease);
}
.chips button b {
  font-family: var(--aels-font-mono);
  font-size: 10.5px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}
.chips button:hover {
  border-color: var(--vp-c-brand-3);
}
.chips button.on {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-2);
}
.chips button.on b {
  color: var(--vp-c-brand-2);
}

/* ---- 分组 ---- */
.group {
  margin-bottom: 18px;
}
.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 5px 2px;
  border: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.group-head:hover .group-name {
  color: var(--vp-c-brand-2);
}
.group-dot {
  flex: none;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: var(--aels-hue);
}
.group-name {
  font-family: var(--aels-font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color var(--aels-dur) var(--aels-ease);
}
.group-count {
  font-family: var(--aels-font-mono);
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.group-chev {
  margin-left: auto;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.empty {
  color: var(--vp-c-text-3);
  font-size: 13px;
}
.issue-foot {
  margin-top: 18px;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  font-family: var(--aels-font-mono);
}

/* ---- 看图 ---- */
.zoom-layer {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5vw;
  background: rgba(12, 9, 4, 0.74);
  cursor: zoom-out;
}
.zoom-layer img {
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--aels-radius-md);
  background: #fff;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
}
.zoom-close {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 639px) {
  .chips {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
    mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
  }
  .chips::-webkit-scrollbar {
    display: none;
  }
  .chips button {
    flex: none;
  }
  .issue-search {
    flex: 1 1 100%;
    order: 3;
  }
}
</style>
