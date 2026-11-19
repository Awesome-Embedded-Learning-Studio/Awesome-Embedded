<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IssueRecord } from './issue-live'
import { displayDate, excerptOf, labelKind } from './issue-utils'

const props = defineProps<{
  issue: IssueRecord
  compact: boolean
  expanded: boolean
  kidsLoading: boolean
  kidsError: string | null
  nowMs: number
  en: boolean
}>()
const emit = defineEmits<{ toggle: []; retry: [] }>()

const avatarFailed = ref(false)
const imageFailed = ref(false)
watch(() => props.issue.avatarUrl, () => { avatarFailed.value = false })
watch(() => props.issue.excerptImage, () => { imageFailed.value = false })
const author = computed(() => props.issue.author ?? (props.en ? 'Unknown author' : '未知作者'))
const refText = computed(() => `${props.issue.repo}#${props.issue.number}`)
const excerpt = computed(() => {
  const text = excerptOf(props.issue.excerpt)
  const normalize = (s: string) => s.replace(/[\s#*`[\]()]/g, '').toLowerCase()
  return normalize(text) === normalize(props.issue.title) ? '' : text
})
const date = computed(() => displayDate(props.issue.updatedAt, props.nowMs, props.en))
const progress = computed(() => Math.min(props.issue.childTotal, Math.max(0, props.issue.completedChildren)))
const progressText = computed(() => props.en
  ? `${progress.value}/${props.issue.childTotal} sub-issues done`
  : `子任务 ${progress.value}/${props.issue.childTotal} 完成`)
const closedText = computed(() => props.issue.stateReason === 'completed'
  ? (props.en ? 'Done' : '已完成')
  : (props.en ? 'Closed' : '已关闭'))

function clickSummary(event: MouseEvent) {
  if (event.target instanceof Element && !event.target.closest('a, button')) emit('toggle')
}
</script>

<template>
  <a v-if="issue.closed" class="closed-row" :href="issue.url" target="_blank" rel="noopener">
    <span><span class="ref">{{ refText }}</span> {{ issue.title }}</span>
    <span class="closed-label">{{ closedText }}</span>
  </a>
  <article v-else class="issue-card" :class="{ compact, 'is-expanded': expanded }">
    <div class="card-summary" @click="clickSummary">
      <div class="card-top">
        <div class="who">
          <img v-if="issue.avatarUrl && !avatarFailed" class="avatar" :src="issue.avatarUrl" alt="" width="42" height="42" loading="lazy" @error="avatarFailed = true" />
          <span v-else class="avatar initials" aria-hidden="true">{{ issue.author?.slice(0, 2).toUpperCase() || '?' }}</span>
          <div class="byline">
            <span class="author" :title="author">{{ author }}</span>
            <span class="ref">#{{ issue.number }}</span>
          </div>
        </div>
        <span class="repo-tag"><template v-for="(part, index) in issue.repo.split(/(?<=[_.-])/u)" :key="index"><wbr v-if="index" />{{ part }}</template></span>
      </div>
      <h3 class="issue-title">
        <a :href="issue.url" target="_blank" rel="noopener" :title="en ? 'Open on GitHub' : '在 GitHub 打开'">{{ issue.title }}</a>
      </h3>
      <div class="card-foot">
        <time :datetime="issue.updatedAt" :title="issue.updatedAt">{{ en ? 'Updated' : '更新' }} {{ date }}</time>
        <span v-if="issue.childTotal > 0" class="meter">
          <progress :value="progress" :max="issue.childTotal" :aria-label="progressText" />
          <span>{{ progressText }}</span>
        </span>
        <button class="detail-toggle" type="button" :aria-expanded="expanded" @click="emit('toggle')">
          {{ expanded ? (en ? 'Collapse' : '收起') : (en ? 'Details' : '展开') }}
        </button>
      </div>
    </div>
    <div v-if="expanded" class="card-detail">
      <p v-if="excerpt" class="excerpt">{{ excerpt }}</p>
      <a v-if="issue.excerptImage && !imageFailed" class="preview-image" :href="issue.excerptImage.startsWith('data:') ? undefined : issue.excerptImage" target="_blank" rel="noopener noreferrer"
        :aria-label="en ? 'Open issue attachment' : '查看 Issue 配图'">
        <img :src="issue.excerptImage" alt="" loading="lazy" referrerpolicy="no-referrer" @error="imageFailed = true" />
      </a>
      <div v-if="issue.labels.length || issue.comments" class="details-meta">
        <span v-for="label in issue.labels" :key="label" class="label" :class="`label-${labelKind(label)}`">{{ label }}</span>
        <span v-if="issue.comments">{{ issue.comments }} {{ en ? 'comments' : '条评论' }}</span>
      </div>
      <p v-if="kidsLoading" class="detail-note" role="status">{{ en ? 'Fetching sub-issues…' : '正在读取子任务…' }}</p>
      <p v-else-if="kidsError" class="detail-note" role="status">
        {{ kidsError }} <button type="button" class="detail-toggle" @click="emit('retry')">{{ en ? 'Retry' : '重试' }}</button>
      </p>
      <slot v-else />
      <a class="more" :href="issue.url" target="_blank" rel="noopener">{{ en ? 'View on GitHub' : '在 GitHub 查看' }} ↗</a>
    </div>
  </article>
</template>

<style scoped>
.issue-card, .closed-row { min-width: 0; border: 1px solid var(--vp-c-divider); border-radius: var(--aels-radius-md); background: var(--vp-c-bg); }
.issue-card:hover, .issue-card.is-expanded { border-color: var(--vp-c-brand-2); }
.issue-card { flex: 1; display: flex; flex-direction: column; }
.card-summary { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; }
.card-top { display: grid; grid-template-columns: minmax(0, 1fr) fit-content(49%); align-items: start; gap: 8px; }
.who { display: flex; align-items: center; gap: 9px; min-width: 0; }
.repo-tag {
  min-width: 0;
  padding: 3px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font: 600 11px/1.35 var(--aels-font-mono, monospace);
  text-align: end;
  overflow-wrap: anywhere;
}
.avatar { display: block; width: 42px; height: 42px; border-radius: 50%; flex: none; object-fit: cover; background: var(--vp-c-bg-mute); }
.initials { display: grid; place-items: center; font-size: 14px; font-weight: 700; color: var(--vp-c-brand-1); }
.byline { min-width: 0; display: grid; line-height: 1.4; overflow-wrap: anywhere; }
.author { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 650; }
.ref { color: var(--vp-c-text-2); font: 11px var(--aels-font-mono, monospace); }
.issue-card .issue-title { margin: 0; font-size: 15px; line-height: 1.45; font-weight: 650; overflow-wrap: anywhere; padding: 0; }
.issue-title a { color: var(--vp-c-text-1); text-decoration: none; }
.issue-title a:hover { color: var(--vp-c-brand-1); text-decoration: underline; }
.card-foot, .details-meta { display: flex; gap: 5px 8px; flex-wrap: wrap; align-items: center; color: var(--vp-c-text-2); font-size: 11px; }
.card-foot { margin-top: auto; }
.meter { display: inline-flex; align-items: center; gap: 5px; color: var(--vp-c-brand-1); font-variant-numeric: tabular-nums; }
.meter progress { appearance: none; border: 0; width: 34px; height: 5px; border-radius: 5px; background: var(--vp-c-bg-mute); accent-color: var(--vp-c-brand-1); overflow: hidden; }
.meter progress::-webkit-progress-bar { background: var(--vp-c-bg-mute); }
.meter progress::-webkit-progress-value { background: var(--vp-c-brand-1); }
.meter progress::-moz-progress-bar { background: var(--vp-c-brand-1); }
.detail-toggle { margin-inline-start: auto; padding: 2px 6px; border-radius: 5px; border: 1px solid var(--vp-c-divider); color: var(--vp-c-brand-1); font-size: 11px; }
.detail-toggle:hover { background: var(--vp-c-brand-soft); }
.card-detail { padding: 9px 12px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); border-radius: 0 0 var(--aels-radius-md) var(--aels-radius-md); }
.card-detail .excerpt, .card-detail .detail-note { font-size: 12px; margin: 0 0 6px; overflow-wrap: anywhere; color: var(--vp-c-text-2); }
.details-meta { margin: 5px 0; }
.label { border-radius: 99px; padding: 1px 7px; background: var(--vp-c-default-soft); overflow-wrap: anywhere; }
.label-bug { color: var(--vp-c-danger-1); background: var(--vp-c-danger-soft); }
.label-help, .label-first { color: var(--vp-c-warning-1); background: var(--vp-c-warning-soft); }
.label-doc, .label-enh, .label-feat { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.preview-image { display: inline-block; }
.preview-image img { display: block; width: 74px; height: 62px; object-fit: cover; border-radius: 5px; }
.more { font-size: 11px; display: inline-block; margin-top: 5px; }
.closed-row { display: flex; align-items: start; justify-content: space-between; gap: 5px; padding: 5px 7px; font-size: 11px; text-decoration: none; color: var(--vp-c-text-2); overflow-wrap: anywhere; }
.closed-label { flex: none; color: var(--vp-c-text-2); }
.compact .card-summary { padding: 7px 8px; gap: 5px; }
.compact .avatar { width: 25px; height: 25px; font-size: 10px; }
.compact .issue-title { font-size: 13px; }
</style>
