<script setup lang="ts">
import type { IssueRecord } from './issue-live'
import IssueCard from './IssueCard.vue'

// 递归渲染一层卡片网格：展开的父卡片横跨整行，子任务在它下面再排一层网格。
defineOptions({ name: 'IssueGrid' })

defineProps<{
  nodes: IssueRecord[]
  depth: number
  hueOf: (repo: string) => number
  showRepo: boolean
  expanded: Set<string>
  kids: Map<string, IssueRecord[]>
  loading: Set<string>
  errors: Map<string, string>
  nowMs: number
  en: boolean
}>()

defineEmits<{
  (e: 'toggle', issue: IssueRecord): void
  (e: 'retry', issue: IssueRecord): void
  (e: 'zoom', src: string): void
}>()
</script>

<template>
  <ul class="igrid" :class="{ sub: depth > 0 }">
    <template v-for="n in nodes" :key="n.key">
      <li class="icell" :class="{ wide: n.closed }">
        <IssueCard
          :issue="n"
          :depth="depth"
          :hue="hueOf(n.repo)"
          :show-repo="showRepo"
          :expanded="expanded.has(n.key)"
          :kids-loading="loading.has(n.key)"
          :kids-error="errors.get(n.key) ?? null"
          :now-ms="nowMs"
          :en="en"
          @toggle="$emit('toggle', n)"
          @retry="$emit('retry', n)"
          @zoom="$emit('zoom', $event)"
        />
      </li>
      <!-- 展开的子任务另起一块整行面板，父卡片保持原来的格子宽度 -->
      <li v-if="expanded.has(n.key) && kids.get(n.key)?.length" class="ipanel">
        <IssueGrid
          :nodes="kids.get(n.key)!"
          :depth="depth + 1"
          :hue-of="hueOf"
          :show-repo="showRepo"
          :expanded="expanded"
          :kids="kids"
          :loading="loading"
          :errors="errors"
          :now-ms="nowMs"
          :en="en"
          @toggle="$emit('toggle', $event)"
          @retry="$emit('retry', $event)"
          @zoom="$emit('zoom', $event)"
        />
      </li>
    </template>
  </ul>
</template>

<style scoped>
.igrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-flow: row dense;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.icell {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.icell.wide {
  grid-column: 1 / -1;
}

.ipanel {
  grid-column: 1 / -1;
  margin-top: -2px;
}

.icell :deep(.issue-card) {
  height: 100%;
  margin-bottom: 0;
}

/* 窄卡里缩略图让位给文字 */
.icell :deep(.thumb) {
  width: 56px;
  height: 56px;
}

.igrid.sub {
  margin-top: 0;
  padding-left: 12px;
  border-left: 1px solid var(--vp-c-divider);
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

@media (max-width: 639px) {
  .igrid,
  .igrid.sub {
    grid-template-columns: 1fr;
  }
}
</style>
