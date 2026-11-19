<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { issueGroupOf, issueGroups, selectIssueCards } from './issue-catalog'
import type { IssueGroup } from './issue-catalog'
import { GitHubError, ORG_URL, fetchChildren, isRateLimited, loadOrgIssues } from './issue-live'
import type { IssueRecord } from './issue-live'
import IssueGrid from './IssueGrid.vue'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))
const state = ref<'loading' | 'ready' | 'error'>('loading')
const items = ref<IssueRecord[]>([])
const fetchedAt = ref(0)
const fromCache = ref(false)
const refreshing = ref(false)
const errMsg = ref('')
const resetAt = ref<number | null>(null)
const now = ref(Date.now())
const group = ref<IssueGroup | 'all'>('all')
const repo = ref('')
const query = ref('')
const expanded = reactive(new Set<string>())
const children = reactive(new Map<string, IssueRecord[]>())
const loadingKids = reactive(new Set<string>())
const kidErrors = reactive(new Map<string, string>())
let generation = 0

const groups = computed(() => {
  const counts = new Map<IssueGroup, number>()
  for (const issue of items.value) {
    const id = issueGroupOf(issue.repo)
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  return issueGroups.flatMap(([id, zh, english]) => {
    const count = counts.get(id) ?? 0
    return count ? [{ id, title: en.value ? english : zh, count }] : []
  })
})
const groupItems = computed(() => items.value.filter((i) => group.value === 'all' || issueGroupOf(i.repo) === group.value))
const repos = computed(() => {
  const counts = new Map<string, number>()
  for (const issue of groupItems.value) counts.set(issue.repo, (counts.get(issue.repo) ?? 0) + 1)
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
})
const scope = computed(() => groupItems.value.filter((i) => !repo.value || i.repo === repo.value))
const scopeTitle = computed(() => repo.value || groups.value.find((g) => g.id === group.value)?.title || (en.value ? 'All groups' : '全站'))
const loadedParents = computed(() => {
  const parents = new Map<string, string>()
  for (const [parent, list] of children) for (const child of list) parents.set(child.key, parent)
  return parents
})
const cards = computed(() => selectIssueCards(scope.value, query.value, loadedParents.value))

function pickGroup(id: IssueGroup | 'all') {
  if (group.value === id && id !== 'all') return
  group.value = id
  repo.value = ''
}
watch([group, repo, query], () => expanded.clear())

function timeOf(ms: number) {
  return new Date(ms).toLocaleTimeString(en.value ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })
}
function resetText(ms: number | null) {
  return ms ? (en.value ? `Resets around ${timeOf(ms)}.` : `大约 ${timeOf(ms)} 恢复。`) : ''
}
function describeError(error: unknown) {
  if (isRateLimited(error)) return en.value ? 'GitHub API quota exhausted.' : 'GitHub 接口额度用完了。'
  if (error instanceof GitHubError) return `GitHub HTTP ${error.status}`
  return en.value ? 'Could not load issues from GitHub.' : '没能从 GitHub 取到 Issue。'
}

async function load(force = false) {
  if (refreshing.value) return
  refreshing.value = true
  errMsg.value = ''
  resetAt.value = null
  const firstLoad = state.value !== 'ready'
  if (firstLoad) state.value = 'loading'
  try {
    const payload = await loadOrgIssues(force)
    items.value = payload.items
    fetchedAt.value = payload.at
    fromCache.value = payload.cached
    now.value = Date.now()
    if (firstLoad) group.value = groups.value[0]?.id ?? 'all'
    else if (group.value !== 'all' && !groups.value.some((g) => g.id === group.value)) pickGroup('all')
    if (repo.value && !repos.value.some(([name]) => name === repo.value)) repo.value = ''
    if (force) {
      generation++
      expanded.clear()
      children.clear()
      loadingKids.clear()
      kidErrors.clear()
    }
    state.value = 'ready'
  } catch (error) {
    errMsg.value = describeError(error)
    resetAt.value = isRateLimited(error) ? (error as GitHubError).resetAt : null
    if (firstLoad) state.value = 'error'
  } finally {
    refreshing.value = false
  }
}

async function ensureKids(issue: IssueRecord) {
  if (children.has(issue.key) || loadingKids.has(issue.key)) return
  const version = generation
  loadingKids.add(issue.key)
  kidErrors.delete(issue.key)
  try {
    const list = await fetchChildren(issue.repoFull, issue.number)
    if (version !== generation) return
    if (list.length === 0) {
      kidErrors.set(issue.key, en.value ? 'GitHub did not return any sub-issues.' : 'GitHub 没有返回子任务。')
    } else children.set(issue.key, list)
  } catch (error) {
    if (version !== generation) return
    const hint = isRateLimited(error) ? resetText((error as GitHubError).resetAt) : ''
    kidErrors.set(issue.key, `${describeError(error)}${hint ? ` ${hint}` : ''}`)
  } finally {
    if (version === generation) loadingKids.delete(issue.key)
  }
}
function toggle(issue: IssueRecord) {
  if (expanded.delete(issue.key)) return
  expanded.add(issue.key)
  if (issue.childTotal > 0) void ensureKids(issue)
}

const syncLabel = computed(() => {
  const time = timeOf(fetchedAt.value)
  if (fromCache.value) return en.value ? `Cached from ${time}` : `${time} 的缓存`
  return en.value ? `Synced at ${time}` : `${time} 已同步`
})
onMounted(() => void load())
</script>

<template>
  <div class="issue-board">
    <div v-if="state === 'loading'" class="board-notice" role="status">
      {{ en ? 'Fetching open issues from GitHub…' : '正在从 GitHub 读取开放 Issue…' }}
    </div>
    <div v-else-if="state === 'error'" class="board-notice">
      <p role="alert">{{ errMsg }} {{ resetText(resetAt) }}</p>
      <button class="control" type="button" @click="load(true)">{{ en ? 'Retry' : '重试' }}</button>
      <a class="github-link" :href="ORG_URL" target="_blank" rel="noopener">{{ en ? 'Browse on GitHub' : '去 GitHub 看' }} ↗</a>
    </div>
    <template v-else>
      <p v-if="errMsg" class="board-notice" role="status">{{ errMsg }} {{ resetText(resetAt) }}</p>
      <div class="board-layout">
        <nav class="topic-nav" :aria-label="en ? 'Issue topics' : 'Issue 技术分组'">
          <div class="nav-caption">{{ en ? 'Topics · open issues' : '技术分组 · 开放 Issue' }}</div>
          <div class="topic-options">
            <button type="button" :aria-pressed="group === 'all'" @click="pickGroup('all')">
              <span>{{ en ? 'All groups' : '全站' }}</span><span class="count">{{ items.length }}</span>
            </button>
            <button v-for="topic in groups" :key="topic.id" type="button" :aria-pressed="group === topic.id" @click="pickGroup(topic.id)">
              <span>{{ topic.title }}</span><span class="count">{{ topic.count }}</span>
            </button>
          </div>
        </nav>
        <section class="board-main" aria-labelledby="issue-scope-heading">
          <header class="board-head">
            <div class="scope-head">
              <div>
                <div class="nav-caption">{{ en ? 'Current scope' : '当前范围' }}</div>
                <h2 id="issue-scope-heading">{{ scopeTitle }}</h2>
              </div>
              <button class="control" type="button" :disabled="refreshing" @click="load(true)">
                {{ refreshing ? (en ? 'Syncing…' : '同步中…') : en ? 'Refresh' : '刷新' }}
              </button>
            </div>
            <div class="filters">
              <select v-model="repo" class="control" :aria-label="en ? 'Repository' : '选择仓库'">
                <option value="">{{ en ? 'All repositories' : '全部仓库' }}</option>
                <option v-for="[name, count] in repos" :key="name" :value="name">{{ name }} ({{ count }})</option>
              </select>
              <input v-model="query" class="control issue-search" type="search" :aria-label="en ? 'Search issues' : '搜索 Issue'"
                :placeholder="en ? 'Title, author, or repo#number' : '搜标题、作者或 仓库#编号'" aria-describedby="issue-search-scope" />
            </div>
            <div id="issue-search-scope" class="hint">{{ en ? 'Search scope:' : '搜索范围：' }} {{ scopeTitle }}</div>
          </header>
          <div class="list-bar">
            <span aria-live="polite">{{ cards.length }} {{ query.trim() ? (en ? 'matches' : '条匹配结果') : (en ? 'issue cards' : '张 Issue 卡片') }}</span>
            <span>{{ en ? 'Recently updated first' : '最近更新优先' }}</span>
          </div>
          <div class="board-results">
            <p v-if="!cards.length" class="empty">
              {{ items.length ? (en ? 'No matching issues. Try another term or select All groups.' : '没有匹配的 Issue。可以换个词，或切到全站。') : (en ? 'No open issues in the organization.' : '组织当前没有开放 Issue。') }}
            </p>
            <IssueGrid v-else :nodes="cards" :expanded="expanded" :kids="children" :loading="loadingKids"
              :errors="kidErrors" :now-ms="now" :en="en" @toggle="toggle" @retry="ensureKids" />
          </div>
        </section>
      </div>
      <p class="board-foot">
        {{ syncLabel }} · {{ en ? 'Group counts include open sub-issues. Sub-issue details load on demand.' : '分组数字包含开放的子任务。展开卡片才读取子任务详情。' }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.issue-board { margin: 20px 0 28px; }
.board-layout { display: grid; grid-template-columns: minmax(162px, 19%) minmax(0, 1fr); gap: 12px; align-items: start; }
.topic-nav, .board-main, .board-notice { border: 1px solid var(--vp-c-divider); border-radius: var(--aels-radius-md); background: var(--vp-c-bg-elv); min-width: 0; }
.topic-nav { padding: 9px; }
.nav-caption { font-size: 11px; color: var(--vp-c-text-2); font-weight: 650; }
.topic-nav .nav-caption { padding: 4px 6px 7px; }
.topic-options { display: grid; gap: 3px; }
.topic-options button { display: flex; width: 100%; min-height: 34px; gap: 8px; justify-content: space-between; align-items: center; text-align: left; padding: 6px 8px; border-radius: 6px; font-size: 13px; }
.topic-options button:hover { background: var(--vp-c-bg-mute); }
.topic-options button[aria-pressed='true'] { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 650; }
.count { font-family: var(--aels-font-mono); font-size: 11px; font-variant-numeric: tabular-nums; }
.board-head { padding: 12px 14px 10px; }
.scope-head { display: flex; align-items: start; justify-content: space-between; gap: 10px; }
.scope-head h2 { border: 0; margin: 2px 0 0; padding: 0; font-size: 19px; line-height: 1.4; overflow-wrap: anywhere; }
.filters { display: flex; flex-wrap: wrap; gap: 7px; margin: 8px 0 4px; }
.control { min-height: 35px; max-width: 100%; padding: 5px 9px; border: 1px solid var(--vp-c-border); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; font-size: 13px; }
.control:disabled { opacity: .65; cursor: wait; }
.issue-search { flex: 1 1 170px; min-width: 0; }
.hint, .list-bar { font-size: 12px; color: var(--vp-c-text-2); }
.list-bar { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 5px; padding: 6px 14px; border-block: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.board-results { padding: 10px; }
.issue-board .board-foot, .issue-board .empty, .board-notice { font-size: 13px; color: var(--vp-c-text-2); }
.issue-board .board-foot { margin: 9px 0 0; }
.issue-board .empty { margin: 0; padding: 10px; }
.board-notice { padding: 12px; margin-bottom: 10px; }
.board-notice p { margin: 0 0 6px; }
.github-link { margin-inline-start: 10px; }
.issue-board :is(button, input, select):focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
@media (max-width: 639px) {
  .board-layout { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .topic-nav { padding: 4px 6px; }
  .topic-nav .nav-caption { display: none; }
  .topic-options { display: flex; overflow: auto; padding: 3px; }
  .topic-options button { width: auto; flex: none; white-space: nowrap; }
}
</style>
