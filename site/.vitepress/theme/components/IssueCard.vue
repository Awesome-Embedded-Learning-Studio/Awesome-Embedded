<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IssueRecord } from './issue-live'
import { displayDate, excerptOf, kidsLabel, labelKind } from './issue-utils'

const props = defineProps<{
  issue: IssueRecord
  depth: number
  hue: number
  showRepo: boolean
  expanded: boolean
  kidsLoading: boolean
  kidsError: string | null
  nowMs: number
  en: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'zoom', src: string): void
  (e: 'retry'): void
}>()

const imgFailed = ref(false)
const imgReady = ref(false)

const hasKids = computed(() => props.issue.childTotal > 0)
const excerpt = computed(() => {
  const raw = excerptOf(props.issue.excerpt)
  const norm = (s: string) => s.replace(/[\s#*`[\]()]/g, '').toLowerCase()
  const a = norm(raw)
  const b = norm(props.issue.title)
  if (!a) return ''
  // 正文第一行常常和标题重复，这种就不铺摘要
  if (a === b || a.startsWith(b.slice(0, 10)) || b.startsWith(a.slice(0, 10))) return ''
  return raw
})
// 列表按最近更新时间排，卡上的日期也取更新时间，两边对得上
const date = computed(() => displayDate(props.issue.updatedAt, props.nowMs, props.en))
const fullDate = computed(
  () => `${props.issue.createdAt.slice(0, 10)} → ${props.issue.updatedAt.slice(0, 10)}`,
)
const foldedLabel = computed(() => kidsLabel(props.issue, props.expanded, props.en))

// 点卡片展开子任务，点子任务里的链接或按钮不算
function onCardClick(e: MouseEvent) {
  if (!hasKids.value) return
  const el = e.target as HTMLElement
  if (el.closest('a,button')) return
  emit('toggle')
}
</script>

<template>
  <!-- 已关闭的子任务压成一行，不再占一张整卡 -->
  <li
    v-if="issue.closed"
    class="issue-card skeleton"
    :class="`d${Math.min(depth, 3)}`"
    :style="{ '--d': Math.min(depth, 3) }"
  >
    <a class="skel" :href="issue.url" target="_blank" rel="noopener">
      <span class="skel-check">✓</span>
      <span class="skel-num">#{{ issue.number }}</span>
      <span class="skel-title">{{ issue.title }}</span>
      <span class="skel-tag">{{ en ? 'done' : '已完成' }}</span>
    </a>
  </li>

  <li
    v-else
    class="issue-card"
    :class="[`d${Math.min(depth, 3)}`, { 'is-foldable': hasKids, 'is-open': expanded }]"
    :style="{ '--d': Math.min(depth, 3) }"
    @click="onCardClick"
  >
    <button
      v-if="issue.excerptImage && !imgFailed"
      class="thumb"
      type="button"
      :title="en ? 'Enlarge' : '放大看'"
      @click.stop="emit('zoom', issue.excerptImage!)"
    >
      <img
        :src="issue.excerptImage"
        :alt="issue.title"
        loading="lazy"
        referrerpolicy="no-referrer"
        :class="{ ready: imgReady }"
        @load="imgReady = true"
        @error="imgFailed = true"
      />
    </button>

    <div class="body">
      <div class="meta">
        <img
          v-if="issue.avatarUrl"
          class="avatar"
          :src="issue.avatarUrl"
          :alt="issue.author ?? 'author'"
          loading="lazy"
        />
        <span v-else class="avatar avatar-none">?</span>
        <span class="author">{{ issue.author ?? 'ghost' }}</span>
        <time class="date" :datetime="issue.updatedAt" :title="fullDate">{{ date }}</time>
        <span
          v-if="showRepo"
          class="repo"
          :class="`aels-hue-${hue}`"
          :title="`${issue.repo}#${issue.number}`"
          >{{ issue.repo }} <b>#{{ issue.number }}</b></span
        >
        <span v-else class="num">#{{ issue.number }}</span>
        <a
          class="open"
          :href="issue.url"
          target="_blank"
          rel="noopener"
          :title="en ? 'Open on GitHub' : '在 GitHub 打开'"
          @click.stop
          >↗</a
        >
      </div>

      <h3 class="title">
        <a
          :href="issue.url"
          target="_blank"
          rel="noopener"
          :title="en ? 'Open on GitHub' : '在 GitHub 打开'"
          @click.stop
          >{{ issue.title }}</a
        >
      </h3>

      <p v-if="excerpt" class="excerpt">{{ excerpt }}</p>

      <div v-if="issue.labels.length || hasKids || issue.comments" class="foot">
        <span v-for="l in issue.labels" :key="l" class="lb" :class="`lb-${labelKind(l)}`">{{
          l
        }}</span>
        <span class="right">
          <span v-if="issue.comments" class="cmt" :title="en ? 'comments' : '评论数'">
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              <path
                fill="currentColor"
                d="M2.5 2h11A1.5 1.5 0 0 1 15 3.5v7A1.5 1.5 0 0 1 13.5 12H8.6l-3.9 2.7a.5.5 0 0 1-.8-.4V12h-1.4A1.5 1.5 0 0 1 1 10.5v-7A1.5 1.5 0 0 1 2.5 2z"
              />
            </svg>
            {{ issue.comments }}
          </span>
          <button
            v-if="hasKids"
            class="kids"
            type="button"
            :aria-expanded="expanded"
            @click.stop="emit('toggle')"
          >
            <span class="chev">{{ expanded ? '▾' : '▸' }}</span>
            {{ kidsLoading ? (en ? 'loading…' : '正在取…') : foldedLabel }}
          </button>
        </span>
      </div>

      <p v-if="expanded && kidsLoading" class="rest">
        {{ en ? 'Fetching sub-issues…' : '正在取子任务…' }}
      </p>
      <p v-else-if="expanded && kidsError" class="rest rest-error">
        {{ kidsError }}
        <button class="retry" type="button" @click.stop="emit('retry')">
          {{ en ? 'retry' : '重试' }}
        </button>
      </p>
    </div>
  </li>
</template>

<style scoped>
.issue-card {
  position: relative;
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  padding: 11px 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--aels-radius-md);
  background: var(--vp-c-bg);
  transition:
    border-color var(--aels-dur) var(--aels-ease),
    box-shadow var(--aels-dur) var(--aels-ease),
    transform var(--aels-dur) var(--aels-ease);
}

.issue-card.is-foldable {
  cursor: pointer;
}

.issue-card:hover {
  border-color: color-mix(in srgb, var(--aels-copper) 45%, var(--vp-c-divider));
  box-shadow: 0 4px 14px rgba(24, 18, 8, 0.07);
}

.dark .issue-card {
  background: var(--vp-c-bg-elv);
}

.dark .issue-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.32);
}

/* 子卡：收窄、降一档字号，层级由外层网格的缩进表达 */
.issue-card.d1 {
  padding: 9px 12px;
}
.issue-card.d2,
.issue-card.d3 {
  padding: 8px 11px;
}

.issue-card.d1 .title,
.issue-card.d2 .title,
.issue-card.d3 .title {
  font-size: 14px;
}
.issue-card.d1 .excerpt,
.issue-card.d2 .excerpt,
.issue-card.d3 .excerpt {
  font-size: 12px;
}

/* 首图缩略图，贴右上，点开看原图 */
.thumb {
  flex: none;
  width: 68px;
  height: 68px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--aels-radius-sm);
  background: var(--vp-c-bg-mute);
  overflow: hidden;
  cursor: zoom-in;
}
.thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.25s var(--aels-ease);
}
.thumb img.ready {
  opacity: 1;
}
.dark .thumb img {
  filter: brightness(0.72) contrast(0.95);
}

.body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}
.avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.avatar-none {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-mute);
  font-size: 10px;
}
.author {
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.date {
  font-family: var(--aels-font-mono);
}
.num {
  font-family: var(--aels-font-mono);
}
.repo {
  font-family: var(--aels-font-mono);
  font-size: 10.5px;
  padding: 0 6px;
  border: 1px solid color-mix(in srgb, var(--aels-hue, var(--vp-c-divider)) 32%, transparent);
  border-radius: 999px;
  color: var(--aels-hue, var(--vp-c-text-2));
  background: color-mix(in srgb, var(--aels-hue, var(--vp-c-text-3)) 9%, transparent);
  white-space: nowrap;
}
.repo b {
  font-weight: 600;
  opacity: 0.75;
}
.open {
  font-size: 11px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color var(--aels-dur) var(--aels-ease);
}
.open:hover {
  color: var(--vp-c-brand-2);
}

.title {
  margin: 4px 0 0;
  font-size: 15px;
  line-height: 1.45;
  font-weight: 600;
}
.title a {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color var(--aels-dur) var(--aels-ease);
}
.title a:hover {
  color: var(--vp-c-brand-2);
}

.excerpt {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  margin-top: auto;
  padding-top: 8px;
}
.right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.lb {
  font-size: 10.5px;
  padding: 0 7px;
  border-radius: 999px;
  line-height: 1.7;
  border: 1px solid transparent;
}
.lb-doc {
  color: #35618f;
  background: color-mix(in srgb, #35618f 10%, transparent);
  border-color: color-mix(in srgb, #35618f 22%, transparent);
}
.lb-enh {
  color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
  border-color: color-mix(in srgb, var(--vp-c-brand-2) 22%, transparent);
}
.lb-help {
  color: #94600c;
  background: color-mix(in srgb, #a2620f 10%, transparent);
  border-color: color-mix(in srgb, #a2620f 24%, transparent);
}
.lb-first {
  color: #9a3f6f;
  background: color-mix(in srgb, #9a3f6f 9%, transparent);
  border-color: color-mix(in srgb, #9a3f6f 22%, transparent);
}
.lb-bug {
  color: #a33a32;
  background: color-mix(in srgb, #a33a32 9%, transparent);
  border-color: color-mix(in srgb, #a33a32 22%, transparent);
}
.lb-feat {
  color: #6b4b9a;
  background: color-mix(in srgb, #6b4b9a 9%, transparent);
  border-color: color-mix(in srgb, #6b4b9a 22%, transparent);
}
.lb-misc {
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-divider);
}

.dark .lb-doc {
  color: #8fb6e0;
  background: color-mix(in srgb, #8fb6e0 12%, transparent);
}
.dark .lb-help {
  color: #e0b062;
  background: color-mix(in srgb, #e0b062 12%, transparent);
}
.dark .lb-first {
  color: #e19ac0;
  background: color-mix(in srgb, #e19ac0 12%, transparent);
}
.dark .lb-bug {
  color: #e89088;
  background: color-mix(in srgb, #e89088 12%, transparent);
}
.dark .lb-feat {
  color: #b9a0e6;
  background: color-mix(in srgb, #b9a0e6 12%, transparent);
}

.cmt {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: var(--aels-font-mono);
  font-size: 10.5px;
  color: var(--vp-c-text-3);
}

.kids {
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-brand-2);
  font-family: var(--aels-font-mono);
  font-size: 10.5px;
  line-height: 1.7;
  cursor: pointer;
  transition:
    border-color var(--aels-dur) var(--aels-ease),
    background var(--aels-dur) var(--aels-ease);
}
.kids:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}
.chev {
  margin-right: 2px;
}

.rest {
  margin: 6px 0 0;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}
.rest-error {
  color: #a33a32;
}
.dark .rest-error {
  color: #e89088;
}
.retry {
  margin-left: 6px;
  padding: 0 6px;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font-size: 10.5px;
  cursor: pointer;
}

/* 已关闭的子任务：一行灰条 */
.issue-card.skeleton {
  display: block;
  margin-bottom: 6px;
  padding: 0;
  border-style: dashed;
  border-color: color-mix(in srgb, var(--vp-c-divider) 85%, transparent);
  background: transparent;
  opacity: 0.72;
}
.issue-card.skeleton:hover {
  opacity: 1;
  box-shadow: none;
  border-color: var(--vp-c-divider);
}
.skel {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-decoration: none;
}
.skel-check {
  color: var(--vp-c-brand-2);
  font-weight: 700;
}
.skel-num {
  font-family: var(--aels-font-mono);
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.skel-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.skel:hover .skel-title {
  color: var(--vp-c-text-1);
}
.skel-tag {
  flex: none;
  font-size: 10.5px;
  color: var(--vp-c-text-3);
}

@media (max-width: 639px) {
  .thumb {
    width: 56px;
    height: 56px;
  }
  .issue-card {
    padding: 10px 11px;
  }
  .title {
    font-size: 14.5px;
  }
}
</style>
